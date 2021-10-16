<script>
	import CritterListItem from "./CritterListItem.svelte";
	
	export let critters;
	export let dir;
</script>

<ul class="critter-list">
	{#each critters as critter}
		<CritterListItem {critter} {dir} />
	{/each}
</ul>

<style lang="scss">
	ul{
		padding: 1rem;
		list-style: none;
		max-width: 1200px;
		margin: 1rem auto;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		grid-gap: 1.6rem;
	}
</style>