<script context="module">
	export async function load({ params, fetch }) {
		const { dir, slug } = params

		const req = await fetch(`/api/${dir}/${slug}.json`)
		const res = await req.json()
		const { critter } = res

		return{
			props: {
				dir,
				critter
			}
		}
	}
</script>

<script>
	import CritterImg from '$lib/components/CritterImg.svelte'
	import CritterCard from '$lib/components/CritterCard.svelte'
	export let critter;
	export let dir;


	const findThemeColor = () => {
		if(critter.price >= 10000){
			return 'hsl(52.4, 77.5%, 72%)';
		}else if(critter.price >= 5000){
			return 'hsl(271.8, 25.6%, 71%)';
		}else if(critter.price >= 1000){
			return 'hsl(211.4, 51.2%, 64%)';
		}else{
			return 'hsl(161.4, 49.9%, 67.1%)';
		}
	}

	let themeColor = findThemeColor()



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

	$: width = dir === 'fish' ? 1024 : 600
	$: height = dir === 'fish' ? 512 : 600
</script>

<svelte:head>
	<title>{critter.name} | Critterpoo</title>
	<meta name="theme-color" 
      content={themeColor}>
</svelte:head>


	<div class="body-bg {moneyBracket}">
		<div class="grid col-2-md gap-3-md">
			<CritterImg src={`/${dir}-detailed/${critter.detailedImg}`} alt={critter.name} {width} {height} />
			<CritterCard {critter} {moneyBracket} {dir} />
		</div>
	</div>


	<style lang="scss">

		div.body-bg{
			width: 100%;
			min-height: 100vh;
			background-color: var(--bg, var(--tan));
			background-image: var(--bgImage, url('/leaf-test.png'));
			background-attachment: fixed;

			&.gold{
				--bg: var(--yellow);
				--bgImage: url('/gold-leafs.webp');
			}
			&.purple{
				--bg: var(--purple);
				--bgImage: url('/purple-leafs.webp');
			}
			&.blue{
				--bg: var(--blue);
				--bgImage: url('/blue-leafs.webp');
			}
			&.green{
				--bg: var(--mint);
				--bgImage: url('/green-leafs.webp');
			}
			&.dark{
				--bg: var(--dark);
				--bgImage: url('/play-dots.png');
			}

			@media screen and (min-width: 767px) {
				--bg: var(--dark);
			}
		}
		div.grid{
			max-width: 1100px;
			margin: 0 auto;
			isolation: isolate;
			
			@media screen and (min-width: 767px) {
				padding: 0rem 2rem;
				position: relative;
			}
		}
	</style>