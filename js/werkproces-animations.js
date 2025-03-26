// TwinPixel Werkproces (Work Process) Animations

document.addEventListener('DOMContentLoaded', function() {
  // Initialize work process animations
  initWerkprocesAnimations();
});

function initWerkprocesAnimations() {
  // Get work process section
  const werkprocesSection = document.querySelector('.werkproces-section');
  if (!werkprocesSection) return;
  
  // Get process steps
  const steps = werkprocesSection.querySelectorAll('.process-step');
  
  // Set animation delay based on index
  steps.forEach((step, index) => {
    // Set step index as CSS variable for animation delays
    step.style.setProperty('--step-index', index);
    
    // Add hover effects
    step.addEventListener('mouseenter', function() {
      this.classList.add('step-hover');
    });
    
    step.addEventListener('mouseleave', function() {
      this.classList.remove('step-hover');
    });
  });
  
  // Add scroll reveal animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class to trigger animations
        entry.target.classList.add('in-view');
        // Once animation is triggered, no need to observe anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });
  
  // Observe the section to trigger animations when it comes into view
  observer.observe(werkprocesSection);
  
  // Add particle effect to the background
  createParticleEffect(werkprocesSection);
}

// Function to create particle effect
function createParticleEffect(container) {
  // Create particle container if it doesn't exist
  let particleContainer = container.querySelector('.particle-container');
  
  if (!particleContainer) {
    particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    container.appendChild(particleContainer);
    
    // Create particles
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random position
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      // Random size
      const size = Math.random() * 8 + 4;
      
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
}
