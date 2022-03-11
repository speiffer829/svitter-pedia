import critters from '$lib/critters.json';
import { findIfActive } from '$lib/findIfActive';
import type { Critter } from '$lib/types/index';

export async function get() {
	const currentMonthRaw = new Date().getMonth();

	const currentMonth = getMonthText(currentMonthRaw);

	const nextMonth = getMonthText(currentMonthRaw === 11 ? 0 : currentMonthRaw + 1);

	const lastMonth = getMonthText(currentMonthRaw === 0 ? 11 : currentMonthRaw - 1);

	// Get All critters leaving this month
	const leavingArray: Critter[] = critters
		.filter((critter) => {
			const { months } = critter;
			return months.includes(currentMonth) && !months.includes(nextMonth);
		})
		.sort(() => Math.random() - 0.5);

	//Get all Critters who are new this month
	const newThisMonthArray: Critter[] = critters
		.filter((critter) => {
			const { months } = critter;
			return months.includes(currentMonth) && !months.includes(lastMonth);
		})
		.sort(() => Math.random() - 0.5);

	//Get all Critters Coming Next Month
	const comingNextMonthArray: Critter[] = critters
		.filter((critter) => {
			const { months } = critter;
			return !months.includes(currentMonth) && months.includes(nextMonth);
		})
		.sort(() => Math.random() - 0.5);

	//Get all critters worth more than $10,000 available now
	const mostValuableNow: Critter[] = critters
		.filter((critter: Critter): Critter[] => {
			const { price } = critter;
			return price >= 10000;
		})
		.filter((critter: Critter): Critter[] => {
			const { start, end, months } = critter;
			const isActive = findIfActive(start, end, months);
			return isActive;
		})
		.sort(() => Math.random() - 0.5);

	return {
		status: 200,
		body: {
			leavingArray,
			newThisMonthArray,
			comingNextMonthArray,
			mostValuableNow,
		},
	};
}

function shuffle(arr) {
	return arr.sort(() => Math.random() - 0.5);
}

function getMonthText(month) {
	switch (month) {
		case 0:
			return 'jan';
			break;
		case 1:
			return 'feb';
			break;
		case 2:
			return 'mar';
			break;
		case 3:
			return 'apr';
			break;
		case 4:
			return 'may';
			break;
		case 5:
			return 'jun';
			break;
		case 6:
			return 'jul';
			break;
		case 7:
			return 'aug';
			break;
		case 8:
			return 'sept';
			break;
		case 9:
			return 'oct';
			break;
		case 10:
			return 'nov';
			break;
		case 11:
			return 'dec';
			break;

		default:
			return 'jan';
			break;
	}
}
