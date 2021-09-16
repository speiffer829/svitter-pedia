<script>
	import critters from '$lib/bugs.json'
	import CritterList from '$lib/components/CritterList.svelte'
// export let bugs;

</script>

<svelte:head>
	<title>Bugs | Critterpoo</title>
</svelte:head>


<CritterList {critters} dir="bugs" />


<style>
	
</style>