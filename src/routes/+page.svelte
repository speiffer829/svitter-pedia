<script context="module">
	export async function load({ fetch }) {
		const req = await fetch('/api/homepage.json');
		const {
			leavingArray,
			newThisMonthArray,
			comingNextMonthArray,
			mostValuableNow,
		} = await req.json();

		return {
			props: {
				leavingArray,
				newThisMonthArray,
				comingNextMonthArray,
				mostValuableNow,
			},
		};
	}
</script>

<script>
	import HomeArticle from '$lib/components/HomeArticle.svelte';
	export let leavingArray, newThisMonthArray, comingNextMonthArray, mostValuableNow;
</script>

<h1>Welcome To My Critterpedia!</h1>

<section class="grid col-2-md gap-2">
	<HomeArticle title="New This Month" critters={newThisMonthArray} />

	<HomeArticle title="Coming Next Month" critters={comingNextMonthArray} />

	<HomeArticle title="Gone Next Month" critters={leavingArray} />

	<HomeArticle title="Most Valuable Out Right Now" critters={mostValuableNow} />
</section>

<style lang="scss">
	.grid {
		padding: 2rem;
	}
	h1 {
		font-size: 5rem;
		color: var(--gold);
		text-align: center;
		padding-top: 3rem;
	}
</style>
