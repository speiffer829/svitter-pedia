<script>
	import {parallaxImg} from '$lib/actions/parallaxImg'
	export let src, alt;
</script>

<img {src} {alt} use:parallaxImg>

<style>
	img{
		z-index: -1;
		position: relative;
		width: calc(100% - 20px);
		margin: 0 auto;
		display: block;
	}
</style>