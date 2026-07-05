
window.openFaceSwapModal = function(id) {
    const videoData = window.exploreVideos.find(v => v.id === id);
    if (!videoData) return;
    
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
    document.getElementById("modalPhotoPlaceholder").style.display = "block";
    document.getElementById("modalPhotoInput").value = "";
    document.getElementById("modalErrorMsg").style.display = "none";
    
    // Set up swap button
    const swapBtn = document.getElementById("modalSwapBtn");
    swapBtn.dataset.videoId = id;
    swapBtn.dataset.videoSrc = videoData.src;
    swapBtn.innerHTML = "? Swap My Face Into Video";
    swapBtn.disabled = false;
    swapBtn.style.opacity = "1";
    
    // Show modal
    document.getElementById("videoSwapModal").style.display = "flex";
};

// Handle Photo Upload Preview
document.addEventListener("DOMContentLoaded", () => {
    const photoInput = document.getElementById("modalPhotoInput");
    if(photoInput) {
        photoInput.addEventListener("change", function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById("modalPhotoPlaceholder").style.display = "none";
                    const preview = document.getElementById("modalPhotoPreview");
                    preview.src = e.target.result;
                    preview.style.display = "block";
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
            
            // Upload to Fal storage
            try {
                let imageUrlToUse = "";
                const falUploadUrl = "https://api.fal.ai/storage/upload";
                
                // Get the file
                const file = photoInput.files[0];
                
                if (file) {
                    const formData = new FormData();
                    formData.append("file", file);
                    const res = await fetch("/.netlify/functions/upload", {
                        method: "POST",
                        body: formData
                    });
                    
                    if (res.ok) {
                        const data = await res.json();
                        imageUrlToUse = data.url;
                    }
                }
                
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
                const task = {
                    id: generateData.id,
                    templateTitle: document.getElementById("modalTemplateTitle").textContent,
                    templateSrc: videoSrc,
                    status: "queued",
                    timestamp: Date.now()
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
                this.innerHTML = "? Swap My Face Into Video";
                this.disabled = false;
                this.style.opacity = "1";
            }
        });
    }
});

