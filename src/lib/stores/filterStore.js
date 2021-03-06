import { writable } from "svelte/store";

export const currentCritterList = writable([])

export const search = writable('')

export const currentDir = writable('');

export const showAllBool = writable(true);
export const showActiveOnlyBool = writable(false);
export const filtersActive = writable(false);
export const currentFilteredMonth = writable(null);
