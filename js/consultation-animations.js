// TwinPixel Consultation Section Animations

document.addEventListener('DOMContentLoaded', function() {
  // Initialize consultation section animations
  initConsultationAnimations();
});

function initConsultationAnimations() {
  // Get consultation section elements
  const consultationSection = document.querySelector('.consultation-section');
  if (!consultationSection) return;

  // Add animation class to the section
  consultationSection.classList.add('animated-section');
  
  // Get consultation steps
  const steps = consultationSection.querySelectorAll('.consultation-step');
  
  // Add staggered animation to steps with reduced delay
  steps.forEach((step, index) => {
    // Set animation delay based on index (reduced from 0.3s to 0.2s)
    step.style.animationDelay = `${index * 0.2}s`;
    
    // Add hover effect to steps
    step.addEventListener('mouseenter', function() {
      this.classList.add('step-hover');
    });
    
    step.addEventListener('mouseleave', function() {
      this.classList.remove('step-hover');
    });
    
    // Get icon circle
    const iconCircle = step.querySelector('.consultation-icon-circle');
    if (iconCircle) {
      // Add subtle floating animation to icon circles
      iconCircle.classList.add('subtle-floating');
    }
    
    // Get step content
    const content = step.querySelector('.consultation-step-content');
    if (content) {
      // Add slide-in animation with reduced delay
      content.classList.add('slide-in');
      content.style.animationDelay = `${(index * 0.2) + 0.1}s`;
    }
  });
  
  // Add animation to CTA button
  const ctaButton = consultationSection.querySelector('.cta-button-container .btn');
  if (ctaButton) {
    ctaButton.classList.add('animated-button');
    
    // Add shine effect on hover
    ctaButton.addEventListener('mouseenter', function() {
      this.classList.add('shine');
    });
    
    ctaButton.addEventListener('mouseleave', function() {
      this.classList.remove('shine');
    });
    
    // Add pulse effect on click
    ctaButton.addEventListener('click', function() {
      this.classList.add('pulse');
      setTimeout(() => {
        this.classList.remove('pulse');
      }, 500);
    });
  }
  
  // Add scroll reveal animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe section title and subtitle
  const title = consultationSection.querySelector('.section-title');
  const subtitle = consultationSection.querySelector('.section-subtitle');
  
  if (title) {
    title.classList.add('fade-in-title');
    observer.observe(title);
  }
  
  if (subtitle) {
    subtitle.classList.add('fade-in-subtitle');
    observer.observe(subtitle);
  }
  
  // Also observe step content elements to make them visible when scrolled into view
  const stepContents = consultationSection.querySelectorAll('.consultation-step-content.slide-in');
  stepContents.forEach(content => {
    observer.observe(content);
  });
  
  // Add particle effect to the background
  createParticleEffect(consultationSection);
}

// Function to create particle effect
function createParticleEffect(container) {
  // Create particle container
  const particleContainer = document.createElement('div');
  particleContainer.className = 'particle-container';
  container.appendChild(particleContainer);
  
  // Create particles (reduced from 20 to 10)
  for (let i = 0; i < 10; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    // Random size
    const size = Math.random() * 10 + 5;
    
    // Random animation duration
    const duration = Math.random() * 20 + 10;
    
    // Random delay
    const delay = Math.random() * 5;
    
    // Set styles
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    
    // Add to container
    particleContainer.appendChild(particle);
  }
}

// Add CSS styles for animations
const style = document.createElement('style');
style.textContent = `
  /* Consultation Section Animation Styles */
  .animated-section {
    position: relative;
    overflow: hidden;
  }
  
  .fade-in-title {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  
  .fade-in-subtitle {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease, transform 0.8s ease;
    transition-delay: 0.3s;
  }
  
  .visible {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
  
  .consultation-step {
    transition: transform 0.4s ease, box-shadow 0.4s ease;
  }
  
  .step-hover {
    transform: translateY(-5px);
  }
  
  .step-pulse {
    animation: step-pulse 0.5s ease;
  }
  
  @keyframes step-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .consultation-icon-circle.subtle-floating {
    animation: subtle-float 4s ease-in-out infinite alternate;
  }
  
  @keyframes subtle-float {
    0% { transform: translateY(0); }
    100% { transform: translateY(-5px); }
  }
  
  .consultation-step-content.slide-in {
    opacity: 0;
    transform: translateX(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  
  .consultation-step-content.slide-in.visible {
    opacity: 1;
    transform: translateX(0);
  }
  
  
  .animated-button {
    position: relative;
    overflow: hidden;
  }
  
  .animated-button.shine::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: shine 1.5s ease;
  }
  
  @keyframes shine {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  
  .animated-button.pulse {
    animation: button-pulse 0.5s ease;
  }
  
  @keyframes button-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  /* Particle effect */
  .particle-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }
  
  .particle {
    position: absolute;
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    border-radius: 50%;
    opacity: 0.1;
    animation: particle-float linear infinite;
  }
  
  @keyframes particle-float {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 0.1;
    }
    50% {
      opacity: 0.3;
    }
    100% {
      transform: translateY(-100vh) rotate(360deg);
      opacity: 0;
    }
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .consultation-step-content.slide-in {
      transform: translateY(20px);
    }
    
    .consultation-step-content.content-hover {
      transform: translateY(-3px);
    }
  }
`;

document.head.appendChild(style);
