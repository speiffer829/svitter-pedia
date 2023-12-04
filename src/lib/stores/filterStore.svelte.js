class Store {
	value = $state();
	constructor(start_value) {
		this.value = start_value;
	}

	update(fn) {
		this.value = fn(this.value);
	}
}

export const currentCritterList = new Store([]);

export const search = new Store('');

export const currentDir = new Store('');

export const showAllBool = new Store(true);
export const showActiveOnlyBool = new Store(false);
export const filtersActive = new Store(false);
export const currentFilteredMonth = new Store(null);
