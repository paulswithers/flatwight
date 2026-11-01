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
        align-items: center;
        justify-content: flex-start;
        gap: 15px;
        padding: 0;
        margin: 0;
        list-style: none;
        min-width: max-content;
    }
    .event-details {
        box-sizing: border-box;
        width: min(320px, calc(100vw - 6rem));
        min-height: 250px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 12px;
        background: var(--popup-background-light);
        border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
        text-align: left;

        h3, p { margin: 0; }
        time { font-weight: 600; }
    }
    .carousel {
        overflow-x: auto;
        scroll-snap-type: x proximity;
        scroll-marker-group: after;
        grid-area: scroll;
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
        overflow: visible;
        flex: 0 0 min(320px, calc(100vw - 6rem));
        width: min(320px, calc(100vw - 6rem));
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
        height: 250px;
        width: auto;
        display: block;
    }

    @media (max-width: 760px) {
        .scroll-layout {
            margin: 12px 0;
        }
        .content {
            gap: 12px;
        }
        .carousel {
            scrollbar-width: none;
        }
    }
`);

const getEventsUrl = () => {
    const url = new URL('data/events.json', window.location.href);
    url.searchParams.set('v', new Date().toISOString().slice(0, 10));
    return url.toString();
};

class EventsPage extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        this.root.adoptedStyleSheets = [stylesheet];
    }

    connectedCallback() {
        this.render();
        this.loadEvents();
    }

    async loadEvents() {
        try {
            const response = await fetch(getEventsUrl(), { cache: 'no-store' });
            if (!response.ok) throw new Error('Failed to load events');
            const events = await response.json();
            this.render(events);
        } catch (error) {
            this.render([]);
        }
    }

    render(events = []) {
        this.root.innerHTML = `
            <h2>Events</h2>
            <div class="scroll-layout">
                <div class="carousel">
                    <ul class="content">
                        ${events.map(event => `
                            <li>
                                <article class="event-details">
                                    ${event.title ? `<h3>${event.title}</h3>` : ""}
                                    ${event.date ? `<time datetime="${event.date}">${event.dateLabel || event.date}</time>` : ""}
                                    ${event.location ? `<p>${event.location}</p>` : ""}
                                </article>
                            </li>
                        `).join('') || `
                            <li>
                                <article class="event-details">
                                    <h3>No upcoming events</h3>
                                </article>
                            </li>
                        `}
                    </ul>
                </div>
            </div>
        `;
    }
}

customElements.define("events-page", EventsPage);