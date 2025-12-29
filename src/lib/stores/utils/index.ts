/**
 * State management utilities.
 *
 * @module
 */

// Persistence
export {
	StatePersistence,
	createStatePersistence,
	type StatePersistenceConfig,
	type StoredStateRecord
} from './state-persistence';

export {
	useStatePersistence,
	type UseStatePersistenceConfig,
	type UseStatePersistenceReturn
} from './use-state-persistence.svelte';
