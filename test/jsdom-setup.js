/* global global:false */
import { JSDOM } from 'jsdom';

const { window } = new JSDOM('<!doctype html><html><body></body></html>');
const {
    document,
    navigator,
    CustomEvent,
    alert,
    NodeList,
    HTMLElement,
    customElements
} = window;
Object.assign(global, {
    window,
    document,
    navigator,
    CustomEvent,
    alert,
    NodeList,
    HTMLElement,
    customElements
});

