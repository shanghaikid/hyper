import { hyper, wire, bind, Component } from "hyperhtml/esm";
import "./Button.scss";

class Button extends HTMLElement {
    static get observedAttributes() {
        return ["label"];
    }
    constructor(...args) {
        super(...args);
        this.html = bind(this);
    }
    attributeChangedCallback() {
        this.render();
    }
    connectedCallback() {
        this.render();
    }
    render() {
        return this.html`
            <button>${this.getAttribute("label")}</button>
        `;
    }
}

customElements.define("hyper-button", Button);

export { Button };
