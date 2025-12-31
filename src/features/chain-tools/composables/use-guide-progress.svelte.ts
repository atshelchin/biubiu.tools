/**
 * Composable for tracking user progress in category guides
 * Uses localStorage for persistence
 */
import { browser } from '$app/environment';
import type { CategoryId, UserCategoryProgress } from '../types';

const STORAGE_KEY_PREFIX = 'biubiu_guide_progress_';

/**
 * Get initial progress state for a category
 */
function getInitialProgress(categoryId: CategoryId): UserCategoryProgress {
	return {
		categoryId,
		readSections: [],
		toolStatus: {},
		quizAttempts: [],
		learningPathProgress: {
			currentPhase: 0,
			completedTaskIds: []
		},
		lastVisited: Date.now(),
		startedAt: Date.now()
	};
}

/**
 * Load progress from localStorage
 */
function loadProgress(categoryId: CategoryId): UserCategoryProgress {
	if (!browser) {
		return getInitialProgress(categoryId);
	}

	try {
		const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${categoryId}`);
		if (stored) {
			const parsed = JSON.parse(stored) as UserCategoryProgress;
			// Update last visited
			parsed.lastVisited = Date.now();
			return parsed;
		}
	} catch {
		console.warn('Failed to load progress from localStorage');
	}

	return getInitialProgress(categoryId);
}

/**
 * Save progress to localStorage
 */
function saveProgress(progress: UserCategoryProgress): void {
	if (!browser) return;

	try {
		localStorage.setItem(`${STORAGE_KEY_PREFIX}${progress.categoryId}`, JSON.stringify(progress));
	} catch {
		console.warn('Failed to save progress to localStorage');
	}
}

/**
 * Create a reactive progress tracker for a category guide
 */
export function useGuideProgress(categoryId: CategoryId) {
	// Reactive state
	let progress = $state<UserCategoryProgress>(loadProgress(categoryId));

	// Computed values
	const readSectionsCount = $derived(progress.readSections.length);
	const masteredToolsCount = $derived(
		Object.values(progress.toolStatus).filter((s) => s === 'mastered').length
	);
	const learningToolsCount = $derived(
		Object.values(progress.toolStatus).filter((s) => s === 'learning').length
	);
	const bookmarkedToolsCount = $derived(
		Object.values(progress.toolStatus).filter((s) => s === 'bookmarked').length
	);
	const completedTasksCount = $derived(progress.learningPathProgress.completedTaskIds.length);
	const bestQuizScore = $derived(() => {
		if (progress.quizAttempts.length === 0) return null;
		return Math.max(...progress.quizAttempts.map((a) => a.score / a.totalQuestions));
	});

	// Actions
	function markSectionRead(sectionId: string): void {
		if (!progress.readSections.includes(sectionId)) {
			progress.readSections = [...progress.readSections, sectionId];
			saveProgress(progress);
		}
	}

	function setToolStatus(
		toolId: string,
		status: 'viewed' | 'learning' | 'mastered' | 'bookmarked'
	): void {
		progress.toolStatus = { ...progress.toolStatus, [toolId]: status };
		saveProgress(progress);
	}

	function removeToolStatus(toolId: string): void {
		const { [toolId]: _removed, ...rest } = progress.toolStatus;
		void _removed; // Suppress unused variable warning
		progress.toolStatus = rest;
		saveProgress(progress);
	}

	function completeTask(taskId: string): void {
		if (!progress.learningPathProgress.completedTaskIds.includes(taskId)) {
			progress.learningPathProgress = {
				...progress.learningPathProgress,
				completedTaskIds: [...progress.learningPathProgress.completedTaskIds, taskId]
			};
			saveProgress(progress);
		}
	}

	function uncompleteTask(taskId: string): void {
		progress.learningPathProgress = {
			...progress.learningPathProgress,
			completedTaskIds: progress.learningPathProgress.completedTaskIds.filter((id) => id !== taskId)
		};
		saveProgress(progress);
	}

	function setCurrentPhase(phase: number): void {
		progress.learningPathProgress = {
			...progress.learningPathProgress,
			currentPhase: phase
		};
		saveProgress(progress);
	}

	function recordQuizAttempt(
		difficulty: 'beginner' | 'intermediate' | 'expert',
		score: number,
		totalQuestions: number,
		wrongQuestionIds: string[]
	): void {
		const attempt = {
			difficulty,
			score,
			totalQuestions,
			wrongQuestionIds,
			timestamp: Date.now()
		};

		progress.quizAttempts = [...progress.quizAttempts, attempt];

		// Update best achievement if this is a new high score
		const scorePercent = score / totalQuestions;
		if (!progress.bestAchievement || scorePercent > progress.bestAchievement.score) {
			let badge = '🌱';
			let titleKey = 'beginner';
			if (scorePercent >= 0.9) {
				badge = '🏆';
				titleKey = 'master';
			} else if (scorePercent >= 0.7) {
				badge = '⭐';
				titleKey = 'advanced';
			} else if (scorePercent >= 0.5) {
				badge = '📚';
				titleKey = 'intermediate';
			}

			progress.bestAchievement = {
				titleKey,
				badge,
				score: scorePercent
			};
		}

		saveProgress(progress);
	}

	function resetProgress(): void {
		progress = getInitialProgress(categoryId);
		saveProgress(progress);
	}

	function isTaskCompleted(taskId: string): boolean {
		return progress.learningPathProgress.completedTaskIds.includes(taskId);
	}

	function isSectionRead(sectionId: string): boolean {
		return progress.readSections.includes(sectionId);
	}

	function getToolStatus(toolId: string): string | undefined {
		return progress.toolStatus[toolId];
	}

	// Calculate overall progress percentage
	function calculateOverallProgress(
		totalSections: number,
		totalTools: number,
		totalTasks: number
	): number {
		const sectionProgress = totalSections > 0 ? progress.readSections.length / totalSections : 0;
		const toolProgress = totalTools > 0 ? masteredToolsCount / totalTools : 0;
		const taskProgress =
			totalTasks > 0 ? progress.learningPathProgress.completedTaskIds.length / totalTasks : 0;

		// Weight: 30% sections, 40% tools, 30% tasks
		return Math.round((sectionProgress * 0.3 + toolProgress * 0.4 + taskProgress * 0.3) * 100);
	}

	return {
		// State
		get progress() {
			return progress;
		},

		// Computed
		get readSectionsCount() {
			return readSectionsCount;
		},
		get masteredToolsCount() {
			return masteredToolsCount;
		},
		get learningToolsCount() {
			return learningToolsCount;
		},
		get bookmarkedToolsCount() {
			return bookmarkedToolsCount;
		},
		get completedTasksCount() {
			return completedTasksCount;
		},
		get bestQuizScore() {
			return bestQuizScore;
		},

		// Actions
		markSectionRead,
		setToolStatus,
		removeToolStatus,
		completeTask,
		uncompleteTask,
		setCurrentPhase,
		recordQuizAttempt,
		resetProgress,

		// Helpers
		isTaskCompleted,
		isSectionRead,
		getToolStatus,
		calculateOverallProgress
	};
}
