import { hyper, wire, bind, Component } from "hyperhtml/esm";
import { Clock } from "./components/Clock";
import { Button } from "./components/Button";
import { Select } from "./components/Select";

class App extends HTMLElement {
    constructor(...args) {
        super(...args);
        this.state = {
            clock: {
                stop: false
            },
            select1: {
                selected: 'o1'
            },
            select2: {
                selected: 'o4'
            }
        };
        this.html = bind(this);
    }
    attributeChangedCallback() {
        this.render();
    }
    connectedCallback() {
        this.render();
    }
    handleEvent(e) {
        console.log(e.target, e.type, this);
        this.state.clock.stop = !this.state.clock.stop;
        this.render();
    }
    render() {
        return this.html`
            <h1>My Hyper HTML Playground</h1>
            <h3>Clock</h3>
            <hyper-clock stop=${this.state.clock.stop} />
            <h3>Button</h3>
            <hyper-button onclick=${this} label=${this.state.clock.stop ? "Resume" : "Stop"}></hyper-button>
            <h3>Select</h3>
            <hyper-select selected=${this.state.select1.selected}>
                <option value="o1">option1</option>
                <option value="o2">option2</option>
            </hyper-select>
            <hyper-select selected=${this.state.select2.selected}>
                <option value="o3">option3</option>
                <option value="o4">option4</option>
            </hyper-select>
            <h3>Grid system</h3>
            <h3>Line chart</h3>
    `;
    }
}

customElements.define("hyper-app", App);

export { App };
