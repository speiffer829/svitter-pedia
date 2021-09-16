<script>
	export let critters;
	export let dir;
</script>

<ul class="critter-list">
	{#each critters as critter}
		<li>
			<a href={`${dir}/${critter.slug}`} sveltekit:prefetch>
				<img src={`/${dir}/${critter.img}.png`} alt={critter.name}>
				<span>{critter.name}</span>
			</a>
		</li>
	{/each}
</ul>

<style lang="scss">
	ul{
		padding: 1rem;
		list-style: none;
		max-width: 1200px;
		margin: 1rem auto;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		grid-gap: 1.6rem;
	}

	a{
		background-color: var(--green);
		background-image: url('/green-triangles.png');
		background-size: var(--triangle-size);
		box-shadow: 2px 3px 4px hsl( 420 69% 0% / 25% );
		font-size: 1rem;
		display: flex;
		// margin: 1rem 0;
		border-radius: 1rem;
		align-items: center;
		font-size: 2.2rem;
		padding: 1rem 1.5rem;
		color: var(--gold);
		text-decoration: none;
		font-weight: bold;
		text-shadow: 2px 2px 5px hsl(420 69% 0% / 20%);

		span{
			padding-left: 1.5rem;
		}
	}
</style>