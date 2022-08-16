import allCritters from '$lib/critters.json';
import type { Critter } from '$lib/types/index';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function get({ params }): Obj {
	const { slug }: { slug: string } = params;
	const critter: Critter = allCritters.find((critter: Critter) => critter.slug === slug);

	const status: number = !critter ? 404 : 200;

	return {
		status,
		body: {
			critter,
		},
	};
}
