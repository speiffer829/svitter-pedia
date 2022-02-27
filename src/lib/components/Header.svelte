<script lang="ts">
	import { navigating } from '$app/stores';

	let isOpenNav: boolean;

	$: closeMenu(!!$navigating);

	function closeMenu(status: boolean) {
		if (status && isOpenNav) isOpenNav = false;
	}
</script>

<nav class:isOpenNav>
	<a href="/" sveltekit:prefetch>Home</a>
	<a href="/bugs" sveltekit:prefetch>Bugs</a>
	<a href="/fish" sveltekit:prefetch>Fish</a>
</nav>

<button on:click={() => (isOpenNav = !isOpenNav)}>
	<svg
		width="100%"
		height="100%"
		viewBox="0 0 30 21"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		class:crossMode={isOpenNav}
	>
		<rect width="30" height="3" rx="1.5" fill="var(--brown)" id="bar-1" />
		<rect y="9" width="30" height="3" rx="1.5" fill="var(--brown)" id="bar-2" />
		<rect y="18" width="30" height="3" rx="1.5" fill="var(--brown)" id="bar-3" />
	</svg>
</button>

<style lang="scss">
	nav {
		font-size: 1.6rem;
		background-color: var(--brown);
		background-image: url('/play-dots.png');
		background-size: var(--dot-size);
		padding: 1.5rem;
		position: fixed;
		inset: 0;
		z-index: 19;
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: var(--gold);
		transform: translateY(-100%);
		transition: all 300ms;

		a {
			display: block;
			font-size: 5rem;
			font-weight: bold;
			text-align: center;
			text-decoration: none;
			color: var(--gold);
			padding: 2rem;
		}
	}

	nav.isOpenNav {
		transform: translateY(0);
	}

	button {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 70px;
		height: 70px;
		background: var(--gold);
		box-shadow: 3px 3px 0 var(--dbrown);
		z-index: 20;
		border-radius: 100%;
		padding: 1.5rem;
		border: none;
		cursor: pointer;
	}

	#bar-1,
	#bar-2,
	#bar-3 {
		transform-origin: center;
		transition: transform 250ms;
	}

	.crossMode {
		#bar-1 {
			transform: translate(-5px, 7px) rotate(45deg);
		}

		#bar-2 {
			transform: scaleX(0);
		}

		#bar-3 {
			transform: translate(-6px, -6px) rotate(-45deg);
		}
	}
</style>
