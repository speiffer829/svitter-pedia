import allCritters from '$lib/critters.json';
export async function get({ params }) {
	const { dir, slug } = params
	const critter = allCritters.find( critter => critter.slug === slug )

	return {
		status: 200,
		body: {
			critter
		}
	};
}
