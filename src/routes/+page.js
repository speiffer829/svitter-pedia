export async function GET({ fetch }) {
	const req = await fetch('/api/homepage.json');
	const {
		leavingArray,
		newThisMonthArray,
		comingNextMonthArray,
		mostValuableNow,
	} = await req.json();

	return {
		leavingArray,
		newThisMonthArray,
		comingNextMonthArray,
		mostValuableNow,
	};
}
