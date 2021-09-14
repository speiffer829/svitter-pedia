<script context="module">
	import bugs from '$lib/bugs.json'

	export function load() {
		return {
			props: {
				bugs
			}
		}
	}
</script>

<script>
export let bugs;

</script>

<svelte:head>
	<title>Bugs | Critterpoo</title>
</svelte:head>

{#each bugs as bug}
	<h2>{bug.name}</h2>
{/each}


