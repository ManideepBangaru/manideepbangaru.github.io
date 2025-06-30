// Fitness Videos Page functionality
class FitnessVideosPage {
    constructor() {
        this.fitnessData = null;
        this.init();
    }

    async init() {
        await this.loadFitnessData();
        this.updateStats();
        this.animateStats();
        this.loadVideos();
    }

    async loadFitnessData() {
        try {
            const response = await fetch('assets/library/fitness/fitness-data.json');
            const data = await response.json();
            this.fitnessData = data.fitnessJourney;
        } catch (error) {
            console.error('Error loading fitness data:', error);
            // Fallback data
            this.fitnessData = {
                stats: { currentStreak: 45, totalWorkouts: 120 },
                videos: []
            };
        }
    }

    updateStats() {
        if (!this.fitnessData) return;

        const stats = this.fitnessData.stats;
        document.getElementById('streakCount').textContent = stats.currentStreak;
        document.getElementById('workoutCount').textContent = stats.totalWorkouts;
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const finalValue = parseInt(stat.textContent);
            let currentValue = 0;
            const increment = finalValue / 50;
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    stat.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(currentValue);
                }
            }, 30);
        });
    }

    loadVideos() {
        const videoGrid = document.getElementById('videoGrid');
        if (!this.fitnessData || !this.fitnessData.videos) {
            videoGrid.innerHTML = '<p class="no-videos">No videos available yet.</p>';
            return;
        }

        videoGrid.innerHTML = this.fitnessData.videos.map(video => `
            <div class="video-card" data-video-id="${video.id}" data-video-url="${video.videoUrl}">
                <div class="video-thumbnail">
                    <img src="${this.getYouTubeThumbnail(video.videoUrl)}" alt="${video.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjU3MCIgdmlld0JveD0iMCAwIDMyMCA1NzAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iNTcwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik0xMzAgMjg1TDE5MCAzMjVMMTMwIDM2NVYyODVaIiBmaWxsPSIjZmZmIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iNDAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0Ij5GaXRuZXNzIFZpZGVvPC90ZXh0Pgo8L3N2Zz4K'">
                    <div class="play-overlay">
                        <i class="fas fa-play"></i>
                    </div>
                    <div class="video-duration">${video.duration}</div>
                </div>
                <div class="video-info">
                    <h3>${video.title}</h3>
                    <p class="video-date">${new Date(video.date).toLocaleDateString()}</p>
                </div>
            </div>
        `).join('');

        // Add click listeners to video cards
        document.querySelectorAll('.video-card').forEach(card => {
            card.addEventListener('click', () => {
                const videoUrl = card.dataset.videoUrl;
                const videoId = parseInt(card.dataset.videoId);
                this.playVideo(videoUrl, videoId);
            });
        });
    }

    getYouTubeThumbnail(url) {
        // Extract video ID from various YouTube URL formats
        let videoId = null;
        
        // YouTube Shorts format: https://www.youtube.com/shorts/VIDEO_ID
        if (url.includes('/shorts/')) {
            videoId = url.split('/shorts/')[1].split('?')[0];
        }
        // Regular YouTube format: https://www.youtube.com/watch?v=VIDEO_ID
        else if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1].split('&')[0];
        }
        // Short format: https://youtu.be/VIDEO_ID
        else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        }
        
        if (videoId) {
            return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
        
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjU3MCIgdmlld0JveD0iMCAwIDMyMCA1NzAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iNTcwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik0xMzAgMjg1TDE5MCAzMjVMMTMwIDM2NVYyODVaIiBmaWxsPSIjZmZmIi8+Cjx0ZXh0IHg9IjE2MCIgeT0iNDAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0Ij5GaXRuZXNzIFZpZGVvPC90ZXh0Pgo8L3N2Zz4K';
    }

    getYouTubeEmbedUrl(url) {
        let videoId = null;
        
        // Extract video ID from various YouTube URL formats
        if (url.includes('/shorts/')) {
            videoId = url.split('/shorts/')[1].split('?')[0];
        } else if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        }
        
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        }
        
        return url;
    }

    playVideo(videoUrl, videoId) {
        const video = this.fitnessData.videos.find(v => v.id === videoId);
        if (!video) return;

        // Determine if it's a YouTube Short (9:16 aspect ratio)
        const isShort = videoUrl.includes('/shorts/');
        const embedUrl = this.getYouTubeEmbedUrl(videoUrl);

        // Create full-page video player
        const videoModal = document.createElement('div');
        videoModal.className = 'fullpage-video-player';
        videoModal.innerHTML = `
            <div class="fullpage-video-content">
                <div class="fullpage-video-header">
                    <h3>${video.title}</h3>
                    <button class="close-fullpage-video">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="fullpage-video-body">
                    <div class="fullpage-video-container ${isShort ? 'shorts-container' : 'regular-container'}">
                        <iframe 
                            src="${embedUrl}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                    <div class="fullpage-video-details">
                        <p><strong>Date:</strong> ${new Date(video.date).toLocaleDateString()}</p>
                        <p><strong>Duration:</strong> ${video.duration}</p>
                        <p>${video.description}</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(videoModal);
        setTimeout(() => videoModal.classList.add('active'), 10);

        // Close video player
        const closeBtn = videoModal.querySelector('.close-fullpage-video');
        closeBtn.addEventListener('click', () => {
            videoModal.remove();
        });

        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                videoModal.remove();
            }
        });

        // Close with Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                videoModal.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
}

// Initialize fitness videos page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FitnessVideosPage();
}); 