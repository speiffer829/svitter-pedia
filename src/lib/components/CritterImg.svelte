<script>
	import { elasticOut as bounceOut } from 'svelte/easing'
	import { scale } from 'svelte/transition'
	import {parallaxImg} from '$lib/actions/parallaxImg'
	export let src, alt, width, height;

</script>

<div id="img">
	<picture>
		<source srcset={`${src}.avif`} type="image/avif">
		<source srcset={`${src}.webp`} type="image/webp">
		<img src={`${src}.png`} {alt} 
			use:parallaxImg 
			loading="eager" 
			decoding="async"
			{width} {height} 
			in:scale={{duration: 1500, easing: bounceOut}}>
	</picture>
</div>

<style lang="scss">
	img{
		z-index: -1;
		position: relative;
		width: calc(100% - 20px);
		height: auto;
		margin: 0 auto;
		display: block;
		transform: translate3d(0, var(--translateY, 0), 0) scale(var(--scale, 1));

		@media screen and (min-width: 767px) {
			transform: none;
		}
	}

	div{
		@media screen and (min-width: 767px) {
			max-height: calc(100vh - 5rem);
			display: flex;
			align-items: center;
			position: sticky;
			top: 5rem;
		}
	}
</style>