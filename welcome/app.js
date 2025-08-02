// Smooth scrolling functionality for internal navigation
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// FAQ toggle functionality
function toggleFAQ(questionElement) {
  const faqItem = questionElement.parentElement;
  const answer = faqItem.querySelector('.faq__answer');
  const arrow = questionElement.querySelector('.faq__arrow');
  
  // Close all other FAQ items
  const allFAQItems = document.querySelectorAll('.faq__item');
  allFAQItems.forEach(item => {
    if (item !== faqItem) {
      const otherAnswer = item.querySelector('.faq__answer');
      const otherQuestion = item.querySelector('.faq__question');
      const otherArrow = item.querySelector('.faq__arrow');
      
      otherAnswer.classList.remove('active');
      otherQuestion.classList.remove('active');
      otherArrow.style.transform = 'rotate(0deg)';
    }
  });
  
  // Toggle current FAQ item
  const isActive = answer.classList.contains('active');
  
  if (isActive) {
    answer.classList.remove('active');
    questionElement.classList.remove('active');
    arrow.style.transform = 'rotate(0deg)';
  } else {
    answer.classList.add('active');
    questionElement.classList.add('active');
    arrow.style.transform = 'rotate(180deg)';
  }
}

// Form validation and submission
// Intersection Observer for animations
function setupAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe elements for animation
  const animatedElements = document.querySelectorAll('.benefit-card, .step, .testimonial, .comparison__item');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Navbar scroll effect (if needed)
function setupScrollEffects() {
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add floating effect to hero CTA when scrolling
    const heroCTA = document.querySelector('.hero__cta');
    if (heroCTA) {
      if (scrollTop > 100) {
        heroCTA.style.transform = 'translateY(-2px)';
        heroCTA.style.boxShadow = '0 12px 48px rgba(212, 165, 116, 0.25)';
      } else {
        heroCTA.style.transform = 'translateY(0)';
        heroCTA.style.boxShadow = '0 4px 20px rgba(212, 165, 116, 0.15)';
      }
    }
    
    lastScrollTop = scrollTop;
  });
}

// Add hover effects to images
function setupImageEffects() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.05)';
    });
    
    img.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });
  });
}

// Lazy loading for images
function setupLazyLoading() {
  const images = document.querySelectorAll('img');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = '1';
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    imageObserver.observe(img);
  });
}

// Add click tracking for CTAs
function setupCTATracking() {
  const ctaButtons = document.querySelectorAll('.hero__cta'); // Only track hero CTA
  ctaButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const buttonText = button.textContent.trim();
      console.log('CTA clicked:', buttonText);
      
      // Track CTA clicks
      // Example: gtag('event', 'cta_click', { button_text: buttonText });
    });
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Setup animations and effects
  setupAnimations();
  setupScrollEffects();
  setupImageEffects();
  setupLazyLoading();
  setupCTATracking();
  
  // Add smooth scrolling to all internal links
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
  // Responsive adjustments now handled through CSS media queries
  // No JavaScript manipulation of styles needed
});

// Add keyboard navigation support
document.addEventListener('keydown', (event) => {
  // ESC key to close any open FAQ
  if (event.key === 'Escape') {
    const activeFAQ = document.querySelector('.faq__question.active');
    if (activeFAQ) {
      toggleFAQ(activeFAQ);
    }
  }
  
  // Enter key on FAQ questions
  if (event.key === 'Enter' && event.target.classList.contains('faq__question')) {
    toggleFAQ(event.target);
  }
});

// Preload critical images
function preloadImages() {
  const criticalImages = [
    'https://pplx-res.cloudinary.com/image/upload/v1748628532/pplx_project_search_images/ada3c95ac24946e050e9f92d20a6df620d66785b.jpg',
    'https://pplx-res.cloudinary.com/image/upload/v1751759476/pplx_project_search_images/a29576fc1a31e199933273f243943813dbb155ff.jpg'
  ];
  
  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// Initialize preloading
preloadImages();

// Performance monitoring
function trackPagePerformance() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    }, 0);
  });
}

trackPagePerformance();

// Sticky header functionality
function setupStickyHeader() {
  const stickyHeader = document.getElementById('stickyHeader');
  let lastScrollTop = 0;
  const scrollThreshold = 300; // Show sticky header after scrolling this many pixels
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > scrollThreshold) {
      stickyHeader.classList.add('visible');
    } else {
      stickyHeader.classList.remove('visible');
    }
    
    lastScrollTop = scrollTop;
  });
}

// Annual pricing toggle functionality
function setupPricingToggle() {
  const annualToggle = document.getElementById('annualToggle');
  if (!annualToggle) return;
  
  const monthlyOption = document.querySelector('.pricing-toggle__option:first-child');
  const annualOption = document.querySelector('.pricing-toggle__option:last-child');
  
  // Monthly prices
  const monthlyPrices = {
    essentials: 39,
    curator: 59,
    atelier: 99
  };
  
  // Annual prices (10 months for the price of 12)
  const annualPrices = {
    essentials: Math.round(monthlyPrices.essentials * 10),
    curator: Math.round(monthlyPrices.curator * 10),
    atelier: Math.round(monthlyPrices.atelier * 10)
  };
  
  annualToggle.addEventListener('change', () => {
    const isAnnual = annualToggle.checked;
    
    // Update active state for toggle options
    if (isAnnual) {
      monthlyOption.classList.remove('pricing-toggle__option--active');
      annualOption.classList.add('pricing-toggle__option--active');
    } else {
      annualOption.classList.remove('pricing-toggle__option--active');
      monthlyOption.classList.add('pricing-toggle__option--active');
    }
    
    // Update prices and period text
    const priceElements = document.querySelectorAll('.pricing-tier__price');
    const periodElements = document.querySelectorAll('.pricing-tier__period');
    
    priceElements.forEach((priceElement, index) => {
      const tier = ['essentials', 'curator', 'atelier'][index];
      const price = isAnnual ? annualPrices[tier] : monthlyPrices[tier];
      
      priceElement.innerHTML = `$${price}<span class="pricing-tier__period">${isAnnual ? '/year' : '/month'}</span>`;
    });
    
    // Update checkout links
    const ctaLinks = document.querySelectorAll('.pricing-tier__cta a');
    ctaLinks.forEach((link, index) => {
      const tier = ['essentials', 'curator', 'atelier'][index];
      const billingCycle = isAnnual ? 'annual' : 'monthly';
      link.href = `checkout.html?tier=${tier}&billing=${billingCycle}`;
    });
  });
}

// Initialize new functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Setup existing animations and effects
  setupAnimations();
  setupScrollEffects();
  setupImageEffects();
  setupLazyLoading();
  setupCTATracking();
  
  // Setup new functionality
  setupStickyHeader();
  setupPricingToggle();
  
  // Add smooth scrolling to all internal links
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

