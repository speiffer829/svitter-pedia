<script lang="ts">
	import { loading } from '$lib/stores/loading';

	$: if ($loading.status === 'NAVIGATING') {
		setTimeout(() => {
			if ($loading.status === 'NAVIGATING') {
				$loading.status = 'LOADING';
			}
		}, 300);
	}
</script>

{#if $loading.status === 'LOADING'}
	<div class="overlay">
		<div class="spinner" />
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		z-index: 200;
		inset: 0;
		background: hsl(0 0% 0% / 50%);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.spinner {
		width: 100px;
		height: 100px;
		border: solid 5px transparent;
		border-top-color: var(--gold);
		border-radius: 1000px;
		animation: spin 1000ms infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0turn);
		}
		100% {
			transform: rotate(1turn);
		}
	}
</style>
