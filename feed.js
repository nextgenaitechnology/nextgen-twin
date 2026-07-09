document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('exploreFeed');
    const spinner = document.getElementById('loadingSpinner');
    
    if (!feedContainer || typeof exploreVideos === 'undefined') return;

    let currentIndex = 0;
    const batchSize = 10; // Load 10 at a time to keep it extremely smooth
    let isLoading = false;

    function createCard(videoData) {
        const card = document.createElement('div');
        card.className = 'playbox-card'; 
        
        let mediaHtml = `
            <video class="playbox-media" loop muted playsinline autoplay src="${videoData.src}" poster="assets/placeholder.jpg"></video>
        `;

        card.innerHTML = `
            ${mediaHtml}
            <div class="playbox-overlay-top">
                <div class="playbox-avatar" style="background-image: url('${videoData.profile}');"></div>
                <div class="playbox-pill-top">${videoData.action}</div>
            </div>
            
            <div class="playbox-overlay-bottom">
                <h3 class="playbox-title">${videoData.title}</h3>
                <p class="playbox-username">${videoData.username}</p>
                <div class="playbox-pill-bottom">GENERATE ★ 30</div>
            </div>
            
            <button onclick="window.openFaceSwapModal('${videoData.id}')" class="playbox-click-overlay"></button>
        `;
        
        return card;
    }

    function loadMore() {
        if (isLoading || currentIndex >= exploreVideos.length) return;
        isLoading = true;
        
        if (spinner) spinner.style.display = 'block';

        // Simulate network delay for smooth experience
        setTimeout(() => {
            const fragment = document.createDocumentFragment();
            const endIndex = Math.min(currentIndex + batchSize, exploreVideos.length);
            
            for (let i = currentIndex; i < endIndex; i++) {
                fragment.appendChild(createCard(exploreVideos[i]));
            }
            
            feedContainer.appendChild(fragment);
            currentIndex = endIndex;
            isLoading = false;
            if (spinner) spinner.style.display = 'none';
        }, 300);
    }

    // Initial load
    loadMore();

    // Infinite scroll
    window.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 800) {
            loadMore();
        }
    });
});
