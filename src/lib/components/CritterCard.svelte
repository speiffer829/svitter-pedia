<script>
	export let critter, dir;

	let title;
	let titleAtTop = false;

	function handleScroll(e) {
		titleAtTop = title.getBoundingClientRect().top <= 10
	}
</script>

<svelte:window on:scroll={handleScroll} />

<main>
	<div class="title-contain" class:atTop={titleAtTop}>
		<h1 class="name" bind:this={title} >{ critter.name }</h1>
		<div class="icon"><img src={`/${dir}/${critter.img}.png`} alt={critter.name}></div>
	</div>
</main>

<style>
		main{
		height: 300vh;
		width: 100%;
		background-color: var(--tan);
		background-image: url('/play-dots.png');
		background-size: var(--dot-size);
		border-radius: 2rem 2rem 0 0;
		box-shadow: 0 -3px 10px hsl(0 0% 0% / 20%);
		z-index: 2;
		position: relative;

		--rarity: var(--lgreen);
	}

	.icon{
		position: absolute;
		left: 50%;
		bottom: 0;
		transform: translate(-50%, 50%);
		width: 80px;
		height: 80px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--rarity);
		border-radius: 50%;
		background-image: url('/play-dots.png');
		background-size: var(--dot-size);
		z-index: 5;
		box-shadow: 0 3px 10px hsl(0 0% 0% / 20%);
		border: solid 4px var(--brown);
		transition: all 300ms;
	}

	.atTop > .icon{
		transform: translate(-50%, 30%) scale(.7);
	}

	.title-contain{
		position: sticky;
		top: 0;
	}

	h1{
		font-size: 3.5rem;
		color: #fccc1f;
		padding: 3rem 2rem 6.5rem;
		background: #9a702a;
		margin: 0;
		text-shadow: 2px 2px 5px #72531f;
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAElBMVEX8/PxISEgkJCRqamqIiIizs7OpMFnZAAAABnRSTlMXFxcXFxfwQqWiAAAAaUlEQVRIx+2SsQ2AMAwEbwXjDbwBgg0SRmD/VZAiyuBvLZRrLkWq93EyMJ97p7+Pc+5GETbLTURuwnJj/ukiuNgCE1vg+QamgynC6mH1sHr4aw8dwUFOiyvbYnwQPXREDzfVe1DHkud+ACYQGu23NmkEAAAAAElFTkSuQmCC);
		background-size: 36px 34.5px;
		grid-area: title;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 2rem 2rem 0 0;
		text-align: center;
		
		transition: border-radius 300ms;
	}

	.atTop > .name{
		border-radius: 0;
		box-shadow: 0 3px 10px hsl(0 0% 0% / 20%);
	}


</style>