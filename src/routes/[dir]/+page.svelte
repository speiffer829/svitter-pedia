<script lang="ts">
	import type { Critter } from '$lib/types/index';
	import { flip } from 'svelte/animate';
	import { quintOut, backOut } from 'svelte/easing';
	import CritterListItem from '$lib/components/CritterListItem.svelte';
	import FilterPane from '$lib/components/FilterPane.svelte';
	import { currentCritterList } from '$lib/stores/filterStore.svelte.js';
	import { page } from '$app/stores';

	type Props = {
		data: {
			critters: Critter[];
			dir: string;
		};
	};
	let { data }: Props = $props();

	const title = $derived(data.dir.replace(/./, (c) => c.toUpperCase()));
</script>

<svelte:head>
	<title>{title} | Critterpedia</title>
</svelte:head>

<h1>{title}</h1>
<main>
	{#key data.dir}
		<FilterPane critters={data.critters} dir={data.dir} />
		<ul class="critter-list span-2-md span-3-lg">
			{#each currentCritterList.value as critter (critter.name)}
				<li animate:flip={{ duration: 500, easing: quintOut }}>
					<CritterListItem {critter} dir={data.dir} />
				</li>
			{/each}
		</ul>
	{/key}
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
