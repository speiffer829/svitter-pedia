<script context="module">
	import bugs from '$lib/bugs.json'
	export function load({page}){
		const bug = bugs.filter(bug => bug.slug === page.params.slug)

		return {
			props: {
				bug: bug[0]
			}
		}
	}
</script>

<script>
	export let bug;
</script>

<h1>{ bug.name }</h1>