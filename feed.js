document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('exploreFeed');
    const spinner = document.getElementById('loadingSpinner');
    
    if (!feedContainer || typeof exploreVideos === 'undefined') return;

    let currentIndex = 0;
    const batchSize = 10; // Load 10 at a time to keep it extremely smooth
    let isLoading = false;

    function createCard(videoData) {
        const card = document.createElement('div');
        card.className = 'nexa-card masonry-item'; // Added masonry-item for global click handler
        
        // Use video if it's an mp4, otherwise image. Though all are .mp4 in our data.
        let mediaHtml = `
            <video class="nexa-media lazy-video" loop muted playsinline autoplay src="${videoData.src}"></video>
        `;

        card.innerHTML = `
            ${mediaHtml}
            <div class="nexa-author-thumb" style="background-image: url('${videoData.profile}');"></div>
            
            <div class="nexa-info-overlay">
                <h3 class="nexa-title">${videoData.title}</h3>
                <p class="nexa-username">${videoData.username}</p>
                <button class="nexa-btn">${videoData.action}</button>
            </div>
            
            <!-- Click intercept overlay for app.js routing -->
            <a href="media-detail.html?id=${videoData.id}" class="nexa-click-overlay"></a>
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
