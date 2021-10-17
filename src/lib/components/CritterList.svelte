<script>
	import CritterListItem from "./CritterListItem.svelte";
	
	export let critters, dir, title;
</script>

<h1>{ title }</h1>
<ul class="critter-list">
	{#each critters as critter}
		<CritterListItem {critter} {dir} />
	{/each}
</ul>

<style lang="scss">

	h1{
		font-size: 6.4rem;
		text-align: center;
		text-shadow: 2px 2px 5px hsl(0 0% 0% / 15%);
		color: var(--gold);
		padding-top: 3rem;
	}
	ul{
		padding: 1rem;
		list-style: none;
		max-width: 1200px;
		margin: 1rem auto;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		grid-gap: 1.6rem;
	}
</style>