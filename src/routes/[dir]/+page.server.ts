import allCritters from '$lib/critters.json';

export async function load({ params }) {
	const { dir } = params;

	const critters = allCritters.filter((critter) => critter.type === dir);

	return {
		critters,
	};
}
