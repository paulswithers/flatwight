const sheet = new CSSStyleSheet();
sheet.replaceSync(`
:host { display: inline-block; font-family: inherit; }
.toggle {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: help;
  text-decoration: underline dotted;
  text-underline-offset: 3px;
}
[popover] {
  background: var(--popup-background-light, #FFF);
  color: var(--popup-color);
  padding: 0.45rem 0.6rem;
  border-radius: 10px;
  font-size: 0.9rem;
  white-space: nowrap;
  box-shadow: 0 6px 18px rgba(0,0,0,0.35);
  z-index: 20;
  overflow: hidden;
  opacity: 0; 
  transition: opacity 200ms ease-in-out;

  &:popover-open { opacity: 1; }

  &::after {
    content: "";
    position: absolute;
    inset-inline-start: 50%;
    transform: translateX(-50%);
    top: 100%;
    border: 6px solid transparent;
    border-top-color: var(--popup-background-light, #FFF);
    }
}

.fallback {
  display: none;
  opacity: 0;
  transition: opacity 200ms ease-in-out;
  position: absolute;
  bottom: calc(100% + 0.6rem);
  left: 50%;
  transform: translateX(-50%);
  /* match the popover surface test color */
  background: #ff69b4; /* hotpink */
  color: #fff;
  padding: 0.45rem 0.6rem;
  border-radius: 6px;
  font-size: 0.9rem;
  white-space: nowrap;
  box-shadow: 0 6px 18px rgba(0,0,0,0.35);
  z-index: 20;
}
.toggle.open + .fallback { display: block; opacity: 1; }
`);

