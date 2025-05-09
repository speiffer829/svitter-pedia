<script lang="ts">
	import type { Critter } from '$lib/types/index';
	import { fly, scale, fade } from 'svelte/transition';
	import {
		search,
		currentDir,
		showActiveOnlyBool,
		showAllBool,
		currentCritterList,
		filtersActive,
		currentFilteredMonth,
	} from '$lib/stores/filterStore.svelte.js';
	import { backOut, backIn, elasticOut } from 'svelte/easing';
	import { findIfActive } from '$lib/findIfActive';

	type Props = {
		critters: Critter[];
		dir: string;
	};

	let { critters, dir } = $props<Props>();

	let filtersAreVisible: boolean = $state(false);

	function clearFilters(resetCritters = false) {
		search.value = '';
		showActiveOnlyBool.value = false;
		showAllBool.value = true;
		filtersActive.value = false;
		filtersAreVisible = false;
		currentFilteredMonth.value = null;

		if (resetCritters) {
			currentCritterList.value = [...critters];
		}
	}

	function handleFilter() {
		if (search.value === '') {
			clearFilters(true);
		} else {
			filtersActive.value = true;
			showAllBool.value = false;
			showActiveOnlyBool.value = false;
			const freshArr = critters.filter((critter) => {
				return critter.name.toLowerCase().indexOf(search.value.toLowerCase()) !== -1;
			});

			currentCritterList.value = [...freshArr];
		}
	}

	function showActiveOnly() {
		if (showActiveOnlyBool.value) return;
		search.value = '';
		showActiveOnlyBool.value = true;
		showAllBool.value = false;
		filtersActive.value = true;
		filtersAreVisible = false;
		currentCritterList.value = [
			...critters.filter((critter) => {
				return findIfActive(critter.start, critter.end, critter.months);
			}),
		];
	}

	function clearSearch() {
		search.value = '';
		clearFilters();
	}

	function filterMonth(month) {
		search.value = '';
		showActiveOnlyBool.value = false;
		showAllBool.value = false;
		filtersActive.value = true;
		filtersAreVisible = false;
		currentFilteredMonth.value = month;
		currentCritterList.value = [
			...critters.filter((critter) => {
				return critter.months.includes(month);
			}),
		];
	}

	$effect(() => {
		if (currentDir.value !== dir) {
			currentDir.value = dir;
			clearFilters(true);
		}
	});
</script>

