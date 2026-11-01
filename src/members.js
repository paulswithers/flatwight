import { addCarouselControls, carouselControlsStylesheet } from './carousel-controls.js';

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
    :host { display: block; width: 100%; font-family: inherit; }
    .scroll-layout {
        margin: 20px 50px;
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 8px;
    }
    .content {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        gap: 15px;
        padding: 0;
        margin: 0;
        list-style: none;
        min-width: max-content;
    }
    .carousel {
        overflow-x: auto;
        scroll-snap-type: x proximity;
        overscroll-behavior-x: contain;
        scrollbar-width: none;
        -ms-overflow-style: none;
        width: 100%;
    }
    .carousel::-webkit-scrollbar {
        display: none;
    }
    .carousel li {
        scroll-snap-align: center;
        flex: 0 0 clamp(9rem, 27vw, 12rem);
        max-width: clamp(9rem, 27vw, 12rem);
        display: grid;
        justify-items: center;
        gap: 0.5rem;
        text-align: center;
        position: relative;
    }
    .carousel img {
        display: block;
        width: 100%;
        max-width: 10em;
        height: auto;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 50%;
    }

    @media (max-width: 760px) {
        .scroll-layout {
            margin: 12px 0;
        }
        .content {
            gap: 12px;
        }
        .carousel li {
            flex-basis: clamp(8.25rem, 34vw, 11rem);
            max-width: clamp(8.25rem, 34vw, 11rem);
        }
    }
`);

const members = [
    { name: "Adrian Dingley", role: "Tenor, Lead, Bass", img: "/assets/members/Default.jpg" },
    { name: "Grenville Shipley", role: "Tenor, Baritone", img: "/assets/members/Default.jpg" },
    { name: "Mark Davis", role: "Bass, Lead", img: "/assets/members/Default.jpg" },
    { name: "Paul Gardner", role: "Tenor, Lead, Bass", img: "/assets/members/Paul.jpg" },
    { name: "Paul Withers", role: "Bass, Lead, Baritone", img: "/assets/members/PaulWithers.jpg" },
    { name: "Ralph Brindley", role: "Baritone, Tenor, Lead", img: "/assets/members/Ralph.jpg" },
    { name: "Simon Bligh", role: "Lead", img: "/assets/members/Default.jpg" },
]

class MembersPage extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        this.root.adoptedStyleSheets = [stylesheet, carouselControlsStylesheet];
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.root.innerHTML = `
            <h2>Members</h2>
            <div class="scroll-layout">
                <div class="carousel">
                    <ul class="content">
                        ${members.map(member => `
                            <li>
                                <img src="${member.img}" alt="Photo of ${member.name}" />
                                <b>${member.name}</b>
                                <span>${member.role}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
        addCarouselControls(this.root.querySelector('.carousel'));
    }
}

customElements.define("members-page", MembersPage);