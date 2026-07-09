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
function bindEvents() {
    // Fix all logos immediately
    document.querySelectorAll('.logo').forEach(logo => {
        logo.href = 'explore.html';
    });

    // 1. Pills (Filters)
    document.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.preventDefault();
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
                window.location.href='referral.html';
            } else {
                window.showToast('Action triggered', 'info');
            }
        });
    });

    // 3. Modals and Navigation
    document.querySelectorAll('.hamburger-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const menu = document.getElementById('mobileMenu');
            if(menu) {
                menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
            }
        });
    });

    document.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => { e.preventDefault();
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
            console.log('Post media clicked!');
            const interactive = e.target.closest('button, .btn-primary, .action-btn, a, input, select, textarea, label, .creator-tag, .pill, .queue-action-btn, [class*="-btn"], [class*="btn-"], [onclick], summary, video, audio, area, [contenteditable]');
            if (interactive) return;
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
function bindEvents() {
    // Fix all logos immediately
    document.querySelectorAll('.logo').forEach(logo => {
        logo.href = 'explore.html';
    });

    // 1. Pills (Filters)
    document.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', (e) => {
            e.preventDefault();
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
                window.location.href='referral.html';
            } else {
                window.showToast('Action triggered', 'info');
            }
        });
    });

    // 3. Modals and Navigation
    document.querySelectorAll('.hamburger-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const menu = document.getElementById('mobileMenu');
            if(menu) {
                menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
            }
        });
    });

    document.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => { e.preventDefault();
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
            console.log('Post media clicked!');
            const interactive = e.target.closest('button, .btn-primary, .action-btn, a, input, select, textarea, label, .creator-tag, .pill, .queue-action-btn, [class*="-btn"], [class*="btn-"], [onclick], summary, video, audio, area, [contenteditable]');
            if (interactive) return;
            const validPart = e.target.closest('img, video, .media-placeholder');
            if (e.target !== media && !validPart) return;
            window.location.href = 'media-detail.html?id=community_post';
        });
    });

    // (masonry-item redirect removed to allow custom handling in feed.js)



    
    document.querySelectorAll('.nav-link, footer a, [href="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if(!href || href === '#') {
                e.preventDefault();
                window.showToast('Navigating...', 'info');
            }
        });
    });

    document.querySelectorAll('.dur-btn, .ql-btn, .hamburger-btn, .navbar-toggler, #hamburgerBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // empty handler to satisfy bindings
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
}
bindEvents();


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
