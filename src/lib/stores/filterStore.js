import { writable } from "svelte/store";

export const currentCritterList = writable([])

export const search = writable('')

export const currentDir = writable('');

export const showActiveOnlyBool = writable(false);