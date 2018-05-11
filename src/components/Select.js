import {hyper, wire, bind, Component} from 'hyperhtml/esm';

class Select extends HTMLElement {
	static get observedAttributes() {
		return ['label'];
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
			<select></select>	
		`;
	}
}

customElements.define('hyper-select', Select);

export {Select}
