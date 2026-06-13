function sanitizeCard(card) {
    const onclickStr = card.getAttribute('onclick');
    if (!onclickStr) return;
    
    if (/location|window\.open/i.test(onclickStr)) {
        const match = onclickStr.match(/(?:window\.location(?:\.href|\.assign|\.replace)?|location(?:\.href|\.assign|\.replace)?|window\.open)\s*(=|\()\s*(['"`])([^'"`]+)\2/);
        if (match && match[3]) {
            const extractedUrl = match[3];
            if (extractedUrl.includes('media-detail.html?id=')) {
                card.dataset.redirectId = extractedUrl.substring(extractedUrl.indexOf('media-detail.html?id=') + 'media-detail.html?id='.length);
            } else {
                card.dataset.redirectUrl = extractedUrl;
            }
        }
    }
    card.removeAttribute('onclick');
    card.onclick = null;
}

function initScript() {
    // Dynamically remove inline onclick from cards to prevent bubbling race conditions
    document.querySelectorAll('.card[onclick]').forEach(sanitizeCard);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    if (node.classList && node.classList.contains('card') && node.hasAttribute('onclick')) {
                        sanitizeCard(node);
                    }
                    const nestedCards = node.querySelectorAll ? node.querySelectorAll('.card[onclick]') : [];
                    nestedCards.forEach(sanitizeCard);
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('click', (e) => {
        if (!e.target || typeof e.target.closest !== 'function') return;
        const card = e.target.closest('.card');
        if (card && card.hasAttribute('onclick')) {
            sanitizeCard(card);
            // We removed the inline handler before it could execute during target phase.
            // Do NOT stop propagation, so our global bubble-phase listener can handle the click normally.
        }
    }, true);

    // Pre-assign redirect IDs to cards without onclick to ensure stable IDs
    const staticCards = Array.from(document.querySelectorAll('.card:not([onclick])'));
    const ids = ['video1', 'provocative', 'soft', 'wild', 'naughty', 'topmodel', 'nerdy', 'modest'];
    staticCards.forEach((c, index) => {
        if (!c.dataset.redirectId && !c.dataset.redirectUrl) {
            c.dataset.redirectId = ids[index % ids.length] || 'provocative';
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target || typeof e.target.closest !== 'function') return;

        // 1. Nav Links
        const navLink = e.target.closest('.nav-link');
        if (navLink) {
            const href = navLink.getAttribute('href');
            if (!href || href === '#' || href === '') {
                e.preventDefault();
            }
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            navLink.classList.add('active');
        }

        // 2. Duration toggle
        const durBtn = e.target.closest('.dur-btn');
        if (durBtn) {
            const parent = durBtn.parentElement;
            if (parent) {
                parent.querySelectorAll('.dur-btn').forEach(b => b.classList.remove('active'));
            }
            durBtn.classList.add('active');
        }

        // 3. Template Cards
        const card = e.target.closest('.card');
        if (card && !card.hasAttribute('onclick')) {
            const explicitBtns = '.share-btn, .like-btn, .save-btn, .follow-btn, .comment-btn, .icon-btn, .delete-btn, .download-btn';
            const interactive = e.target.closest(`a, button, input, select, textarea, .action-btn, [onclick], .creator-tag, summary, video, audio, label, area, [contenteditable], .post-media, .masonry-item, [data-bs-toggle], ${explicitBtns}`);
            if (interactive && interactive !== card) {
                return;
            }
            e.preventDefault();
            if (typeof card.dataset.redirectUrl === 'string') {
                window.location.href = card.dataset.redirectUrl;
            } else {
                const id = card.dataset.redirectId || 'provocative';
                window.location.href = 'media-detail.html?id=' + id;
            }
        }

    });


    // Editor generate button deterministic sequence
    const generateBtn = document.getElementById('generateBtn');
    const progressBox = document.getElementById('generationProgress');
    
    if (generateBtn && progressBox && !generateBtn.dataset.listenerAttached) {
        generateBtn.dataset.listenerAttached = 'true';
        let interval = null;
        generateBtn.addEventListener('click', () => {
            if (interval) return; // Prevent multiple intervals
            
            generateBtn.disabled = true;
            generateBtn.style.opacity = '0.5';
            progressBox.style.display = 'block';
            
            if (!progressBox.querySelector('.progress-bar')) {
                progressBox.innerHTML = '<div class="progress-bar"><div class="progress-fill"></div></div>';
            }
            const currentProgressFill = progressBox.querySelector('.progress-fill');
            const steps = [0, 20, 40, 60, 80, 100];
            let currentStepIndex = 0;
            
            interval = setInterval(() => {
                if (currentStepIndex < steps.length) {
                    const progress = steps[currentStepIndex];
                    if (currentProgressFill) {
                        currentProgressFill.style.width = `${progress}%`;
                    }
                    
                    if (progress === 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            progressBox.innerHTML = '<p style="color:#2ecc71; text-align:center; font-size:13px; font-weight:500;">Video generated successfully!</p>';
                            generateBtn.disabled = false;
                            generateBtn.style.opacity = '1';
                            interval = null; // release lock
                        }, 500);
                    } else {
                        currentStepIndex++;
                    }
                }
            }, 400);
        });
    }
};
document.addEventListener('DOMContentLoaded', initScript);