class InlinePopover extends HTMLElement {
  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
    this._root.adoptedStyleSheets = [sheet];
  }

  connectedCallback() {
    this._render();
    this._setup();
  }

  disconnectedCallback() {
    this._teardown();
  }

  static get observedAttributes() { return ['label']; }

  attributeChangedCallback() {
    // If label attribute changes and no slotted label is provided, update fallback label
    if (!this._root) return;
    const slotted = this.querySelector('[slot="label"]');
    if (!slotted && this._toggle) {
      const label = this.getAttribute('label') || this.textContent.trim() || '';
      this._toggle.innerHTML = label;
    }
  }

  _render() {
    const label = this.getAttribute('label') || this.textContent.trim() || '';
    // panel content fallback is innerHTML of the element
    const panelContent = this.getAttribute('panel') || this.dataset.panel || this.innerHTML.trim() || '';

    // Use named slots: slot="label" for toggle content, slot="panel" for panel content
    this._root.innerHTML = `
      <button class="toggle" type="button" aria-haspopup="dialog" aria-expanded="false"><slot name="label">${label}</slot></button>
      <div id="surface" popover role="tooltip"><slot name="panel">${panelContent}</slot></div>
      <div class="fallback" id="fallback"><slot name="panel">${panelContent}</slot></div>
    `;

    this._toggle = this._root.querySelector('.toggle');
    this._surface = this._root.getElementById('surface');
    this._fallback = this._root.getElementById('fallback');
  }

  _setup() {
    if (!this._toggle || !this._surface) return;

    // handler to detect outside clicks (works with Shadow DOM via composedPath)
    this._docHandler = (e) => {
      const path = (e.composedPath && e.composedPath()) || (e.path || []);
      // If the event occurred inside this host or its UI, ignore
      if (path.includes(this) || path.includes(this._toggle) || path.includes(this._surface) || path.includes(this._fallback)) return;

      // Otherwise close the popover (native or fallback)
      try {
        if (this._surface && typeof this._surface.matches === 'function' && this._surface.matches(':popover-open')) {
          if (typeof this._surface.hidePopover === 'function') this._surface.hidePopover();
          this._toggle.setAttribute('aria-expanded', 'false');
          return;
        }
      } catch (err) { /* ignore */ }

      if (this._toggle && this._toggle.classList.contains('open')) {
        this._toggle.classList.remove('open');
        this._toggle.setAttribute('aria-expanded', 'false');
      }
    };

    const supports = typeof this._surface.showPopover === 'function';

    if (supports) {
      const onClick = (e) => {
        if (this._surface.matches(':popover-open')) {
          try { this._surface.hidePopover(); } catch (err) { /* ignore */ }
          this._toggle.setAttribute('aria-expanded', 'false');
        } else {
          try { this._surface.showPopover(this._toggle); } catch (err) { /* ignore */ }
          this._toggle.setAttribute('aria-expanded', 'true');
        }
      };

      const onKey = (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }
        else if (e.key === 'Escape') { try { this._surface.hidePopover(); } catch (err) {} this._toggle.setAttribute('aria-expanded', 'false'); this._toggle.blur(); }
      };

      const onBlur = () => { try { this._surface.hidePopover(); } catch (err) {} this._toggle.setAttribute('aria-expanded', 'false'); };

      this._toggle.addEventListener('click', onClick);
      this._toggle.addEventListener('keydown', onKey);
      this._toggle.addEventListener('blur', onBlur);

      this._handlers = { supports: true, onClick, onKey, onBlur };
    } else {
      const onMouseEnter = () => { this._toggle.classList.add('open'); this._toggle.setAttribute('aria-expanded', 'true'); };
      const onMouseLeave = () => { this._toggle.classList.remove('open'); this._toggle.setAttribute('aria-expanded', 'false'); };
      const onFocus = () => { this._toggle.classList.add('open'); this._toggle.setAttribute('aria-expanded', 'true'); };
      const onBlur = () => { this._toggle.classList.remove('open'); this._toggle.setAttribute('aria-expanded', 'false'); };
      const onKey = (e) => {
        if (e.key === 'Escape') { this._toggle.classList.remove('open'); this._toggle.setAttribute('aria-expanded', 'false'); this._toggle.blur(); }
        else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const isOpen = this._toggle.classList.toggle('open'); this._toggle.setAttribute('aria-expanded', String(!!isOpen)); }
      };
      const onClick = () => { const isOpen = this._toggle.classList.toggle('open'); this._toggle.setAttribute('aria-expanded', String(!!isOpen)); };

      this._toggle.addEventListener('mouseenter', onMouseEnter);
      this._toggle.addEventListener('mouseleave', onMouseLeave);
      this._toggle.addEventListener('focus', onFocus);
      this._toggle.addEventListener('blur', onBlur);
      this._toggle.addEventListener('keydown', onKey);
      this._toggle.addEventListener('click', onClick);

      this._handlers = { supports: false, onMouseEnter, onMouseLeave, onFocus, onBlur, onKey, onClick };
    }

    // Register a document-level pointerdown to detect outside clicks/taps.
    // Use pointerdown so it fires early; we ignore events that hit the component itself above.
    if (typeof document !== 'undefined' && this._docHandler) {
      document.addEventListener('pointerdown', this._docHandler);
    }
  }

  _teardown() {
    if (!this._handlers || !this._toggle) return;
    const h = this._handlers;
    if (h.supports) {
      this._toggle.removeEventListener('click', h.onClick);
      this._toggle.removeEventListener('keydown', h.onKey);
      this._toggle.removeEventListener('blur', h.onBlur);
      try { if (this._surface && typeof this._surface.hidePopover === 'function') this._surface.hidePopover(); } catch (err) {}
    } else {
      this._toggle.removeEventListener('mouseenter', h.onMouseEnter);
      this._toggle.removeEventListener('mouseleave', h.onMouseLeave);
      this._toggle.removeEventListener('focus', h.onFocus);
      this._toggle.removeEventListener('blur', h.onBlur);
      this._toggle.removeEventListener('keydown', h.onKey);
      this._toggle.removeEventListener('click', h.onClick);
    }
    // remove document-level handler
    if (typeof document !== 'undefined' && this._docHandler) {
      document.removeEventListener('pointerdown', this._docHandler);
      this._docHandler = null;
    }

    this._handlers = null;
  }
}

customElements.define('inline-popover', InlinePopover);
export default InlinePopover;
