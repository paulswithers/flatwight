const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
    :host { display: block; width: 100%; font-family: inherit; }
    .scroll-layout {
        margin: 20px 50px;
        display: grid;
        grid-template-areas:
        "scroll scroll scroll"
        "left markers right";
        grid-template-columns: auto 1fr auto;
        align-items: center;
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
        scroll-marker-group: after;
        grid-area: scroll;
        overscroll-behavior-x: contain;
        scrollbar-width: none;
        -ms-overflow-style: none;
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
    .carousel li::scroll-marker {
        content: " ";
        border: 1px solid var(--btn-background);
        border-radius: 50%;
        outline-offset: 4px;
        -webkit-tap-highlight-color: transparent;
        scroll-snap-align: center;
    }
    .carousel li::scroll-marker:is(:hover, :focus-visible) {
        border-color: var(--link-hover);
    }
    .carousel li::scroll-marker:target-current {
        background: var(--link-hover);
        border-color: var(--link-hover);
    }
    .carousel::scroll-marker-group {
        grid-area: markers;
        display: grid;
        place-content: center;
        grid: 30px / auto-flow 30px;
        gap: 15px;
        padding: 15px;
        scroll-padding: 15px;
        overflow: auto;
        overscroll-behavior-x: contain;
        scrollbar-width: none;
        scroll-snap-type: x mandatory;
    }
    .carousel::scroll-button(*) {
        inline-size: 48px;
        aspect-ratio: 1;
        border-radius: 1e3px;
        border: 2px solid #999;
        margin: 5px;
    }
    .carousel::scroll-button(*):focus-visible {
        outline-offset: 5px;
    }
    .carousel::scroll-button(*):not(:disabled):is(:hover, :active) {
        background-color: Canvas;
    }
    .carousel::scroll-button(*):not(:disabled):active {
        scale: 90%;
    }
    .carousel::scroll-button(left) {
        content: "⬅" / "Scroll Left";
        grid-area: left;
    }
    .carousel::scroll-button(right) {
        content: "⮕" / "Scroll Right";
        grid-area: right;
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
        this.root.adoptedStyleSheets = [stylesheet];
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
                                <b>${member.name}</b><br/>
                                <span>${member.role}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
}

customElements.define("members-page", MembersPage);