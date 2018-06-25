import { hyper, wire, bind, Component } from "hyperhtml/esm";

class Clock extends HTMLElement {
    static get observedAttributes() {
        return ["stop"];
    }
    constructor(...args) {
        super(...args);
        this.html = bind(this);
        this.stop = false;
    }
    attributeChangedCallback(attribute, lastValue, currentValue) {
        this.render();
        if (attribute === "stop") {
            console.log(attribute, currentValue);
            this.stop = currentValue;
        }
    }
    connectedCallback() {
        this.timer = setInterval(() => this.tick(), 1000);
        this.render();
    }
    disconnectedCallback() {
        clearInterval(this.timer);
    }
    tick() {
        !this.stop && this.render();
    }
    render() {
        return this.html`
			It is ${new Date().toLocaleTimeString()}. 
		`;
    }
}

customElements.define("hyper-clock", Clock);

export { Clock };
