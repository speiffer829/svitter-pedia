<script>
	import { onMount } from 'svelte'
import ActiveDot from './ActiveDot.svelte';
	export let critter, dir;

	let item;

	

	onMount(() => {
		new IntersectionObserver((entries,observer) => {
			entries.forEach(entry => {
				if(entry.isIntersecting){
					const imgWebp = new Image()
					imgWebp.src = `/${dir}-detailed/${critter.detailedImg}.webp`
					const imgAvif = new Image()
					imgAvif.src = `/${dir}-detailed/${critter.detailedImg}.avif`
					observer.unobserve(entry.target);
				}
			});
		}).observe(item)
	})

		const findMoneyBracket = () => {
		if(critter.price >= 10000){
			return 'gold';
		}else if(critter.price >= 5000){
			return 'purple';
		}else if(critter.price >= 1000){
			return 'blue';
		}else{
			return 'green';
		}
	}

	let moneyBracket = findMoneyBracket()

	function handleHover(e) {
		const rect = e.target.getBoundingClientRect()
		const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
	}
</script>


<a href={`/${dir}/${critter.slug}`} sveltekit:prefetch class={moneyBracket} bind:this={item} id={critter.slug} on:mouseenter={handleHover}>
	<ActiveDot {critter} alignTopLeft={true} />
	<picture>
		<source srcset={`/${dir}/${critter.img}.avif`} type="image/avif">
		<source srcset={`/${dir}/${critter.img}.webp`} type="image/webp">
		<img src={`/${dir}/${critter.img}.png`} alt={critter.name} height="64" width="64" loading="lazy">
	</picture>
	<span>{critter.name}</span>
</a>


<style lang="scss">
		a{
		background-color: var(--tan);
		box-shadow: 2px 3px 4px hsl( 420 69% 0% / 25% );
		display: grid;
		grid-template-columns: 64px 1fr;
		width: 100%;
		border-radius: 3rem;
		align-items: center;
		font-size: 2.2rem;
		padding: 1rem 1.5rem;
		color: var(--darker);
		text-decoration: none;
		font-weight: bold;
		text-shadow: 2px 2px 5px hsl(420 69% 0% / 10%);
		position: relative;
		isolation: isolate;
		overflow: hidden;
		transition: all 100ms;

		&:active{
			transform: scale(.9);
		}

		--base: var(--mint);
		--darker: var(--dmint);
		--lighter: var(--lmint);

		&.blue{
			--base: var(--blue);
			--darker: var(--dblue);
			--lighter: var(--lblue);
		}

		&.purple{
			--base: var(--purple);
			--darker: var(--dpurple);
			--lighter: var(--lpurple);
		}

		&.gold{
			--base: var(--gold);
			--darker: var(--dgold);
			--lighter: var(--lgold);
		}

		&::after{
			content: '';
			width: 180px;
			height: 180px;
			position: absolute;
			z-index: -1;
			background: var(--lighter);
			border-radius: 150px;
			top: 0;
			left:0;
			transform: translate(-55%, -55%);
			opacity: 0.5;
		}
		&::before{
			content: '';
			width: 250px;
			height: 160px;
			position: absolute;
			z-index: -1;
			background: var(--lighter);
			border-radius: 150px;
			bottom: 0;
			right:0;
			transform: translate(55%, 55%);
			opacity: 0.5;
		}

		span{
			padding-left: 1.5rem;
			display: block;
		}

		img{
			width: 64px;
			height: 64px;
		}
	}
</style>