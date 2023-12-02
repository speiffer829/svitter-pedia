<script lang="ts">
	import CritterImg from '$lib/components/CritterImg.svelte';
	import CritterCard from '$lib/components/CritterCard.svelte';
	import type { Critter } from '$lib/types/index';

	export let data;
	let { critter, dir }: { critter: Critter; dir: string } = data;

	const findThemeColor = () => {
		if (critter.price >= 10000) {
			return 'hsl(52.4, 77.5%, 72%)';
		} else if (critter.price >= 5000) {
			return 'hsl(271.8, 25.6%, 71%)';
		} else if (critter.price >= 1000) {
			return 'hsl(211.4, 51.2%, 64%)';
		} else {
			return 'hsl(161.4, 49.9%, 67.1%)';
		}
	};

	let themeColor = findThemeColor();

	const findMoneyBracket = () => {
		if (critter.price >= 10000) {
			return 'gold';
		} else if (critter.price >= 5000) {
			return 'purple';
		} else if (critter.price >= 1000) {
			return 'blue';
		} else {
			return 'green';
		}
	};

	let moneyBracket = findMoneyBracket();

	$: width = dir === 'fish' ? 1024 : 600;
	$: height = dir === 'fish' ? 512 : 600;
</script>

<svelte:head>
	<title>{critter.name} | Critterpedia</title>
	<meta name="theme-color" content={themeColor} />
	<meta property="og:image" content={`/${dir}-detailed/${critter.detailedImg}.webp`} />
	<meta property="og:image:type" content="image/webp" />
	<meta property="og:image:width" content="488" />
	<meta property="og:image:height" content="478" />
	<meta property="og:title" content={critter.name} />
	<meta
		name="description"
		content={`Useful information about the ${critter.name} from Animal Crossing.  Learn about it and others in this free Critterpedia.`}
	/>
</svelte:head>

<div class="body-bg {moneyBracket}">
	<div class="grid col-2-md gap-3-md">
		<CritterImg
			src={`/${dir}-detailed/${critter.detailedImg}`}
			alt={critter.name}
			{width}
			{height}
		/>
		<CritterCard {critter} {moneyBracket} {dir} />
	</div>
</div>

<style lang="postcss">
	div.body-bg {
		width: 100%;
		min-height: 100vh;
		background-color: var(--bg, var(--tan));
		background-image: var(--bgImage, url('/leaf-test.png'));
		background-attachment: fixed;

		&.gold {
			--bg: var(--yellow);
			--bgImage: url('/gold-leafs.webp');
		}
		&.purple {
			--bg: var(--purple);
			--bgImage: url('/purple-leafs.webp');
		}
		&.blue {
			--bg: var(--blue);
			--bgImage: url('/blue-leafs.webp');
		}
		&.green {
			--bg: var(--mint);
			--bgImage: url('/green-leafs.webp');
		}
		&.dark {
			--bg: var(--dark);
			--bgImage: url('/play-dots.png');
		}

		@media screen and (min-width: 767px) {
			--bg: var(--dark);
		}
	}
	div.grid {
		max-width: 1100px;
		margin: 0 auto;
		isolation: isolate;

		@media screen and (min-width: 767px) {
			padding: 0rem 2rem;
			position: relative;
		}
	}
</style>
