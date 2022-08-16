export async function GET({ params, fetch }) {
	const { dir, slug } = params;

	const req = await fetch(`/api/${dir}/${slug}.json`);
	const res = await req.json();
	const { critter } = res;

	return {
		dir,
		critter,
	};
}
