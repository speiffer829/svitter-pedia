<script lang="ts">
	import type { Critter } from '$lib/types/index.js';
	import { flip } from 'svelte/animate';
	import { scale } from 'svelte/transition';
	import { elasticOut, quintOut } from 'svelte/easing';
	import CritterListItem from './CritterListItem.svelte';
	import FilterPane from './FilterPane.svelte';
	import { currentCritterList } from '$lib/stores/filterStore.svelte.js';

	type Props = {
		critters: Critter[];
		dir: string;
		title: string;
	};

	let { critters, dir, title }: Props = $props();
</script>

<h1>{title}</h1>
<main>
	<FilterPane {critters} {dir} />
	<ul class="critter-list span-2-md span-3-lg">
		{#each currentCritterList.value as critter (critter.name)}
			<li
				animate:flip={{ duration: 500, easing: quintOut }}
				in:scale={{ duration: 1000, easing: elasticOut }}
				out:scale={{ duration: 500 }}
			>
				<CritterListItem {critter} {dir} />
			</li>
		{/each}
	</ul>
</main>

<style lang="postcss">
	main {
		max-width: 1400px;
		margin: 1rem auto;
	}

	h1 {
		font-size: 6.4rem;
		text-align: center;
		text-shadow: 2px 2px 5px hsl(0 0% 0% / 15%);
		color: var(--gold);
		padding-top: 3rem;
	}
	ul {
		padding: 1rem;
		list-style: none;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		grid-gap: 1.6rem;
	}
</style>
