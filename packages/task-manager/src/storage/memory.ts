/**
 * In-Memory Storage Adapter
 *
 * Useful for testing and short-lived tasks that don't need persistence.
 */

import type { TaskRoot, TaskNode, TaskStatus, StorageAdapter } from '../types';

export class MemoryStorage implements StorageAdapter {
	private roots = new Map<string, TaskRoot>();
	private nodes = new Map<string, TaskNode>();

	// =========================================================================
	// Root Operations
	// =========================================================================

	async saveRoot(root: TaskRoot): Promise<void> {
		this.roots.set(root.id, { ...root });
	}

	async getRoot(id: string): Promise<TaskRoot | null> {
		const root = this.roots.get(id);
		return root ? { ...root } : null;
	}

	async getAllRoots(): Promise<TaskRoot[]> {
		return Array.from(this.roots.values()).map((r) => ({ ...r }));
	}

	async deleteRoot(id: string): Promise<void> {
		this.roots.delete(id);
	}

	// =========================================================================
	// Node Operations
	// =========================================================================

	async saveNode(node: TaskNode): Promise<void> {
		this.nodes.set(node.id, { ...node });
	}

	async saveNodes(nodes: TaskNode[]): Promise<void> {
		for (const node of nodes) {
			this.nodes.set(node.id, { ...node });
		}
	}

	async getNode(id: string): Promise<TaskNode | null> {
		const node = this.nodes.get(id);
		return node ? { ...node } : null;
	}

	async getNodesByRoot(rootId: string): Promise<TaskNode[]> {
		return Array.from(this.nodes.values())
			.filter((n) => n.rootId === rootId)
			.map((n) => ({ ...n }));
	}

	async getChildren(parentId: string | null, rootId: string): Promise<TaskNode[]> {
		return Array.from(this.nodes.values())
			.filter((n) => n.rootId === rootId && n.parentId === parentId)
			.sort((a, b) => a.index - b.index)
			.map((n) => ({ ...n }));
	}

	async getLeaves(rootId: string): Promise<TaskNode[]> {
		return Array.from(this.nodes.values())
			.filter((n) => n.rootId === rootId && n.isLeaf)
			.sort((a, b) => a.index - b.index)
			.map((n) => ({ ...n }));
	}

	async getLeafCount(rootId: string): Promise<number> {
		let count = 0;
		for (const node of this.nodes.values()) {
			if (node.rootId === rootId && node.isLeaf) {
				count++;
			}
		}
		return count;
	}

	async getPendingLeafCount(rootId: string): Promise<number> {
		let count = 0;
		for (const node of this.nodes.values()) {
			if (
				node.rootId === rootId &&
				node.isLeaf &&
				node.status !== 'completed' &&
				node.status !== 'failed'
			) {
				count++;
			}
		}
		return count;
	}

	async getLeafIds(rootId: string): Promise<string[]> {
		return Array.from(this.nodes.values())
			.filter((n) => n.rootId === rootId && n.isLeaf)
			.sort((a, b) => a.index - b.index)
			.map((n) => n.id);
	}

	async getPendingLeafIds(rootId: string): Promise<string[]> {
		return Array.from(this.nodes.values())
			.filter(
				(n) =>
					n.rootId === rootId &&
					n.isLeaf &&
					n.status !== 'completed' &&
					n.status !== 'failed' &&
					n.status !== 'cancelled'
			)
			.sort((a, b) => a.index - b.index)
			.map((n) => n.id);
	}

	// =========================================================================
	// Atomic Operations (for data integrity)
	// =========================================================================

	/**
	 * Atomically save root with all its nodes
	 */
	async saveRootWithNodes(root: TaskRoot, nodes: TaskNode[]): Promise<void> {
		// Memory storage is naturally atomic (single-threaded JS)
		this.roots.set(root.id, { ...root });
		for (const node of nodes) {
			this.nodes.set(node.id, { ...node });
		}
	}

	/**
	 * Atomically delete root and all its nodes
	 */
	async deleteRootWithNodes(rootId: string): Promise<void> {
		// Delete nodes first, then root
		for (const [id, node] of this.nodes) {
			if (node.rootId === rootId) {
				this.nodes.delete(id);
			}
		}
		this.roots.delete(rootId);
	}

	/**
	 * Get all nodes across all roots (for orphan detection)
	 */
	async getAllNodes(): Promise<TaskNode[]> {
		return Array.from(this.nodes.values()).map((n) => ({ ...n }));
	}

	async deleteNodesByRoot(rootId: string): Promise<void> {
		for (const [id, node] of this.nodes) {
			if (node.rootId === rootId) {
				this.nodes.delete(id);
			}
		}
	}

	async updateNodeStatus(
		id: string,
		status: TaskStatus,
		updates?: Partial<TaskNode>
	): Promise<void> {
		const node = this.nodes.get(id);
		if (!node) return;

		this.nodes.set(id, {
			...node,
			...updates,
			status,
			updatedAt: Date.now()
		});
	}

	// =========================================================================
	// Lifecycle
	// =========================================================================

	async close(): Promise<void> {
		// No-op for memory storage
	}

	async clear(): Promise<void> {
		this.roots.clear();
		this.nodes.clear();
	}
}

/**
 * Create a new in-memory storage adapter
 */
export function createMemoryStorage(): StorageAdapter {
	return new MemoryStorage();
}
