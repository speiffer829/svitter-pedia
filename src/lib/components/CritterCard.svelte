<script lang="ts">
	import type { Critter } from '$lib/types/index';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import ActiveDot from './ActiveDot.svelte';
	export let critter: Critter, dir: string, moneyBracket: string;

	function timeConvert(time): string {
		if (time === 0) {
			return `12am`;
		} else {
			return time > 12 ? `${time - 12}pm` : `${time}am`;
		}
	}

	let titleAtTop: boolean = false;

	onMount(() => {
		const options = {
			root: null,
			rootMargin: '0px',
			threshold: 0.1,
		};

		const observer = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				titleAtTop = !entry.isIntersecting;
			});
		}, options);

		observer.observe(document?.querySelector('#top'));
	});

	$: specialPrice = critter.price * 1.5;
	$: reducedPrice = critter.price * 0.8;
</script>

<div>
	<div id="top" />
	<main
		in:fly={{
			y: window.innerWidth > 767 ? 0 : 400,
			x: window.innerWidth > 767 ? 300 : 0,
			duration: 1000,
			easing: elasticOut,
			opacity: 1,
		}}
		class={moneyBracket}
	>
		<section class="title-contain" class:atTop={titleAtTop}>
			<h1 class="name">{critter.name}</h1>
			<div class="icon">
				<ActiveDot {critter} />
				<picture>
					<source srcset={`/${dir}/${critter.img}.avif`} type="image/avif" />
					<source srcset={`/${dir}/${critter.img}.webp`} type="image/webp" />
					<img
						src={`/${dir}/${critter.img}.png`}
						alt={critter.name}
						width="64"
						height="64"
						loading="eager"
						decoding="async"
					/>
				</picture>
			</div>
		</section>

		<section class="grid col-2 gap-none">
			<div class="reduced price info-block">
				<span class="label">Drop-Off Price</span>
				<p>${Intl.NumberFormat('en-US').format(reducedPrice)}</p>
			</div>
			<div class="price special info-block">
				<span class="label">{dir === 'bugs' ? "Flick's" : "CJ's"} Price</span>
				<p>${Intl.NumberFormat('en-US').format(specialPrice)}</p>
			</div>

			<div class="price info-block span-2">
				<span class="label">Base Price</span>
				<p>${Intl.NumberFormat('en-US').format(critter.price)}</p>
			</div>
		</section>

		<blockquote class="phrase info-block">
			"{critter.phrase}"
		</blockquote>

		<div class="grid {dir === 'fish' ? 'col-3' : 'col-1'} gap-none">
			{#if dir === 'fish'}
				<div class="size info-block">
					<span class="label">Size</span>
					<p>{critter.size}</p>
				</div>
			{/if}

			<div class="location info-block {dir === 'fish' ? 'span-2' : ''}">
				<span class="label">Location</span>
				<p>{critter.location}</p>
			</div>
		</div>

		<div class="info-block time">
			<span class="label">Time</span>
			{#if Array.isArray(critter.start)}
				{#each critter.start as start, i}
					<p>{timeConvert(start)} - {timeConvert(critter.end[i])}</p>
				{/each}
			{:else if critter.start === 0 && critter.end === 24}
				<p>All Day</p>
			{:else}
				<p>{timeConvert(critter.start)} - {timeConvert(critter.end)}</p>
			{/if}
		</div>

		<div class="info-block months">
			<span class="label">Months</span>
			<div class="grid col-4 gap-1">
				<p class="month" class:active={critter.months.includes('jan')}>Jan</p>
				<p class="month" class:active={critter.months.includes('feb')}>Feb</p>
				<p class="month" class:active={critter.months.includes('mar')}>Mar</p>
				<p class="month" class:active={critter.months.includes('apr')}>Apr</p>
				<p class="month" class:active={critter.months.includes('may')}>May</p>
				<p class="month" class:active={critter.months.includes('jun')}>Jun</p>
				<p class="month" class:active={critter.months.includes('jul')}>Jul</p>
				<p class="month" class:active={critter.months.includes('aug')}>Aug</p>
				<p class="month" class:active={critter.months.includes('sept')}>Sept</p>
				<p class="month" class:active={critter.months.includes('oct')}>Oct</p>
				<p class="month" class:active={critter.months.includes('nov')}>Nov</p>
				<p class="month" class:active={critter.months.includes('dec')}>Dec</p>
			</div>
		</div>

		<div class="rarity info-block {critter.rarity}">
			<span class="label">Rarity</span>
			<p>{critter.rarity}</p>
		</div>

		<div class="blathers-fact info-block">
			<blockquote>
				"{critter.blathers || 'God is Dead. Long Live Beelzebub'}"
			</blockquote>

			<img src="/blathers.webp" alt="blathers" width="180" loading="lazy" />
		</div>
	</main>
</div>

<div class="btn-container">
	<a class="back-btn" href={`/${dir}`}>
		<svg
			width="100%"
			height="100%"
			viewBox="0 0 44 38"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M1.23223 17.2322C0.255922 18.2085 0.255922 19.7915 1.23223 20.7678L17.1421 36.6777C18.1184 37.654 19.7014 37.654 20.6777 36.6777C21.654 35.7014 21.654 34.1184 20.6777 33.1421L6.53553 19L20.6777 4.85786C21.654 3.88155 21.654 2.29864 20.6777 1.32233C19.7014 0.34602 18.1184 0.34602 17.1421 1.32233L1.23223 17.2322ZM44 16.5L3 16.5V21.5L44 21.5V16.5Z"
				fill="var(--brown)"
			/>
		</svg>
	</a>
</div>

<style lang="scss">
	main {
		width: 100%;
		background-color: var(--tan);
		border-radius: var(--border-radius) var(--border-radius) 0 0;
		box-shadow: 0 -3px 10px hsl(0 0% 0% / 20%);
		z-index: 2;
		position: relative;

		@media screen and (min-width: 767px) {
			border-radius: var(--border-radius);
			margin: 5rem 0;
		}

		--base: var(--mint);
		--darker: var(--dmint);
		--lighter: var(--lmint);

		&.blue {
			--base: var(--blue);
			--darker: var(--dblue);
			--lighter: var(--lblue);
		}

		&.purple {
			--base: var(--purple);
			--darker: var(--dpurple);
			--lighter: var(--lpurple);
		}

		&.gold {
			--base: var(--gold);
			--darker: var(--dgold);
			--lighter: var(--lgold);
		}
	}

	span.label {
		display: inline-block;
		background: var(--gold);
		color: var(--dbrown);
		text-align: center;
		border-radius: 100px;
		padding: 5px 10px;
		font-size: 1.2rem;
		margin-bottom: 5px;
		// box-shadow: 2px 2px 10px rgb(0 0 0 / 20%);
		border: solid 1px var(--dbrown);
	}

	.icon {
		position: absolute;
		left: 50%;
		bottom: 0;
		transform: translate(-50%, 50%);
		width: 80px;
		height: 80px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--base);
		border-radius: 50%;
		background-image: url('/play-dots.png');
		background-size: var(--dot-size);
		z-index: 5;
		box-shadow: 0 3px 10px hsl(0 0% 0% / 20%);
		border: solid 4px var(--brown);
		transition: all 600ms;
	}

	.atTop > .icon {
		transform: translate(-50%, 30%) scale(0.7);
	}

	.title-contain {
		position: sticky;
		top: -25px;
		z-index: 50;
	}

	h1 {
		font-size: 3.5rem;
		color: #fccc1f;
		padding: 3rem 6rem 6.5rem;
		background: #9a702a;
		margin: 0;
		text-shadow: 2px 2px 5px #72531f;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAElBMVEX8/PxISEgkJCRqamqIiIizs7OpMFnZAAAABnRSTlMXFxcXFxfwQqWiAAAAaUlEQVRIx+2SsQ2AMAwEbwXjDbwBgg0SRmD/VZAiyuBvLZRrLkWq93EyMJ97p7+Pc+5GETbLTURuwnJj/ukiuNgCE1vg+QamgynC6mH1sHr4aw8dwUFOiyvbYnwQPXREDzfVe1DHkud+ACYQGu23NmkEAAAAAElFTkSuQmCC);
		background-size: 36px 34.5px;
		grid-area: title;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: var(--border-radius) var(--border-radius) 0 0;
		text-align: center;

		transition: border-radius 100ms;
	}

	.atTop > .name {
		box-shadow: 0 3px 10px hsl(0 0% 0% / 20%);
		border-radius: 2rem 2rem 0 0;
	}

	.info-block.phrase {
		width: 100%;
		padding: 3.5rem 1.6rem 3.5rem;
		font-size: 2.5rem;
		color: var(--dark);
		text-align: center;
	}

	blockquote {
		font-style: italic;
		color: var(--dark);
		font-weight: normal;
		text-shadow: 1px 1px 2px hsl(420 69% 0% / 25%);
	}

	.info-block {
		background-image: url('/play-dots.png');
		background-size: var(--dot-size);
		padding: 2rem 1rem 2rem;
		color: var(--light);
		text-align: center;
		text-transform: capitalize;

		p {
			font-size: 3.2rem;
			font-weight: bold;
			text-align: center;
			text-shadow: 1px 1px 0 #77770c;
		}
	}

	.price {
		background-color: var(--darker);

		&.special {
			background-color: var(--base);
		}
		&.reduced {
			background-color: var(--lighter);
		}
	}

	.location {
		background-color: var(--dbrown);
	}
	.size {
		background-color: var(--brown);
	}

	.time > p {
		color: var(--dark);
		text-shadow: 1px 1px 2px rgb(0 0 0 /25%);
	}

	p.month {
		font-style: italic;
		border: solid 2px var(--brown);
		background: transparent;
		color: var(--dbrown);
		border-radius: 10rem;
		font-size: 1.6em;
		padding: 1rem;
		opacity: 0.5;

		&.active {
			opacity: 1;
			background: var(--gold);
			color: var(--brown);
			text-shadow: none;
		}
	}

	.rarity {
		background-color: var(--brown);

		&.common {
			background-color: var(--mint);
		}
		&.uncommon {
			background-color: var(--blue);
		}
		&.rare {
			background-color: var(--purple);
		}
		&.ultra-rare {
			background-color: var(--gold);
		}

		p {
			text-transform: capitalize;
		}
	}

	.blathers-fact {
		blockquote {
			font-size: 1.6rem;
			padding: 1.5rem;
			line-height: 3.2rem;
		}
		@media screen and (min-width: 767px) {
			border-radius: 0 0 var(--border-radius) var(--border-radius);
		}
	}

	.btn-container {
		position: fixed;
		z-index: 15;
		bottom: 2.5rem;
		left: 2rem;

		@media screen and (min-width: 767px) {
			top: 2.5rem;
			bottom: auto;
		}

		a {
			width: 50px;
			height: 50px;
			display: block;
			background-color: var(--gold);
			border: none;
			border-radius: 100%;
			cursor: pointer;
			box-shadow: 2px 3px 0 var(--dbrown);
			padding: 1.5rem;
			transition: all 100ms;

			&:active {
				transform: scale(0.9);
			}
		}
	}
</style>
