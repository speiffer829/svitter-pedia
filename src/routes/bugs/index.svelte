<script>
	import bugs from '$lib/bugs.json'
	import Header from '$lib/components/Header.svelte'
// export let bugs;

</script>

<svelte:head>
	<title>Bugs | Critterpoo</title>
</svelte:head>

<Header />

{#each bugs as bug}
	<h2>{bug.name}</h2>
	<img src={`/bugs/${bug.img}.png`} alt={bug.name}>
	<a href={`/bugs/${bug.slug}`} sveltekit:prefetch>View Bug</a>
{/each}


