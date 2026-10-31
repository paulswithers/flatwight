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
    }
    .content {
        display: flex;
        align-items: center;
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
        flex: 0 0 min(80vw, 420px);
        width: min(80vw, 420px);
        max-width: min(80vw, 420px);
        overflow: hidden;
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
        height: auto;
        aspect-ratio: 4 / 3;
        object-fit: cover;
    }

    @media (max-width: 760px) {
        .scroll-layout {
            margin: 12px 0;
        }
        .content {
            gap: 12px;
        }
        .carousel li {
            flex-basis: min(80vw, 340px);
            width: min(80vw, 340px);
            max-width: min(80vw, 340px);
        }
    }
`);

const photos = [
    { alt: "Flat Wight March 2024", img: "assets/gallery/PHOTO-2024-03-13-10-40-46.jpg" },
    { alt: "Flat Wight St Blasius October 2024", img: "assets/gallery/PHOTO-2024-10-12-09-26-54.jpg" },
    { alt: "Flat Wight Cruise 2025", img: "assets/gallery/PHOTO-2025-11-30-09-52-37.jpg" }
]

class GalleryPage extends HTMLElement {
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
            <h2>Gallery</h2>
            <div class="scroll-layout">
                <div class="carousel">
                    <ul class="content">
                        ${photos.map(photo => `
                            <li>
                                <img src="${photo.img}" alt="${photo.alt}" />
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
}

customElements.define("gallery-page", GalleryPage);