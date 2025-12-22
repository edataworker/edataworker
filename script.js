// Enhanced JavaScript for eDataWorker Portfolio with Automatic Image Loading from GitHub
document.addEventListener('DOMContentLoaded', async function() {
 
  // Add Font Awesome icons
  const fontAwesome = document.createElement('link');
  fontAwesome.rel = 'stylesheet';
  fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  document.head.appendChild(fontAwesome);

  // Replace these with your actual GitHub username and repository name
  const owner = 'YOUR_GITHUB_USERNAME'; // e.g., 'eDataWorker'
  const repo = 'YOUR_REPO_NAME'; // e.g., 'portfolio'

  // Function to fetch image list from GitHub API
  async function getImagesFromFolder(folder) {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/mysite/${folder}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data
        .filter(file => file.type === 'file' && /\.(png|jpg|jpeg|gif)$/i.test(file.name))
        .map(file => ({
          url: `/mysite/${folder}/${file.name}`,
          alt: file.name.replace(/\.\w+$/, '')
        }));
    } catch (error) {
      console.error(`Error fetching images from ${folder}:`, error);
      return [];
    }
  }
 
  // Simple image loading function
  function loadImages(imageList, containerId, type = 'logo') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container ${containerId} not found`);
      return;
    }
   
    // Clear loading placeholder
    container.innerHTML = '';
   
    // Check if we have images to load
    if (!imageList || imageList.length === 0) {
      // Show placeholder if no images
      if (type === 'logo') {
        container.innerHTML = `
          <div class="logo-item">
            <div class="logo-placeholder">
              <i class="fas fa-images"></i>
              <div>No logos found</div>
              <small>Add images to /mysite/logo/ folder in your GitHub repo</small>
            </div>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="testimonial-card">
            <div class="testimonial-placeholder">
              <i class="fas fa-image"></i>
              <div>No testimonials found</div>
              <small>Add screenshots to /mysite/testimonial/ folder in your GitHub repo</small>
            </div>
          </div>
        `;
      }
      return;
    }
   
    // Load each image
    imageList.forEach((image, index) => {
      if (type === 'logo') {
        const logoItem = document.createElement('div');
        logoItem.className = 'logo-item fade-in';
        logoItem.innerHTML = `
          <img src="${image.url}"
               class="logo-image"
               alt="${image.alt || 'Logo ' + (index + 1)}"
               onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\"logo-placeholder\\"><i class=\\"fas fa-image\\"></i><div>Logo ${index + 1}</div><small>Image not found</small></div>';">
        `;
        container.appendChild(logoItem);
      } else {
        const testimonialCard = document.createElement('div');
        testimonialCard.className = 'testimonial-card fade-in';
        testimonialCard.innerHTML = `
          <img src="${image.url}"
               class="testimonial-image"
               alt="${image.alt || 'Testimonial ' + (index + 1)}"
               onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\"testimonial-placeholder\\"><i class=\\"fas fa-image\\"></i><div>Testimonial ${index + 1}</div><small>Screenshot not found</small></div>';">
        `;
        container.appendChild(testimonialCard);
      }
    });
  }

  // Load images automatically from folders
  async function loadAllImages() {
    const logoImages = await getImagesFromFolder('logo');
    loadImages(logoImages, 'logoGallery', 'logo');

    const testimonialImages = await getImagesFromFolder('testimonial');
    loadImages(testimonialImages, 'testimonialGallery', 'testimonial');
  }

  // Load the images
  await loadAllImages();
 
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
      // Allow actual form submission to FormSubmit.co
      // Just add a visual feedback
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
     
      // Change button text to indicate loading
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
     
      // Re-enable after 5 seconds in case form submission fails
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
 
  // Log success
  setTimeout(() => {
    console.log('eDataWorker Portfolio loaded successfully!');
    console.log('Images are now loaded automatically from GitHub folders.');
    console.log('Make sure to replace YOUR_GITHUB_USERNAME and YOUR_REPO_NAME with your actual values.');
  }, 1000);
});
