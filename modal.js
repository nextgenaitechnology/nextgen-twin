
window.openFaceSwapModal = function(id) {
    let videoData = null;
    if (window.exploreVideos && Array.isArray(window.exploreVideos)) {
        videoData = window.exploreVideos.find(v => v.id === id);
        if (!videoData) {
            // Fallback to first video if ID doesn't exist (e.g. from community.html hardcoded links)
            videoData = window.exploreVideos[0];
        }
    }
    
    if (!videoData) {
        videoData = {
            title: "Template Video",
            src: "assets/video_1.mp4"
        };
    }
    
    // Set up modal content
    document.getElementById("modalTemplateTitle").textContent = videoData.title;
    
    // Reset video player
    const videoPlayer = document.getElementById("modalVideoPlayer");
    videoPlayer.src = videoData.src;
    videoPlayer.load();
    videoPlayer.play().catch(e => console.log("Auto-play blocked:", e));
    
    // Reset photo upload state
    document.getElementById("modalPhotoPreview").style.display = "none";
    document.getElementById("modalPhotoPreview").src = "";
    if (document.getElementById("modalPhotoPlaceholder")) {
        document.getElementById("modalPhotoPlaceholder").style.display = "block";
    }
    document.getElementById("modalPhotoInput").value = "";
    document.getElementById("modalErrorMsg").style.display = "none";
    
    // Set up swap button
    const swapBtn = document.getElementById("modalSwapBtn");
    swapBtn.dataset.videoId = id;
    swapBtn.dataset.videoSrc = videoData.src;
    swapBtn.innerHTML = `Generate <span style="color: #007bff;">★ 30</span>`;
    swapBtn.disabled = false;
    swapBtn.style.opacity = "1";
    
    // Show modal
    document.getElementById("videoSwapModal").style.display = "flex";
};

// Handle Photo Upload Preview
function setupModal() {
    const photoInput = document.getElementById("modalPhotoInput");
    if(photoInput) {
        photoInput.addEventListener("change", function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = new Image();
                    img.onload = function() {
                        const canvas = document.createElement("canvas");
                        let width = img.width;
                        let height = img.height;
                        const MAX_SIZE = 800; // Resize to max 800px

                        if (width > height && width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        } else if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }

                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0, width, height);

                        // Export as highly compressed JPEG
                        const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.7);

                        if (document.getElementById("modalPhotoPlaceholder")) {
                            document.getElementById("modalPhotoPlaceholder").style.display = "none";
                        }
                        const preview = document.getElementById("modalPhotoPreview");
                        preview.src = resizedDataUrl;
                        preview.style.display = "block";
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    const swapBtn = document.getElementById("modalSwapBtn");
    if(swapBtn) {
        swapBtn.addEventListener("click", async function() {
            const videoSrc = this.dataset.videoSrc;
            const photoPreview = document.getElementById("modalPhotoPreview");
            const errorMsg = document.getElementById("modalErrorMsg");
            const photoInput = document.getElementById("modalPhotoInput");
            
            errorMsg.style.display = "none";
            
            if (photoPreview.style.display === "none" || !photoPreview.src) {
                errorMsg.textContent = "Please upload a photo first!";
                errorMsg.style.display = "block";
                return;
            }
            
            // Validate video src for local test
            if (videoSrc && (videoSrc.includes("localhost") || videoSrc.includes("127.0.0.1") || !videoSrc.startsWith("http"))) {
                // If it is a relative URL like assets/video_1.mp4, convert it to the public absolute URL so it works when deployed.
                // But wait, the generate function is on the same domain.
                // We must send the fully qualified URL.
            }
            
            const absoluteVideoUrl = new URL(videoSrc, window.location.href).href;
            
            // Let upload the photo to fal storage if needed, but for now we can just use the data URL or a mock
            // To be robust, since we know we only have a limited netlify backend, we will simulate the generation by pushing to queue.
            
            this.innerHTML = `<div style="width:20px;height:20px;border:3px solid white;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div> Processing...`;
            this.disabled = true;
            this.style.opacity = "0.7";
            
            // Instead of uploading to a custom backend, use the local data URL.
            try {
                const imageUrlToUse = photoPreview.src;
                
                // Submit to backend
                const generateRes = await fetch("/.netlify/functions/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        video_url: absoluteVideoUrl,
                        image_url: imageUrlToUse || "https://images.unsplash.com/photo-1534528741775-53994a69daeb" // fallback
                    })
                });
                
                const generateData = await generateRes.json();
                
                if (!generateRes.ok || generateData.error) {
                    throw new Error(generateData.error || "Server error");
                }
                
                // Add to queue and redirect
                const templateTitle = document.getElementById("modalTemplateTitle").textContent;
                const thumbUrl = photoPreview ? photoPreview.src : "";
                
                const videoId = this.dataset.videoId;
                let videoData = null;
                if (window.exploreVideos && Array.isArray(window.exploreVideos)) {
                    videoData = window.exploreVideos.find(v => v.id === videoId);
                    if (!videoData) {
                        videoData = window.exploreVideos[0];
                    }
                }
                
                let username = "@delulu";
                if (videoData && videoData.username) {
                    username = videoData.username;
                }
                if (!username.startsWith('@')) {
                    username = '@' + username;
                }

                const task = {
                    id: generateData.id,
                    templateTitle: templateTitle,
                    templateSrc: videoSrc,
                    status: "queued",
                    timestamp: Date.now(),
                    title: `FaceSwap — ${templateTitle}`,
                    meta: `Template by ${username} · Queued`,
                    thumb: thumbUrl
                };
                const queue = JSON.parse(localStorage.getItem("generationQueue") || "[]");
                queue.push(task);
                localStorage.setItem("generationQueue", JSON.stringify(queue));
                
                // Deduct credits visually
                window.showToast("Task Queued! Redirecting...", "success");
                
                setTimeout(() => {
                    window.location.href = "queue.html";
                }, 1000);
                
            } catch (error) {
                console.error(error);
                errorMsg.textContent = error.message;
                errorMsg.style.display = "block";
                this.innerHTML = "★ Swap My Face Into Video";
                this.disabled = false;
                this.style.opacity = "1";
            }
        });
    }
}

if (document.readyState === "interactive" || document.readyState === "complete") {
    setupModal();
} else {
    document.addEventListener("DOMContentLoaded", setupModal);
}

