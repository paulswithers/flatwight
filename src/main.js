import './nav-links.js';
import './about-page.js';
import './members.js';
import './events.js';
import './gallery.js';
import './testimonials.js';

const bootstrap = () => {
	console.log("Application is starting...");
	// Your application initialization code goes here
}


if (document.readyState != "loading") {
	bootstrap();
} else {
	document.addEventListener("DOMContentLoaded", bootstrap);
}