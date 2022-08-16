<script>
	import { page } from '$app/stores';
</script>

<h1>UH OH! SPAGHETTI-O's</h1>
<h2>{$page.status}: {$page.error.message}</h2>

<style>
	h1 {
		font-size: 6rem;
		text-align: center;
		color: var(--green);
	}
</style>
