export const carouselControlsStylesheet = new CSSStyleSheet();
carouselControlsStylesheet.replaceSync(`
    .carousel-controls {
        display: grid;
        grid-template-columns: 48px minmax(0, 1fr) 48px;
        align-items: center;
        gap: 8px;
    }
    .carousel-arrow {
        display: grid;
        place-items: center;
        box-sizing: border-box;
        inline-size: 48px;
        block-size: 48px;
        border: 2px solid #999;
        border-radius: 50%;
        color: inherit;
        font: inherit;
        font-size: 1.5rem;
        font-weight: 900;
        line-height: 1;
    }
    .carousel-arrow > span {
        transform: translateY(-2px);
    }
    .carousel-arrow:focus-visible {
        outline-offset: 5px;
    }
    .carousel-arrow:not(:disabled):is(:hover, :active) {
        background-color: Canvas;
    }
    .carousel-arrow:not(:disabled):active {
        scale: 90%;
    }
    .carousel-arrow:disabled {
        cursor: not-allowed;
        opacity: 0.45;
    }
    .carousel-markers {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12px;
        min-width: 0;
        padding: 8px;
        overflow-x: auto;
        scrollbar-width: none;
    }
    .carousel-markers::-webkit-scrollbar {
        display: none;
    }
    .carousel-marker {
        box-sizing: border-box;
        flex: 0 0 14px;
        inline-size: 14px;
        block-size: 14px;
        padding: 0;
        border: 1px solid var(--btn-background);
        border-radius: 50%;
        background: transparent;
        -webkit-tap-highlight-color: transparent;
    }
    .carousel-marker:is(:hover, :focus-visible) {
        border-color: var(--link-hover);
    }
    .carousel-marker[aria-current="true"] {
        background: var(--link-hover);
        border-color: var(--link-hover);
    }
`);

export function addCarouselControls(carousel) {
    const slides = Array.from(carousel.querySelectorAll('.content > li'));
    const controls = document.createElement('div');
    controls.className = 'carousel-controls';
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', 'Carousel controls');

    const previous = document.createElement('button');
    previous.type = 'button';
    previous.className = 'carousel-arrow carousel-previous';
    previous.setAttribute('aria-label', 'Previous item');
    const previousIcon = document.createElement('span');
    previousIcon.textContent = '←';
    previous.append(previousIcon);

    const markers = document.createElement('div');
    markers.className = 'carousel-markers';
    markers.setAttribute('role', 'group');
    markers.setAttribute('aria-label', 'Choose item');

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'carousel-arrow carousel-next';
    next.setAttribute('aria-label', 'Next item');
    const nextIcon = document.createElement('span');
    nextIcon.textContent = '→';
    next.append(nextIcon);

    const markerButtons = slides.map((slide, index) => {
        const label = slide.querySelector('b, h3')?.textContent.trim()
            || slide.querySelector('img')?.alt
            || `item ${index + 1}`;
        const marker = document.createElement('button');
        marker.type = 'button';
        marker.className = 'carousel-marker';
        marker.setAttribute('aria-label', `Show ${label}`);
        marker.addEventListener('click', () => scrollToSlide(index));
        markers.append(marker);
        return marker;
    });

    function scrollToSlide(index) {
        const slide = slides[index];
        if (!slide) return;

        const carouselRect = carousel.getBoundingClientRect();
        const slideRect = slide.getBoundingClientRect();
        const left = carousel.scrollLeft + slideRect.left - carouselRect.left
            - (carousel.clientWidth - slideRect.width) / 2;
        carousel.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    }

    previous.addEventListener('click', () => {
        carousel.scrollBy({ left: -carousel.clientWidth * 0.8, behavior: 'smooth' });
    });
    next.addEventListener('click', () => {
        carousel.scrollBy({ left: carousel.clientWidth * 0.8, behavior: 'smooth' });
    });

    controls.append(previous, markers, next);
    carousel.parentElement.append(controls);

    const updateControls = () => {
        const center = carousel.getBoundingClientRect().left + carousel.clientWidth / 2;
        const current = slides.reduce((nearest, slide, index) => {
            const rect = slide.getBoundingClientRect();
            const distance = Math.abs(rect.left + rect.width / 2 - center);
            return distance < nearest.distance ? { index, distance } : nearest;
        }, { index: 0, distance: Infinity }).index;

        previous.disabled = carousel.scrollLeft <= 1;
        next.disabled = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1;
        markerButtons.forEach((marker, index) => {
            if (index === current) marker.setAttribute('aria-current', 'true');
            else marker.removeAttribute('aria-current');
        });
    };

    carousel.addEventListener('scroll', updateControls, { passive: true });
    updateControls();
}
