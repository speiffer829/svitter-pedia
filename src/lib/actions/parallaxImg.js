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
				window.addEventListener('scroll', handleScroll)
			}else{
				window.removeEventListener('scroll', handleScroll);
			}
		})
	}).observe(node)

	function handleScroll(e) {
		const nodeRect = node.getBoundingClientRect()
		const scaleMath = 1 - (window.scrollY / window.innerHeight);
		const newY = window.scrollY / 1.7
		const newScale = scaleMath > 0.1 ? scaleMath : 0.1

		transTween.update($store => {
			return {
				newY,
				newScale
			}
		})

		
	}

	transTween.subscribe($store => {
		node.style.setProperty('--scale', `${$store.newScale}`);
		node.style.setProperty('--translateY', `${$store.newY}px`);
	})
}