(function() {
    const hamburgerBtns = document.querySelectorAll('.hamburger-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (hamburgerBtns.length > 0) {
        hamburgerBtns.forEach(hamburgerBtn => {
            hamburgerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (mobileMenu) {
                    mobileMenu.classList.toggle('active');
                    hamburgerBtn.classList.toggle('active');
                } else {
                    if (window.showToast) window.showToast('Menu opening...', 'info');
                }
            });
        });

        if (mobileMenu) {
            document.addEventListener('click', (e) => {
                const path = e.composedPath ? e.composedPath() : [];
                const isInsideMenu = path.includes(mobileMenu) || mobileMenu.contains(e.target);
                const isHamburgerBtn = Array.from(hamburgerBtns).some(btn => path.includes(btn) || btn.contains(e.target));

                if (mobileMenu.classList.contains('active') && !isInsideMenu && !isHamburgerBtn) {
                    mobileMenu.classList.remove('active');
                    hamburgerBtns.forEach(btn => btn.classList.remove('active'));
                }
            });
        }
    }
})();
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
// NextGen Global Interaction Script

// 1. Toast Notification System (Internal use only, no dummy inline usage)
window.showToast = window.showToast || function(message, type = 'success') {
    if (message == null) message = '';
    else message = String(message);
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '';
    if (type === 'success') icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    else if (type === 'error') icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e60000" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    else if (type === 'info') icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e60000" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    else icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>';
    
    const escapedMessage = message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    toast.innerHTML = `<div class="toast-icon" style="display:flex;align-items:center;">${icon}</div><div class="toast-msg" style="font-size:14px;font-weight:500;">${escapedMessage}</div>`;
    container.appendChild(toast);
    
    if (container.children.length > 5) {
        container.removeChild(container.firstChild);
    }
    
    setTimeout(() => { toast.classList.add('show'); }, 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};

// 2. Global Smart Routing & Click Handlers (GENUINE BINDING)
function bindAllEvents() {
    // Fix all logos immediately
    document.querySelectorAll('.logo').forEach(logo => {
        logo.href = 'explore.html';
    });

    // 1. Pills (Filters)
    document.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            const container = e.target.closest('.filters');
            if (container) {
                container.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            }
            e.target.classList.add('active');
            window.showToast("Refreshing feed...", "info");
        });
    });

    // 2. Action Buttons (like, share, comment)
    document.querySelectorAll('.action-btn, .like-btn, .comment-btn, .share-btn, .icon-btn, .btn-social, .copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isLike = btn.dataset.intent === 'like' || btn.classList.contains('fa-heart') || btn.querySelector('.fa-heart') || btn.classList.contains('liked') || btn.classList.contains('like-btn');
            const isComment = btn.dataset.intent === 'comment' || btn.classList.contains('fa-comment') || btn.querySelector('.fa-comment') || btn.classList.contains('comment-btn');
            const isShare = btn.dataset.intent === 'share' || btn.classList.contains('fa-share') || btn.querySelector('.fa-share') || btn.classList.contains('share-btn') || btn.classList.contains('copy-btn');

            if (isLike) {
                btn.classList.toggle('liked');
                window.showToast(btn.classList.contains('liked') ? 'Post liked!' : 'Post unliked', 'success');
            } else if (isComment) {
                window.showToast('Opening comments...', 'info');
            } else if (isShare) {
                if (navigator.clipboard) navigator.clipboard.writeText(window.location.href);
                window.showToast('Link copied to clipboard!', 'success');
            } else {
                window.showToast('Action triggered', 'info');
            }
        });
    });

    // 3. Modals and Navigation
    document.querySelectorAll('.hamburger-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.showToast('Toggling menu...', 'info');
        });
    });

    document.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });

    // 4. Content Creation & Actions
    document.querySelectorAll('.generate-btn, .publish-btn, .download-btn, .save-btn, .train-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (btn.classList.contains('publish-btn')) {
                btn.textContent = 'Published';
                btn.disabled = true;
                window.showToast('Successfully published to Community!', 'success');
            } else if (btn.classList.contains('download-btn')) {
                window.showToast('Download started', 'info');
            } else if (btn.classList.contains('train-btn')) {
                window.simulateTraining(btn);
            } else {
                window.showToast('Action processing...', 'info');
            }
        });
    });

    // 5. User / Account Actions
    document.querySelectorAll('.subscribe-btn, .follow-btn, .withdraw-btn, .support-btn, .connect-btn, .btn-plan, .btn-tier, .persona-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (btn.classList.contains('follow-btn')) {
                btn.textContent = btn.textContent === 'Follow' ? 'Following' : 'Follow';
                btn.classList.toggle('following');
            } else if (btn.classList.contains('subscribe-btn')) {
                window.showToast('Subscribed!', 'success');
            } else {
                window.showToast('Request received.', 'success');
            }
        });
    });

    // 6. Generic primary and secondary buttons not covered
    document.querySelectorAll('.btn-primary, .dur-btn, .tip-btn, .share-earn-btn, .feed-tab, .delete-btn, .retry-btn, .queue-action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!btn.hasAttribute('type') || btn.getAttribute('type') !== 'submit') {
                e.preventDefault();
            }
            window.showToast('Action acknowledged', 'info');
        });
    });

    // Creator Tags
    document.querySelectorAll('.creator-tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = 'creator.html';
        });
    });

    // Media Routing (Phase 3)
    document.querySelectorAll('.post-media').forEach(media => {
        media.addEventListener('click', (e) => {
            const interactive = e.target.closest('button, .btn-primary, .action-btn, a, input, select, textarea, label, .creator-tag, .pill, .queue-action-btn, [onclick], summary, video, audio, area, [contenteditable]');
            if (interactive) return;
            window.location.href = 'media-detail.html?id=community_post';
        });
    });

    document.querySelectorAll('.masonry-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const interactive = e.target.closest('button, .btn-primary, .action-btn, a, input, select, textarea, label, .creator-tag, .pill, .queue-action-btn, [onclick], summary, video, audio, area, [contenteditable]');
            if (interactive) return;
            window.location.href = 'media-detail.html?id=collection_item';
        });
    });

    // NSFW Toggle
    document.querySelectorAll('.nsfw-toggle input[type="checkbox"]').forEach(toggle => {
        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                window.showToast('NSFW content enabled', 'success');
            } else {
                window.showToast('NSFW content disabled', 'info');
            }
        });
    });
});

bindAllEvents();

window.simulateTraining = function(btn) {
    if (!btn || !btn.isConnected || btn.disabled) return;
    btn.disabled = true;
    btn.style.background = '#333';
    btn.style.boxShadow = 'none';

    const states = [
        { text: 'INGESTING DATA... 12%', delay: 1000 },
        { text: 'TRAINING NEURAL NET... 45%', delay: 1000 },
        { text: 'VOICE CLONING... 82%', delay: 1000 },
        { text: 'FINALIZING... 99%', delay: 1000 },
        { text: 'TRAINING COMPLETE o"', delay: 1000, bg: '#2ecc71', color: '#000', final: true }
    ];

    let currentState = 0;

    function advanceState() {
        if (!btn.isConnected) return; // Clean exit if removed
        
        const state = states[currentState];
        btn.innerHTML = state.text;
        if (state.bg) btn.style.background = state.bg;
        if (state.color) btn.style.color = state.color;

        currentState++;
        if (currentState < states.length) {
            setTimeout(advanceState, state.delay);
        } else if (state.final) {
            window.showToast('Neural Clone trained successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'studio.html';
            }, 2000);
        }
    }

    advanceState();
};
