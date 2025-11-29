<script lang="ts">
	import Hero from './Hero.svelte';
	import Features from './Features.svelte';
	// import Stats from './Stats.svelte';
	// import Pricing from './/Pricing.svelte';
	// import FAQs from './FAQs.svelte';
	// import CTA from './CTA.svelte';
</script>

<!-- Landing page layout | 着陆页布局 -->
<div class="landing-page">
	<!-- Hero section | 主要展示区 -->
	<Hero />

	<!-- Features section | 功能特性区 -->
	<Features />

	<!-- Stats section | 统计数据区 -->
	<!-- <Stats /> -->

	<!-- Pricing section | 定价部分 -->
	<!-- <Pricing /> -->

	<!-- FAQs section | 常见问题部分 -->
	<!-- <FAQs /> -->

	<!-- Call to action | 行动号召区 -->
	<!-- <CTA /> -->
</div>

<style>
	.landing-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
</style>
