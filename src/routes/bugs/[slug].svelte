<script context="module">
	import bugs from '$lib/bugs.json'
	export function load({page}){
		const bug = bugs.find(bug => bug.slug === page.params.slug)

		return {
			props: {
				critter: bug
			}
		}
	}
</script>

<script>
	import CritterImg from '$lib/components/CritterImg.svelte'
	import CritterCard from '$lib/components/CritterCard.svelte'
	export let critter;
</script>

<svelte:head>
	<title>{critter.name} | Critterpoo</title>
	<style>
		body{
			background-color: var(--green);
			background-image: url('/green-triangles.png');
			background-size: 156px 154.5px;
			background-attachment: fixed;
			width: 100%;
			min-height: 100vh;
		}
	</style>
</svelte:head>


	<CritterImg src={`/bugs-detailed/${critter.detailedImg}.png`} alt={critter.name} />

	<CritterCard {critter} dir="bugs" />

