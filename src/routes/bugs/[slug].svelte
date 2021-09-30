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
	import CritterPage from "$lib/components/CritterPage.svelte"

	export let critter;
</script>

<CritterPage {critter} dir="bugs" />

