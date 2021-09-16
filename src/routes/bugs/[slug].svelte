<script context="module">
	import bugs from '$lib/bugs.json'
	export function load({page}){
		const bug = bugs.find(bug => bug.slug === page.params.slug)

		return {
			props: {
				bug: bug
			}
		}
	}
</script>

<script>
	import CritterImg from '$lib/components/CritterImg.svelte'
	export let bug;
</script>

<svelte:head>
	<title>{bug.name} | Critterpoo</title>
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


	<div class="img-contain">
		<CritterImg src={`/bugs-detailed/${bug.detailedImg}.png`} alt={bug.name} />
	</div>

	<main class="info-card">

	</main>


<style>
	main{
		height: 300vh;
		width: 100%;
		background-color: var(--tan);
		background-image: url('/play-dots.png');
		background-size: var(--dot-size);
		border-radius: 2rem 2rem 0 0;
		box-shadow: 0 -3px 10px hsl(0 0% 0% / 20%);
		z-index: 2;
		position: relative;
	}
</style>