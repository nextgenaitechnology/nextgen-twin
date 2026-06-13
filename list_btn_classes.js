const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const classes = new Set();
files.forEach(f => {
    const cnt = fs.readFileSync(f, 'utf8');
    for (const m of cnt.matchAll(/class=["']([^"']+)["']/g)) {
        m[1].split(/\s+/).forEach(c => {
            if (c.includes('btn')) classes.add(c);
        });
    }
});
console.log(Array.from(classes).sort().join('\n'));
