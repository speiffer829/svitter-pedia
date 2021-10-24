<script>
	import critters from '$lib/fish.json'
	import CritterList from '$lib/components/CritterList.svelte'

</script>

<svelte:head>
	<title>Fish | Critterpoo</title>
</svelte:head>


<CritterList {critters} dir="fish" title="Fish" />

