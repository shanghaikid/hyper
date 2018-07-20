import { fromEvent} from 'rxjs';
import { map, filter, scan } from 'rxjs/operators';


import { wire, bind } from 'hyperhtml/esm';
import "./Redux.scss";
import { Button } from './Button';


class Rxjs extends HTMLElement {
    static get observedAttributes() {
        return ['label'];
    }
    constructor(...args) {
        super(...args);
        this.html = bind(this);
        // rxjs
        const source$ = fromEvent(this, 'click');
        source$.pipe(
            map(e => 1),
            scan((total, value) => total + value, 10)
        ).subscribe(this.onclick.bind(this))
    }
    handleEvent(e) {
        if (e.type === 'click') {
            this.onclick('ci');
        }
    }
    onclick(v) {
        console.log(v);
    }
    attributeChangedCallback() {
        this.render();
    }
    connectedCallback() {
        this.render();
    }
    render() {
        return this.html`
            <hyper-button label="click me"></hyper-button>
        `;
    }
}

customElements.define('hyper-rxjs', Rxjs);

export { Rxjs }
