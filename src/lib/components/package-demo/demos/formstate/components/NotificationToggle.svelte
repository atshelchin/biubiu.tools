<script lang="ts">
	/**
	 * NotificationToggle - Beautiful toggle switches for notification preferences
	 */
	import { Mail, MessageSquare, Bell } from '@lucide/svelte';

	interface NotificationOption {
		key: string;
		label: string;
		icon: typeof Mail;
	}

	interface Props {
		value?: Record<string, boolean>;
		labels?: {
			email?: string;
			sms?: string;
			push?: string;
		};
		onInput?: (value: Record<string, boolean>) => void;
		onBlur?: () => void;
	}

	let {
		value = { email: true, sms: false, push: false },
		labels = { email: 'Email', sms: 'SMS', push: 'Push' },
		onInput,
		onBlur
	}: Props = $props();

	const options: NotificationOption[] = $derived([
		{ key: 'email', label: labels.email || 'Email', icon: Mail },
		{ key: 'sms', label: labels.sms || 'SMS', icon: MessageSquare },
		{ key: 'push', label: labels.push || 'Push', icon: Bell }
	]);

	function toggle(key: string) {
		const newValue = { ...value, [key]: !value[key] };
		if (onInput) {
			onInput(newValue);
		}
	}
</script>

<div class="notification-toggles" role="group" aria-label="Notification preferences">
	{#each options as option (option.key)}
		{@const isActive = value[option.key]}
		<button
			type="button"
			class="toggle-item"
			class:active={isActive}
			onclick={() => toggle(option.key)}
			onblur={onBlur}
			aria-pressed={isActive}
		>
			<div class="toggle-icon">
				<option.icon size={18} />
			</div>
			<span class="toggle-label">{option.label}</span>
			<div class="toggle-switch">
				<div class="toggle-track">
					<div class="toggle-thumb"></div>
				</div>
			</div>
		</button>
	{/each}
</div>

<style>
	.notification-toggles {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.toggle-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		cursor: pointer;
		transition: all 0.2s ease;
		width: 100%;
		text-align: left;
	}

	.toggle-item:hover {
		border-color: var(--color-primary);
	}

	.toggle-item.active {
		background: color-mix(in srgb, var(--color-primary) 8%, transparent);
		border-color: var(--color-primary);
	}

	.toggle-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: var(--color-panel-1);
		border-radius: 8px;
		color: var(--color-muted-foreground);
		transition: all 0.2s ease;
	}

	.toggle-item.active .toggle-icon {
		background: var(--color-primary);
		color: white;
	}

	.toggle-label {
		flex: 1;
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-foreground);
	}

	.toggle-switch {
		display: flex;
		align-items: center;
	}

	.toggle-track {
		width: 44px;
		height: 24px;
		background: var(--color-panel-1);
		border-radius: 12px;
		position: relative;
		transition: all 0.2s ease;
	}

	.toggle-item.active .toggle-track {
		background: var(--color-primary);
	}

	.toggle-thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 20px;
		height: 20px;
		background: white;
		border-radius: 50%;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
		transition: all 0.2s ease;
	}

	.toggle-item.active .toggle-thumb {
		left: 22px;
	}
</style>
