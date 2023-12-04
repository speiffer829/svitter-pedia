<script lang="ts">
	import type { Critter } from '$lib/types/index';

	type Props = {
		critters: Critter[];
		title: string;
	};

	let { critters, title } = $props<Props>();
</script>

{#if critters.length}
	<article>
		<h2>{title}</h2>
		<div class="grid col-6-lg col-4-md col-3-sm col-2 gap-1">
			{#each critters as critter}
				<a href={`/${critter.type}/${critter.slug}`} class={``}>
					<img
						src={`/${critter.type}/${critter.img}.webp`}
						alt={critter.name}
						width="75"
						height="75"
					/>
					<span>{critter.name}</span>
				</a>
			{/each}
		</div>
	</article>
{/if}

<style lang="postcss">
	article {
		padding: 1rem;
		border-radius: 2rem;
		background: var(--tan);
	}

	h2 {
		text-align: center;
		color: var(--brown);
		font-size: 2rem;
		margin: 1rem 0;
	}

	a {
		display: grid;
		justify-content: center;
		color: var(--brown);
		text-decoration: none;
		text-align: center;

		&:hover img {
			transform: scale(1.2);
		}
	}

	img {
		margin: 0 auto;
		transition: all 300ms;
	}
</style>
