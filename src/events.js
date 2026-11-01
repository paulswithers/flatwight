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
        this.root.adoptedStyleSheets = [stylesheet, carouselControlsStylesheet];
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
        addCarouselControls(this.root.querySelector('.carousel'));
    }
}

customElements.define("events-page", EventsPage);