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
	import CritterPage from "$lib/components/CritterPage.svelte"

	export let critter;
</script>

<CritterPage {critter} dir="fish" />