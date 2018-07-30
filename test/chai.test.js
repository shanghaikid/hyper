import chai from 'chai';
import { JSDOM } from "jsdom";

const { expect } = chai;

before(mockDOM)
before(mockCustomElements)

function mockDOM() {
    const { JSDOM: Dom } = require('jsdom')
    const dom = new Dom('<!doctype html><html><body></body></html>')
    global.document = dom.window.document
    global.window = document.defaultView
    window.Object = Object
    window.Math = Math
}

function mockCustomElements() {
    require('document-register-element/pony')(window)
}

describe('Rxjs', function () {
    var rxjs2 = require("../src/components/Rxjs");
    let rxjs = document.createElement('<hyper-rxjs label="rxjs"></hyper-rxjs>');

    describe('items focus state', function () {
        console.log(rxjs);
    });

});
