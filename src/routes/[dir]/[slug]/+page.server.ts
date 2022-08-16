import allCritters from '$lib/critters.json';
import type { Critter } from '$lib/types/index';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function load({ params }): Obj {
	const { slug, dir }: { slug: string; dir: string } = params;
	const critter: Critter = allCritters.find((critter: Critter) => critter.slug === slug);

	// if (!critter) throw 404;

	return {
		dir,
		critter,
	};
}
