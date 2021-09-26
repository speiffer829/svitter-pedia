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
</svelte:head>


	<div class="grid col-2-md gap-3-md">
		<CritterImg src={`/bugs-detailed/${critter.detailedImg}.png`} alt={critter.name} />
		<CritterCard {critter} dir="bugs" />
	</div>


	<style lang="scss">
		div{
			max-width: 1100px;
			margin: 0 auto;
			
			@media screen and (min-width: 767px) {
				padding: 5rem 2rem;
				position: relative;
			}
		}
	</style>

