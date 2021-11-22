export function findIfActive( start, end, months  ) {
	const date = new Date(Date.now());
	const currentHour = date.getHours();
	let isHoursActive = false;

	if (Array.isArray(start)) {
		start.forEach((startTime, i) => {
			if (startTime < end[i]) {
				if (startTime <= currentHour && currentHour <= end[i]) isHoursActive = true;
			} else {
				if (startTime <= currentHour || currentHour <= end[i]) isHoursActive = true;
			}
		});
	} else {
		if (start < end) {
			isHoursActive = start <= currentHour && currentHour <= end;
		} else {
			isHoursActive = start <= currentHour || currentHour <= end;
		}
	}

	const currentMonth = date.toLocaleString('en-US', { month: 'short' }).toLocaleLowerCase();

	return months.includes(currentMonth) && isHoursActive;
};