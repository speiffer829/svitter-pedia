import {spring} from 'svelte/motion'
import { cubicOut } from 'svelte/easing';

export function parallaxImg(node) {

	const transTween = spring(
		{ 
			newY: 0,
			newScale: 1
		},
		{
			stiffness: 0.1,
			damping: 0.25
		}
	);
	
	new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				window.addEventListener('scroll', handleScroll, false)
				document.addEventListener(
					'touchmove',
					function (e) {
						e.preventDefault();
					},
					true
				);
			}else{
				window.removeEventListener('scroll', handleScroll, false);
			}
		})
	}).observe(node)

	function handleScroll(e) {
		const nodeRect = node.getBoundingClientRect()
		const scaleMath = 1 - (window.scrollY / window.innerHeight);
		const newY = window.scrollY / 1.7
		const newScale = scaleMath > 0.1 ? scaleMath : 0.1

		// transTween.update($store => {
		// 	return {
		// 		newY,
		// 		newScale
		// 	}
		// })

		transTween.subscribe($store => {
			node.style.setProperty('--scale', `${newScale}`);
			node.style.setProperty('--translateY', `${newY}px`);
		})
		
	}

}