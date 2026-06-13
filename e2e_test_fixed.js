import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const allFiles = fs.readdirSync(ROOT_DIR).filter(file => file.endsWith('.html') && file !== 'adversarial.html');
const INTERACTION_FILES = allFiles;
const CONTENT_FILES = allFiles;

let totalErrors = 0;

function logError(file, element, message) {
    console.error(`[FAIL] ${file}: ${element} - ${message}`);
    totalErrors++;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isBoundInJS(btn, window) {
    if (window.__boundElements && window.__boundElements.has(btn)) {
        
    }
    return false;
}

function verifyInteractions() {
    console.log('--- Verifying Interactions ---');
    INTERACTION_FILES.forEach(file => {
        const filePath = path.join(ROOT_DIR, file);
        if (!fs.existsSync(filePath)) {
            logError(file, 'FILE', 'File not found');
            return;
        }

        const html = fs.readFileSync(filePath, 'utf-8');
        const dom = new JSDOM(html, { runScripts: "dangerously", url: "http://localhost/" });
        const window = dom.window;
        const document = window.document;

        let pageJS = '';
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            const src = script.getAttribute('src');
            if (src && !src.startsWith('http')) {
                const cleanSrc = src.split('?')[0].split('#')[0];
                const srcPath = path.join(ROOT_DIR, cleanSrc);
                if (fs.existsSync(srcPath)) {
                    pageJS += fs.readFileSync(srcPath, 'utf8') + '\n';
                }
            } else if (!src) {
                pageJS += script.textContent + '\n';
            }
        });
        
        // Setup genuine binding tracking
        window.eval(`
            window.__boundElements = new Set();
            const originalAdd = window.EventTarget.prototype.addEventListener;
            window.EventTarget.prototype.addEventListener = function(type, fn, opts) {
                if (type === 'click' || type === 'submit' || type === 'change') {
                    window.__boundElements.add(this);
                }
                return originalAdd.call(this, type, fn, opts);
            };
        `);

        // Execute JS to attach listeners
        try {
            window.eval(pageJS);
            window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
        } catch (e) {
            console.error(`[WARN] Error executing JS in ${file}: ${e.message}`);
        }

        const links = document.querySelectorAll('a');
        links.forEach((a, index) => {
            const href = a.getAttribute('href');
            const onclick = a.getAttribute('onclick');
            
            const jsBind = a.getAttribute('data-bs-toggle') || isBoundInJS(a, window);
            
            const cleanHrefAttr = href ? href.trim() : '';
            const cleanedProtocol = cleanHrefAttr.replace(/[\x00-\x20]/g, '').toLowerCase();
            const isJavascriptProto = cleanedProtocol.startsWith('javascript:');
            
            const isDeadEnd = (!href || cleanHrefAttr === '#' || cleanHrefAttr === '' || isJavascriptProto) && !jsBind;
            
            if (isDeadEnd) {
                const text = a.textContent.trim().substring(0, 20) || 'no text';
                logError(file, `<a> tag ("${text}")`, 'Dead end detected (href is empty or "#" with no event listener or binding)');
            } else if (href && cleanHrefAttr !== '' && cleanHrefAttr !== '#' && !cleanHrefAttr.startsWith('http') && !cleanHrefAttr.startsWith('//') && !cleanHrefAttr.startsWith('mailto:') && !isJavascriptProto) {
                const cleanHref = cleanHrefAttr.split('?')[0].split('#')[0];
                if (cleanHref) {
                    const targetPath = path.join(ROOT_DIR, cleanHref);
                    if (!fs.existsSync(targetPath)) {
                        const text = a.textContent.trim().substring(0, 20) || 'no text';
                        logError(file, `<a> tag ("${text}")`, `Broken link: ${href} (File not found)`);
                    }
                }
            }
        });

        const buttons = document.querySelectorAll('button, input[type="button"], input[type="submit"], input[type="image"], input[type="reset"], area');
        buttons.forEach((btn, index) => {
            const type = btn.getAttribute('type') || (btn.tagName.toLowerCase() === 'button' ? 'submit' : null);
            const onclick = btn.getAttribute('onclick');
            const formaction = btn.getAttribute('formaction');
            
            const formEl = btn.closest('form') || (btn.hasAttribute('form') ? document.getElementById(btn.getAttribute('form')) : null);
            const hasForm = formEl !== null;
            
            let hasValidFormAction = false;
            if (formaction && formaction.trim() !== '#' && formaction.trim() !== '') {
                hasValidFormAction = true;
                const cleanVal = formaction.split('?')[0].split('#')[0];
                const cleanedAction = cleanVal.replace(/[\x00-\x20]/g, '').toLowerCase();
                if (!cleanVal.startsWith('http') && !cleanVal.startsWith('//') && !cleanVal.startsWith('mailto:') && !cleanedAction.startsWith('javascript:')) {
                    const targetPath = path.join(ROOT_DIR, cleanVal);
                    if (!fs.existsSync(targetPath)) {
                        const text = btn.tagName.toLowerCase() + (btn.id ? '#'+btn.id : '');
                        logError(file, `<${btn.tagName.toLowerCase()}> tag ("${text}")`, `Broken formaction link: ${formaction} (File not found)`);
                    }
                }
            } else if (hasForm && ((formEl.getAttribute('action') && formEl.getAttribute('action').trim() !== '#' && formEl.getAttribute('action').trim() !== '') || formEl.hasAttribute('onsubmit'))) {
                hasValidFormAction = true;
            }
            
            const isSubmit = type === 'submit' || type === 'image' || (!btn.hasAttribute('type') && btn.tagName.toLowerCase() === 'button' && hasForm);
            const isValidSubmit = isSubmit && hasValidFormAction;
            const isValidReset = type === 'reset' && hasForm;
            const isArea = btn.tagName.toLowerCase() === 'area';
            let isAreaValid = false;
            if (isArea) {
                const href = btn.getAttribute('href');
                if (href && href.trim() !== '' && href.trim() !== '#') {
                    isAreaValid = true;
                }
            }
            
            const isBound = isBoundInJS(btn, window);
            
            const hasAction = isValidSubmit || isValidReset || isAreaValid || isBound || btn.hasAttribute('data-bs-toggle');
            
            if (!hasAction) {
                const text = (btn.textContent ? btn.textContent.trim().substring(0, 20) : '') || btn.tagName.toLowerCase();
                logError(file, `<${btn.tagName.toLowerCase()}> tag ("${text}")`, 'Possible silent failure (no interactive attributes like onclick, valid type=submit/reset, or handled id/class)');
            }
        });
    });
}

