// Enhanced JavaScript for eDataWorker Portfolio

document.addEventListener('DOMContentLoaded', function() {
  
  // Animate elements on scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.card, .price-card, .logo-item');
    
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
  
  // Dynamic logo gallery
  const logoGallery = document.getElementById('logoGallery');
  if (logoGallery) {
    const logos = [
      { name: 'TechCorp Logo', color: '#4361ee' },
      { name: 'HealthPlus Logo', color: '#f72585' },
      { name: 'EcoGreen Logo', color: '#4cc9f0' },
      { name: 'FoodHub Logo', color: '#4ade80' },
      { name: 'CreativeMind Logo', color: '#7209b7' },
      { name: 'SwiftServe Logo', color: '#3a0ca3' },
      { name: 'BuildRight Logo', color: '#4895ef' },
      { name: 'EduLearn Logo', color: '#f72585' }
    ];
    
    logos.forEach(logo => {
      const logoItem = document.createElement('div');
      logoItem.className = 'logo-item fade-in';
      logoItem.innerHTML = `
        <div class="logo-placeholder" style="color: ${logo.color}">
          ${logo.name}
        </div>
      `;
      logoGallery.appendChild(logoItem);
    });
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
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Change button text to indicate loading
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      // In a real scenario, you would handle the actual form submission here
      // For demo purposes, we'll revert after 2 seconds
      setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.background = 'var(--success)';
        
        // Reset after 3 seconds
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
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
});
