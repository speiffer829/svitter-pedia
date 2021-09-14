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

<svelte:head>
	<style>
		body{
			background-color: var(--green);
			background-image: url('/green-triangles.png');
			background-size: 156px 154.5px;
			width: 100%;
			min-height: 100vh;
		}
	</style>
</svelte:head>
<div class="green-bg">
	<h1>{ bug.name }</h1>
	<img src={`/bugs-detailed/${bug.img.toLowerCase()}.png`} alt={bug.name}>
</div>


<style>

</style>