import { hyper, wire, bind, Component } from "hyperhtml/esm";

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
        console.log(attr, lastValue, currentValue);
        this.selected = currentValue;
        this.render();
    }
    connectedCallback() {
        this.render();
    }
    handleEvent(e) {
        console.log(this.selectedOptions);
    }
    render() {
        return this.html`
            <select onchange=${this}>
                ${[...this.options].map(option => `<option ${option.value === this.selected ? `selected` : ``} value=${option.value}>${option.label}</option>`)}
            </select>	
		`;
    }
}

customElements.define("hyper-select", Select);

export { Select };
