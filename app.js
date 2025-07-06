// Smooth scrolling functionality
function scrollToWaitlist() {
  const waitlistSection = document.getElementById('waitlist');
  if (waitlistSection) {
    waitlistSection.scrollIntoView({ 
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
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showSuccessMessage(message) {
  // Remove any existing success message
  const existingMessage = document.querySelector('.success-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create new success message
  const successMessage = document.createElement('div');
  successMessage.className = 'success-message';
  successMessage.textContent = message;
  
  document.body.appendChild(successMessage);
  
  // Show message with animation
  setTimeout(() => {
    successMessage.classList.add('show');
  }, 100);
  
  // Hide message after 4 seconds
  setTimeout(() => {
    successMessage.classList.remove('show');
    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.parentNode.removeChild(successMessage);
      }
    }, 300);
  }, 4000);
}

function handleWaitlistSubmission(event) {
  event.preventDefault();
  
  const form = event.target;
  const email = form.email.value.trim();
  const name = form.name.value.trim();
  
  // Reset any previous error states
  const emailInput = form.email;
  const nameInput = form.name;
  emailInput.style.borderColor = '';
  nameInput.style.borderColor = '';
  
  // Validate email
  if (!email) {
    emailInput.style.borderColor = '#e74c3c';
    emailInput.focus();
    showErrorMessage('Please enter your email address');
    return;
  }
  
  if (!validateEmail(email)) {
    emailInput.style.borderColor = '#e74c3c';
    emailInput.focus();
    showErrorMessage('Please enter a valid email address');
    return;
  }
  
  // Simulate form submission
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  
  // Show loading state
  submitButton.textContent = 'Joining...';
  submitButton.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    // Reset form
    form.reset();
    
    // Reset button
    submitButton.textContent = originalText;
    submitButton.disabled = false;
    
    // Show success message
    const successText = name 
      ? `Thank you, ${name}! You're now on the waitlist. Check your email for exclusive updates!`
      : 'Thank you! You\'re now on the waitlist. Check your email for exclusive updates!';
    
    showSuccessMessage(successText);
    
    // Track conversion (placeholder for analytics)
    trackWaitlistSignup(email, name);
    
  }, 2000);
}

function showErrorMessage(message) {
  // Remove any existing error message
  const existingMessage = document.querySelector('.error-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create new error message
  const errorMessage = document.createElement('div');
  errorMessage.className = 'error-message';
  errorMessage.textContent = message;
  errorMessage.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #e74c3c;
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 8px 32px rgba(212, 165, 116, 0.2);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(errorMessage);
  
  // Show message with animation
  setTimeout(() => {
    errorMessage.style.transform = 'translateX(0)';
  }, 100);
  
  // Hide message after 3 seconds
  setTimeout(() => {
    errorMessage.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (errorMessage.parentNode) {
        errorMessage.parentNode.removeChild(errorMessage);
      }
    }, 300);
  }, 3000);
}

// Analytics tracking placeholder
function trackWaitlistSignup(email, name) {
  // Placeholder for analytics tracking
  console.log('Waitlist signup tracked:', { email, name, timestamp: new Date().toISOString() });
  
  // Here you would typically send data to your analytics service
  // Example: gtag('event', 'waitlist_signup', { email, name });
}

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
  const ctaButtons = document.querySelectorAll('.hero__cta, .waitlist__form button');
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
  // Setup form submission handler
  const waitlistForm = document.getElementById('waitlist-form');
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', handleWaitlistSubmission);
  }
  
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
  // Adjust any responsive elements if needed
  const heroContent = document.querySelector('.hero__content');
  if (heroContent && window.innerWidth < 768) {
    heroContent.style.textAlign = 'center';
  }
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