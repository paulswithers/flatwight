
const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
    :host {
        display: flex; 
        font-family: inherit;
        flex-direction: column;
        align-items: center;
    }
`);

class TestimonialsPage extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        this.root.adoptedStyleSheets = [stylesheet];
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.root.innerHTML = `
            <div class="aboutImg" alt="Testimonials"></div>
            <h2>Testimonials</h2>
            <p></p>
        `;
    }

}

customElements.define("testimonials-page", TestimonialsPage);

export default TestimonialsPage;