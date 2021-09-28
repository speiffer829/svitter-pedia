<script context="module">
	import fishies from '$lib/fish.json'
	export function load({page}){
		const fish = fishies.find(fish => fish.slug === page.params.slug)

		return {
			props: {
				critter: fish
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
		<CritterImg src={`/fish-detailed/${critter.detailedImg}.png`} alt={critter.name} />
		<CritterCard {critter} dir="fish" />
	</div>


	<style lang="scss">
		div{
			max-width: 1100px;
			margin: 0 auto;
			
			@media screen and (min-width: 767px) {
				padding: 0rem 2rem;
				position: relative;
			}
		}
	</style>