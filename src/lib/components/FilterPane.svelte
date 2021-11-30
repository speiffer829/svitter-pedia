<script>
	import { onMount } from 'svelte'
	import { fly, scale } from 'svelte/transition'
	import { search, currentDir, showActiveOnlyBool, showAllBool, currentCritterList, filtersActive } from '$lib/stores/filterStore.js'
	import { elasticOut, backIn } from 'svelte/easing';
	import { findIfActive } from '$lib/findIfActive'

	export let critters, dir;


	let filtersAreVisible = false


	function clearFilters(resetCritters = false) {
		console.log( 'fired' )
		$search = ''
		$showActiveOnlyBool = false
		$showAllBool = true
		$filtersActive = false;
		filtersAreVisible = false

		if(resetCritters){
			$currentCritterList = [...critters]
		}
	}


	function handleFilter() {
		if($search === ''){
			clearFilters(true)
		}else{
			$filtersActive = true
			$showAllBool = false
			$showActiveOnlyBool = false
			const freshArr = critters.filter((critter) => {
				return critter.name.toLowerCase().indexOf($search.toLowerCase()) !== -1
			})

			$currentCritterList = [...freshArr]
		}


	}

	function showActiveOnly() {
		if($showActiveOnlyBool) return
		$search = ''
		$showActiveOnlyBool = true
		$showAllBool = false
		$filtersActive = true;
		filtersAreVisible = false
		$currentCritterList = [...critters.filter(critter => {
			return findIfActive( critter.start, critter.end, critter.months )
		})]

	}

	function clearSearch() {
		$search= ''
		clearFilters()
	}




	onMount(() => {
		if($currentDir !== dir){
			$search = ''
			$currentDir = dir
			$showAllBool = true
			$showActiveOnlyBool = false
			$currentCritterList = [...critters]
		}
	})
</script>

<section class="search-section">
	<div class="input-contain">
		<input type="search" bind:value={$search} on:input={handleFilter} placeholder="Search">
		{#if $search !== ''}
		<button class="clear-btn" on:click={() => clearFilters(true)} transition:fly|local={{ x: 50, duration: 1000, easing: elasticOut }}>
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M2.12109 2L14 14" stroke="#643939" stroke-width="3" stroke-linecap="round"/>
				<path d="M2 13.9395L14 2.06055" stroke="#643939" stroke-width="3" stroke-linecap="round"/>
			</svg>
		</button>
		{/if}
	</div>

	<div class="filter-btns">
		<button class="btn" on:click={() => filtersAreVisible = !filtersAreVisible}>Filters: { $filtersActive ? 'On' : 'Off' }</button>
		{#if $filtersActive}
			<button class="btn clear-filters-btn" on:click={() => clearFilters(true)}>Clear Filters</button>
		{/if}
	</div>
</section>

{#if filtersAreVisible}
	<aside 
		in:scale|local={{ duration: 1100, easing: elasticOut }}
		out:scale|local={{ duration: 300, easing: backIn }}>
		<button class="close-btn" on:click={() => filtersAreVisible = false}>&times;</button>
		<h2>Filters</h2>
			<section class="btns grid col-2-sm">
				<button class="btn" class:active={$showActiveOnlyBool} on:click={showActiveOnly}>Show Currently Active</button>
				<button class="btn" class:active={$showAllBool} on:click={() => clearFilters(true)}>Show All</button>
			</section>
	</aside>
{/if}

<style lang="scss">
	aside{
		max-width: 767px;
		position: fixed;
		inset: 20px;
		background-color: var(--light);
		background-image: url('/play-dots.png');
		background-size: var(--dot-size);
		padding: 1.5rem;
		z-index: 100;
		box-shadow: var(--shadow);
		border-radius: 4rem;

	}

	section{
		max-width: 767px;
		margin: 10px auto;

		&.search-section{
			width: 100%;
			max-width: 767px;
			padding: 1rem;
		}
	}

	h2{
		text-align: center;
		font-size: 3rem;
		background-color: var(--brown);
		background-image: url('/play-dots.png');
		background-size: var(--dot-size);
		box-shadow: var(--shadow);
		border-radius: 3rem 3rem 5px 5px;
		padding: 1rem;
		color: var(--gold);
	}

	.search-section{
		position: relative;
	}

	.input-contain{
		position: relative;
		max-width: 767px;
		margin: 10px auto;
	}

	input{
		width: 100%;
		box-shadow: var(--shadow);
		font-size: 2.4rem;
		padding: 2rem;
		border-radius: 3rem;
		border: solid 3px transparent;
		font-family: var(--headFont);
		color: var(--brown);
		background: var(--light);
		margin: 10px auto;
		max-width: 767px;
		display: block;

		&:focus{
			border-color: var(--gold);
		}
	}

	.clear-btn{
		position: absolute;
		right: 2rem;
		top: 50%;
		transform: translate(0, -50%);
		background: none;
		display: flex;
		align-items: center;
		border: none;
		cursor: pointer;
	}

	.btn{
		width: 100%;
		text-align: center;
		border: none;
		box-shadow: var(--shadow);
		background: var(--brown);
		color: var(--gold);
		font-family: var(--headfont);
		font-size: 1.5rem;
		padding: 2rem;
		border-radius: 2rem;
		cursor: pointer;
		transition: all 100ms;

		&:active{
			transform: scale(.9);
		}

		&.active{
			background: var(--gold);
			color: var(--brown);
		}
	}

	.close-btn{
		position: absolute;
		top: -10px;
		right: -10px;
		width: 50px;
		height: 50px;
		font-size: 3rem;
		background: var(--red);
		color: var(--light);
		box-shadow: 0px 0px 5px hsl(var(--redHSL) / 80%), var(--shadow);
		border: none;
		border-radius: 1rem;
		transition: all 100ms;

		&:active{
			transform: scale(.9);
		}
	}

.filter-btns{
	display: flex;
	gap: 1rem;

	button{
		display: block;
	}
}
	.clear-filters-btn{
		background: var(--red);
		box-shadow: var(--shadow);
		color: var(--light);
	}
</style>