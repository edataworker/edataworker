// JavaScript for eDataWorker Portfolio with GitHub API dynamic image loading

document.addEventListener('DOMContentLoaded', function() {
  
  // Add Font Awesome icons
  const fontAwesome = document.createElement('link');
  fontAwesome.rel = 'stylesheet';
  fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  document.head.appendChild(fontAwesome);
  
  // GitHub Repository Information
  const GITHUB_USERNAME = 'edataworker'; // Your GitHub username
  const REPO_NAME = 'edataworker.github.io'; // Your repository name
  const BRANCH = 'main'; // Your default branch
  
  // Base URLs
  const GITHUB_API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents`;
  const GITHUB_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/${BRANCH}`;
  
  // Function to fetch folder contents from GitHub
  async function fetchFolderContents(folderPath) {
    try {
      const apiUrl = `${GITHUB_API_URL}${folderPath}`;
      console.log(`Fetching: ${apiUrl}`);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log(`Folder not found: ${folderPath}`);
          return [];
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const contents = await response.json();
      
      // Filter for image files only
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const imageFiles = contents.filter(item => {
        if (item.type !== 'file') return false;
        const ext = item.name.toLowerCase().substring(item.name.lastIndexOf('.'));
        return imageExtensions.includes(ext);
      });
      
      console.log(`Found ${imageFiles.length} images in ${folderPath}`);
      return imageFiles;
      
    } catch (error) {
      console.error('Error fetching folder:', error);
      return [];
    }
  }
  
  // Function to load images into gallery
  function loadImagesToGallery(images, containerId, type = 'logo') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container ${containerId} not found`);
      return;
    }
    
    // Clear container
    container.innerHTML = '';
    
    if (!images || images.length === 0) {
      // Show placeholder if no images
      if (type === 'logo') {
        container.innerHTML = `
          <div class="logo-item">
            <div class="logo-placeholder">
              <i class="fas fa-folder-open"></i>
              <div>No logos found</div>
              <small>Add images to /mysite/logo/ folder</small>
            </div>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="testimonial-card">
            <div class="testimonial-placeholder">
              <i class="fas fa-folder-open"></i>
              <div>No testimonials found</div>
              <small>Add screenshots to /mysite/testimonial/ folder</small>
            </div>
          </div>
        `;
      }
      return;
    }
    
    // Load each image
    images.forEach((image, index) => {
      const imageUrl = `${GITHUB_RAW_URL}${image.path}`;
      
      if (type === 'logo') {
        const logoItem = document.createElement('div');
        logoItem.className = 'logo-item fade-in';
        logoItem.innerHTML = `
          <img src="${imageUrl}" 
               class="logo-image" 
               alt="${image.name}"
               loading="lazy"
               onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerHTML='<div class=\"logo-placeholder\"><i class=\"fas fa-image\"></i><div>${image.name}</div><small>Failed to load</small></div>';">
        `;
        container.appendChild(logoItem);
      } else {
        const testimonialCard = document.createElement('div');
        testimonialCard.className = 'testimonial-card fade-in';
        
        // Create testimonial text based on filename
        const testimonialText = getTestimonialText(image.name);
        
        testimonialCard.innerHTML = `
          <img src="${imageUrl}" 
               class="testimonial-image" 
               alt="${image.name}"
               loading="lazy"
               onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerHTML='<div class=\"testimonial-placeholder\"><i class=\"fas fa-image\"></i><div>${image.name}</div><small>Failed to load</small></div><p class=\"testimonial-text\">\"${testimonialText}\"</p><strong class=\"testimonial-author\">- Happy Client</strong>';">
          <p class="testimonial-text">"${testimonialText}"</p>
          <strong class="testimonial-author">- Happy Client</strong>
        `;
        container.appendChild(testimonialCard);
      }
    });
  }
  
  // Helper function to generate testimonial text from filename
  function getTestimonialText(filename) {
    const texts = [
      "Amazing work! Delivered perfectly and on time.",
      "Professional, responsive and highly skilled. Highly recommended!",
      "Great communication and excellent quality work.",
      "Exceeded expectations. Will hire again!",
      "Fast delivery and excellent results.",
      "Very professional and easy to work with."
    ];
    
    // Use filename hash to pick a text (consistent for same filename)
    let hash = 0;
    for (let i = 0; i < filename.length; i++) {
      hash = ((hash << 5) - hash) + filename.charCodeAt(i);
      hash = hash & hash;
    }
    hash = Math.abs(hash);
    
    return texts[hash % texts.length];
  }
  
  // Main function to load all images
  async function loadAllImages() {
    console.log('🚀 Loading images dynamically from GitHub...');
    
    // Load logos
    console.log('📁 Loading logos from /mysite/logo/');
    const logoImages = await fetchFolderContents('/mysite/logo');
    loadImagesToGallery(logoImages, 'logoGallery', 'logo');
    
    // Load testimonials
    console.log('📁 Loading testimonials from /mysite/testimonial/');
    const testimonialImages = await fetchFolderContents('/mysite/testimonial');
    loadImagesToGallery(testimonialImages, 'testimonialGallery', 'testimonial');
    
    // Log summary
    const totalImages = logoImages.length + testimonialImages.length;
    console.log(`✅ Loaded ${totalImages} images total (${logoImages.length} logos, ${testimonialImages.length} testimonials)`);
    
    // Show refresh button if in development
    if (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')) {
      addRefreshButton();
    }
  }
  
  // Add a refresh button for testing
  function addRefreshButton() {
    const refreshBtn = document.createElement('button');
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Images';
    refreshBtn.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      padding: 10px 15px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    refreshBtn.onclick = () => {
      refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
      refreshBtn.disabled = true;
      loadAllImages().then(() => {
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Images';
        refreshBtn.disabled = false;
      });
    };
    document.body.appendChild(refreshBtn);
  }
  
  // Start loading images
  loadAllImages();
  
  // Animate elements on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.card, .price-card, .logo-item, .testimonial-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
  };
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Form submission feedback
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 5000);
    });
  }
  
  // Initialize animations
  animateOnScroll();
  
  // Add hover effect to service cards
  const serviceCards = document.querySelectorAll('#services .card');
  serviceCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.borderTopColor = 'var(--secondary)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.borderTopColor = 'var(--primary)';
    });
  });
  
  // Dynamic year in footer
  const footer = document.querySelector('footer p');
  if (footer) {
    const currentYear = new Date().getFullYear();
    footer.innerHTML = footer.innerHTML.replace('2025', currentYear);
  }
  
  // Add typing effect to header
  const tagline = document.querySelector('header p');
  if (tagline) {
    const text = tagline.textContent;
    tagline.textContent = '';
    let i = 0;
    
    function typeWriter() {
      if (i < text.length) {
        tagline.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 30);
      }
    }
    
    setTimeout(typeWriter, 1000);
  }
  
  // Add GitHub API status indicator
  function addStatusIndicator() {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'github-status';
    statusDiv.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 5px;
      font-size: 12px;
      z-index: 999;
      display: none;
    `;
    document.body.appendChild(statusDiv);
    
    // Monitor GitHub API calls
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      if (args[0] && args[0].includes('api.github.com')) {
        statusDiv.style.display = 'block';
        statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading images from GitHub...';
        statusDiv.style.background = 'rgba(67, 97, 238, 0.9)';
        
        return originalFetch.apply(this, args).then(response => {
          setTimeout(() => {
            statusDiv.innerHTML = '<i class="fas fa-check"></i> Images loaded';
            statusDiv.style.background = 'rgba(76, 201, 240, 0.9)';
            setTimeout(() => {
              statusDiv.style.display = 'none';
            }, 2000);
          }, 500);
          return response;
        }).catch(error => {
          statusDiv.innerHTML = '<i class="fas fa-times"></i> Failed to load';
          statusDiv.style.background = 'rgba(247, 37, 133, 0.9)';
          setTimeout(() => {
            statusDiv.style.display = 'none';
          }, 3000);
          throw error;
        });
      }
      return originalFetch.apply(this, args);
    };
  }
  
  // Initialize status indicator
  addStatusIndicator();
  
  // Expose refresh function to console
  window.refreshImages = loadAllImages;
  
  // Log helpful info
  console.log(`
  ========================================
  eDataWorker Portfolio - Dynamic Image Loader
  ========================================
  This script automatically loads ALL images from:
  - /mysite/logo/ (for logos)
  - /mysite/testimonial/ (for testimonials)
  
  No manual configuration needed!
  
  GitHub API Rate Limits:
  - 60 requests per hour (unauthenticated)
  - 5000 requests per hour (authenticated)
  
  To manually refresh images, type in console:
  refreshImages()
  ========================================
  `);
});
