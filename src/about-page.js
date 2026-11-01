
const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
    :host {
        display: flex; 
        font-family: inherit;
        flex-direction: column;
        align-items: center;
    }
    .aboutImg {
        background-image: url('/assets/FlatWight.jpg');
        background-size: cover;
        border-radius: 25%;
        position: relative;
        height: 10em;
        width: 10em;
        overflow: visible;
        align-self: center;

        &::after {
            content: "";
            width:100%;
            height:100%;
            top: 0;
            right: 0;
            position: absolute;
            background: inherit;
            filter: blur(20px);
            z-index: -1;
            transform: scale(1.2);
        }
    }

    p {
        max-width: 40em;
        text-align: center;
    }

`);

import './inline-popover.js';

class AboutPage extends HTMLElement {
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
            <div class="aboutImg" alt="Flat Wight"></div>
            <h2>About Us</h2>
            <p>We are Flat Wight, an 
                <inline-popover label="acapella">A close-harmony singing group that<br/>performs without instrumental accompaniment.</inline-popover>
             show group performing across the Isle of Wight. We sing at open mics, care homes, weddings, and other events.
              We all have many years experience in choirs on the island and mainland, socially and competitively.</p>
            <p>Our repertoire covers a variety of popular music including well-known acapella songs like "Only You" and "Caravan of Love" 
            classic songs like "The Longest Time" and "Under the Boardwalk" and contemporary songs like "One Day Like This".
            </p>
        `;
    }

}

customElements.define("about-page", AboutPage);

export default AboutPage;