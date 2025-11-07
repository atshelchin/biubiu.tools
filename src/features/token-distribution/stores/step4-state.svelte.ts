import type { Recipient } from '@/features/token-distribution/types/recipient';
import { SvelteSet } from 'svelte/reactivity';

/**
 * Module-level state for Step 4 (Import Recipients)
 * Shared across all step components
 */
class Step4State {
	recipients = $state<Recipient[]>([]);
	selectedRecipientIds = $state(new SvelteSet<string>());

	reset() {
		this.recipients = [];
		this.selectedRecipientIds.clear();
	}

	addRecipient(recipient: Recipient) {
		this.recipients = [...this.recipients, recipient];
	}

	addRecipients(newRecipients: Recipient[]) {
		this.recipients = [...this.recipients, ...newRecipients];
	}

	removeRecipient(id: string) {
		this.recipients = this.recipients.filter((r) => r.id !== id);
		this.selectedRecipientIds.delete(id);
	}

	removeSelectedRecipients() {
		this.recipients = this.recipients.filter((r) => !this.selectedRecipientIds.has(r.id));
		this.selectedRecipientIds.clear();
	}

	updateRecipient(id: string, updates: Partial<Recipient>) {
		this.recipients = this.recipients.map((r) => (r.id === id ? { ...r, ...updates } : r));
	}

	get isValid(): boolean {
		return this.recipients.length > 0 && this.recipients.every((r) => r.address);
	}

	get totalRecipients(): number {
		return this.recipients.length;
	}
}

export const step4State = new Step4State();
