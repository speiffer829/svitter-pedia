export function parallaxImg(node) {
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
		const scaleMath = 1 - (window.scrollY / (nodeRect.top + nodeRect.height));
		node.style.setProperty('--translateY', `${window.scrollY}px`)
		node.style.setProperty('--scale', `${scaleMath > 0.7 ? scaleMath : 0.7}`);
		// node.style.transform = `translate3d(0, ${window.scrollY / 1.7}px, 0) scale(${scaleMath > 0.7 ? scaleMath : 0.7})`;
	}
}