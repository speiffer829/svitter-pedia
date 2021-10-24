<script>
	export let critter
	export let alignTopLeft = false

		const findIfActive = () => {
		const { start, end } = critter
		const date = new Date(Date.now())
		const currentHour = date.getHours()
		let isHoursActive = false

		if(Array.isArray(start)){

			start.forEach((startTime, i) => {
				if(startTime < end[i]){
					if(startTime <= currentHour && currentHour <= end[i]) isHoursActive = true
				}else{
					if(startTime <= currentHour || currentHour <= end[i]) isHoursActive = true
				}
			})

		}else{
			if(start < end){
				isHoursActive = start <= currentHour && currentHour <= end
			}else{
				isHoursActive =	start <= currentHour || currentHour <= end
			}
		}

		const currentMonth = date.toLocaleString('en-US', {month: 'short'}).toLocaleLowerCase();

		return critter.months.includes(currentMonth) && isHoursActive
	}

	let isActive = findIfActive()
</script>

{#if isActive}
	<span class="active-dot" class:alignTopLeft aria-label="Currently Active" title="Currently Active"></span>
{/if}

<style>
		.active-dot{
		width: 12px;
		height: 12px;
		background: var(--green);
		border: 2px solid #fff;
		border-radius: 100px;
		position: absolute;
		right: 8px;
		top: 0;
	}

	.active-dot.alignTopLeft{
		right: auto;
		top: 10px;
		left: 15px;
	}
</style>