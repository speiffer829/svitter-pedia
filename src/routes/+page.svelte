<script>
	import HomeArticle from '$lib/components/HomeArticle.svelte';
	export let data;
</script>

<svelte:head>
	<title>Critterpedia</title>
</svelte:head>

<h1>Welcome To My Critterpedia!</h1>

<section class="grid col-2-md gap-2">
	<HomeArticle title="New This Month" critters={data.newThisMonthArray} />

	<HomeArticle title="Coming Next Month" critters={data.comingNextMonthArray} />

	<HomeArticle title="Gone Next Month" critters={data.leavingArray} />

	<HomeArticle title="Most Valuable Out Right Now" critters={data.mostValuableNow} />
</section>

<style lang="postcss">
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
