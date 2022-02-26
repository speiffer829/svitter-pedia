import { spring } from 'svelte/motion';

export function parallaxImg(node: Htmlelement): void {
	const transTween = spring(
		{
			newY: 0,
			newScale: 1,
		},
		{
			stiffness: 0.1,
			damping: 0.25,
		},
	);

	window.addEventListener('scroll', handleScroll, true);
	window.addEventListener('touchmove', handleScroll, true);

	function handleScroll() {
		const scaleMath = 1 - window.scrollY / window.innerHeight;
		const newY = window.scrollY / 1.7;
		const newScale = scaleMath > 0.1 ? scaleMath : 0.1;

		transTween.subscribe(($store) => {
			node.style.setProperty('--scale', `${newScale}`);
			node.style.setProperty('--translateY', `${newY}px`);
		});
	}
}
