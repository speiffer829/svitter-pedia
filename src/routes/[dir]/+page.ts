import allCritters from '$lib/critters.json';
import type { Critter } from '$lib/types/index.js';

export async function load({ params }) {
	const { dir } = params;

	const critters: Critter[] = allCritters.filter((critter) => critter.type === dir);

	return {
		dir,
		critters,
	};
}
