import allCritters from '$lib/critters.json';
export async function get({ params }) {
	const { dir } = params;
	const critters = allCritters.filter((critter) => critter.type === dir);

	return {
		status: 200,
		body: {
			critters
		}
	};
}
