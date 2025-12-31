<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { SvelteMap } from 'svelte/reactivity';
	import {
		CircleHelp,
		ChevronLeft,
		ChevronRight,
		CheckCircle2,
		XCircle,
		RotateCcw,
		Clock,
		ExternalLink
	} from '@lucide/svelte';
	import SeoHead from '$lib/components/seo-head.svelte';
	import { useGuideProgress } from '@/features/chain-tools/composables/use-guide-progress.svelte';
	import type { PageData } from './$types';
	import type { QuizQuestion } from '@/features/chain-tools/types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const progress = useGuideProgress(data.guide.categoryId);

	// Base paths for absolute links
	const basePath = $derived(`/apps/chain-tools/${data.guide.categoryId}/guide`);
	const toolPath = '/apps/chain-tools/tool';

	// Quiz state
	type QuizState = 'select' | 'quiz' | 'results';
	let quizState = $state<QuizState>(data.initialDifficulty ? 'quiz' : 'select');
	let selectedDifficulty = $state<'beginner' | 'intermediate' | 'expert' | null>(
		data.initialDifficulty as 'beginner' | 'intermediate' | 'expert' | null
	);

	// Current question state
	let currentQuestionIndex = $state(0);
	const answers = new SvelteMap<string, number[]>();
	let showExplanation = $state(false);

	// Timer
	let startTime = $state<number | null>(null);
	let elapsedTime = $state(0);
	let timerInterval: ReturnType<typeof setInterval> | null = null;

	// Get localized text
	function t(key: string, params?: Record<string, unknown>): string {
		const fullKey = `${data.guide.i18nKeyPrefix}.${key}`;
		return i18n.t(fullKey as never, params as never) || key;
	}

	// Get questions for selected difficulty
	const questions = $derived(() => {
		if (!selectedDifficulty) return [];
		return data.guide.quiz.questions.filter((q) => q.difficulty === selectedDifficulty);
	});

	// Current question
	const currentQuestion = $derived(() => questions()[currentQuestionIndex]);

	// Start quiz
	function startQuiz(difficulty: 'beginner' | 'intermediate' | 'expert') {
		selectedDifficulty = difficulty;
		currentQuestionIndex = 0;
		answers.clear();
		showExplanation = false;
		startTime = Date.now();
		quizState = 'quiz';

		// Start timer
		if (timerInterval) clearInterval(timerInterval);
		timerInterval = setInterval(() => {
			if (startTime) {
				elapsedTime = Math.floor((Date.now() - startTime) / 1000);
			}
		}, 1000);
	}

	// Select answer
	function selectAnswer(questionId: string, optionIndex: number) {
		const question = questions().find((q) => q.id === questionId);
		if (!question) return;

		const currentAnswers = answers.get(questionId) || [];

		if (question.type === 'multiple_choice') {
			// Toggle selection for multiple choice
			if (currentAnswers.includes(optionIndex)) {
				answers.set(
					questionId,
					currentAnswers.filter((i) => i !== optionIndex)
				);
			} else {
				answers.set(questionId, [...currentAnswers, optionIndex]);
			}
		} else {
			// Single selection for other types
			answers.set(questionId, [optionIndex]);
		}
		// SvelteMap is reactive, no need to reassign
	}

	// Check if answer is selected
	function isSelected(questionId: string, optionIndex: number): boolean {
		return answers.get(questionId)?.includes(optionIndex) || false;
	}

	// Check if current question is answered
	const isCurrentAnswered = $derived(() => {
		const q = currentQuestion();
		if (!q) return false;
		return (answers.get(q.id)?.length ?? 0) > 0;
	});

	// Submit current answer and show explanation
	function submitAnswer() {
		showExplanation = true;
	}

	// Go to next question
	function nextQuestion() {
		showExplanation = false;
		if (currentQuestionIndex < questions().length - 1) {
			currentQuestionIndex++;
		} else {
			finishQuiz();
		}
	}

	// Go to previous question
	function prevQuestion() {
		if (currentQuestionIndex > 0) {
			showExplanation = false;
			currentQuestionIndex--;
		}
	}

	// Check if answer is correct
	function isCorrect(question: QuizQuestion, selectedAnswers: number[]): boolean {
		if (!selectedAnswers || selectedAnswers.length === 0) return false;
		const correct = question.correctAnswers;
		if (selectedAnswers.length !== correct.length) return false;
		return selectedAnswers.every((a) => correct.includes(a));
	}

	// Calculate score
	const score = $derived(() => {
		let correct = 0;
		questions().forEach((q) => {
			const userAnswers = answers.get(q.id) || [];
			if (isCorrect(q, userAnswers)) {
				correct++;
			}
		});
		return {
			correct,
			total: questions().length,
			percentage: Math.round((correct / questions().length) * 100)
		};
	});

	// Get achievement based on score
	const achievement = $derived(() => {
		const pct = score().percentage / 100;
		return (
			data.guide.quiz.achievements.find((a) => pct >= a.minScore) ||
			data.guide.quiz.achievements[data.guide.quiz.achievements.length - 1]
		);
	});

	// Get wrong questions for review
	const wrongQuestions = $derived(() => {
		return questions().filter((q) => {
			const userAnswers = answers.get(q.id) || [];
			return !isCorrect(q, userAnswers);
		});
	});

	// Finish quiz
	function finishQuiz() {
		if (timerInterval) clearInterval(timerInterval);

		// Record attempt
		if (selectedDifficulty) {
			progress.recordQuizAttempt(
				selectedDifficulty,
				score().correct,
				score().total,
				wrongQuestions().map((q) => q.id)
			);
		}

		quizState = 'results';
	}

	// Retry quiz
	function retryQuiz() {
		if (selectedDifficulty) {
			startQuiz(selectedDifficulty);
		}
	}

	// Go back to selection
	function backToSelection() {
		if (timerInterval) clearInterval(timerInterval);
		quizState = 'select';
		selectedDifficulty = null;
	}

	// Format time
	function formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	// Get tool by ID
	function getToolById(toolId: string) {
		return data.tools.find((tool) => tool.id === toolId);
	}
