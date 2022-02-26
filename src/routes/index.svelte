<script context="module">
	export async function load({ fetch }) {
		const req = await fetch('/api/homepage.json');
		const {
			leavingArray,
			newThisMonthArray,
			comingNextMonthArray,
			mostValuableNow,
		} = await req.json();

		const obj = { title: 'foo', lip: 'taste', leg: 'foot ', flim: 'flam', butt: 'hole' };

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
	export let leavingArray, newThisMonthArray, comingNextMonthArray, mostValuableNow;
</script>

<h1>Welcome To My Critterpedia!</h1>

<section class="grid col-2-md gap-2">
	{#if newThisMonthArray.length}
		<article>
			<h2>New This Month</h2>
			{#each newThisMonthArray as critter}
				<a href={`/${critter.type}/${critter.slug}`}>
					<img src={`/${critter.type}/${critter.img}.webp`} alt={critter.name} />
					<span>{critter.name}</span>
				</a>
			{/each}
		</article>
	{/if}

	{#if comingNextMonthArray.length}
		<article>
			<h2>Coming Next Month</h2>
			{#each comingNextMonthArray as critter}
				<a href={`/${critter.type}/${critter.slug}`}>
					<img src={`/${critter.type}/${critter.img}.webp`} alt={critter.name} />
					<span>{critter.name}</span>
				</a>
			{/each}
		</article>
	{/if}

	{#if leavingArray.length}
		<article>
			<h2>Gone Next Month</h2>
			{#each leavingArray as critter}
				<a href={`/${critter.type}/${critter.slug}`}>
					<img src={`/${critter.type}/${critter.img}.webp`} alt={critter.name} />
					<span>{critter.name}</span>
				</a>
			{/each}
		</article>
	{/if}

	{#if leavingArray.length}
		<article>
			<h2>Most Valuable Out Right Now</h2>
			{#each mostValuableNow as critter}
				<a href={`/${critter.type}/${critter.slug}`}>
					<img src={`/${critter.type}/${critter.img}.webp`} alt={critter.name} />
					<span>{critter.name}</span>
				</a>
			{/each}
		</article>
	{/if}
</section>

<style lang="scss">
	h1 {
		font-size: 5rem;
		color: var(--gold);
		text-align: center;
		padding-top: 3rem;
	}
</style>
