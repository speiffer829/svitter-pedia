// import { writable } from 'svelte/store';

export class LoadingStore {
	status = $state('IDLE');
	message = $state('');

	setNavigate(isNavigating) {
		this.status = isNavigating ? 'NAVIGATING' : 'IDLE';
		this.message = '';
	}
}

export const loading = new LoadingStore();

// function loadingStore() {
// 	const { set, update, subscribe } = writable({
// 		status: 'IDLE',
// 		message: '',
// 	});

// 	function setNavigate(isNavigating: boolean) {
// 		update(() => {
// 			return {
// 				status: isNavigating ? 'NAVIGATING' : 'IDLE',
// 				message: '',
// 			};
// 		});
// 	}

// 	return {
// 		set,
// 		update,
// 		subscribe,
// 		setNavigate,
// 	};
// }
