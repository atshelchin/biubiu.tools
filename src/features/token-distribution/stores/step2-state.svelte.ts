/**
 * Shared state for Step 2 dependency checks
 * Uses the shared createStep2State factory from lib
 */

import { createStep2State } from '$lib/stores/modules/dependency-check.svelte';

export const step2State = createStep2State();
