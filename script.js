// Consolidated JavaScript for eDataWorker Portfolio - Automatic Image Loader

document.addEventListener('DOMContentLoaded', function() {
    // GitHub Repository Configuration
    const GITHUB_USERNAME = 'edataworker'; // Your GitHub username
    const GITHUB_REPO = 'edataworker.github.io'; // Your GitHub Pages repository
    const BRANCH = 'main'; // Your default branch

    // Base URLs for GitHub API and raw content
    const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents`;
    const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${BRANCH}`;

    // Function to load images from a specific folder
    async function loadImagesFromFolder(folderName, galleryElementId, type = 'logo') {
        const galleryElement = document.getElementById(galleryElementId);
        
        if (!galleryElement) {
            console.error(`Gallery element #${galleryElementId} not found.`);
            return;
        }

        // Show loading state
        galleryElement.innerHTML = `
            <div class="${type}-item">
                <div class="${type}-placeholder">
                    <i class="fas fa-spinner fa-spin"></i>
                    <div>Loading ${type}s...</div>
                </div>
            </div>
        `;

        try {
            // Fetch folder contents from GitHub API
            const apiUrl = `${GITHUB_API_BASE}/${folderName}`;
            console.log(`Fetching from: ${apiUrl}`);
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`The "${folderName}" folder was not found in your repository.`);
                }
                // Handle GitHub API rate limits [citation:1][citation:6]
                if (response.status === 403 || response.status === 429) {
                    console.warn(`GitHub API rate limit may be exceeded. Status: ${response.status}`);
                    // You could check x-ratelimit-remaining header here [citation:10]
                }
                throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
            }

            const files = await response.json();
            
            // Filter for image files (png, jpg, jpeg, gif, webp, svg)
            const imageFiles = files.filter(file => 
                file.type === 'file' && 
                /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file.name)
            );

            console.log(`Found ${imageFiles.length} images in ${folderName}/`);

            // Clear gallery
            galleryElement.innerHTML = '';

            if (imageFiles.length === 0) {
                // Show message if no images found
                galleryElement.innerHTML = `
                    <div class="${type}-item">
                        <div class="${type}-placeholder">
                            <i class="fas fa-folder-open"></i>
                            <div>No ${type}s found</div>
                            <small>Add images to the <code>/${folderName}/</code> folder</small>
                        </div>
                    </div>
                `;
                return;
            }

            // Create and append image elements
            imageFiles.forEach(file => {
                const imageUrl = file.download_url || `${GITHUB_RAW_BASE}/${folderName}/${file.name}`;
                
                if (type === 'logo') {
                    // Create logo item
                    const logoItem = document.createElement('div');
                    logoItem.className = 'logo-item fade-in';
                    logoItem.innerHTML = `
                        <img src="${imageUrl}" 
                             class="logo-image" 
                             alt="${file.name.replace(/\.[^/.]+$/, '')}"
                             loading="lazy"
                             onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\"logo-placeholder\"><i class=\"fas fa-exclamation-triangle\"></i><div>Failed to load</div></div>';">
                    `;
                    galleryElement.appendChild(logoItem);
                } else if (type === 'testimonial') {
                    // Create testimonial card
                    const testimonialCard = document.createElement('div');
                    testimonialCard.className = 'testimonial-card fade-in';
                    
                    // You can customize the text based on filename or other logic
                    const defaultText = "Great service and excellent results!";
                    const defaultAuthor = "Satisfied Client";
                    
                    testimonialCard.innerHTML = `
                        <img src="${imageUrl}" 
                             class="testimonial-image" 
                             alt="Testimonial screenshot: ${file.name}"
                             loading="lazy"
                             onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\"testimonial-placeholder\"><i class=\"fas fa-exclamation-triangle\"></i><div>Image not found</div></div>';">
                        <p class="testimonial-text">"${defaultText}"</p>
                        <strong class="testimonial-author">- ${defaultAuthor}</strong>
                    `;
                    galleryElement.appendChild(testimonialCard);
                }
            });

        } catch (error) {
            console.error(`Error loading ${type}s:`, error);
            galleryElement.innerHTML = `
                <div class="${type}-item">
                    <div class="${type}-placeholder error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div>Error loading ${type}s</div>
                        <small>${error.message}</small>
                        <br>
                        <small style="margin-top: 10px; display: block;">
                            Check: 1) Folder exists 2) Images are inside 3) Repository is public
                        </small>
                    </div>
                </div>
            `;
        }
    }

    // Add Font Awesome for icons if not already loaded
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }

    // Load images on page load
    loadImagesFromFolder('logo', 'logoGallery', 'logo');
    loadImagesFromFolder('testimonial', 'testimonialGallery', 'testimonial');

    // Your existing animation and other functions here...
    // (Keep your existing animateOnScroll, smooth scroll, etc. code below)
    
    // For example, keep your animation code:
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.card, .price-card, .logo-item, .testimonial-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        elements.forEach(el => observer.observe(el));
    };
    animateOnScroll();
});

// Expose function to manually refresh from browser console
window.refreshPortfolioImages = function() {
    console.log('Refreshing portfolio images...');
    // You'll need to make loadImagesFromFolder globally accessible or re-trigger
    location.reload(); // Simple reload for now
};
