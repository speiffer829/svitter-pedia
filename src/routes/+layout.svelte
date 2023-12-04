<script lang="ts">
	import '../app.pcss';
	import '$lib/global.css';
	import Header from '$lib/components/Header.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { loading } from '$lib/stores/loading.svelte';
	import { navigating } from '$app/stores';

	$effect(() => {
		loading.setNavigate(!!$navigating);
	});
</script>

<Header />
<slot />

<Loading />
