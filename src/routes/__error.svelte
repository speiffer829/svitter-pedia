<script context="module">
	export function load({ error, status }) {
		return {
			props: {
				title: `${status}: ${error.message}`
			}
		};
	}
</script>

<script>
	export let title
</script>

<h1>UH OH! FUCKIN SPAGHETTI-O's</h1>
<h2>{ title }</h2>

<style>
	h1{
		font-size: 6rem;
		text-align: center;
		color: var(--green);
	}
</style>