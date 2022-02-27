import { writable } from 'svelte/store';

interface Load {
	status: string;
	message: string;
}

function loadingStore() {
	const { set, update, subscribe } = writable({
		status: 'IDLE',
		message: '',
	});

	function setNavigate(isNavigating: boolean) {
		update(() => {
			return {
				status: isNavigating ? 'NAVIGATING' : 'IDLE',
				message: '',
			};
		});
	}

	return {
		set,
		update,
		subscribe,
		setNavigate,
	};
}

export const loading = loadingStore();
