<script lang="ts">
	import { onMount } from 'svelte';
	import QRCodeStyling from 'qr-code-styling';

	interface Props {
		data: string;
		size?: number;
		logo?: string;
		class?: string;
	}

	let { data, size = 280, logo = '/logo.svg', class: className = '' }: Props = $props();

	let qrCodeElement: HTMLDivElement | undefined;

	// 获取 CSS 变量值
	function getCssVariable(variable: string): string {
		return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
	}

	onMount(() => {
		if (qrCodeElement && data) {
			// 获取主题颜色
			const foregroundColor = getCssVariable('--color-foreground');
			const backgroundColor = getCssVariable('--color-card');
			const primaryColor = getCssVariable('--brand-600');
			const accentColor = getCssVariable('--brand-500');

			const qrCode = new QRCodeStyling({
				width: size,
				height: size,
				data,
				image: logo,
				dotsOptions: {
					color: foregroundColor || '#1a1a1a',
					type: 'rounded'
				},
				backgroundOptions: {
					color: backgroundColor || '#ffffff'
				},
				imageOptions: {
					crossOrigin: 'anonymous',
					margin: 8,
					imageSize: 0.4
				},
				cornersSquareOptions: {
					color: primaryColor || '#2563eb',
					type: 'extra-rounded'
				},
				cornersDotOptions: {
					color: accentColor || '#3b82f6',
					type: 'dot'
				}
			});

			qrCode.append(qrCodeElement);
		}
	});
</script>

<div bind:this={qrCodeElement} class="qr-code {className}"></div>

<style>
	.qr-code {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
