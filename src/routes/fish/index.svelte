<script>
	import critters from '$lib/fish.json'
	import CritterList from '$lib/components/CritterList.svelte'

</script>

<svelte:head>
	<title>Bugs | Critterpoo</title>
</svelte:head>


<CritterList {critters} dir="fish" />

