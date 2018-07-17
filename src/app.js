import {hyper, wire, bind, Component} from 'hyperhtml/esm';
import { Redux } from './components/Redux';

class App extends HTMLElement {
	constructor(...args) {
		super(...args);
		this.state = {
			clock: {
				stop: false
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
			<hyper-redux label="redux"></hyper-redux>
			<hyper-redux label="redux"></hyper-redux>
		`;
	}
}

customElements.define("hyper-app", App);

export { App };