function verifyContent() {
    console.log('\n--- Verifying Content ---');
    CONTENT_FILES.forEach(file => {
        const filePath = path.join(ROOT_DIR, file);
        if (!fs.existsSync(filePath)) {
            logError(file, 'FILE', 'File not found');
            return;
        }

        const html = fs.readFileSync(filePath, 'utf-8');
        const dom = new JSDOM(html);
        const document = dom.window.document;

        const checkResourcePath = (elType, srcIndex, attrVal) => {
            if (attrVal && attrVal.trim() !== '' && !attrVal.startsWith('http') && !attrVal.startsWith('//') && !attrVal.startsWith('data:') && !attrVal.startsWith('mailto:') && !attrVal.toLowerCase().startsWith('javascript:')) {
                const cleanVal = attrVal.split('?')[0].split('#')[0];
                if (cleanVal) {
                    const targetPath = path.join(ROOT_DIR, cleanVal);
                    if (!fs.existsSync(targetPath)) {
                        logError(file, `<${elType}> tag (index ${srcIndex})`, `Broken resource link: ${attrVal} (File not found)`);
                    }
                }
            }
        };

        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            const src = img.getAttribute('src');
            const dataSrc = img.getAttribute('data-src');
            const srcset = img.getAttribute('srcset');
            let srcsToCheck = [];
            if (src && src.trim() !== '') srcsToCheck.push(src);
            if (dataSrc && dataSrc.trim() !== '') srcsToCheck.push(dataSrc);
            if (srcset) {
                const parts = srcset.split(',').map(s => s.trim().split(/\s+/)[0]).filter(s => s);
                srcsToCheck.push(...parts);
            }
            
            if (srcsToCheck.length === 0) {
                logError(file, `<img> tag (index ${index})`, 'Empty src/srcset attribute');
                return;
            }

            srcsToCheck.forEach(s => {
                if (s.toLowerCase().includes('placeholder') || s.toLowerCase().includes('dummy') || s.toLowerCase().includes('placekitten') || s.toLowerCase().includes('picsum')) {
                    logError(file, `<img> tag (index ${index})`, `Generic placeholder found: ${s}`);
                    return;
                }
                checkResourcePath('img', index, s);
            });
        });

        const mediaElements = document.querySelectorAll('audio, video, source, iframe, embed, object, script[src], link[href]');
        mediaElements.forEach((el, index) => {
            const tagName = el.tagName.toLowerCase();
            if (tagName === 'video') {
                const poster = el.getAttribute('poster');
                if (poster && poster.trim() !== '') {
                    checkResourcePath('video-poster', index, poster);
                }
            }
            const src = el.getAttribute('src') || el.getAttribute('data-src') || el.getAttribute('href') || el.getAttribute('data');
            
            if (!src || src.trim() === '') {
                if (tagName === 'video' || tagName === 'audio' || tagName === 'object') {
                    if (el.querySelector('source') || el.querySelector('param')) return;
                }
                if (tagName === 'script' || tagName === 'link') return; // Handled if src/href not present (e.g. inline script)
                logError(file, `<${tagName}> tag (index ${index})`, 'Empty src/data/href attribute');
                return;
            }
            checkResourcePath(tagName, index, src);
        });

        const forms = document.querySelectorAll('form');
        forms.forEach((form, index) => {
            const action = form.getAttribute('action');
            if (action && action.trim() !== '' && action.trim() !== '#') {
                checkResourcePath('form', index, action);
            }
        });
        
        const styleBlocks = document.querySelectorAll('style');
        styleBlocks.forEach((styleBlock, index) => {
            const content = styleBlock.textContent;
            if (content) {
                const regex = /url\(\s*(?:(["'])(.*?)\1|([^'"\)]*?))\s*\)/gi;
                let match;
                while ((match = regex.exec(content)) !== null) {
                    const url = match[2] || match[3];
                    if (url && url.trim() !== '' && !url.trim().startsWith('data:')) {
                        checkResourcePath('style-block', index, url.trim());
                    }
                }
            }
        });
        
        const styledElements = document.querySelectorAll('*[style]');
        styledElements.forEach((el, index) => {
            const style = el.getAttribute('style');
            if (style) {
                const regex = /url\(\s*(?:(["'])(.*?)\1|([^'"\)]*?))\s*\)/gi;
                let match;
                while ((match = regex.exec(style)) !== null) {
                    const url = match[2] || match[3];
                    if (url && url.trim() !== '' && !url.trim().startsWith('data:')) {
                        checkResourcePath('inline-style', index, url.trim());
                    }
                }
            }
        });
    });
}

console.log('Starting E2E Test Suite...\n');

verifyInteractions();
verifyContent();

console.log('\n--- Test Results ---');
if (totalErrors > 0) {
    console.error(`Status: FAILED with ${totalErrors} errors.`);
    process.exit(1);
} else {
    console.log('Status: PASSED. All tests passed.');
    process.exit(0);
}

