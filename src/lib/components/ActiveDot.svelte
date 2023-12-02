<script lang="ts">
	import type { Critter } from '$lib/types/index';
	import { findIfActive } from '$lib/findIfActive';

	type Props = {
		critter: Critter;
		alignTopLeft?: boolean;
	};

	let { critter, alignTopLeft = false } = $props<Props>();

	let isActive = findIfActive(critter.start, critter.end, critter.months);
</script>

{#if isActive}
	<span
		class="active-dot"
		class:alignTopLeft
		aria-label="Currently Active"
		title="Currently Active"
	/>
{/if}

<style>
	.active-dot {
		width: 12px;
		height: 12px;
		background: var(--green);
		border: 2px solid #fff;
		border-radius: 100px;
		position: absolute;
		right: 8px;
		top: 0;
	}

	.active-dot.alignTopLeft {
		right: auto;
		top: 10px;
		left: 15px;
	}
</style>
