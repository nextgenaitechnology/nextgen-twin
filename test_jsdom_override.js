import { JSDOM } from 'jsdom';
const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`, { runScripts: "dangerously" });
const window = dom.window;
window.eval(`
    window.__globalDelegation = false;
    const originalAdd = window.EventTarget.prototype.addEventListener;
    window.EventTarget.prototype.addEventListener = function(type, fn, opts) {
        if (this === document) { window.__globalDelegation = true; }
        return originalAdd.call(this, type, fn, opts);
    };
`);
window.eval(`document.addEventListener('click', () => {});`);
console.log(window.__globalDelegation);
