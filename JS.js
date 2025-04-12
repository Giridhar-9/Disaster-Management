const videoItems = document.querySelectorAll('.video-item');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        let currentIndex = 0;

        function updateVideoDisplay() {
            videoItems.forEach((item, index) => {
                if (index === currentIndex) {
                    item.classList.add('active');
                    item.querySelector('video').currentTime = 0; // Reset video to start
                    item.querySelector('video').pause(); // Pause video when switching
                } else {
                    item.classList.remove('active');
                    item.querySelector('video').pause(); // Pause non-active videos
                }
            });

            // Disable buttons at edges
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === videoItems.length - 1;
        }
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateVideoDisplay();
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < videoItems.length - 1) {
                currentIndex++;
                updateVideoDisplay();
            }
        });

        // Initialize the display
        updateVideoDisplay();