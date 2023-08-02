import type { ProcessingInstructions } from '$lib/utils/search';
import { writable } from 'svelte/store';

export const searchQuery = writable<string|undefined>(undefined);
export const processingInstructions = writable<ProcessingInstructions|undefined>(undefined);