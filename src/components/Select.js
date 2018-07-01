import { wire, bind } from "hyperhtml/esm";

class Select extends HTMLElement {
    static get observedAttributes() {
        return ["selected"];
    }
    constructor(...args) {
        super(...args);
        this.html = bind(this);
        this.options = [...this.children].map(o => { return { value: o.value, label: o.label }});
    }
    attributeChangedCallback(attr, lastValue, currentValue) {
        if (attr === 'selected' && (lastValue !== currentValue)) {
            this.render();
        }
    }
    connectedCallback() {
        this.render();
    }
    handleEvent(e) {
        this.setAttribute('selected', e.target.options[e.target.selectedIndex].value);
        this.render();
    }
    render() {
        return this.html`
            <select onchange=${this}>
                ${this.options.map(option => {
                    const w = wire(option);
                    return ((this.getAttribute("selected") === option.value)
                        ? w`<option selected="true" value=${option.value}>${option.label}</option>`
                        : w`<option value=${option.value}>${option.label}</option>`);
                })}
            </select>
        `;
    }
}

customElements.define("hyper-select", Select);

export { Select };
