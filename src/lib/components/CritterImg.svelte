<script>
	import { browser } from '$app/env'
	import {parallaxImg} from '$lib/actions/parallaxImg'
	export let src, alt;

</script>

<img {src} {alt} use:parallaxImg loading="lazy">

<style lang="scss">
	img{
		z-index: -1;
		position: relative;
		width: calc(100% - 20px);
		margin: 0 auto;
		display: block;
		transform: translate3d(0, var(--translateY, 0), 0) scale(var(--scale, 1));
		aspect-ratio: 1/1;

		@media screen and (min-width: 767px) {
			transform: none;
		}
	}
</style>