const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
    :host { display: inline-block; font-family: inherit; }
    .scroll-layout {
        margin: 20px 50px;
        display: grid;
        grid-template-areas:
        "scroll scroll scroll"
        "left markers right";
        grid-template-columns: auto 1fr auto;
    }
    .content {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: max-content;
        grid-auto-rows: 250px;
        gap: 15px;
        padding: 0;
        margin: 0;
        align-items: center;
    }
    .carousel {
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scroll-marker-group: after;
        grid-area: scroll;
        overscroll-behavior-x: contain;   

        @media (prefers-reduced-motion: no-preference) {
            scroll-behavior: smooth;
        }
        & ul {
            list-style: none;
        }
        /* snap to center */  
        & li {
            scroll-snap-align: center;
            overflow: visible;
            width: max-content;
            &::scroll-marker {
                content: " ";
                
                border: 1px solid var(--btn-background);
                border-radius: 50%;
                outline-offset: 4px;
                -webkit-tap-highlight-color: transparent;
                
                /* snap if group is overflowing */
                scroll-snap-align: center;
                }
                
                &::scroll-marker:is(:hover, :focus-visible) {
                border-color: var(--link-hover);
                }
                
                &::scroll-marker:target-current {
                background: var(--link-hover);
                border-color: var(--link-hover);
            }
        }
        &::scroll-marker-group {
            grid-area: markers; /* place markers in parent grid area */
            
            /* 15px by 15px horizontal grid - size of dots */
            display: grid;
            place-content: safe center;
            grid: 30px / auto-flow 30px;
            gap: 15px;
            padding: 15px;
            scroll-padding: 15px;
            
            /* handle overflow */
            overflow: auto;
            overscroll-behavior-x: contain;
            scrollbar-width: none;
            scroll-snap-type: x mandatory;
            
            @media (prefers-reduced-motion: no-preference) {
            scroll-behavior: smooth;
            }
        }
        &::scroll-button(*) {
            /* make them round and easy to press */
            inline-size: 48px;
            aspect-ratio: 1;
            border-radius: 1e3px;
            border: 2px solid #999;
            
            /* space from content */
            margin: 5px;
        }
        &::scroll-button(*):focus-visible {
            outline-offset: 5px;
        }
        &::scroll-button(*):not(:disabled):is(:hover, :active) {
            background-color: Canvas;
        }
        &::scroll-button(*):not(:disabled):active {
            scale: 90%;
        }
        &::scroll-button(left) {
            content: "⬅" / "Scroll Left";
            grid-area: left; /* place markers in parent grid area */
        }
        &::scroll-button(right) {
            content: "⮕" / "Scroll Right";
            grid-area: right;
        }
        img {
            height: 250px;
            width: auto;
            display: block;
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