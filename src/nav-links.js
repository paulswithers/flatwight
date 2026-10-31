// Web component <nav-links> - renders a JSON-driven list of same-page anchor links
// Usage:
// <nav-links></nav-links>
// or set links via attribute: <nav-links links='["A","B"]'></nav-links>

const defaultLinks = [
	"About",
	"Members",
	"Upcoming Events",
	"Gallery",
	// "Testimonials",
	"Contact"
];

function slugify(label) {
	return label
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-");
}

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
	:host {
		display: block;
		box-sizing: border-box;
		font-family: inherit;
		max-width: 100%;
	}

	.nav-toggle {
		display: none;
		background: transparent;
		border: 1px solid currentColor;
		border-radius: 999px;
		padding: 0.25rem 0.6rem;
		font: inherit;
		color: inherit;
		cursor: pointer;
	}

	.nav-links {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		justify-content: flex-end;
		flex-wrap: nowrap;
		overflow: hidden;
	}

	a {
		color: inherit;
		text-decoration: none;
		white-space: nowrap;
	}

	.pipe {
		color: currentColor;
		margin: 0 0.5rem;
		user-select: none;
	}

	@media (max-width: 760px) {
		:host {
			max-width: 100%;
		}

		.nav-toggle {
			display: inline-flex;
			align-items: center;
			justify-content: center;
		}

		.nav-links {
			display: none;
			position: absolute;
			top: calc(100% + 0.5rem);
			right: 0;
			flex-direction: column;
			align-items: flex-start;
			padding: 0.75rem 1rem;
			border-radius: 12px;
			background: rgba(255, 255, 255, 0.3);
			backdrop-filter: blur(6px);
			box-shadow: 0 8px 22px rgba(0,0,0,0.12);
			z-index: 10;
		}

		:host {
			position: relative;
		}

		.nav-links.open {
			display: flex;
		}

		.pipe {
			display: none;
		}
	}
`);

class NavLinks extends HTMLElement {
	constructor() {
		super();
		this.root = this.attachShadow({ mode: "open" });
        this.root.adoptedStyleSheets = [stylesheet];
		this._links = defaultLinks.slice();
	}

	static get observedAttributes() {
		return ["links"];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "links") {
			try {
				const parsed = JSON.parse(newValue);
				if (Array.isArray(parsed)) {
					this.links = parsed;
				}
			} catch (e) {
				// ignore invalid JSON
				// keep previous links
			}
		}
	}

	get links() {
		return this._links;
	}

	set links(value) {
		if (Array.isArray(value)) {
			this._links = value.slice();
			this.render();
		}
	}

	connectedCallback() {
		// If element contains a <script type="application/json"> child, use it
		const jsonScript = this.querySelector('script[type="application/json"]');
		if (jsonScript) {
			try {
				const parsed = JSON.parse(jsonScript.textContent);
				if (Array.isArray(parsed)) this._links = parsed.slice();
			} catch (e) {
				// ignore
			}
		}

		// If attribute present, attributeChangedCallback handles it
		this.render();

		// Ensure the host never exceeds the viewport width (defensive clamp).
		// Some outer layout rules can make the host wider than the browser viewport
		// (observed as a fixed large width). Clamp to viewport and update on resize.
		this._updateClamp = () => {
			try {
				// Use the layout viewport width
				const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
				this.style.maxWidth = vw + "px";
			} catch (e) {
				// ignore
			}
		};

		this._updateClamp();
		window.addEventListener('resize', this._updateClamp);
	}

	disconnectedCallback() {
		if (this._updateClamp) window.removeEventListener('resize', this._updateClamp);
	}

	render() {

		const links = this._links || [];

		const html = `
			<button class="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="primary-navigation">☰</button>
			<nav id="primary-navigation" class="nav-links" aria-label="Primary navigation">
				${links
					.map((label, idx) => {
						const id = slugify(label);
						const isLast = idx === links.length - 1;
						return `
							<a href="#${id}" data-link-index="${idx}">${label}</a>
							${isLast ? "" : '<span class="pipe" aria-hidden="true">|</span>'}
						`;
					})
					.join("")}
			</nav>
		`;

		this.shadowRoot.innerHTML = html;

		this._toggle = this.shadowRoot.querySelector('.nav-toggle');
		this._nav = this.shadowRoot.querySelector('.nav-links');

		if (this._toggle && this._nav) {
			this._toggle.addEventListener('click', () => {
				const isOpen = this._nav.classList.toggle('open');
				this._toggle.setAttribute('aria-expanded', String(isOpen));
			});

			this.shadowRoot.querySelectorAll('a').forEach((link) => {
				link.addEventListener('click', () => {
					this._nav.classList.remove('open');
					this._toggle.setAttribute('aria-expanded', 'false');
				});
			});
		}
	}
}

customElements.define("nav-links", NavLinks);

export default NavLinks;