</script>

<SeoHead
	title={data.meta.title}
	description={data.meta.description}
	keywords={data.meta.keywords}
	canonical={data.meta.canonical}
	type={data.meta.type}
	image={data.meta.image}
	locale={data.meta.locale}
	structuredData={data.structuredData}
/>

<div class="quiz-page">
	<!-- Header -->
	<header class="page-header">
		<a href={basePath} class="back-link">
			<ChevronLeft class="back-icon" />
			<span>Back to Guide</span>
		</a>
		<div class="header-content">
			<CircleHelp class="header-icon" />
			<div>
				<h1 class="title">{t('quiz.title')}</h1>
				<p class="subtitle">{t('quiz.description')}</p>
			</div>
		</div>
	</header>

	{#if quizState === 'select'}
		<!-- Difficulty Selection -->
		<section class="difficulty-section">
			<h2 class="section-title">{t('quiz.select_difficulty')}</h2>

			<div class="difficulty-cards">
				<button class="difficulty-card beginner" onclick={() => startQuiz('beginner')}>
					<div class="difficulty-badge">🌱</div>
					<h3 class="difficulty-name">{t('quiz.beginner')}</h3>
					<p class="difficulty-count">
						{t('quiz.questions_count', { count: data.questionCounts.beginner })}
					</p>
					<p class="difficulty-time">{t('quiz.estimated_time', { minutes: 5 })}</p>
				</button>

				<button class="difficulty-card intermediate" onclick={() => startQuiz('intermediate')}>
					<div class="difficulty-badge">📚</div>
					<h3 class="difficulty-name">{t('quiz.intermediate')}</h3>
					<p class="difficulty-count">
						{t('quiz.questions_count', { count: data.questionCounts.intermediate })}
					</p>
					<p class="difficulty-time">{t('quiz.estimated_time', { minutes: 10 })}</p>
				</button>

				<button class="difficulty-card expert" onclick={() => startQuiz('expert')}>
					<div class="difficulty-badge">🏆</div>
					<h3 class="difficulty-name">{t('quiz.expert')}</h3>
					<p class="difficulty-count">
						{t('quiz.questions_count', { count: data.questionCounts.expert })}
					</p>
					<p class="difficulty-time">{t('quiz.estimated_time', { minutes: 15 })}</p>
				</button>
			</div>

			<!-- Previous attempts -->
			{#if progress.progress.quizAttempts.length > 0}
				<div class="previous-attempts">
					<h3 class="attempts-title">Previous Attempts</h3>
					<div class="attempts-list">
						{#each progress.progress.quizAttempts
							.slice(-3)
							.reverse() as attempt (attempt.timestamp)}
							<div class="attempt-item">
								<span class="attempt-difficulty">{attempt.difficulty}</span>
								<span class="attempt-score"
									>{attempt.score}/{attempt.totalQuestions} ({Math.round(
										(attempt.score / attempt.totalQuestions) * 100
									)}%)</span
								>
								<span class="attempt-date">{new Date(attempt.timestamp).toLocaleDateString()}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</section>
	{:else if quizState === 'quiz'}
		<!-- Quiz in progress -->
		{@const question = currentQuestion()}
		{#if question}
			<div class="quiz-container">
				<!-- Progress bar -->
				<div class="quiz-progress">
					<div class="progress-info">
						<span class="question-counter">
							Question {currentQuestionIndex + 1} of {questions().length}
						</span>
						<span class="timer">
							<Clock class="timer-icon" />
							{formatTime(elapsedTime)}
						</span>
					</div>
					<div class="progress-bar">
						<div
							class="progress-fill"
							style="width: {((currentQuestionIndex + 1) / questions().length) * 100}%"
						></div>
					</div>
				</div>

				<!-- Question -->
				<div class="question-card">
					<div class="question-type" data-type={question.type}>
						{question.type === 'multiple_choice' ? 'Select all that apply' : 'Select one'}
					</div>
					<h2 class="question-text">{t(`quiz.${question.id}.question`)}</h2>

					<!-- Options -->
					<div class="options-list">
						{#each question.optionKeys as optionKey, index (optionKey)}
							{@const isAnswerSelected = isSelected(question.id, index)}
							{@const isCorrectOption = question.correctAnswers.includes(index)}
							{@const wasWrong = showExplanation && isAnswerSelected && !isCorrectOption}
							{@const shouldHighlight = showExplanation && isCorrectOption}

							<button
								class="option-btn"
								class:selected={isAnswerSelected}
								class:correct={shouldHighlight}
								class:wrong={wasWrong}
								disabled={showExplanation}
								onclick={() => selectAnswer(question.id, index)}
							>
								<span class="option-marker">
									{#if showExplanation}
										{#if isCorrectOption}
											<CheckCircle2 class="marker-icon correct" />
										{:else if wasWrong}
											<XCircle class="marker-icon wrong" />
										{:else}
											<span class="marker-letter">{String.fromCharCode(65 + index)}</span>
										{/if}
									{:else}
										<span class="marker-letter">{String.fromCharCode(65 + index)}</span>
									{/if}
								</span>
								<span class="option-text">{t(`quiz.${question.id}.option${index + 1}`)}</span>
							</button>
						{/each}
					</div>

					<!-- Explanation (shown after answering) -->
					{#if showExplanation}
						<div class="explanation-section">
							<h3 class="explanation-title">{t('quiz.explanation')}</h3>
							<p class="explanation-text">{t(`quiz.${question.id}.explanation`)}</p>

							{#if question.relatedToolIds && question.relatedToolIds.length > 0}
								<div class="related-tools">
									<h4 class="related-title">{t('quiz.related_tools')}</h4>
									<div class="related-list">
										{#each question.relatedToolIds as toolId (toolId)}
											{@const tool = getToolById(toolId)}
											{#if tool}
												<a href="{toolPath}/{tool.id}" class="related-tool">
													{tool.name}
													<ExternalLink class="tool-icon" />
												</a>
											{/if}
										{/each}
									</div>
								</div>
							{/if}
						</div>
					{/if}

					<!-- Navigation -->
					<div class="question-nav">
						<button class="nav-btn" onclick={prevQuestion} disabled={currentQuestionIndex === 0}>
							<ChevronLeft class="nav-icon" />
							{t('quiz.previous')}
						</button>

						{#if !showExplanation}
							<button
								class="nav-btn primary"
								onclick={submitAnswer}
								disabled={!isCurrentAnswered()}
							>
								{t('quiz.submit')}
							</button>
						{:else}
							<button class="nav-btn primary" onclick={nextQuestion}>
								{#if currentQuestionIndex === questions().length - 1}
									Finish Quiz
								{:else}
									{t('quiz.next')}
									<ChevronRight class="nav-icon" />
								{/if}
							</button>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	{:else if quizState === 'results'}
		<!-- Results -->
		<div class="results-container">
			<div class="results-card">
				<div class="achievement-badge">{achievement()?.badge}</div>
				<h2 class="achievement-title">
					{t(`quiz.achievement.${achievement()?.titleKey?.split('.').pop()}`)}
				</h2>

				<div class="score-display">
					<div class="score-circle">
						<span class="score-percentage">{score().percentage}%</span>
					</div>
					<p class="score-detail">
						{score().correct} / {score().total} correct
					</p>
					<p class="time-taken">
						Time: {formatTime(elapsedTime)}
					</p>
				</div>

				<!-- Wrong answers review -->
				{#if wrongQuestions().length > 0}
					<div class="review-section">
						<h3 class="review-title">{t('quiz.results.weak_areas')}</h3>
						<p class="review-description">{t('quiz.results.recommendations')}</p>
						<ul class="weak-areas-list">
							{#each wrongQuestions() as question (question.id)}
								<li class="weak-area">
									<span class="weak-topic">{question.tags[0]}</span>
									<a href="{basePath}/glossary" class="review-link">Review</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<div class="results-actions">
					<button class="action-btn retry" onclick={retryQuiz}>
						<RotateCcw class="action-icon" />
						{t('quiz.results.retry')}
					</button>
					<button class="action-btn secondary" onclick={backToSelection}>
						Try Different Level
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Navigation (only in selection state) -->
	{#if quizState === 'select'}
		<div class="page-nav">
			<a href="{basePath}/glossary" class="nav-link prev">
				<ChevronLeft class="nav-icon" />
				<span>Glossary</span>
			</a>
			<a href={basePath} class="nav-link next">
				<span>Back to Guide</span>
				<ChevronLeft class="nav-icon rotate" />
			</a>
		</div>
	{/if}
</div>

<style>
	.quiz-page {
		max-width: 800px;
		margin: 0 auto;
		padding: var(--space-6);
	}

	/* Header */
	.page-header {
		margin-bottom: var(--space-6);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		color: var(--color-description-3);
		text-decoration: none;
		margin-bottom: var(--space-4);
	}

	.back-link:hover {
		color: #3b82f6;
	}

	.back-link :global(.back-icon) {
		width: 16px;
		height: 16px;
	}

	.header-content {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.header-content :global(.header-icon) {
		width: 48px;
		height: 48px;
		color: #3b82f6;
	}

	.title {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin-bottom: var(--space-1);
	}

	.subtitle {
		font-size: var(--text-sm);
		color: var(--color-description-2);
	}

	/* Difficulty Selection */
	.difficulty-section {
		margin-bottom: var(--space-8);
	}

	.section-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin-bottom: var(--space-4);
	}

	.difficulty-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-4);
	}

	.difficulty-card {
		padding: var(--space-6);
		background: var(--color-panel-2);
		border: 2px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
		text-align: center;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.difficulty-card:hover {
		transform: translateY(-4px);
	}

	.difficulty-card.beginner:hover {
		border-color: #10b981;
	}

	.difficulty-card.intermediate:hover {
		border-color: #f59e0b;
	}

	.difficulty-card.expert:hover {
		border-color: #ef4444;
	}

	.difficulty-badge {
		font-size: var(--text-4xl);
		margin-bottom: var(--space-3);
	}

	.difficulty-name {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin-bottom: var(--space-2);
	}

	.difficulty-count,
	.difficulty-time {
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	/* Previous attempts */
	.previous-attempts {
		margin-top: var(--space-6);
		padding: var(--space-4);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
	}

	.attempts-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin-bottom: var(--space-3);
	}

	.attempts-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.attempt-item {
		display: flex;
		justify-content: space-between;
		padding: var(--space-2);
		background: var(--color-panel-3);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
	}

	.attempt-difficulty {
		text-transform: capitalize;
		color: var(--color-heading-2);
	}

	.attempt-score {
		font-weight: var(--font-medium);
		color: #3b82f6;
	}

	.attempt-date {
		color: var(--color-description-3);
	}

	/* Quiz Progress */
	.quiz-container {
		margin-bottom: var(--space-6);
	}

	.quiz-progress {
		margin-bottom: var(--space-6);
	}

	.progress-info {
		display: flex;
		justify-content: space-between;
		margin-bottom: var(--space-2);
	}

	.question-counter {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-heading-2);
	}

	.timer {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	.timer :global(.timer-icon) {
		width: 14px;
		height: 14px;
	}

	.progress-bar {
		height: 8px;
		background: var(--color-panel-3);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: #3b82f6;
		border-radius: var(--radius-full);
		transition: width 0.3s ease;
	}

	/* Question Card */
	.question-card {
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
	}

	.question-type {
		display: inline-block;
		padding: var(--space-1) var(--space-3);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--color-description-3);
		background: var(--color-panel-3);
		border-radius: var(--radius-full);
		margin-bottom: var(--space-4);
	}

	.question-text {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		margin-bottom: var(--space-6);
		line-height: 1.5;
	}

	/* Options */
	.options-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-bottom: var(--space-6);
	}

	.option-btn {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-panel-border-1);
		border-radius: var(--radius-md);
		text-align: left;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.option-btn:hover:not(:disabled) {
		border-color: #3b82f6;
	}

	.option-btn.selected {
		border-color: #3b82f6;
		background: var(--color-panel-2);
	}

	.option-btn.correct {
		border-color: #10b981;
		background: rgba(16, 185, 129, 0.1);
	}

	.option-btn.wrong {
		border-color: #ef4444;
		background: rgba(239, 68, 68, 0.1);
	}

	.option-btn:disabled {
		cursor: default;
	}

	.option-marker {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-panel-3);
		border-radius: var(--radius-full);
		flex-shrink: 0;
	}

	.option-btn.selected .option-marker {
		background: #3b82f6;
	}

	.option-btn.selected .marker-letter {
		color: white;
	}

	.marker-letter {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-description-2);
	}

	.option-marker :global(.marker-icon) {
		width: 20px;
		height: 20px;
	}

	.option-marker :global(.marker-icon.correct) {
		color: #10b981;
	}

	.option-marker :global(.marker-icon.wrong) {
		color: #ef4444;
	}

	.option-text {
		font-size: var(--text-base);
		color: var(--color-description-2);
		line-height: 1.5;
	}

	/* Explanation */
	.explanation-section {
		padding: var(--space-4);
		background: var(--color-panel-3);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-6);
	}

	.explanation-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin-bottom: var(--space-2);
	}

	.explanation-text {
		font-size: var(--text-sm);
		color: var(--color-description-2);
		line-height: 1.7;
	}

	.related-tools {
		margin-top: var(--space-4);
		padding-top: var(--space-3);
		border-top: 1px solid var(--color-panel-border-1);
	}

	.related-title {
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		color: var(--color-description-3);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-bottom: var(--space-2);
	}

	.related-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.related-tool {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: #3b82f6;
		text-decoration: none;
	}

	.related-tool:hover {
		border-color: #3b82f6;
	}

	.related-tool :global(.tool-icon) {
		width: 12px;
		height: 12px;
	}

	/* Question Navigation */
	.question-nav {
		display: flex;
		justify-content: space-between;
	}

	.nav-btn {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-3);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.nav-btn:hover:not(:disabled) {
		border-color: #3b82f6;
		color: var(--color-heading-2);
	}

	.nav-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.nav-btn.primary {
		background: #3b82f6;
		border-color: #3b82f6;
		color: white;
	}

	.nav-btn.primary:hover:not(:disabled) {
		background: #60a5fa;
	}

	.nav-btn :global(.nav-icon) {
		width: 16px;
		height: 16px;
	}

	/* Results */
	.results-container {
		display: flex;
		justify-content: center;
	}

	.results-card {
		max-width: 400px;
		width: 100%;
		padding: var(--space-8);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
		text-align: center;
	}

	.achievement-badge {
		font-size: 64px;
		margin-bottom: var(--space-4);
	}

	.achievement-title {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
		margin-bottom: var(--space-6);
	}

	.score-display {
		margin-bottom: var(--space-6);
	}

	.score-circle {
		width: 120px;
		height: 120px;
		margin: 0 auto var(--space-4);
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #3b82f6, #10b981);
		border-radius: var(--radius-full);
	}

	.score-percentage {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: white;
	}

	.score-detail {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--color-heading-2);
		margin-bottom: var(--space-2);
	}

	.time-taken {
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	/* Review section */
	.review-section {
		text-align: left;
		padding: var(--space-4);
		background: var(--color-panel-3);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-6);
	}

	.review-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin-bottom: var(--space-2);
	}

	.review-description {
		font-size: var(--text-sm);
		color: var(--color-description-3);
		margin-bottom: var(--space-3);
	}

	.weak-areas-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.weak-area {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2) 0;
		border-bottom: 1px solid var(--color-panel-border-1);
	}

	.weak-area:last-child {
		border-bottom: none;
	}

	.weak-topic {
		font-size: var(--text-sm);
		color: var(--color-description-2);
		text-transform: capitalize;
	}

	.review-link {
		font-size: var(--text-sm);
		color: #3b82f6;
		text-decoration: none;
	}

	.review-link:hover {
		text-decoration: underline;
	}

	/* Results Actions */
	.results-actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.action-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.action-btn.retry {
		background: #3b82f6;
		border: none;
		color: white;
	}

	.action-btn.retry:hover {
		background: #60a5fa;
	}

	.action-btn.secondary {
		background: transparent;
		border: 1px solid var(--color-panel-border-1);
		color: var(--color-description-2);
	}

	.action-btn.secondary:hover {
		border-color: #3b82f6;
		color: var(--color-heading-2);
	}

	.action-btn :global(.action-icon) {
		width: 18px;
		height: 18px;
	}

	/* Page Navigation */
	.page-nav {
		display: flex;
		justify-content: space-between;
		padding-top: var(--space-6);
		border-top: 1px solid var(--color-panel-border-1);
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.nav-link:hover {
		border-color: #3b82f6;
		color: var(--color-heading-2);
	}

	.nav-link :global(.nav-icon) {
		width: 16px;
		height: 16px;
	}

	.nav-link :global(.rotate) {
		transform: rotate(180deg);
	}

	/* Mobile */
	@media (max-width: 768px) {
		.quiz-page {
			padding: var(--space-4);
		}

		.difficulty-cards {
			grid-template-columns: 1fr;
		}

		.question-card {
			padding: var(--space-4);
		}

		.page-nav {
			flex-direction: column;
			gap: var(--space-3);
		}

		.nav-link {
			justify-content: center;
		}
	}
</style>
