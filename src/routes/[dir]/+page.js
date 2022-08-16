export async function load({ params, fetch }) {
	const { dir } = params;
	console.log('dir', dir);

	const req = await fetch(`/api/${dir}.json`);
	const res = await req.json();
	const { critters } = res;

	return {
		dir,
		critters,
	};
}
