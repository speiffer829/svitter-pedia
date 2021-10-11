<script>
	import { onMount } from 'svelte'
	import {parallaxImg} from '$lib/actions/parallaxImg'
	export let src, alt;



	// const imgSrc = async () => {
	// 	const getImg = await import(src);
	// 	console.log( getImg )
	// 	return 'boob.png'
	// }

</script>

<div id="img">
	<picture>
		<source srcset={`${src}?width=600&format=webp`} type="image/webp">
		<img {src} {alt} use:parallaxImg loading="eager" decoding="async">
	</picture>
	<!-- <img src="/bugs-detailed/brown_cicada.png?width=600&format=webp" alt="dsf"> -->
</div>

<style lang="scss">
	img{
		z-index: -1;
		position: relative;
		width: calc(100% - 20px);
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