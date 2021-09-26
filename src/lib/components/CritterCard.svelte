<script>
	export let critter, dir;

	let title;
	let titleAtTop = false;

	function handleScroll(e) {
		titleAtTop = title.getBoundingClientRect().top <= 10
	}

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

	function timeConvert(time) {
		if(time === 0){
			return `12am`
		}else{
			return time > 12 ? `${time - 12}pm` : `${time}am`
		}
	}

	$: flickPrice = critter.price * 1.5
</script>

<svelte:window on:scroll={handleScroll} />

<main class="{findMoneyBracket()}">
	<section class="title-contain" class:atTop={titleAtTop}>
		<h1 class="name" bind:this={title} >{ critter.name }</h1>
		<div class="icon"><img src={`/${dir}/${critter.img}.png`} alt={critter.name}></div>
	</section>

	<div class="grid col-2 gap-none">
		<div class="price info-block">
			<span class="label">Price</span>
			<p>${ Intl.NumberFormat('en-US').format(critter.price) }</p>
		</div>
		<div class="price flick info-block">
			<span class="label">Flick's Price</span>
			<p>${ Intl.NumberFormat('en-US').format(flickPrice) }</p>
		</div>
	</div>

	<blockquote class="phrase">
		"{ critter.phrase }"
	</blockquote>

	<div class="grid {dir === 'fish' ? 'col-3' : 'col-1'}">
		{#if dir === 'fish'}
			<div class="size info-block">
				<span class="label">Size</span>
				<p>{ critter.size }</p>
			</div>
		{/if}
		
		<div class="location info-block">
			<span class="label">Location</span>
			<p>{ critter.location }</p>
		</div>
	</div>

	<div class="info-block time">
		<span class="label">Time</span>
		{#if Array.isArray(critter.start)}
			{#each critter.start as start, i}
				<p>{ timeConvert(start) } - { timeConvert(critter.end[i]) }</p>
			{/each}
		{:else if critter.start === 0 && critter.end === 24}
			<p>All Day</p>
		{:else}
			<p>{ timeConvert(critter.start) } - { timeConvert(critter.end) }</p>
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
		<p>{ critter.rarity }</p>
	</div>

</main>

<div class="btn-container">
	<a class="back-btn" href={`/${dir}#${critter.slug}`}>
		<svg width="100%" height="100%" viewBox="0 0 44 38" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M1.23223 17.2322C0.255922 18.2085 0.255922 19.7915 1.23223 20.7678L17.1421 36.6777C18.1184 37.654 19.7014 37.654 20.6777 36.6777C21.654 35.7014 21.654 34.1184 20.6777 33.1421L6.53553 19L20.6777 4.85786C21.654 3.88155 21.654 2.29864 20.6777 1.32233C19.7014 0.34602 18.1184 0.34602 17.1421 1.32233L1.23223 17.2322ZM44 16.5L3 16.5V21.5L44 21.5V16.5Z" fill="var(--brown)"/>
		</svg>
	</a>
</div>

<style lang="scss">
		main{
		width: 100%;
		background-color: var(--tan);
		background-image: url('/play-dots.png');
		background-size: var(--dot-size);
		border-radius: 2rem 2rem 0 0;
		box-shadow: 0 -3px 10px hsl(0 0% 0% / 20%);
		z-index: 2;
		position: relative;

		@media screen and (min-width: 767px) {
			border-radius: 2rem;
		}

		--bg: var(--lgreen);
		--color: var(--dgreen);

		&.blue{
			--bg: var(--blue);
			--color: var(--dblue)
		}

		&.purple{
			--bg: var(--purple);
			--color: var(--dpurple)
		}

		&.gold{
			--bg: var(--gold);
			--color: var(--dgold)
		}
	}

	span.label{
		display: inline-block;
		background: var(--gold);
		color: var(--dbrown);
		text-align: center;
		border-radius: 100px;
		padding: 5px 10px;
		font-size: 1.2rem;
		margin-bottom: 5px;
		box-shadow: 2px 2px 10px rgb(0 0 0 / 20%);
		border: solid 1px var(--dbrown)
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
		background-color: var(--bg);
		border-radius: 50%;
		background-image: url('/play-dots.png');
		background-size: var(--dot-size);
		z-index: 5;
		box-shadow: 0 3px 10px hsl(0 0% 0% / 20%);
		border: solid 4px var(--brown);
		transition: all 600ms;
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
		border-radius: 2rem 2rem 0 0;
		text-align: center;
		
		transition: border-radius 300ms;
	}

	.atTop > .name{
		border-radius: 0;
		box-shadow: 0 3px 10px hsl(0 0% 0% / 20%);
	}


	.phrase{
		width: 100%;
		padding: 3.5rem 1.6rem 3.5rem;
		font-size: 2.5rem;
		text-align: center;
	}

	blockquote{
		font-style: italic;
		color: var(--dark);
		font-weight: normal;
		text-shadow: 1px 1px 2px hsl(420 69% 0% / 25%);
	}

	.info-block{
		background-image: url('/play-dots.png');
		background-size: var(--dot-size);
		padding: 2rem 1rem 2rem;
		color: var(--light);
		text-align: center;
		text-transform: capitalize;


		p{
			font-size: 3.2rem;
			font-weight: bold;
			text-align: center;
			text-shadow: 1px 1px 0 #77770c;
		}
	}

	.price {
		background-color: var(--bg);

		&.flick {
			background-color: var(--color);
		}

	}

	.location{
		background-color: var(--dbrown);
	}

	.time > p{
		color: var(--dark);
		text-shadow: 1px 1px 2px rgb(0 0 0 /25%);
	}


	p.month{
		font-style: italic;
		border: solid 2px var(--brown);
		background: transparent;
		color: var(--dbrown);
		border-radius: 10rem;
		font-size: 1.6em;
		padding: 1rem;
		opacity: .5;

		&.active{
			opacity: 1;
			background: var(--gold);
			color: var(--brown);
			text-shadow: none;
		}
	}

	.rarity{
		background-color: var(--brown);

		&.common{ background-color: var(--lgreen); }
		&.uncommon{ background-color: var(--blue); }
		&.rare{ background-color: var(--purple); }
		&.ultra-rare{ background-color: var(--gold); }
	}




	.btn-container{
		position: fixed;
		z-index: 15;
		top: 2.5rem;
		left: 2rem;

		a{
			width: 50px;
			height: 50px;
			display: block;
			background-color: var(--gold);
			border: none;
			border-radius: 100%;
			cursor: pointer;
			box-shadow: 2px 3px 0 var(--dbrown);
			padding: 1.5rem;
		}
	}

</style>