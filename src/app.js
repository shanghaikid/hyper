import {hyper, wire, bind, Component} from 'hyperhtml/esm';
import {Clock} from  './components/Clock';
import {Button} from './components/Button';
import {Select} from './components/Select';

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
			<h1>My Hyper HTML Playground</h1>
			<h3>Clock</h3>
			<hyper-clock stop=${this.state.clock.stop} />
			<h3>Button</h3>
			<hyper-button onclick=${this} label=${this.state.clock.stop ? 'Resume': 'Stop'}></hyper-button>
			<h3>Select</h3>
			<hyper-select></hyper-select>
			<h3>Carousel</h3>
			<hyper-carousel></hyper-carousel>
			<h3>Grid system</h3>
			<h3>Line chart</h3>
		`;
	}
}

customElements.define('hyper-app', App);

export {App};
