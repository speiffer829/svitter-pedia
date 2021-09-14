<section class="intro">

</section>

<section class="bug-section"></section>


<style lang="scss">
	.intro{
		min-height: 70vh;
		width: 100%;
		/* background: linear-gradient(to bottom, var(--blue), var(--tan)); */
		background: linear-gradient(to bottom, var(--blue), hsl(var(--blueHS) calc(var(--blueL) + 30%)));
	}

	.bug-section{
		min-height: 70vh;
		width: 100%;
		background-color: var(--green);
		background-image: url('/green-triangles.png');
		background-size: 156px 154.5px;
		position: relative;
		overflow: hidden;

		&:after{
			content:'';
			position: absolute;
			top: 0;
			left: -150%;
			width: 400%;
			height: 3000px;
			border-top-left-radius: 50%;
			border-top-right-radius: 50%;
			background-color: var(--green);
			background-image: url('/green-triangles.png');
			background-size: 156px 154.5px;
			background-position: 50% 28%;
			z-index: -1;
		}
	}
</style>