{#if filtersAreVisible}
	<div
		class="overlay"
		on:click={() => (filtersAreVisible = false)}
		transition:fade={{ duration: 500 }}
	/>
{/if}

<section class="search-section">
	<div class="input-grid grid">
		<div class="input-contain">
			<input type="search" bind:value={search.value} on:input={handleFilter} placeholder="Search" />
			{#if search.value !== ''}
				<button
					class="clear-btn"
					on:click={() => clearFilters(true)}
					transition:fly|local={{ x: 50, duration: 1000, easing: elasticOut }}
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M2.12109 2L14 14" stroke="#643939" stroke-width="3" stroke-linecap="round" />
						<path
							d="M2 13.9395L14 2.06055"
							stroke="#643939"
							stroke-width="3"
							stroke-linecap="round"
						/>
					</svg>
				</button>
			{/if}
		</div>
		<button
			class="btn filter-btn"
			on:click={() => (filtersAreVisible = !filtersAreVisible)}
			class:active={filtersActive.value}
		>
			<svg
				width="76"
				height="76"
				viewBox="0 0 76 76"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect x="23" y="25" width="30" height="3" rx="1" fill="currentcolor" />
				<rect x="23" y="37" width="30" height="3" rx="1" fill="currentcolor" />
				<rect x="46" y="22" width="3" height="8" rx="1" fill="currentcolor" />
				<rect x="28" y="34" width="3" height="8" rx="1" fill="currentcolor" />
				<rect x="39" y="46" width="3" height="8" rx="1" fill="currentcolor" />
				<rect x="23" y="49" width="30" height="3" rx="1" fill="currentcolor" />
			</svg>
		</button>
	</div>
</section>

{#if filtersAreVisible}
	<aside
		in:scale|local={{ duration: 300, easing: backOut, opacity: 1 }}
		out:scale|local={{ duration: 300, easing: backIn, opacity: 1 }}
	>
		<button class="close-btn" on:click={() => (filtersAreVisible = false)}>&times;</button>
		<h2>Filters</h2>
		<section class="btns grid col-2-md gap-1" class:col-2-md={filtersActive.value}>
			{#if filtersActive.value}
				<button class="btn clear-filters-btn" on:click={() => clearFilters(true)}
					>Clear Filters</button
				>
			{/if}
			<button
				class="btn currently-active-btn"
				class:active={showActiveOnlyBool.value}
				on:click={showActiveOnly}>Show Currently Active</button
			>
		</section>

		<section class="btns grid col-3-md col-2 gap-1">
			<button
				on:click={() => filterMonth('jan')}
				class="btn month-btn"
				class:active={'jan' === currentFilteredMonth.value}>Jan</button
			>
			<button
				on:click={() => filterMonth('feb')}
				class="btn month-btn"
				class:active={'feb' === currentFilteredMonth.value}>Feb</button
			>
			<button
				on:click={() => filterMonth('mar')}
				class="btn month-btn"
				class:active={'mar' === currentFilteredMonth.value}>Mar</button
			>
			<button
				on:click={() => filterMonth('apr')}
				class="btn month-btn"
				class:active={'apr' === currentFilteredMonth.value}>Apr</button
			>
			<button
				on:click={() => filterMonth('may')}
				class="btn month-btn"
				class:active={'may' === currentFilteredMonth.value}>May</button
			>
			<button
				on:click={() => filterMonth('jun')}
				class="btn month-btn"
				class:active={'jun' === currentFilteredMonth.value}>Jun</button
			>
			<button
				on:click={() => filterMonth('jul')}
				class="btn month-btn"
				class:active={'jul' === currentFilteredMonth.value}>Jul</button
			>
			<button
				on:click={() => filterMonth('aug')}
				class="btn month-btn"
				class:active={'aug' === currentFilteredMonth.value}>Aug</button
			>
			<button
				on:click={() => filterMonth('sep')}
				class="btn month-btn"
				class:active={'sep' === currentFilteredMonth.value}>Sept</button
			>
			<button
				on:click={() => filterMonth('oct')}
				class="btn month-btn"
				class:active={'oct' === currentFilteredMonth.value}>Oct</button
			>
			<button
				on:click={() => filterMonth('nov')}
				class="btn month-btn"
				class:active={'nov' === currentFilteredMonth.value}>Nov</button
			>
			<button
				on:click={() => filterMonth('dec')}
				class="btn month-btn"
				class:active={'dec' === currentFilteredMonth.value}>Dec</button
			>
		</section>
	</aside>
{/if}

<style lang="postcss">
	aside {
		width: 90%;
		max-width: 767px;
		position: fixed;
		inset: 50% auto auto 50%;
		transform: translate(-50%, -50%);
		background-color: var(--light);
		background-image: url('/play-dots.png');
		background-size: var(--dot-size);
		padding: 1.5rem;
		z-index: 100;
		box-shadow: var(--shadow);
		border-radius: 4rem;
	}

	section {
		max-width: 767px;
		margin: 10px auto;

		&.search-section {
			width: 100%;
			max-width: 767px;
			padding: 1rem;
		}
	}

	h2 {
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

	.search-section {
		position: relative;
	}

	.input-contain {
		position: relative;
		max-width: 767px;
	}

	.input-grid {
		display: grid;
		grid-template-columns: auto 76px;
		max-width: 767px;
		margin: 10px auto;
		.filter-btn {
			padding: 0;
			border-radius: 1rem 3rem 3rem 1rem;
			height: 76px;
		}
	}
	input {
		width: 100%;
		box-shadow: var(--shadow);
		font-size: 2.4rem;
		padding: 2rem;
		border-radius: 3rem 1rem 1rem 3rem;
		border: solid 3px transparent;
		font-family: var(--headFont);
		color: var(--brown);
		background: var(--light);
		margin: 0px auto;
		max-width: 767px;
		display: block;

		&:focus {
			border-color: var(--gold);
		}
	}

	.clear-btn {
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

	.btn {
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

		&:active {
			transform: scale(0.9);
		}

		&.currently-active-btn {
			background: var(--green);
		}

		&.active {
			background: var(--gold);
			color: var(--brown);
		}
	}

	.close-btn {
		position: absolute;
		top: -10px;
		right: -10px;
		width: 50px;
		height: 50px;
		font-size: 3rem;
		background: var(--red);
		color: var(--light);
		box-shadow:
			0px 0px 5px hsl(var(--redHSL) / 80%),
			var(--shadow);
		border: none;
		border-radius: 1rem;
		transition: all 100ms;

		&:active {
			transform: scale(0.9);
		}
	}

	.filter-btns {
		display: flex;
		gap: 1rem;

		button {
			display: block;
		}
	}
	.clear-filters-btn {
		background: var(--red);
		box-shadow: var(--shadow);
		color: var(--light);
	}

	.overlay {
		position: fixed;
		inset: 0;
		background: hsl(var(--darkHSL) / 50%);
		z-index: 100;
	}
</style>
