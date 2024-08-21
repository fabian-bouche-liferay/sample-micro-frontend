const labels = fragmentElement.querySelector('sample-microfrontend').querySelector('labels');
labels.getAttributeNames().forEach(attributeName => {
	labels.setAttribute(attributeName, fragmentElement.querySelector(".label-" + attributeName).innerHTML);
});