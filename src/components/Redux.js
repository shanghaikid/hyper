import { wire, bind } from 'hyperhtml/esm';
import { createStore, combineReducers, applyMiddleware} from 'redux'
import "./Redux.scss";

const reducer1 = (state = {text : 'reducer'}, action) => {
    switch (action.type) {
        case 1:
            return Object.assign({}, state, {
                text: action.text
            })
        case 'pending':
            return Object.assign({}, state, {
                text: 'Pending'
            })
        default:t
            return state
    }
};
const reducer2 = (state = {}, action) => {
    switch (action.type) {
        case 2:
            return Object.assign({}, state, {
                text: action.text
            })
        default: t
            return state
    }
}

const logger = ({ getState }) => {
    return next => action => {
        console.log('will dispatch', action)

        // Call the next dispatch method in the middleware chain.
        const returnValue = next(action)

        console.log('state after dispatch', getState())

        // This will likely be the action itself, unless
        // a middleware further in chain changed it.
        return returnValue
    }
}

const apiMiddleware = store => next => action => {
    if (action.type !== 2) {
        return next(action);
    }

    store.dispatch({type: 1, text: 'pending'});

    return new Promise(resolver => {
        setTimeout(() => {
            resolver(action.text)
        }, 1000)
    }).then(d => {
        store.dispatch({ type: 1, text: d })
    }).catch(err => {
        dispatch({ type: 'err', text: 'err' })
    });
}

const store = createStore(combineReducers({ reducer1, reducer2 }), { reducer1: {text: 'front'}}, applyMiddleware(apiMiddleware));


class Redux extends HTMLElement {
    static get observedAttributes() {
        return ['label'];
    }
    constructor(...args) {
        super(...args);
        this.html = bind(this);
        window.store = store;
        this.store = store;
        this.state = this.store.getState().reducer1;
        store.subscribe((() => {
            this.state = store.getState().reducer1;
            this.render();
        }))
    }
    handleEvent(e) {
        if (e.type === 'click') {
            this.onclick(e);
        }
    }
    onclick(e) {
        this.store.dispatch({ type: 1, text: Math.random() * 2 > 1 ? '2' : 'fff' })
    }
    attributeChangedCallback() {
        this.render();
    }
    connectedCallback() {
        this.render();
    }
    render() {
        return this.html`
            <div class=${"container " + this.state.text} onclick=${this}>
            <div class="f" ><span>front</span></div>
            <div class="b"><span>back</span></div>
            </div>
        `;
    }
}

customElements.define('hyper-redux', Redux);

export { Redux }
