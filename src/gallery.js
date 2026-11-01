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
        flex: 0 0 min(80vw, 420px);
        width: min(80vw, 420px);
        max-width: min(80vw, 420px);
        overflow: hidden;
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
        this.root.adoptedStyleSheets = [stylesheet, carouselControlsStylesheet];
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
        addCarouselControls(this.root.querySelector('.carousel'));
    }
}

customElements.define("gallery-page", GalleryPage);