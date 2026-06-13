const cases = [
    "window.location.href = 'media-detail.html?id=' + 'video1'",
    "location.assign('media-detail.html?id=' + 'video1')",
    "window.open('media-detail.html?id=' + 'video1')",
    "window.location.href='a'+'b'; console.log(1)"
];
cases.forEach(onclickStr => {
    const match = onclickStr.match(/(?:window\.location(?:\.href|\.assign)?|location(?:\.href|\.assign)?|window\.open)\s*(=|\()\s*([^;]+)/);
    if (match) {
        let rawUrl = match[2].trim();
        if (match[1] === '(' && rawUrl.endsWith(')')) {
            rawUrl = rawUrl.slice(0, -1);
        }
        let url = rawUrl.replace(/['"\s+]/g, '');
        console.log(url);
    }
});
