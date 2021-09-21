<nav>
	<a href="/" sveltekit:prefetch>Home</a>
	<a href="/bugs" sveltekit:prefetch>Bugs</a>
</nav>

<style>
	nav{
		font-size: 1.6rem;
		background-color: var(--brown);
		background-image: url('/play-dots.png');
		background-size: var(--dot-size);
		border-radius: 0 0 2rem 2rem;
		padding: 1.5rem;
	}
</style>