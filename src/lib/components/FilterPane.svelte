<script>
	import { onMount } from 'svelte'
	import { fly } from 'svelte/transition'
	import { search, currentDir, showActiveOnlyBool, currentCritterList } from '$lib/stores/filterStore.js'
	import { elasticOut } from 'svelte/easing';
	import { findIfActive } from '$lib/findIfActive'

	export let critters, dir;


	function handleFilter() {
		if($search === ''){
			$currentCritterList = [...critters]
		}else{
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
		$currentCritterList = [...critters.filter(critter => {
			return findIfActive( critter.start, critter.end, critter.months )
		})]

	}


	function showAll() {
		$search = ''
		$showActiveOnlyBool = false
		$currentCritterList = [...critters]
	}




	onMount(() => {
		if($currentDir !== dir){
			$search = ''
			$currentDir = dir
			$currentCritterList = [...critters]
		}
	})
</script>

<aside>
	<div>

		<section class="search-section">
			<div class="input-contain">
				<input type="search" bind:value={$search} on:input={handleFilter} placeholder="Search">
				{#if $search !== ''}
				<button class="clear-btn" on:click={() => $search = ''} transition:fly|local={{ x: 50, duration: 1000, easing: elasticOut }}>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M2.12109 2L14 14" stroke="#643939" stroke-width="3" stroke-linecap="round"/>
						<path d="M2 13.9395L14 2.06055" stroke="#643939" stroke-width="3" stroke-linecap="round"/>
					</svg>
				</button>
				{/if}
			</div>
		</section>

		<section class="btns grid col-2">
			<button class="btn" class:active={$showActiveOnlyBool} on:click={showActiveOnly}>Show Currently Active</button>
			<button class="btn" class:active={!$showActiveOnlyBool} on:click={showAll}>Show All</button>
		</section>
	</div>
</aside>

<style lang="scss">
	aside{
		width: 100%;
		max-width: 1400px;
		padding: 1rem;
	}

	section{
		max-width: 767px;
		margin: 10px auto;
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

	.btns{
		button{
			text-align: center;
			border: none;
			box-shadow: var(--shadow);
			background: var(--brown);
			color: var(--gold);
			font-family: var(--headfont);
			font-size: 2rem;
			padding: 2rem;
			border-radius: 2rem;
			cursor: pointer;

			&.active{
				background: var(--gold);
				color: var(--brown);
			}
		}
	}
</style>