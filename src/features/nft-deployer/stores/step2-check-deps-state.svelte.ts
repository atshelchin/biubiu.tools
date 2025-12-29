/**
 * Step 2 state for dependency checks (NFT Deployer)
 * Uses the shared createStep2State factory from lib
 */

import { createStep2State } from '$lib/stores/modules/dependency-check.svelte';

export const step2CheckDepsState = createStep2State();
