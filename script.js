// Enhanced JavaScript for eDataWorker Portfolio with Dynamic Folder Detection

document.addEventListener('DOMContentLoaded', function() {
  
  // Add Font Awesome icons
  const fontAwesome = document.createElement('link');
  fontAwesome.rel = 'stylesheet';
  fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  document.head.appendChild(fontAwesome);
  
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
  
  // Function to load images from a folder
  async function loadImagesFromFolder(folderPath, containerId, type = 'logo') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Show loading state
    container.classList.add('loading');
    
    try {
      // Get list of image files from the folder
      // Note: This requires server-side support or a predefined list of images
      // For GitHub Pages, we'll use a different approach
      
      // Create a list of potential image files
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const images = [];
      
      // For GitHub Pages, we need to know the exact image names
      // We'll create placeholder images and instructions
      
      if (type === 'logo') {
        // Clear container first
        container.innerHTML = '';
        
        // Create 8 placeholder logos
        for (let i = 1; i <= 8; i++) {
          const logoItem = document.createElement('div');
          logoItem.className = 'logo-item fade-in';
          logoItem.innerHTML = `
            <div class="logo-placeholder">
              <i class="fas fa-palette"></i>
              <div>Logo ${i}</div>
              <small>Upload logo${i}.png to /mysite/logo/ folder</small>
            </div>
          `;
          container.appendChild(logoItem);
        }
        
        // Try to load actual logo images
        for (let i = 1; i <= 8; i++) {
          const img = new Image();
          img.src = `/mysite/logo/logo${i}.png`;
          img.onload = function() {
            // Replace placeholder with actual image
            const placeholder = container.children[i-1];
            if (placeholder) {
              placeholder.innerHTML = '';
              const actualImg = document.createElement('img');
              actualImg.src = `/mysite/logo/logo${i}.png`;
              actualImg.className = 'logo-image';
              actualImg.alt = `Logo ${i}`;
              actualImg.onerror = function() {
                // If image fails to load, keep placeholder
                placeholder.innerHTML = `
                  <div class="logo-placeholder">
                    <i class="fas fa-palette"></i>
                    <div>Logo ${i}</div>
                    <small>Add logo${i}.png to /mysite/logo/</small>
                  </div>
                `;
              };
              placeholder.appendChild(actualImg);
            }
          };
          img.onerror = function() {
            // Image doesn't exist, keep placeholder
            console.log(`Logo ${i} not found in /mysite/logo/ folder`);
          };
        }
        
        // Instructions
        console.log('=== LOGO FOLDER SETUP ===');
        console.log('1. Create a folder named "logo" inside your "mysite" folder');
        console.log('2. Add your logo images as: logo1.png, logo2.png, logo3.png, etc.');
        console.log('3. The script will automatically detect and display them');
        console.log('4. Recommended logo size: 400x400px with transparent background');
        
      } else if (type === 'testimonial') {
        // Clear container first
        container.innerHTML = '';
        
        // Try to load testimonial screenshots
        const testimonialTexts = [
          "Amazing work! Delivered perfectly and on time.",
          "Professional, responsive and highly skilled. Highly recommended!",
          "Great communication and excellent quality work.",
          "Exceeded expectations. Will hire again!",
          "Fast delivery and excellent results.",
          "Very professional and easy to work with."
        ];
        
        const platforms = ["Upwork", "Freelancer.com", "Guru.com", "Upwork", "Freelancer.com", "Guru.com"];
        
        // Create 6 testimonial cards
        for (let i = 1; i <= 6; i++) {
          const testimonialCard = document.createElement('div');
          testimonialCard.className = 'testimonial-card fade-in';
          
          testimonialCard.innerHTML = `
            <div class="testimonial-placeholder" id="testimonial-placeholder-${i}">
              <i class="fas fa-image"></i>
              <div>Testimonial ${i}</div>
              <small>Upload testimonial${i}.jpg to /mysite/testimonial/ folder</small>
            </div>
            <p class="testimonial-text">"${testimonialTexts[i-1] || 'Excellent service and quality work.'}"</p>
            <strong class="testimonial-author">- Happy Client</strong>
            <small style="color: var(--gray); display: block; margin-top: 5px;">${platforms[i-1] || 'Platform'}</small>
          `;
          
          container.appendChild(testimonialCard);
          
          // Try to load actual testimonial image
          const img = new Image();
          img.src = `/mysite/testimonial/testimonial${i}.jpg`;
          img.onload = function() {
            // Replace placeholder with actual image
            const placeholder = document.getElementById(`testimonial-placeholder-${i}`);
            if (placeholder) {
              placeholder.parentNode.innerHTML = `
                <img src="/mysite/testimonial/testimonial${i}.jpg" 
                     class="testimonial-image" 
                     alt="Testimonial ${i} from ${platforms[i-1] || 'Client'}"
                     loading="lazy">
                <p class="testimonial-text">"${testimonialTexts[i-1] || 'Excellent service and quality work.'}"</p>
                <strong class="testimonial-author">- Happy Client</strong>
                <small style="color: var(--gray); display: block; margin-top: 5px;">${platforms[i-1] || 'Platform'}</small>
              `;
            }
          };
          img.onerror = function() {
            // Image doesn't exist, keep placeholder
            console.log(`Testimonial ${i} not found in /mysite/testimonial/ folder`);
          };
        }
        
        // Instructions
        console.log('=== TESTIMONIAL FOLDER SETUP ===');
        console.log('1. Create a folder named "testimonial" inside your "mysite" folder');
        console.log('2. Add your testimonial screenshots as: testimonial1.jpg, testimonial2.jpg, etc.');
        console.log('3. The script will automatically detect and display them');
        console.log('4. Recommended size: 800x600px for screenshots');
      }
      
    } catch (error) {
      console.error(`Error loading ${type} images:`, error);
      
      // Show error message
      const errorMsg = document.createElement('div');
      errorMsg.className = 'error-message';
      errorMsg.style.color = 'var(--secondary)';
      errorMsg.style.textAlign = 'center';
      errorMsg.style.padding = '20px';
      errorMsg.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Unable to load ${type}s</h3>
        <p>Please create a "${type}" folder inside "mysite" and add your images.</p>
        <p>Name your images: ${type}1.jpg, ${type}2.jpg, etc.</p>
      `;
      container.appendChild(errorMsg);
    } finally {
      container.classList.remove('loading');
    }
  }
  
  // Initialize dynamic image loading
  loadImagesFromFolder('/mysite/logo/', 'logoGallery', 'logo');
  
  // Update testimonials section ID in HTML first, then load testimonials
  const testimonialsSection = document.getElementById('testimonials') || document.querySelector('section:nth-of-type(5)');
  if (testimonialsSection) {
    // Find the grid container inside testimonials
    const testimonialGrid = testimonialsSection.querySelector('.grid');
    if (testimonialGrid) {
      testimonialGrid.id = 'testimonialGallery';
      loadImagesFromFolder('/mysite/testimonial/', 'testimonialGallery', 'testimonial');
    }
  }
  
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
      e.preventDefault(); // Prevent actual form submission for now
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      const originalBg = submitBtn.style.background;
      
      // Change button text to indicate loading
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // Simulate form submission
      setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = 'var(--success)';
        
        // Reset form after success
        this.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = originalBg;
        }, 3000);
      }, 2000);
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
  
  // Add a simple typing effect to the header tagline
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
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 1000);
  }
  
  // Function to manually refresh galleries
  window.refreshGalleries = function() {
    loadImagesFromFolder('/mysite/logo/', 'logoGallery', 'logo');
    loadImagesFromFolder('/mysite/testimonial/', 'testimonialGallery', 'testimonial');
    console.log('Galleries refreshed. Check console for setup instructions.');
  };
  
  // Add refresh button for debugging (visible only in development)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '🔄 Refresh Galleries';
    refreshBtn.style.position = 'fixed';
    refreshBtn.style.bottom = '20px';
    refreshBtn.style.right = '20px';
    refreshBtn.style.zIndex = '1000';
    refreshBtn.style.padding = '10px 15px';
    refreshBtn.style.background = 'var(--primary)';
    refreshBtn.style.color = 'white';
    refreshBtn.style.border = 'none';
    refreshBtn.style.borderRadius = '5px';
    refreshBtn.style.cursor = 'pointer';
    refreshBtn.style.fontSize = '12px';
    refreshBtn.onclick = window.refreshGalleries;
    document.body.appendChild(refreshBtn);
  }
});
