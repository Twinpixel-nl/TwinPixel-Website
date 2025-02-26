// TwinPixel Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check for language in URL hash first
    let savedLanguage = null;
    
    // Check if there's a language specified in the URL hash
    if (window.location.hash) {
        const hash = window.location.hash.substring(1); // Remove the # symbol
        if (hash === 'en' || hash === 'nl') {
            savedLanguage = hash;
        }
    }
    
    // If no language in URL hash, try to get from cookies as fallback
    if (!savedLanguage) {
        savedLanguage = getCookie('preferredLanguage');
    }
    
    // Default to 'nl' if no language is saved
    if (!savedLanguage) {
        savedLanguage = 'nl';
    }
    
    // Apply the saved language
    switchLanguage(savedLanguage, false);
    
    // Update language selector UI and add event listener
    const languageSelector = document.querySelector('.language-switcher select');
    if (languageSelector) {
        languageSelector.value = savedLanguage;
        
        // Add event listener to the select dropdown
        languageSelector.addEventListener('change', function() {
            switchLanguage(this.value);
        });
    }
    
    // Add event listeners to language buttons
    const langButtons = document.querySelectorAll('.lang-btn');
    if (langButtons.length > 0) {
        langButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent default anchor behavior
                const lang = this.getAttribute('href').substring(1); // Remove the # symbol
                console.log('Language button clicked:', lang);
                switchLanguage(lang);
            });
        });
    }
    
    // Listen for hash changes in the URL
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash === 'en' || hash === 'nl') {
            console.log('Hash changed to:', hash);
            switchLanguage(hash, false);
        }
    });
    
    // Highlight active page in navigation
    highlightActivePage();
    
    // Initialize animations
    initAnimations();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize header scroll effect
    initHeaderScroll();
    
    // Initialize testimonial slider (if exists)
    if (document.querySelector('.testimonial-slider')) {
        initTestimonialSlider();
    }
});

// Highlight the active page in the navigation menu
function highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Default to index.html if no page is specified
    const activePage = currentPage || 'index.html';
    
    // Find the corresponding navigation link and add the active class
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Check if the link href matches the current page
        if (linkHref === activePage || 
            (activePage === 'index.html' && linkHref === 'index.html') ||
            (linkHref.includes(activePage) && activePage !== 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize fade-in animations
function initAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe each fade element
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });
}

// Initialize smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't prevent default for language hash links
            if (this.getAttribute('href') === '#en' || this.getAttribute('href') === '#nl') {
                return;
            }
            
            // Don't prevent default for links to other pages
            if (this.getAttribute('href').includes('.html')) {
                return;
            }
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.nav-links');
                const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    if (mobileMenuOverlay) {
                        mobileMenuOverlay.classList.remove('active');
                    }
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            if (mobileMenuOverlay) {
                mobileMenuOverlay.classList.toggle('active');
            }
            
            // Toggle menu icon (hamburger/close)
            const isOpen = navLinks.classList.contains('active');
            mobileMenuBtn.innerHTML = isOpen ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
        });
        
        // Close menu when clicking overlay
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        }
    }
}

// Initialize header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Simple testimonial slider
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    const slides = slider.querySelectorAll('.testimonial-card');
    let currentSlide = 0;
    
    // Hide all slides except the first one
    slides.forEach((slide, index) => {
        if (index !== 0) {
            slide.style.display = 'none';
        }
    });
    
    // Function to show next slide
    function nextSlide() {
        slides[currentSlide].style.display = 'none';
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].style.display = 'block';
    }
    
    // Auto-advance slides every 5 seconds
    setInterval(nextSlide, 5000);
}

// Translations for the website
const translations = {
    'nl': {
        // Navigation
        'nav_home': 'Home',
        'nav_about': 'Over ons',
        'nav_services': 'Diensten',
        'nav_portfolio': 'Portfolio',
        'nav_pricing': 'Prijzen',
        'nav_contact': 'Contact',
        
        // Common elements
        'cta_title': 'Klaar om je online aanwezigheid naar een hoger niveau te tillen?',
        'cta_subtitle': 'Neem contact met ons op voor een vrijblijvend gesprek over hoe wij je kunnen helpen.',
        'cta_button': 'Neem contact op',
        'copyright': '© 2025 TwinPixel. Alle rechten voorbehouden.'
    },
    'en': {
        // Navigation
        'nav_home': 'Home',
        'nav_about': 'About us',
        'nav_services': 'Services',
        'nav_portfolio': 'Portfolio',
        'nav_pricing': 'Pricing',
        'nav_contact': 'Contact',
        
        // Common elements
        'cta_title': 'Ready to take your online presence to the next level?',
        'cta_subtitle': 'Contact us for a free consultation about how we can help you.',
        'cta_button': 'Contact us',
        'copyright': '© 2025 TwinPixel. All rights reserved.'
    }
};

// Helper function to set a cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Helper function to get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Language switcher functionality
function switchLanguage(lang, updateHash = true) {
    console.log('Switching language to:', lang);
    
    // Store the selected language in a cookie (valid for 30 days)
    setCookie('preferredLanguage', lang, 30);
    
    // Update URL hash if needed
    if (updateHash) {
        window.location.hash = lang;
    }
    
    // Update the HTML lang attribute
    document.documentElement.lang = lang;
    console.log('Updated HTML lang attribute to:', document.documentElement.lang);
    
    // Update the active state of language buttons if they exist
    const langButtons = document.querySelectorAll('.lang-btn');
    if (langButtons.length > 0) {
        langButtons.forEach(btn => {
            if (btn.textContent.toLowerCase() === lang.toLowerCase()) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Update the select dropdown if it exists
    const langSelect = document.querySelector('.language-switcher select');
    if (langSelect) {
        langSelect.value = lang;
        console.log('Updated select dropdown value to:', langSelect.value);
    }
    
    // Update the content on the page
    updatePageContent(lang);
}

// Function to update the content on the page based on the selected language
function updatePageContent(lang) {
    const t = translations[lang];
    if (!t) return; // If translations for this language don't exist, do nothing
    
    // Update navigation links
    const navLinks = document.querySelectorAll('.nav-links li a');
    if (navLinks.length > 0) {
        const navItems = ['nav_home', 'nav_about', 'nav_services', 'nav_portfolio', 'nav_pricing', 'nav_contact'];
        navLinks.forEach((link, index) => {
            if (index < navItems.length) {
                link.textContent = t[navItems[index]];
            }
        });
    }
    
    // Update footer navigation links
    const footerLinks = document.querySelectorAll('.footer-links li a');
    if (footerLinks.length > 0) {
        const navItems = ['nav_home', 'nav_about', 'nav_services', 'nav_portfolio', 'nav_pricing', 'nav_contact'];
        footerLinks.forEach((link, index) => {
            if (index < navItems.length) {
                link.textContent = t[navItems[index]];
            }
        });
    }
    
    // Update CTA section
    const ctaTitle = document.querySelector('.cta-section h2');
    if (ctaTitle) {
        ctaTitle.textContent = t.cta_title;
    }
    
    const ctaText = document.querySelector('.cta-section p');
    if (ctaText) {
        ctaText.textContent = t.cta_subtitle;
    }
    
    const ctaButton = document.querySelector('.cta-section .btn');
    if (ctaButton) {
        ctaButton.textContent = t.cta_button;
    }
    
    // Update copyright
    const copyright = document.querySelector('.copyright');
    if (copyright) {
        copyright.textContent = t.copyright;
    }
    
    // Update page-specific content based on the current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log('Current page:', currentPage);
    
    if (currentPage.includes('portfolio')) {
        updatePortfolioPage(lang);
    } else if (currentPage.includes('about')) {
        updateAboutPage(lang);
    } else if (currentPage.includes('services')) {
        updateServicesPage(lang);
    } else if (currentPage.includes('pricing')) {
        updatePricingPage(lang);
    } else if (currentPage.includes('contact')) {
        updateContactPage(lang);
    } else if (currentPage.includes('index') || currentPage === '') {
        updateHomePage(lang);
        console.log('Updating home page');
    } else {
        // Default to home page if no specific page is matched
        updateHomePage(lang);
        console.log('No specific page matched, defaulting to home page');
    }
}

// Function to update the home page content
function updateHomePage(lang) {
    // Update hero section
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        heroTitle.innerHTML = lang === 'nl' 
            ? 'Jouw <span>unieke</span> website.<br>Snel, op maat & betaalbaar.'
            : 'Your <span>unique</span> website.<br>Fast, custom & affordable.';
    }
    
    const heroText = document.querySelector('.hero-content p');
    if (heroText) {
        heroText.textContent = lang === 'nl'
            ? 'TwinPixel levert professionele websites die perfect aansluiten bij jouw bedrijf. Geen standaard templates, maar maatwerk met persoonlijke aandacht.'
            : 'TwinPixel delivers professional websites that perfectly match your business. No standard templates, but custom work with personal attention.';
    }
    
    const heroButton = document.querySelector('.hero-content .btn');
    if (heroButton) {
        heroButton.textContent = lang === 'nl'
            ? 'Vraag een gratis consult aan'
            : 'Request a free consultation';
    }
    
    // Update about section
    const aboutTitle = document.querySelector('#over-ons-preview .section-title h2');
    if (aboutTitle) {
        aboutTitle.textContent = lang === 'nl' ? 'Over TwinPixel' : 'About TwinPixel';
    }
    
    const storyTitle = document.querySelector('#over-ons-preview .about-text h3:first-of-type');
    if (storyTitle) {
        storyTitle.textContent = lang === 'nl' ? 'Het verhaal achter TwinPixel' : 'The story behind TwinPixel';
    }
    
    const storyText = document.querySelector('#over-ons-preview .about-text p');
    if (storyText) {
        storyText.textContent = lang === 'nl'
            ? 'TwinPixel is opgericht door twee studenten met een passie voor webdesign en development. Wat begon als een hobby tijdens onze studie, is uitgegroeid tot een professioneel webdesignbureau met een duidelijke missie: betaalbare, hoogwaardige websites leveren aan ZZP\'ers en MKB\'ers.'
            : 'TwinPixel was founded by two students with a passion for web design and development. What started as a hobby during our studies has grown into a professional web design agency with a clear mission: to deliver affordable, high-quality websites to freelancers and small businesses.';
    }
    
    const uniqueTitle = document.querySelector('#over-ons-preview .about-text h3:nth-of-type(2)');
    if (uniqueTitle) {
        uniqueTitle.textContent = lang === 'nl' ? 'Waarom wij uniek zijn' : 'Why we are unique';
    }
    
    const uniqueItems = document.querySelectorAll('#over-ons-preview .about-text ul li');
    if (uniqueItems.length >= 4) {
        if (uniqueItems[0]) {
            uniqueItems[0].innerHTML = lang === 'nl'
                ? '<i class="fas fa-check-circle"></i> <strong>Snelle levering</strong> - Geen lange wachttijden, wij leveren binnen afgesproken deadlines.'
                : '<i class="fas fa-check-circle"></i> <strong>Fast delivery</strong> - No long waiting times, we deliver within agreed deadlines.';
        }
        if (uniqueItems[1]) {
            uniqueItems[1].innerHTML = lang === 'nl'
                ? '<i class="fas fa-check-circle"></i> <strong>100% maatwerk</strong> - Geen standaard templates, maar een uniek design dat past bij jouw merk.'
                : '<i class="fas fa-check-circle"></i> <strong>100% custom</strong> - No standard templates, but a unique design that matches your brand.';
        }
        if (uniqueItems[2]) {
            uniqueItems[2].innerHTML = lang === 'nl'
                ? '<i class="fas fa-check-circle"></i> <strong>Scherpe prijzen</strong> - Professionele kwaliteit zonder de hoge kosten van grote bureaus.'
                : '<i class="fas fa-check-circle"></i> <strong>Competitive prices</strong> - Professional quality without the high costs of large agencies.';
        }
        if (uniqueItems[3]) {
            uniqueItems[3].innerHTML = lang === 'nl'
                ? '<i class="fas fa-check-circle"></i> <strong>Persoonlijke aanpak</strong> - Direct contact met de designers en developers die aan jouw project werken.'
                : '<i class="fas fa-check-circle"></i> <strong>Personal approach</strong> - Direct contact with the designers and developers working on your project.';
        }
    }
    
    const aboutButton = document.querySelector('#over-ons-preview .cta-button .btn');
    if (aboutButton) {
        aboutButton.textContent = lang === 'nl' ? 'Lees meer over ons' : 'Read more about us';
    }
    
    // Update testimonials section
    const testimonialsTitle = document.querySelector('#testimonials .section-title h2');
    if (testimonialsTitle) {
        testimonialsTitle.textContent = lang === 'nl' ? 'Wat Klanten Zeggen' : 'What Clients Say';
    }
    
    // Update testimonial cards
    const testimonialCards = document.querySelectorAll('#testimonials .testimonial-card');
    if (testimonialCards.length >= 3) {
        // First testimonial
        const testimonial1Text = testimonialCards[0].querySelector('.testimonial-text');
        if (testimonial1Text) {
            testimonial1Text.textContent = lang === 'nl'
                ? '"TwinPixel heeft onze verwachtingen overtroffen. Ze hebben niet alleen een prachtige website opgeleverd, maar ook meegedacht over onze online strategie. De website is snel, gebruiksvriendelijk en ziet er fantastisch uit!"'
                : '"TwinPixel exceeded our expectations. They not only delivered a beautiful website, but also thought along with our online strategy. The website is fast, user-friendly, and looks fantastic!"';
        }
        
        const testimonial1Author = testimonialCards[0].querySelector('.testimonial-author');
        if (testimonial1Author) {
            testimonial1Author.textContent = lang === 'nl' ? 'Lisa Jansen' : 'Lisa Jansen';
        }
        
        const testimonial1Company = testimonialCards[0].querySelector('.testimonial-company');
        if (testimonial1Company) {
            testimonial1Company.textContent = lang === 'nl' ? 'Eigenaar, Bloemen & Zo' : 'Owner, Bloemen & Zo';
        }
        
        // Second testimonial
        const testimonial2Text = testimonialCards[1].querySelector('.testimonial-text');
        if (testimonial2Text) {
            testimonial2Text.textContent = lang === 'nl'
                ? '"Als ZZP\'er had ik een professionele website nodig, maar ik had een beperkt budget. TwinPixel heeft me een website op maat gegeven die er professioneel uitziet zonder de hoge kosten. Ik krijg regelmatig complimenten over mijn site!"'
                : '"As a freelancer, I needed a professional website, but I had a limited budget. TwinPixel gave me a custom website that looks professional without the high costs. I regularly receive compliments about my site!"';
        }
        
        const testimonial2Author = testimonialCards[1].querySelector('.testimonial-author');
        if (testimonial2Author) {
            testimonial2Author.textContent = lang === 'nl' ? 'Mark de Vries' : 'Mark de Vries';
        }
        
        const testimonial2Company = testimonialCards[1].querySelector('.testimonial-company');
        if (testimonial2Company) {
            testimonial2Company.textContent = lang === 'nl' ? 'Freelance Fotograaf' : 'Freelance Photographer';
        }
        
        // Third testimonial
        const testimonial3Text = testimonialCards[2].querySelector('.testimonial-text');
        if (testimonial3Text) {
            testimonial3Text.textContent = lang === 'nl'
                ? '"De snelheid waarmee TwinPixel werkt is indrukwekkend. Binnen twee weken hadden we een volledig functionerende webshop die er geweldig uitziet. De communicatie was uitstekend en ze waren altijd bereid om aanpassingen te maken."'
                : '"The speed at which TwinPixel works is impressive. Within two weeks, we had a fully functioning webshop that looks great. The communication was excellent, and they were always willing to make adjustments."';
        }
        
        const testimonial3Author = testimonialCards[2].querySelector('.testimonial-author');
        if (testimonial3Author) {
            testimonial3Author.textContent = lang === 'nl' ? 'Sandra Bakker' : 'Sandra Bakker';
        }
        
        const testimonial3Company = testimonialCards[2].querySelector('.testimonial-company');
        if (testimonial3Company) {
            testimonial3Company.textContent = lang === 'nl' ? 'Oprichter, EcoStyle' : 'Founder, EcoStyle';
        }
    }
    
    // Update services section
    const servicesTitle = document.querySelector('#diensten-preview .section-title h2');
    if (servicesTitle) {
        servicesTitle.textContent = lang === 'nl' ? 'Onze Diensten' : 'Our Services';
    }
    
    // Update service cards
    const serviceCards = document.querySelectorAll('#diensten-preview .service-card');
    if (serviceCards.length >= 3) {
        // Web Design card
        const webdesignTitle = serviceCards[0].querySelector('h3');
        if (webdesignTitle) {
            webdesignTitle.textContent = lang === 'nl' ? 'Webdesign' : 'Web Design';
        }
        
        const webdesignDesc = serviceCards[0].querySelector('p');
        if (webdesignDesc) {
            webdesignDesc.textContent = lang === 'nl'
                ? 'Op maat gemaakte websites die perfect aansluiten bij jouw merk en doelstellingen. Modern, responsive en gebruiksvriendelijk.'
                : 'Custom-made websites that perfectly match your brand and objectives. Modern, responsive, and user-friendly.';
        }
        
        // SEO card
        const seoTitle = serviceCards[1].querySelector('h3');
        if (seoTitle) {
            seoTitle.textContent = lang === 'nl' ? 'SEO-optimalisatie' : 'SEO Optimization';
        }
        
        const seoDesc = serviceCards[1].querySelector('p');
        if (seoDesc) {
            seoDesc.textContent = lang === 'nl'
                ? 'Zorg dat je gevonden wordt door potentiële klanten. Wij optimaliseren je website voor zoekmachines met snelle laadtijden en mobile-first design.'
                : 'Make sure you are found by potential customers. We optimize your website for search engines with fast loading times and mobile-first design.';
        }
        
        // UX/UI card
        const uxTitle = serviceCards[2].querySelector('h3');
        if (uxTitle) {
            uxTitle.textContent = lang === 'nl' ? 'UX/UI-Design' : 'UX/UI Design';
        }
        
        const uxDesc = serviceCards[2].querySelector('p');
        if (uxDesc) {
            uxDesc.textContent = lang === 'nl'
                ? 'Gebruiksvriendelijke en visueel aantrekkelijke interfaces die bezoekers omzetten in klanten. Intuïtief, toegankelijk en conversiegericht.'
                : 'User-friendly and visually appealing interfaces that convert visitors into customers. Intuitive, accessible, and conversion-oriented.';
        }
    }
    
    const servicesButton = document.querySelector('#diensten-preview .cta-button .btn');
    if (servicesButton) {
        servicesButton.textContent = lang === 'nl' ? 'Bekijk al onze diensten' : 'View all our services';
    }
    
    // Update portfolio section
    const portfolioTitle = document.querySelector('#portfolio-preview .section-title h2');
    if (portfolioTitle) {
        portfolioTitle.textContent = lang === 'nl' ? 'Ons Portfolio' : 'Our Portfolio';
    }
    
    const portfolioIntro = document.querySelector('#portfolio-preview .portfolio-intro p');
    if (portfolioIntro) {
        portfolioIntro.textContent = lang === 'nl'
            ? 'Bij TwinPixel zijn we trots op de websites die we hebben ontworpen en ontwikkeld voor onze klanten. Elk project is uniek en op maat gemaakt om aan de specifieke behoeften en doelstellingen van onze klanten te voldoen.'
            : 'At TwinPixel, we are proud of the websites we have designed and developed for our clients. Each project is unique and tailored to meet the specific needs and objectives of our clients.';
    }
    
    // Update portfolio items
    const portfolioItems = document.querySelectorAll('#portfolio-preview .portfolio-item');
    if (portfolioItems.length >= 3) {
        // First portfolio item
        const portfolio1Title = portfolioItems[0].querySelector('.portfolio-title');
        if (portfolio1Title) {
            portfolio1Title.textContent = lang === 'nl' ? 'De wet van staal' : 'De wet van staal';
        }
        
        const portfolio1Category = portfolioItems[0].querySelector('.portfolio-category');
        if (portfolio1Category) {
            portfolio1Category.textContent = lang === 'nl' 
                ? 'Informatieve website met contact pagina' 
                : 'Informative website with contact page';
        }
        
        // Second portfolio item
        const portfolio2Title = portfolioItems[1].querySelector('.portfolio-title');
        if (portfolio2Title) {
            portfolio2Title.textContent = lang === 'nl' ? 'studievereniging NULL' : 'student association NULL';
        }
        
        const portfolio2Category = portfolioItems[1].querySelector('.portfolio-category');
        if (portfolio2Category) {
            portfolio2Category.textContent = lang === 'nl' 
                ? 'Website met database en CMS systeem' 
                : 'Website with database and CMS system';
        }
        
        // Third portfolio item
        const portfolio3Title = portfolioItems[2].querySelector('.portfolio-title');
        if (portfolio3Title) {
            portfolio3Title.textContent = lang === 'nl' ? 'By Britt Nails' : 'By Britt Nails';
        }
        
        const portfolio3Category = portfolioItems[2].querySelector('.portfolio-category');
        if (portfolio3Category) {
            portfolio3Category.textContent = lang === 'nl' 
                ? 'Nagelstyliste Website' 
                : 'Nail Stylist Website';
        }
    }
    
    const portfolioButton = document.querySelector('#portfolio-preview .cta-button .btn');
    if (portfolioButton) {
        portfolioButton.textContent = lang === 'nl' ? 'Bekijk ons volledige portfolio' : 'View our full portfolio';
    }
    
    // Update pricing section
    const pricingTitle = document.querySelector('#prijzen-preview .section-title h2');
    if (pricingTitle) {
        pricingTitle.textContent = lang === 'nl' ? 'Onze Prijzen' : 'Our Pricing';
    }
    
    const pricingIntro = document.querySelector('#prijzen-preview .pricing-intro p');
    if (pricingIntro) {
        pricingIntro.textContent = lang === 'nl'
            ? 'Bij TwinPixel werken we met een hybride prijsmodel: een eenmalig bedrag voor het maken van je website, en daarna een maandelijks bedrag voor hosting en kleine updates. Zo weet je precies waar je aan toe bent, zonder verrassingen achteraf.'
            : 'At TwinPixel, we work with a hybrid pricing model: a one-time fee for creating your website, and then a monthly fee for hosting and small updates. This way, you know exactly what to expect, without surprises afterward.';
    }
    
    // Update pricing cards
    const pricingCards = document.querySelectorAll('#prijzen-preview .pricing-card');
    if (pricingCards.length >= 3) {
        // Starter package
        const starterTitle = pricingCards[0].querySelector('.pricing-title');
        if (starterTitle) {
            starterTitle.textContent = lang === 'nl' ? 'Starter' : 'Starter';
        }
        
        const starterPrice = pricingCards[0].querySelector('.pricing-price span');
        if (starterPrice) {
            starterPrice.textContent = lang === 'nl' ? 'eenmalig' : 'one-time';
        }
        
        const starterHosting = pricingCards[0].querySelector('div[style*="margin-top: 5px"]');
        if (starterHosting) {
            starterHosting.textContent = lang === 'nl'
                ? '+ €5/maand voor hosting & updates'
                : '+ €5/month for hosting & updates';
        }
        
        const starterFeatures = pricingCards[0].querySelectorAll('.pricing-features li');
        if (starterFeatures.length >= 4) {
            if (starterFeatures[0]) {
                starterFeatures[0].textContent = lang === 'nl' ? 'One-page website' : 'One-page website';
            }
            if (starterFeatures[1]) {
                starterFeatures[1].textContent = lang === 'nl' ? 'Responsive design' : 'Responsive design';
            }
            if (starterFeatures[2]) {
                starterFeatures[2].textContent = lang === 'nl' ? 'Basis-SEO' : 'Basic SEO';
            }
            if (starterFeatures[3]) {
                starterFeatures[3].textContent = lang === 'nl' ? 'Contactformulier' : 'Contact form';
            }
        }
        
        const starterButton = pricingCards[0].querySelector('.btn');
        if (starterButton) {
            starterButton.textContent = lang === 'nl' ? 'Meer informatie' : 'More information';
        }
        
        // Standard package
        const standardTitle = pricingCards[1].querySelector('.pricing-title');
        if (standardTitle) {
            standardTitle.textContent = lang === 'nl' ? 'Standaard' : 'Standard';
        }
        
        const standardPrice = pricingCards[1].querySelector('.pricing-price span');
        if (standardPrice) {
            standardPrice.textContent = lang === 'nl' ? 'eenmalig' : 'one-time';
        }
        
        const standardHosting = pricingCards[1].querySelector('div[style*="margin-top: 5px"]');
        if (standardHosting) {
            standardHosting.textContent = lang === 'nl'
                ? '+ €10/maand voor hosting & updates'
                : '+ €10/month for hosting & updates';
        }
        
        const standardFeatures = pricingCards[1].querySelectorAll('.pricing-features li');
        if (standardFeatures.length >= 4) {
            if (standardFeatures[0]) {
                standardFeatures[0].textContent = lang === 'nl' ? 'Meerdere pagina\'s' : 'Multiple pages';
            }
            if (standardFeatures[1]) {
                standardFeatures[1].textContent = lang === 'nl' ? 'Responsive design' : 'Responsive design';
            }
            if (standardFeatures[2]) {
                standardFeatures[2].textContent = lang === 'nl' ? 'SEO-optimalisatie' : 'SEO optimization';
            }
            if (standardFeatures[3]) {
                standardFeatures[3].textContent = lang === 'nl' ? 'Contactformulier' : 'Contact form';
            }
        }
        
        const standardButton = pricingCards[1].querySelector('.btn');
        if (standardButton) {
            standardButton.textContent = lang === 'nl' ? 'Meer informatie' : 'More information';
        }
        
        // Premium package
        const premiumTitle = pricingCards[2].querySelector('.pricing-title');
        if (premiumTitle) {
            premiumTitle.textContent = lang === 'nl' ? 'Premium' : 'Premium';
        }
        
        const premiumPrice = pricingCards[2].querySelector('.pricing-price span');
        if (premiumPrice) {
            premiumPrice.textContent = lang === 'nl' ? 'eenmalig' : 'one-time';
        }
        
        const premiumHosting = pricingCards[2].querySelector('div[style*="margin-top: 5px"]');
        if (premiumHosting) {
            premiumHosting.textContent = lang === 'nl'
                ? '+ €20/maand voor hosting & updates'
                : '+ €20/month for hosting & updates';
        }
        
        const premiumFeatures = pricingCards[2].querySelectorAll('.pricing-features li');
        if (premiumFeatures.length >= 4) {
            if (premiumFeatures[0]) {
                premiumFeatures[0].textContent = lang === 'nl' ? 'High-end design' : 'High-end design';
            }
            if (premiumFeatures[1]) {
                premiumFeatures[1].textContent = lang === 'nl' ? 'Responsive website' : 'Responsive website';
            }
            if (premiumFeatures[2]) {
                premiumFeatures[2].textContent = lang === 'nl' ? 'Geavanceerde SEO' : 'Advanced SEO';
            }
            if (premiumFeatures[3]) {
                premiumFeatures[3].textContent = lang === 'nl' ? 'Content management systeem' : 'Content management system';
            }
        }
        
        const premiumButton = pricingCards[2].querySelector('.btn');
        if (premiumButton) {
            premiumButton.textContent = lang === 'nl' ? 'Meer informatie' : 'More information';
        }
    }
    
    const pricingButton = document.querySelector('#prijzen-preview .cta-button .btn');
    if (pricingButton) {
        pricingButton.textContent = lang === 'nl' ? 'Bekijk alle prijzen en pakketten' : 'View all prices and packages';
    }
}

// Function to update the portfolio page content
function updatePortfolioPage(lang) {
    // Update portfolio page title
    const pageHeader = document.querySelector('.page-header h1');
    if (pageHeader) {
        pageHeader.textContent = lang === 'nl' ? 'Ons Portfolio' : 'Our Portfolio';
    }
    
    // Update portfolio intro title
    const portfolioIntroTitle = document.querySelector('.portfolio-intro h2');
    if (portfolioIntroTitle) {
        portfolioIntroTitle.textContent = lang === 'nl' ? 'Ontdek onze projecten' : 'Discover our projects';
    }
    
    // Update portfolio intro paragraphs
    const portfolioIntroParagraphs = document.querySelectorAll('.portfolio-intro p');
    if (portfolioIntroParagraphs.length >= 2) {
        if (portfolioIntroParagraphs[0]) {
            portfolioIntroParagraphs[0].textContent = lang === 'nl' 
                ? 'Bij TwinPixel zijn we trots op de websites die we hebben ontworpen en ontwikkeld voor onze klanten. Elk project is uniek en op maat gemaakt om aan de specifieke behoeften en doelstellingen van onze klanten te voldoen.'
                : 'At TwinPixel, we are proud of the websites we have designed and developed for our clients. Each project is unique and tailored to meet the specific needs and objectives of our clients.';
        }
        if (portfolioIntroParagraphs[1]) {
            portfolioIntroParagraphs[1].textContent = lang === 'nl'
                ? 'Bekijk hieronder een selectie van onze recente projecten en laat je inspireren door wat wij voor jou kunnen betekenen.'
                : 'Take a look at a selection of our recent projects below and get inspired by what we can do for you.';
        }
    }
    
    // Update portfolio filters
    const portfolioFilters = document.querySelectorAll('.filter-btn');
    if (portfolioFilters.length > 0) {
        if (portfolioFilters[0]) {
            portfolioFilters[0].textContent = lang === 'nl' ? 'Alle projecten' : 'All projects';
        }
        if (portfolioFilters[1]) {
            portfolioFilters[1].textContent = lang === 'nl' ? 'Webshops' : 'Webshops';
        }
        if (portfolioFilters[2]) {
            portfolioFilters[2].textContent = lang === 'nl' ? 'Zakelijke websites' : 'Business websites';
        }
        if (portfolioFilters[3]) {
            portfolioFilters[3].textContent = lang === 'nl' ? 'Portfolio websites' : 'Portfolio websites';
        }
        if (portfolioFilters[4]) {
            portfolioFilters[4].textContent = lang === 'nl' ? 'Blogs' : 'Blogs';
        }
    }
}

// Function to update the about page content
function updateAboutPage(lang) {
    // Update page title
    const pageHeader = document.querySelector('.page-header h1');
    if (pageHeader) {
        pageHeader.textContent = lang === 'nl' ? 'Over TwinPixel' : 'About TwinPixel';
    }
    
    // Update story section
    const storyTitle = document.querySelector('.about-content h2:first-of-type');
    if (storyTitle) {
        storyTitle.textContent = lang === 'nl' ? 'Het verhaal achter TwinPixel' : 'The story behind TwinPixel';
    }
    
    const storyParagraphs = document.querySelectorAll('.about-content p');
    if (storyParagraphs.length >= 6) {
        // First paragraph
        if (storyParagraphs[0]) {
            storyParagraphs[0].textContent = lang === 'nl'
                ? 'TwinPixel is opgericht door Emma de Heer (UX designer) en Twan Meurs (developer), twee studenten met een passie voor webdesign en development. Samen hebben we ook uitgebreide business expertise, waardoor we niet alleen technisch sterke websites bouwen, maar ook websites die echt bijdragen aan het succes van jouw bedrijf.'
                : 'TwinPixel was founded by Emma de Heer (UX designer) and Twan Meurs (developer), two students with a passion for web design and development. Together we also have extensive business expertise, which means we not only build technically strong websites, but also websites that truly contribute to the success of your business.';
        }
        
        // Second paragraph
        if (storyParagraphs[1]) {
            storyParagraphs[1].textContent = lang === 'nl'
                ? 'Wat begon als een hobby tijdens onze studie, is uitgegroeid tot een professioneel webdesignbureau met een duidelijke missie: betaalbare, hoogwaardige websites leveren aan ZZP\'ers en MKB\'ers.'
                : 'What started as a hobby during our studies has grown into a professional web design agency with a clear mission: to deliver affordable, high-quality websites to freelancers and small businesses.';
        }
        
        // Third paragraph
        if (storyParagraphs[2]) {
            storyParagraphs[2].textContent = lang === 'nl'
                ? 'Wij geloven dat elke ondernemer recht heeft op een professionele online aanwezigheid, zonder de hoge kosten die grote bureaus vaak rekenen. Door onze efficiënte werkwijze en focus op wat écht belangrijk is, kunnen wij kwalitatief hoogwaardige websites leveren tegen betaalbare prijzen.'
                : 'We believe that every entrepreneur deserves a professional online presence, without the high costs that large agencies often charge. Through our efficient way of working and focus on what really matters, we can deliver high-quality websites at affordable prices.';
        }
    }
    
    // Update vision section
    const visionTitle = document.querySelector('.about-content h2:nth-of-type(2)');
    if (visionTitle) {
        visionTitle.textContent = lang === 'nl' ? 'Onze visie' : 'Our vision';
    }
    
    const visionParagraph = document.querySelector('.about-content h2:nth-of-type(2) + p');
    if (visionParagraph) {
        visionParagraph.textContent = lang === 'nl'
            ? 'Wij zien een wereld waarin elke ondernemer, groot of klein, toegang heeft tot professionele webdesign diensten die hun bedrijf helpen groeien. Geen generieke templates, maar op maat gemaakte websites die perfect aansluiten bij de identiteit en doelstellingen van jouw bedrijf.'
            : 'We envision a world where every entrepreneur, big or small, has access to professional web design services that help their business grow. No generic templates, but custom-made websites that perfectly match the identity and objectives of your business.';
    }
    
    // Update approach section
    const approachTitle = document.querySelector('.about-content h2:nth-of-type(3)');
    if (approachTitle) {
        approachTitle.textContent = lang === 'nl' ? 'Onze aanpak' : 'Our approach';
    }
    
    const approachParagraphs = document.querySelectorAll('.about-content h2:nth-of-type(3) ~ p');
    if (approachParagraphs.length >= 2) {
        if (approachParagraphs[0]) {
            approachParagraphs[0].textContent = lang === 'nl'
                ? 'Bij TwinPixel geloven we in een persoonlijke aanpak. We nemen de tijd om jouw bedrijf, doelgroep en doelstellingen te begrijpen voordat we aan de slag gaan. Dit stelt ons in staat om een website te creëren die niet alleen mooi is, maar ook effectief in het bereiken van jouw doelen.'
                : 'At TwinPixel, we believe in a personal approach. We take the time to understand your business, target audience, and objectives before we get started. This allows us to create a website that is not only beautiful, but also effective in achieving your goals.';
        }
        
        if (approachParagraphs[1]) {
            approachParagraphs[1].textContent = lang === 'nl'
                ? 'Onze werkwijze is transparant en direct. Je hebt altijd rechtstreeks contact met de designers en developers die aan jouw project werken, zonder tussenlagen of account managers. Dit zorgt voor snellere communicatie, kortere lijnen en uiteindelijk een beter eindresultaat.'
                : 'Our way of working is transparent and direct. You always have direct contact with the designers and developers working on your project, without intermediate layers or account managers. This ensures faster communication, shorter lines, and ultimately a better end result.';
        }
    }
    
    // Update "Why choose TwinPixel?" section
    const whyChooseTitle = document.querySelector('.about-features .section-title');
    if (whyChooseTitle) {
        whyChooseTitle.textContent = lang === 'nl' ? 'Waarom kiezen voor TwinPixel?' : 'Why choose TwinPixel?';
    }
    
    // Update feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length >= 6) {
        // Fast delivery
        const fastDeliveryTitle = featureCards[0].querySelector('h3');
        if (fastDeliveryTitle) {
            fastDeliveryTitle.textContent = lang === 'nl' ? 'Snelle levering' : 'Fast delivery';
        }
        
        const fastDeliveryDesc = featureCards[0].querySelector('p');
        if (fastDeliveryDesc) {
            fastDeliveryDesc.textContent = lang === 'nl'
                ? 'Geen lange wachttijden. Wij leveren binnen afgesproken deadlines, zodat jij snel online kunt gaan.'
                : 'No long waiting times. We deliver within agreed deadlines, so you can go online quickly.';
        }
        
        // 100% custom
        const customTitle = featureCards[1].querySelector('h3');
        if (customTitle) {
            customTitle.textContent = lang === 'nl' ? '100% maatwerk' : '100% custom';
        }
        
        const customDesc = featureCards[1].querySelector('p');
        if (customDesc) {
            customDesc.textContent = lang === 'nl'
                ? 'Geen standaard templates, maar een uniek design dat perfect past bij jouw merk en doelstellingen.'
                : 'No standard templates, but a unique design that perfectly matches your brand and objectives.';
        }
        
        // Competitive prices
        const pricesTitle = featureCards[2].querySelector('h3');
        if (pricesTitle) {
            pricesTitle.textContent = lang === 'nl' ? 'Scherpe prijzen' : 'Competitive prices';
        }
        
        const pricesDesc = featureCards[2].querySelector('p');
        if (pricesDesc) {
            pricesDesc.textContent = lang === 'nl'
                ? 'Professionele kwaliteit zonder de hoge kosten van grote bureaus. Transparante prijzen, geen verborgen kosten.'
                : 'Professional quality without the high costs of large agencies. Transparent pricing, no hidden costs.';
        }
        
        // Personal approach
        const approachCardTitle = featureCards[3].querySelector('h3');
        if (approachCardTitle) {
            approachCardTitle.textContent = lang === 'nl' ? 'Persoonlijke aanpak' : 'Personal approach';
        }
        
        const approachCardDesc = featureCards[3].querySelector('p');
        if (approachCardDesc) {
            approachCardDesc.textContent = lang === 'nl'
                ? 'Direct contact met de designers en developers die aan jouw project werken. Korte lijnen, snelle communicatie.'
                : 'Direct contact with the designers and developers working on your project. Short lines, fast communication.';
        }
        
        // Responsive design
        const responsiveTitle = featureCards[4].querySelector('h3');
        if (responsiveTitle) {
            responsiveTitle.textContent = lang === 'nl' ? 'Responsive design' : 'Responsive design';
        }
        
        const responsiveDesc = featureCards[4].querySelector('p');
        if (responsiveDesc) {
            responsiveDesc.textContent = lang === 'nl'
                ? 'Alle websites zijn volledig responsive en werken perfect op alle apparaten, van desktop tot smartphone.'
                : 'All websites are fully responsive and work perfectly on all devices, from desktop to smartphone.';
        }
        
        // SEO optimized
        const seoTitle = featureCards[5].querySelector('h3');
        if (seoTitle) {
            seoTitle.textContent = lang === 'nl' ? 'SEO-geoptimaliseerd' : 'SEO optimized';
        }
        
        const seoDesc = featureCards[5].querySelector('p');
        if (seoDesc) {
            seoDesc.textContent = lang === 'nl'
                ? 'Alle websites worden geoptimaliseerd voor zoekmachines, zodat jij beter gevonden wordt door potentiële klanten.'
                : 'All websites are optimized for search engines, so you can be found better by potential customers.';
        }
    }
    
    // Update team section
    const teamTitle = document.querySelector('.team-section .section-title');
    if (teamTitle) {
        teamTitle.textContent = lang === 'nl' ? 'Ons Team' : 'Our Team';
    }
    
    // Update team members
    const teamMembers = document.querySelectorAll('.team-member');
    if (teamMembers.length >= 2) {
        // Twan Meurs
        const twanRole = teamMembers[0].querySelector('.team-role');
        if (twanRole) {
            twanRole.textContent = lang === 'nl' ? 'Mede-oprichter & Web Developer' : 'Co-founder & Web Developer';
        }
        
        const twanBio = teamMembers[0].querySelector('.team-bio');
        if (twanBio) {
            twanBio.textContent = lang === 'nl'
                ? 'Twan is onze technische expert. Hij zorgt ervoor dat alle websites niet alleen mooi zijn, maar ook snel, veilig en technisch perfect werken.'
                : 'Twan is our technical expert. He ensures that all websites are not only beautiful, but also fast, secure, and technically perfect.';
        }
        
        // Emma de Heer
        const emmaRole = teamMembers[1].querySelector('.team-role');
        if (emmaRole) {
            emmaRole.textContent = lang === 'nl' ? 'Mede-oprichter & UX/UI Designer' : 'Co-founder & UX/UI Designer';
        }
        
        const emmaBio = teamMembers[1].querySelector('.team-bio');
        if (emmaBio) {
            emmaBio.textContent = lang === 'nl'
                ? 'Emma is gespecialiseerd in gebruiksvriendelijk en visueel aantrekkelijk design. Zij zorgt ervoor dat elke website niet alleen mooi is, maar ook intuïtief in gebruik.'
                : 'Emma specializes in user-friendly and visually appealing design. She ensures that every website is not only beautiful, but also intuitive to use.';
        }
    }
    
    // Update CTA section
    const ctaTitle = document.querySelector('.about-section .cta-section h2');
    if (ctaTitle) {
        ctaTitle.textContent = lang === 'nl' ? 'Klaar om samen te werken?' : 'Ready to work together?';
    }
    
    const ctaText = document.querySelector('.about-section .cta-section p');
    if (ctaText) {
        ctaText.textContent = lang === 'nl'
            ? 'Laat ons je helpen om jouw online aanwezigheid naar een hoger niveau te tillen.'
            : 'Let us help you take your online presence to the next level.';
    }
    
    const ctaButton = document.querySelector('.about-section .cta-section .btn');
    if (ctaButton) {
        ctaButton.textContent = lang === 'nl' ? 'Neem contact op' : 'Contact us';
    }
}

// Function to update the services page content
function updateServicesPage(lang) {
    // Update page title
    const pageHeader = document.querySelector('.page-header h1');
    if (pageHeader) {
        pageHeader.textContent = lang === 'nl' ? 'Onze Diensten' : 'Our Services';
    }
    
    // Update services intro
    const introTitle = document.querySelector('.services-intro h2');
    if (introTitle) {
        introTitle.textContent = lang === 'nl' ? 'Wat kunnen we voor je betekenen?' : 'What can we do for you?';
    }
    
    const introParagraphs = document.querySelectorAll('.services-intro p');
    if (introParagraphs.length >= 2) {
        if (introParagraphs[0]) {
            introParagraphs[0].textContent = lang === 'nl'
                ? 'Bij TwinPixel bieden we een breed scala aan webdesign en development diensten aan. Of je nu een volledig nieuwe website nodig hebt, je bestaande site wilt verbeteren of je online zichtbaarheid wilt vergroten, wij hebben de expertise om je te helpen.'
                : 'At TwinPixel, we offer a wide range of web design and development services. Whether you need a completely new website, want to improve your existing site, or want to increase your online visibility, we have the expertise to help you.';
        }
        if (introParagraphs[1]) {
            introParagraphs[1].textContent = lang === 'nl'
                ? 'Al onze diensten worden op maat gemaakt om aan jouw specifieke behoeften en doelstellingen te voldoen. We werken nauw met je samen om ervoor te zorgen dat het eindresultaat niet alleen aan je verwachtingen voldoet, maar deze overtreft.'
                : 'All our services are tailored to meet your specific needs and objectives. We work closely with you to ensure that the end result not only meets your expectations, but exceeds them.';
        }
    }
    
    // Update main services section
    const serviceItems = document.querySelectorAll('.service-item');
    if (serviceItems.length >= 3) {
        // Webdesign service
        const webdesignTitle = serviceItems[0].querySelector('h2');
        if (webdesignTitle) {
            webdesignTitle.textContent = lang === 'nl' ? 'Webdesign' : 'Web Design';
        }
        
        const webdesignDesc = serviceItems[0].querySelector('p:first-of-type');
        if (webdesignDesc) {
            webdesignDesc.textContent = lang === 'nl'
                ? 'Onze op maat gemaakte websites zijn niet alleen visueel aantrekkelijk, maar ook functioneel en gebruiksvriendelijk. We ontwerpen websites die perfect aansluiten bij jouw merk en doelstellingen.'
                : 'Our custom-made websites are not only visually appealing, but also functional and user-friendly. We design websites that perfectly match your brand and objectives.';
        }
        
        const webdesignOfferTitle = serviceItems[0].querySelector('h3');
        if (webdesignOfferTitle) {
            webdesignOfferTitle.textContent = lang === 'nl' ? 'Wat we bieden:' : 'What we offer:';
        }
        
        const webdesignOfferItems = serviceItems[0].querySelectorAll('ul li');
        if (webdesignOfferItems.length >= 5) {
            if (webdesignOfferItems[0]) {
                webdesignOfferItems[0].textContent = lang === 'nl'
                    ? '✓ Volledig responsive websites die er geweldig uitzien op alle apparaten'
                    : '✓ Fully responsive websites that look great on all devices';
            }
            if (webdesignOfferItems[1]) {
                webdesignOfferItems[1].textContent = lang === 'nl'
                    ? '✓ Unieke designs die passen bij jouw merk en doelgroep'
                    : '✓ Unique designs that match your brand and target audience';
            }
            if (webdesignOfferItems[2]) {
                webdesignOfferItems[2].textContent = lang === 'nl'
                    ? '✓ Gebruiksvriendelijke navigatie en intuïtieve interfaces'
                    : '✓ User-friendly navigation and intuitive interfaces';
            }
            if (webdesignOfferItems[3]) {
                webdesignOfferItems[3].textContent = lang === 'nl'
                    ? '✓ Snelle laadtijden voor een optimale gebruikerservaring'
                    : '✓ Fast loading times for an optimal user experience';
            }
            if (webdesignOfferItems[4]) {
                webdesignOfferItems[4].textContent = lang === 'nl'
                    ? '✓ Content management systemen voor eenvoudige updates'
                    : '✓ Content management systems for easy updates';
            }
        }
        
        const webdesignProcessTitle = serviceItems[0].querySelector('h3:nth-of-type(2)');
        if (webdesignProcessTitle) {
            webdesignProcessTitle.textContent = lang === 'nl' ? 'Ons ontwerpproces:' : 'Our design process:';
        }
        
        const webdesignProcessItems = serviceItems[0].querySelectorAll('ol li');
        if (webdesignProcessItems.length >= 6) {
            if (webdesignProcessItems[0]) {
                webdesignProcessItems[0].textContent = lang === 'nl'
                    ? 'Onderzoek & Analyse - We beginnen met het begrijpen van jouw bedrijf, doelgroep en concurrenten.'
                    : 'Research & Analysis - We start by understanding your business, target audience, and competitors.';
            }
            if (webdesignProcessItems[1]) {
                webdesignProcessItems[1].textContent = lang === 'nl'
                    ? 'Wireframing & Prototyping - We maken een basisstructuur en navigatie voor je website.'
                    : 'Wireframing & Prototyping - We create a basic structure and navigation for your website.';
            }
            if (webdesignProcessItems[2]) {
                webdesignProcessItems[2].textContent = lang === 'nl'
                    ? 'Design & Development - We ontwerpen en bouwen je website met aandacht voor detail.'
                    : 'Design & Development - We design and build your website with attention to detail.';
            }
            if (webdesignProcessItems[3]) {
                webdesignProcessItems[3].textContent = lang === 'nl'
                    ? 'Testen & Lanceren - We testen je website grondig en lanceren deze wanneer alles perfect werkt.'
                    : 'Testing & Launch - We thoroughly test your website and launch it when everything works perfectly.';
            }
            if (webdesignProcessItems[4]) {
                webdesignProcessItems[4].textContent = lang === 'nl'
                    ? 'Testen & Optimaliseren - We testen je website op verschillende apparaten en browsers.'
                    : 'Testing & Optimization - We test your website on different devices and browsers.';
            }
            if (webdesignProcessItems[5]) {
                webdesignProcessItems[5].textContent = lang === 'nl'
                    ? 'Lancering - We lanceren je website en zorgen ervoor dat alles soepel verloopt.'
                    : 'Launch - We launch your website and ensure everything runs smoothly.';
            }
        }
        
        // SEO service
        const seoTitle = serviceItems[1].querySelector('h2');
        if (seoTitle) {
            seoTitle.textContent = lang === 'nl' ? 'SEO-optimalisatie' : 'SEO Optimization';
        }
        
        const seoDesc = serviceItems[1].querySelector('p:first-of-type');
        if (seoDesc) {
            seoDesc.textContent = lang === 'nl'
                ? 'Zorg dat je gevonden wordt door potentiële klanten. Wij optimaliseren je website voor zoekmachines met snelle laadtijden en mobile-first design.'
                : 'Make sure you are found by potential customers. We optimize your website for search engines with fast loading times and mobile-first design.';
        }
        
        const seoOfferTitle = serviceItems[1].querySelector('h3');
        if (seoOfferTitle) {
            seoOfferTitle.textContent = lang === 'nl' ? 'Wat we bieden:' : 'What we offer:';
        }
        
        const seoOfferItems = serviceItems[1].querySelectorAll('ul li');
        if (seoOfferItems.length >= 5) {
            if (seoOfferItems[0]) {
                seoOfferItems[0].textContent = lang === 'nl'
                    ? '✓ Technische SEO-optimalisatie voor betere zoekresultaten'
                    : '✓ Technical SEO optimization for better search results';
            }
            if (seoOfferItems[1]) {
                seoOfferItems[1].textContent = lang === 'nl'
                    ? '✓ Keyword research en implementatie'
                    : '✓ Keyword research and implementation';
            }
            if (seoOfferItems[2]) {
                seoOfferItems[2].textContent = lang === 'nl'
                    ? '✓ Optimalisatie van meta-tags, headers en content'
                    : '✓ Optimization of meta tags, headers, and content';
            }
            if (seoOfferItems[3]) {
                seoOfferItems[3].textContent = lang === 'nl'
                    ? '✓ Verbetering van laadtijden en mobiele prestaties'
                    : '✓ Improvement of loading times and mobile performance';
            }
            if (seoOfferItems[4]) {
                seoOfferItems[4].textContent = lang === 'nl'
                    ? '✓ Lokale SEO voor bedrijven met een fysieke locatie'
                    : '✓ Local SEO for businesses with a physical location';
            }
            if (seoOfferItems.length >= 6 && seoOfferItems[5]) {
                seoOfferItems[5].textContent = lang === 'nl'
                    ? '✓ Regelmatige rapportages en analyses'
                    : '✓ Regular reports and analyses';
            }
        }
        
        const seoApproachTitle = serviceItems[1].querySelector('h3:nth-of-type(2)');
        if (seoApproachTitle) {
            seoApproachTitle.textContent = lang === 'nl' ? 'Onze SEO-aanpak:' : 'Our SEO approach:';
        }
        
        const seoApproachItems = serviceItems[1].querySelectorAll('ol li');
        if (seoApproachItems.length >= 6) {
            if (seoApproachItems[0]) {
                seoApproachItems[0].textContent = lang === 'nl'
                    ? 'Analyse - We onderzoeken je huidige website en die van je concurrenten.'
                    : 'Analysis - We research your current website and those of your competitors.';
            }
            if (seoApproachItems[1]) {
                seoApproachItems[1].textContent = lang === 'nl'
                    ? 'Strategie - We ontwikkelen een op maat gemaakte SEO-strategie voor jouw bedrijf.'
                    : 'Strategy - We develop a customized SEO strategy for your business.';
            }
            if (seoApproachItems[2]) {
                seoApproachItems[2].textContent = lang === 'nl'
                    ? 'Implementatie - We voeren de nodige optimalisaties door op je website.'
                    : 'Implementation - We implement the necessary optimizations on your website.';
            }
            if (seoApproachItems[3]) {
                seoApproachItems[3].textContent = lang === 'nl'
                    ? 'Monitoring & Rapportage - We houden je resultaten bij en sturen bij waar nodig.'
                    : 'Monitoring & Reporting - We track your results and adjust where necessary.';
            }
            if (seoApproachItems[4]) {
                seoApproachItems[4].textContent = lang === 'nl'
                    ? 'Content Strategie - We ontwikkelen een strategie voor relevante en waardevolle content.'
                    : 'Content Strategy - We develop a strategy for relevant and valuable content.';
            }
            if (seoApproachItems[5]) {
                seoApproachItems[5].textContent = lang === 'nl'
                    ? 'Monitoring & Rapportage - We houden je resultaten bij en passen onze strategie indien nodig aan.'
                    : 'Monitoring & Reporting - We track your results and adjust our strategy if necessary.';
            }
        }
        
        // UX/UI service
        const uxTitle = serviceItems[2].querySelector('h2');
        if (uxTitle) {
            uxTitle.textContent = lang === 'nl' ? 'UX/UI-Design' : 'UX/UI Design';
        }
        
        const uxDesc = serviceItems[2].querySelector('p:first-of-type');
        if (uxDesc) {
            uxDesc.textContent = lang === 'nl'
                ? 'Gebruiksvriendelijke en visueel aantrekkelijke interfaces die bezoekers omzetten in klanten. Intuïtief, toegankelijk en conversiegericht.'
                : 'User-friendly and visually appealing interfaces that convert visitors into customers. Intuitive, accessible, and conversion-oriented.';
        }
        
        const uxOfferTitle = serviceItems[2].querySelector('h3');
        if (uxOfferTitle) {
            uxOfferTitle.textContent = lang === 'nl' ? 'Wat we bieden:' : 'What we offer:';
        }
        
        const uxOfferItems = serviceItems[2].querySelectorAll('ul li');
        if (uxOfferItems.length >= 6) {
            if (uxOfferItems[0]) {
                uxOfferItems[0].textContent = lang === 'nl'
                    ? '✓ Gebruikersonderzoek en persona-ontwikkeling'
                    : '✓ User research and persona development';
            }
            if (uxOfferItems[1]) {
                uxOfferItems[1].textContent = lang === 'nl'
                    ? '✓ Wireframing en prototyping'
                    : '✓ Wireframing and prototyping';
            }
            if (uxOfferItems[2]) {
                uxOfferItems[2].textContent = lang === 'nl'
                    ? '✓ Gebruiksvriendelijke navigatie en informatiearchitectuur'
                    : '✓ User-friendly navigation and information architecture';
            }
            if (uxOfferItems[3]) {
                uxOfferItems[3].textContent = lang === 'nl'
                    ? '✓ Visueel aantrekkelijke interfaces met consistente branding'
                    : '✓ Visually appealing interfaces with consistent branding';
            }
            if (uxOfferItems[4]) {
                uxOfferItems[4].textContent = lang === 'nl'
                    ? '✓ Gebruikerstesten en iteratieve verbeteringen'
                    : '✓ User testing and iterative improvements';
            }
            if (uxOfferItems[5]) {
                uxOfferItems[5].textContent = lang === 'nl'
                    ? '✓ Toegankelijkheidsverbeteringen'
                    : '✓ Accessibility improvements';
            }
        }
        
        const uxProcessTitle = serviceItems[2].querySelector('h3:nth-of-type(2)');
        if (uxProcessTitle) {
            uxProcessTitle.textContent = lang === 'nl' ? 'Ons UX/UI-proces:' : 'Our UX/UI process:';
        }
        
        const uxProcessItems = serviceItems[2].querySelectorAll('ol li');
        if (uxProcessItems.length >= 6) {
            if (uxProcessItems[0]) {
                uxProcessItems[0].textContent = lang === 'nl'
                    ? 'Onderzoek - We leren je doelgroep kennen en begrijpen hun behoeften.'
                    : 'Research - We get to know your target audience and understand their needs.';
            }
            if (uxProcessItems[1]) {
                uxProcessItems[1].textContent = lang === 'nl'
                    ? 'Wireframing - We maken een basisstructuur voor de gebruikerservaring.'
                    : 'Wireframing - We create a basic structure for the user experience.';
            }
            if (uxProcessItems[2]) {
                uxProcessItems[2].textContent = lang === 'nl'
                    ? 'Visueel Design - We ontwerpen aantrekkelijke interfaces die passen bij je merk.'
                    : 'Visual Design - We design attractive interfaces that match your brand.';
            }
            if (uxProcessItems[3]) {
                uxProcessItems[3].textContent = lang === 'nl'
                    ? 'Testen & Iteratie - We testen met echte gebruikers en verbeteren waar nodig.'
                    : 'Testing & Iteration - We test with real users and improve where necessary.';
            }
            if (uxProcessItems[4]) {
                uxProcessItems[4].textContent = lang === 'nl'
                    ? 'Prototyping - We maken interactieve prototypes om de gebruikerservaring te testen.'
                    : 'Prototyping - We create interactive prototypes to test the user experience.';
            }
            if (uxProcessItems[5]) {
                uxProcessItems[5].textContent = lang === 'nl'
                    ? 'Implementatie & Testen - We implementeren het design en testen het met echte gebruikers.'
                    : 'Implementation & Testing - We implement the design and test it with real users.';
            }
        }
    }
    
    // Update additional services section
    const additionalTitle = document.querySelector('.additional-services h2');
    if (additionalTitle) {
        additionalTitle.textContent = lang === 'nl' ? 'Aanvullende Diensten' : 'Additional Services';
    }
    
    // Update additional service cards
    const additionalServiceCards = document.querySelectorAll('.additional-services .service-card');
    if (additionalServiceCards.length >= 3) {
        // E-commerce Solutions
        const ecommerceTitle = additionalServiceCards[0].querySelector('h3');
        if (ecommerceTitle) {
            ecommerceTitle.textContent = lang === 'nl' ? 'E-commerce Oplossingen' : 'E-commerce Solutions';
        }
        
        const ecommerceDesc = additionalServiceCards[0].querySelector('p');
        if (ecommerceDesc) {
            ecommerceDesc.textContent = lang === 'nl'
                ? 'We bouwen gebruiksvriendelijke webshops die je producten optimaal presenteren en het aankoopproces vereenvoudigen. Met veilige betalingsintegraties en een intuïtief beheerssysteem.'
                : 'We build user-friendly webshops that optimally present your products and simplify the purchasing process. With secure payment integrations and an intuitive management system.';
        }
        
        // Web Hosting & Maintenance
        const hostingTitle = additionalServiceCards[1].querySelector('h3');
        if (hostingTitle) {
            hostingTitle.textContent = lang === 'nl' ? 'Webhosting & Onderhoud' : 'Web Hosting & Maintenance';
        }
        
        const hostingDesc = additionalServiceCards[1].querySelector('p');
        if (hostingDesc) {
            hostingDesc.textContent = lang === 'nl'
                ? 'We bieden betrouwbare hosting en regelmatig onderhoud om ervoor te zorgen dat je website altijd snel, veilig en up-to-date is.'
                : 'We offer reliable hosting and regular maintenance to ensure your website is always fast, secure, and up-to-date.';
        }
        
        // Content Marketing
        const contentTitle = additionalServiceCards[2].querySelector('h3');
        if (contentTitle) {
            contentTitle.textContent = lang === 'nl' ? 'Content Marketing' : 'Content Marketing';
        }
        
        const contentDesc = additionalServiceCards[2].querySelector('p');
        if (contentDesc) {
            contentDesc.textContent = lang === 'nl'
                ? 'We helpen je met het creëren en verspreiden van waardevolle, relevante content die je doelgroep aanspreekt en je autoriteit in je vakgebied vergroot.'
                : 'We help you create and distribute valuable, relevant content that appeals to your target audience and increases your authority in your field.';
        }
    }
    
    // Update process section
    const processTitle = document.querySelector('.process-section h2');
    if (processTitle) {
        processTitle.textContent = lang === 'nl' ? 'Ons Werkproces' : 'Our Work Process';
    }
    
    const processSteps = document.querySelectorAll('.process-step');
    if (processSteps.length >= 5) {
        // Step 1
        const step1Title = processSteps[0].querySelector('h3');
        if (step1Title) {
            step1Title.textContent = lang === 'nl' ? 'Kennismaking & Analyse' : 'Introduction & Analysis';
        }
        
        const step1Desc = processSteps[0].querySelector('p');
        if (step1Desc) {
            step1Desc.textContent = lang === 'nl'
                ? 'We beginnen met een uitgebreid gesprek om je bedrijf, doelstellingen en verwachtingen te begrijpen. We analyseren je huidige situatie en identificeren verbeterpunten.'
                : 'We start with a comprehensive conversation to understand your business, objectives, and expectations. We analyze your current situation and identify areas for improvement.';
        }
        
        // Step 2
        const step2Title = processSteps[1].querySelector('h3');
        if (step2Title) {
            step2Title.textContent = lang === 'nl' ? 'Strategie & Planning' : 'Strategy & Planning';
        }
        
        const step2Desc = processSteps[1].querySelector('p');
        if (step2Desc) {
            step2Desc.textContent = lang === 'nl'
                ? 'Op basis van onze analyse ontwikkelen we een strategie en planning. We definiëren de scope, tijdlijn en deliverables van het project.'
                : 'Based on our analysis, we develop a strategy and planning. We define the scope, timeline, and deliverables of the project.';
        }
        
        // Step 3
        const step3Title = processSteps[2].querySelector('h3');
        if (step3Title) {
            step3Title.textContent = lang === 'nl' ? 'Design & Development' : 'Design & Development';
        }
        
        const step3Desc = processSteps[2].querySelector('p');
        if (step3Desc) {
            step3Desc.textContent = lang === 'nl'
                ? 'We ontwerpen en ontwikkelen je website of digitale product. Je wordt regelmatig op de hoogte gehouden en hebt de mogelijkheid om feedback te geven.'
                : 'We design and develop your website or digital product. You are regularly kept informed and have the opportunity to provide feedback.';
        }
        
        // Step 4
        const step4Title = processSteps[3].querySelector('h3');
        if (step4Title) {
            step4Title.textContent = lang === 'nl' ? 'Testen & Optimaliseren' : 'Testing & Optimizing';
        }
        
        const step4Desc = processSteps[3].querySelector('p');
        if (step4Desc) {
            step4Desc.textContent = lang === 'nl'
                ? 'We testen je website grondig op verschillende apparaten en browsers. We optimaliseren de prestaties en lost eventuele problemen op.'
                : 'We thoroughly test your website on different devices and browsers. We optimize performance and resolve any issues.';
        }
        
        // Step 5
        const step5Title = processSteps[4].querySelector('h3');
        if (step5Title) {
            step5Title.textContent = lang === 'nl' ? 'Lancering & Ondersteuning' : 'Launch & Support';
        }
        
        const step5Desc = processSteps[4].querySelector('p');
        if (step5Desc) {
            step5Desc.textContent = lang === 'nl'
                ? 'We lanceren je website en zorgen ervoor dat alles soepel verloopt. Na de lancering bieden we ondersteuning en onderhoud om ervoor te zorgen dat je website optimaal blijft presteren.'
                : 'We launch your website and ensure everything runs smoothly. After the launch, we provide support and maintenance to ensure your website continues to perform optimally.';
        }
    }
    
    // Update FAQ section
    const faqTitle = document.querySelector('.faq-section h2');
    if (faqTitle) {
        faqTitle.textContent = lang === 'nl' ? 'Veelgestelde Vragen' : 'Frequently Asked Questions';
    }
    
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length >= 6) {
        // FAQ 1
        const faq1Question = faqItems[0].querySelector('h3');
        if (faq1Question) {
            faq1Question.textContent = lang === 'nl'
                ? 'Hoe lang duurt het om een website te maken?'
                : 'How long does it take to create a website?';
        }
        
        const faq1Answer = faqItems[0].querySelector('p');
        if (faq1Answer) {
            faq1Answer.textContent = lang === 'nl'
                ? 'De tijdlijn varieert afhankelijk van de complexiteit van het project. Een eenvoudige website kan binnen 2-4 weken klaar zijn, terwijl complexere projecten 2-3 maanden kunnen duren. We geven je altijd een duidelijke tijdlijn bij aanvang van het project.'
                : 'The timeline varies depending on the complexity of the project. A simple website can be ready within 2-4 weeks, while more complex projects can take 2-3 months. We always provide you with a clear timeline at the start of the project.';
        }
        
        // FAQ 2
        const faq2Question = faqItems[1].querySelector('h3');
        if (faq2Question) {
            faq2Question.textContent = lang === 'nl'
                ? 'Kan ik mijn website zelf bijwerken?'
                : 'Can I update my website myself?';
        }
        
        const faq2Answer = faqItems[1].querySelector('p');
        if (faq2Answer) {
            faq2Answer.textContent = lang === 'nl'
                ? 'Ja, we bouwen de meeste websites met gebruiksvriendelijke content management systemen (CMS) zoals WordPress, waarmee je eenvoudig tekst, afbeeldingen en andere content kunt bijwerken zonder technische kennis. We bieden ook training aan zodat je weet hoe je je site kunt beheren.'
                : 'Yes, we build most websites with user-friendly content management systems (CMS) like WordPress, which allow you to easily update text, images, and other content without technical knowledge. We also provide training so you know how to manage your site.';
        }
        
        // FAQ 3
        const faq3Question = faqItems[2].querySelector('h3');
        if (faq3Question) {
            faq3Question.textContent = lang === 'nl'
                ? 'Wat zijn de kosten van een website?'
                : 'What are the costs of a website?';
        }
        
        const faq3Answer = faqItems[2].querySelector('p');
        if (faq3Answer) {
            faq3Answer.textContent = lang === 'nl'
                ? 'De kosten hangen af van je specifieke behoeften en de complexiteit van het project. We werken met transparante prijzen en bieden verschillende pakketten aan. Bekijk onze prijzenpagina voor meer informatie of neem contact met ons op voor een persoonlijke offerte.'
                : 'The costs depend on your specific needs and the complexity of the project. We work with transparent pricing and offer different packages. Check our pricing page for more information or contact us for a personal quote.';
        }
        
        // FAQ 4
        const faq4Question = faqItems[3].querySelector('h3');
        if (faq4Question) {
            faq4Question.textContent = lang === 'nl'
                ? 'Bieden jullie ook hosting aan?'
                : 'Do you also offer hosting?';
        }
        
        const faq4Answer = faqItems[3].querySelector('p');
        if (faq4Answer) {
            faq4Answer.textContent = lang === 'nl'
                ? 'Ja, we bieden betrouwbare hosting aan voor alle websites die we bouwen. Onze hosting is geoptimaliseerd voor snelheid, veiligheid en uptime, zodat je website altijd beschikbaar is voor je bezoekers.'
                : 'Yes, we offer reliable hosting for all websites we build. Our hosting is optimized for speed, security, and uptime, ensuring your website is always available to your visitors.';
        }
        
        // FAQ 5
        const faq5Question = faqItems[4].querySelector('h3');
        if (faq5Question) {
            faq5Question.textContent = lang === 'nl'
                ? 'Hoe werkt het proces van offerte tot oplevering?'
                : 'How does the process work from quote to delivery?';
        }
        
        const faq5Answer = faqItems[4].querySelector('p');
        if (faq5Answer) {
            faq5Answer.textContent = lang === 'nl'
                ? 'Na een eerste gesprek stellen we een gedetailleerde offerte op. Na akkoord beginnen we met het ontwerp, gevolgd door development, testen en lancering. Gedurende het hele proces houden we je op de hoogte en vragen we regelmatig om feedback.'
                : 'After an initial conversation, we prepare a detailed quote. After approval, we start with the design, followed by development, testing, and launch. Throughout the entire process, we keep you informed and regularly ask for feedback.';
        }
        
        // FAQ 6
        const faq6Question = faqItems[5].querySelector('h3');
        if (faq6Question) {
            faq6Question.textContent = lang === 'nl'
                ? 'Bieden jullie ondersteuning na de lancering?'
                : 'Do you offer support after the launch?';
        }
        
        const faq6Answer = faqItems[5].querySelector('p');
        if (faq6Answer) {
            faq6Answer.textContent = lang === 'nl'
                ? 'Ja, we bieden verschillende onderhouds- en ondersteuningspakketten aan om ervoor te zorgen dat je website up-to-date, veilig en optimaal presterend blijft. We zijn ook beschikbaar voor ad-hoc ondersteuning wanneer nodig.'
                : 'Yes, we offer various maintenance and support packages to ensure your website stays up-to-date, secure, and performing optimally. We are also available for ad-hoc support when needed.';
        }
    }
}

// Function to update the pricing page content
function updatePricingPage(lang) {
    // Update page title
    const pageHeader = document.querySelector('.page-header h1');
    if (pageHeader) {
        pageHeader.textContent = lang === 'nl' ? 'Onze Prijzen' : 'Our Pricing';
    }
    
    // Update pricing intro
    const introTitle = document.querySelector('.pricing-intro h2');
    if (introTitle) {
        introTitle.textContent = lang === 'nl' ? 'Transparante prijzen, geen verborgen kosten' : 'Transparent pricing, no hidden costs';
    }
    
    const introParagraphs = document.querySelectorAll('.pricing-intro p');
    if (introParagraphs.length >= 2) {
        if (introParagraphs[0]) {
            introParagraphs[0].textContent = lang === 'nl'
                ? 'Bij TwinPixel werken we met een hybride prijsmodel: een eenmalig bedrag voor het maken van je website, en daarna een maandelijks bedrag voor hosting en kleine updates. Zo weet je precies waar je aan toe bent, zonder verrassingen achteraf.'
                : 'At TwinPixel, we work with a hybrid pricing model: a one-time fee for creating your website, and then a monthly fee for hosting and small updates. This way, you know exactly what to expect, without surprises afterward.';
        }
        if (introParagraphs[1]) {
            introParagraphs[1].textContent = lang === 'nl'
                ? 'We bieden verschillende pakketten aan die aansluiten bij verschillende behoeften en budgetten. Heb je specifieke wensen of past geen van onze pakketten bij jouw behoeften? Kies dan voor ons maatwerk pakket of neem contact met ons op voor een persoonlijke offerte.'
                : 'We offer different packages that cater to different needs and budgets. Do you have specific wishes or does none of our packages meet your needs? Then choose our custom package or contact us for a personal quote.';
        }
    }
    
    // Update pricing info
    const pricingInfoTitle = document.querySelector('.pricing-info h3');
    if (pricingInfoTitle) {
        pricingInfoTitle.textContent = lang === 'nl' ? 'Ons hybride prijsmodel' : 'Our hybrid pricing model';
    }
    
    // Update pricing model section
    const pricingModelItems = document.querySelectorAll('.pricing-info div[style*="display: flex"] div[style*="text-align: center"]');
    if (pricingModelItems.length >= 3) {
        // One-time fee
        const oneTimeTitle = pricingModelItems[0].querySelector('h4');
        if (oneTimeTitle) {
            oneTimeTitle.textContent = lang === 'nl' ? 'Eenmalig bedrag' : 'One-time fee';
        }
        
        const oneTimeDesc = pricingModelItems[0].querySelector('p');
        if (oneTimeDesc) {
            oneTimeDesc.textContent = lang === 'nl' 
                ? 'Voor het ontwerpen en bouwen van je website' 
                : 'For designing and building your website';
        }
        
        // Monthly fee
        const monthlyTitle = pricingModelItems[2].querySelector('h4');
        if (monthlyTitle) {
            monthlyTitle.textContent = lang === 'nl' ? 'Maandelijks bedrag' : 'Monthly fee';
        }
        
        const monthlyDesc = pricingModelItems[2].querySelector('p');
        if (monthlyDesc) {
            monthlyDesc.textContent = lang === 'nl' 
                ? 'Voor hosting en kleine updates' 
                : 'For hosting and small updates';
        }
    }
    
    // Update pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    if (pricingCards.length >= 4) {
        // Starter package
        const starterTitle = pricingCards[0].querySelector('.pricing-title');
        if (starterTitle) {
            starterTitle.textContent = lang === 'nl' ? 'Starter' : 'Starter';
        }
        
        const starterPrice = pricingCards[0].querySelector('.pricing-price span');
        if (starterPrice) {
            starterPrice.textContent = lang === 'nl' ? 'eenmalig' : 'one-time';
        }
        
        const starterHosting = pricingCards[0].querySelector('div[style*="margin-top: 5px"]');
        if (starterHosting) {
            starterHosting.textContent = lang === 'nl'
                ? '+ €5/maand voor hosting & updates'
                : '+ €5/month for hosting & updates';
        }
        
        const starterFeatures = pricingCards[0].querySelectorAll('.pricing-features li');
        if (starterFeatures.length >= 7) {
            if (starterFeatures[0]) {
                starterFeatures[0].textContent = lang === 'nl' ? 'One-page website' : 'One-page website';
            }
            if (starterFeatures[1]) {
                starterFeatures[1].textContent = lang === 'nl' ? 'Responsive design' : 'Responsive design';
            }
            if (starterFeatures[2]) {
                starterFeatures[2].textContent = lang === 'nl' ? 'Basis-SEO' : 'Basic SEO';
            }
            if (starterFeatures[3]) {
                starterFeatures[3].textContent = lang === 'nl' ? 'Contactformulier' : 'Contact form';
            }
            if (starterFeatures[4]) {
                starterFeatures[4].textContent = lang === 'nl' ? 'Social media links' : 'Social media links';
            }
            if (starterFeatures[5]) {
                starterFeatures[5].textContent = lang === 'nl' ? 'Mobiel-vriendelijk design' : 'Mobile-friendly design';
            }
            if (starterFeatures[6]) {
                starterFeatures[6].textContent = lang === 'nl' ? '1 revisieronde' : '1 revision round';
            }
        }
        
        const starterButton = pricingCards[0].querySelector('.btn');
        if (starterButton) {
            starterButton.textContent = lang === 'nl' ? 'Meer informatie' : 'More information';
        }
        
        // Standard package
        const standardTitle = pricingCards[1].querySelector('.pricing-title');
        if (standardTitle) {
            standardTitle.textContent = lang === 'nl' ? 'Standaard' : 'Standard';
        }
        
        const standardPrice = pricingCards[1].querySelector('.pricing-price span');
        if (standardPrice) {
            standardPrice.textContent = lang === 'nl' ? 'eenmalig' : 'one-time';
        }
        
        const standardHosting = pricingCards[1].querySelector('div[style*="margin-top: 5px"]');
        if (standardHosting) {
            standardHosting.textContent = lang === 'nl'
                ? '+ €10/maand voor hosting & updates'
                : '+ €10/month for hosting & updates';
        }
        
        const standardFeatures = pricingCards[1].querySelectorAll('.pricing-features li');
        if (standardFeatures.length >= 8) {
            if (standardFeatures[0]) {
                standardFeatures[0].textContent = lang === 'nl' ? 'Meerdere pagina\'s' : 'Multiple pages';
            }
            if (standardFeatures[1]) {
                standardFeatures[1].textContent = lang === 'nl' ? 'Responsive design' : 'Responsive design';
            }
            if (standardFeatures[2]) {
                standardFeatures[2].textContent = lang === 'nl' ? 'Portfolio of blog-optie' : 'Portfolio or blog option';
            }
            if (standardFeatures[3]) {
                standardFeatures[3].textContent = lang === 'nl' ? 'SEO-optimalisatie' : 'SEO optimization';
            }
            if (standardFeatures[4]) {
                standardFeatures[4].textContent = lang === 'nl' ? 'Contactformulier' : 'Contact form';
            }
            if (standardFeatures[5]) {
                standardFeatures[5].textContent = lang === 'nl' ? 'Google Analytics integratie' : 'Google Analytics integration';
            }
            if (standardFeatures[6]) {
                standardFeatures[6].textContent = lang === 'nl' ? 'Social media integratie' : 'Social media integration';
            }
            if (standardFeatures[7]) {
                standardFeatures[7].textContent = lang === 'nl' ? '2 revisierondes' : '2 revision rounds';
            }
        }
        
        const standardButton = pricingCards[1].querySelector('.btn');
        if (standardButton) {
            standardButton.textContent = lang === 'nl' ? 'Meer informatie' : 'More information';
        }
        
        // Premium package
        const premiumTitle = pricingCards[2].querySelector('.pricing-title');
        if (premiumTitle) {
            premiumTitle.textContent = lang === 'nl' ? 'Premium' : 'Premium';
        }
        
        const premiumPrice = pricingCards[2].querySelector('.pricing-price span');
        if (premiumPrice) {
            premiumPrice.textContent = lang === 'nl' ? 'eenmalig' : 'one-time';
        }
        
        const premiumHosting = pricingCards[2].querySelector('div[style*="margin-top: 5px"]');
        if (premiumHosting) {
            premiumHosting.textContent = lang === 'nl'
                ? '+ €20/maand voor hosting & updates'
                : '+ €20/month for hosting & updates';
        }
        
        const premiumFeatures = pricingCards[2].querySelectorAll('.pricing-features li');
        if (premiumFeatures.length >= 9) {
            if (premiumFeatures[0]) {
                premiumFeatures[0].textContent = lang === 'nl' ? 'High-end design' : 'High-end design';
            }
            if (premiumFeatures[1]) {
                premiumFeatures[1].textContent = lang === 'nl' ? 'Responsive website' : 'Responsive website';
            }
            if (premiumFeatures[2]) {
                premiumFeatures[2].textContent = lang === 'nl' ? 'Geavanceerde SEO' : 'Advanced SEO';
            }
            if (premiumFeatures[3]) {
                premiumFeatures[3].textContent = lang === 'nl' ? 'Maatwerk functionaliteiten' : 'Custom functionalities';
            }
            if (premiumFeatures[4]) {
                premiumFeatures[4].textContent = lang === 'nl' ? 'Content management systeem' : 'Content management system';
            }
            if (premiumFeatures[5]) {
                premiumFeatures[5].textContent = lang === 'nl' ? 'Geavanceerd contactformulier' : 'Advanced contact form';
            }
            if (premiumFeatures[6]) {
                premiumFeatures[6].textContent = lang === 'nl' ? 'Google Analytics integratie' : 'Google Analytics integration';
            }
            if (premiumFeatures[7]) {
                premiumFeatures[7].textContent = lang === 'nl' ? 'Social media integratie' : 'Social media integration';
            }
            if (premiumFeatures[8]) {
                premiumFeatures[8].textContent = lang === 'nl' ? '3 revisierondes' : '3 revision rounds';
            }
        }
        
        const premiumButton = pricingCards[2].querySelector('.btn');
        if (premiumButton) {
            premiumButton.textContent = lang === 'nl' ? 'Meer informatie' : 'More information';
        }
        
        // Custom package
        const customTitle = pricingCards[3].querySelector('.pricing-title');
        if (customTitle) {
            customTitle.textContent = lang === 'nl' ? 'Maatwerk' : 'Custom';
        }
        
        const customPricePrefix = pricingCards[3].querySelector('.pricing-price span[style*="font-size: 0.6em"]');
        if (customPricePrefix) {
            customPricePrefix.textContent = lang === 'nl' ? 'vanaf' : 'from';
        }
        
        const customHostingPrefix = pricingCards[3].querySelector('div[style*="margin-top: 5px"] span[style*="font-size: 0.8em"]');
        if (customHostingPrefix) {
            customHostingPrefix.textContent = lang === 'nl' ? 'vanaf' : 'from';
        }
        
        const customHosting = pricingCards[3].querySelector('div[style*="margin-top: 5px"]');
        if (customHosting) {
            const hostingText = customHosting.childNodes[0];
            if (hostingText && hostingText.nodeType === Node.TEXT_NODE) {
                hostingText.textContent = lang === 'nl' ? '+ ' : '+ ';
            }
            
            const hostingText2 = customHosting.childNodes[2];
            if (hostingText2 && hostingText2.nodeType === Node.TEXT_NODE) {
                hostingText2.textContent = lang === 'nl' ? '/maand voor hosting & updates' : '/month for hosting & updates';
            }
        }
        
        const customFeatures = pricingCards[3].querySelectorAll('.pricing-features li');
        if (customFeatures.length >= 9) {
            if (customFeatures[0]) {
                customFeatures[0].textContent = lang === 'nl' ? 'Volledig op maat gemaakte website' : 'Fully custom-made website';
            }
            if (customFeatures[1]) {
                customFeatures[1].textContent = lang === 'nl' ? 'Uniek design' : 'Unique design';
            }
            if (customFeatures[2]) {
                customFeatures[2].textContent = lang === 'nl' ? 'Geavanceerde functionaliteiten' : 'Advanced functionalities';
            }
            if (customFeatures[3]) {
                customFeatures[3].textContent = lang === 'nl' ? 'E-commerce mogelijkheden' : 'E-commerce capabilities';
            }
            if (customFeatures[4]) {
                customFeatures[4].textContent = lang === 'nl' ? 'Uitgebreide SEO-optimalisatie' : 'Extensive SEO optimization';
            }
            if (customFeatures[5]) {
                customFeatures[5].textContent = lang === 'nl' ? 'Betalingssysteem integratie' : 'Payment system integration';
            }
            if (customFeatures[6]) {
                customFeatures[6].textContent = lang === 'nl' ? 'Nieuwsbrief integratie' : 'Newsletter integration';
            }
            if (customFeatures[7]) {
                customFeatures[7].textContent = lang === 'nl' ? 'Uitgebreid content management' : 'Extensive content management';
            }
            if (customFeatures[8]) {
                customFeatures[8].textContent = lang === 'nl' ? 'Onbeperkte revisierondes' : 'Unlimited revision rounds';
            }
        }
        
        const customButton = pricingCards[3].querySelector('.btn');
        if (customButton) {
            customButton.textContent = lang === 'nl' ? 'Meer informatie' : 'More information';
        }
    }
    
    // Update pricing disclaimer
    const pricingDisclaimer = document.querySelector('.pricing-disclaimer p');
    if (pricingDisclaimer) {
        pricingDisclaimer.textContent = lang === 'nl'
            ? 'Alle prijzen zijn exclusief BTW. Ons hybride prijsmodel bestaat uit een eenmalig bedrag voor het ontwerp en de ontwikkeling van je website, plus een maandelijks bedrag voor hosting en kleine updates. Zo heb je geen onverwachte kosten en blijft je website altijd up-to-date.'
            : 'All prices are excluding VAT. Our hybrid pricing model consists of a one-time fee for the design and development of your website, plus a monthly fee for hosting and small updates. This way, you have no unexpected costs and your website always stays up-to-date.';
    }
    
    // Update additional services section
    const additionalTitle = document.querySelector('.additional-pricing h2');
    if (additionalTitle) {
        additionalTitle.textContent = lang === 'nl' ? 'Aanvullende Diensten' : 'Additional Services';
    }
    
    // Update additional service cards
    const additionalServices = document.querySelectorAll('.additional-service');
    if (additionalServices.length >= 6) {
        // Basic Hosting
        const hostingTitle = additionalServices[0].querySelector('h3');
        if (hostingTitle) {
            hostingTitle.textContent = lang === 'nl' ? 'Basis Hosting' : 'Basic Hosting';
        }
        
        const hostingDesc = additionalServices[0].querySelector('p');
        if (hostingDesc) {
            hostingDesc.textContent = lang === 'nl'
                ? 'Betrouwbare hosting met SSL-certificaat om je website snel en veilig online te houden.'
                : 'Reliable hosting with SSL certificate to keep your website fast and secure online.';
        }
        
        const hostingPrice = additionalServices[0].querySelector('.service-price');
        if (hostingPrice) {
            hostingPrice.textContent = lang === 'nl' ? '€5 per maand' : '€5 per month';
        }
        
        // Standard Maintenance
        const standardTitle = additionalServices[1].querySelector('h3');
        if (standardTitle) {
            standardTitle.textContent = lang === 'nl' ? 'Standaard Onderhoud' : 'Standard Maintenance';
        }
        
        const standardDesc = additionalServices[1].querySelector('p');
        if (standardDesc) {
            standardDesc.textContent = lang === 'nl'
                ? 'Hosting, updates en kleine wijzigingen (1x per maand) om je website up-to-date te houden.'
                : 'Hosting, updates, and small changes (1x per month) to keep your website up-to-date.';
        }
        
        const standardPrice = additionalServices[1].querySelector('.service-price');
        if (standardPrice) {
            standardPrice.textContent = lang === 'nl' ? '€10 per maand' : '€10 per month';
        }
        
        // Premium Maintenance
        const premiumTitle = additionalServices[2].querySelector('h3');
        if (premiumTitle) {
            premiumTitle.textContent = lang === 'nl' ? 'Premium Onderhoud' : 'Premium Maintenance';
        }
        
        const premiumDesc = additionalServices[2].querySelector('p');
        if (premiumDesc) {
            premiumDesc.textContent = lang === 'nl'
                ? 'Alles uit Standaard + SEO-optimalisatie + maandelijks een wijziging naar keuze.'
                : 'Everything from Standard + SEO optimization + monthly change of your choice.';
        }
        
        const premiumPrice = additionalServices[2].querySelector('.service-price');
        if (premiumPrice) {
            premiumPrice.textContent = lang === 'nl' ? '€20 per maand' : '€20 per month';
        }
        
        // SEO Optimization
        const seoTitle = additionalServices[3].querySelector('h3');
        if (seoTitle) {
            seoTitle.textContent = lang === 'nl' ? 'SEO-optimalisatie' : 'SEO Optimization';
        }
        
        const seoDesc = additionalServices[3].querySelector('p');
        if (seoDesc) {
            seoDesc.textContent = lang === 'nl'
                ? 'Verbeter de vindbaarheid van je website in zoekmachines met onze SEO-optimalisatie.'
                : 'Improve the findability of your website in search engines with our SEO optimization.';
        }
        
        const seoPrice = additionalServices[3].querySelector('.service-price');
        if (seoPrice) {
            seoPrice.textContent = lang === 'nl' ? '€99 eenmalig' : '€99 one-time';
        }
        
        // Logo & Branding Design
        const logoTitle = additionalServices[4].querySelector('h3');
        if (logoTitle) {
            logoTitle.textContent = lang === 'nl' ? 'Logo & Branding Ontwerp' : 'Logo & Branding Design';
        }
        
        const logoDesc = additionalServices[4].querySelector('p');
        if (logoDesc) {
            logoDesc.textContent = lang === 'nl'
                ? 'Professioneel logo en branding ontwerp om je bedrijfsidentiteit te versterken.'
                : 'Professional logo and branding design to strengthen your company identity.';
        }
        
        const logoPrice = additionalServices[4].querySelector('.service-price');
        if (logoPrice) {
            logoPrice.textContent = lang === 'nl' ? '€149 eenmalig' : '€149 one-time';
        }
        
        // Fast Delivery
        const fastTitle = additionalServices[5].querySelector('h3');
        if (fastTitle) {
            fastTitle.textContent = lang === 'nl' ? 'Snelle Oplevering' : 'Fast Delivery';
        }
        
        const fastDesc = additionalServices[5].querySelector('p');
        if (fastDesc) {
            fastDesc.textContent = lang === 'nl'
                ? 'Heb je haast? Wij kunnen je website binnen 5 dagen opleveren.'
                : 'In a hurry? We can deliver your website within 5 days.';
        }
        
        const fastPrice = additionalServices[5].querySelector('.service-price');
        if (fastPrice) {
            fastPrice.textContent = lang === 'nl' ? '€99 eenmalig' : '€99 one-time';
        }
    }
    
    // Update FAQ section
    const faqTitle = document.querySelector('.pricing-faq h2');
    if (faqTitle) {
        faqTitle.textContent = lang === 'nl' ? 'Veelgestelde Vragen' : 'Frequently Asked Questions';
    }
    
    // Update FAQ items
    const faqItems = document.querySelectorAll('.pricing-faq .faq-item');
    if (faqItems.length >= 7) {
        // FAQ 1
        const faq1Question = faqItems[0].querySelector('h3');
        if (faq1Question) {
            faq1Question.textContent = lang === 'nl'
                ? 'Zijn er verborgen kosten?'
                : 'Are there hidden costs?';
        }
        
        const faq1Answer = faqItems[0].querySelector('p');
        if (faq1Answer) {
            faq1Answer.textContent = lang === 'nl'
                ? 'Nee, bij TwinPixel geloven we in volledige transparantie. De prijs die we opgeven is de prijs die je betaalt. Er zijn geen verborgen kosten of verrassingen achteraf.'
                : 'No, at TwinPixel we believe in full transparency. The price we quote is the price you pay. There are no hidden costs or surprises afterward.';
        }
        
        // FAQ 2
        const faq2Question = faqItems[1].querySelector('h3');
        if (faq2Question) {
            faq2Question.textContent = lang === 'nl'
                ? 'Wat als ik specifieke wensen heb die niet in een pakket passen?'
                : 'What if I have specific wishes that don\'t fit in a package?';
        }
        
        const faq2Answer = faqItems[1].querySelector('p');
        if (faq2Answer) {
            faq2Answer.textContent = lang === 'nl'
                ? 'Geen probleem! We bieden ook op maat gemaakte oplossingen aan. Neem contact met ons op om je specifieke wensen te bespreken en we stellen een offerte op maat voor je op.'
                : 'No problem! We also offer custom solutions. Contact us to discuss your specific wishes and we will create a custom quote for you.';
        }
        
        // FAQ 3
        const faq3Question = faqItems[2].querySelector('h3');
        if (faq3Question) {
            faq3Question.textContent = lang === 'nl'
                ? 'Hoe zit het met hosting en domeinregistratie?'
                : 'What about hosting and domain registration?';
        }
        
        const faq3Answer = faqItems[2].querySelector('p');
        if (faq3Answer) {
            faq3Answer.textContent = lang === 'nl'
                ? 'Hosting is inbegrepen in het maandelijkse bedrag van ons hybride prijsmodel. Domeinregistratie wordt apart gefactureerd tegen kostprijs. We kunnen je domein registreren of helpen bij het overzetten van een bestaand domein.'
                : 'Hosting is included in the monthly fee of our hybrid pricing model. Domain registration is billed separately at cost price. We can register your domain or help you transfer an existing domain.';
        }
        
        // FAQ 4
        const faq4Question = faqItems[3].querySelector('h3');
        if (faq4Question) {
            faq4Question.textContent = lang === 'nl'
                ? 'Kan ik later upgraden naar een ander pakket?'
                : 'Can I upgrade to a different package later?';
        }
        
        const faq4Answer = faqItems[3].querySelector('p');
        if (faq4Answer) {
            faq4Answer.textContent = lang === 'nl'
                ? 'Ja, je kunt altijd upgraden naar een uitgebreider pakket. We berekenen dan alleen het verschil tussen je huidige pakket en het nieuwe pakket, plus eventuele extra werkzaamheden die nodig zijn.'
                : 'Yes, you can always upgrade to a more comprehensive package. We will only charge the difference between your current package and the new package, plus any additional work that may be required.';
        }
        
        // FAQ 5
        const faq5Question = faqItems[4].querySelector('h3');
        if (faq5Question) {
            faq5Question.textContent = lang === 'nl'
                ? 'Hoe lang duurt het voordat mijn website klaar is?'
                : 'How long does it take for my website to be ready?';
        }
        
        const faq5Answer = faqItems[4].querySelector('p');
        if (faq5Answer) {
            faq5Answer.textContent = lang === 'nl'
                ? 'De doorlooptijd hangt af van het gekozen pakket en de complexiteit van je website. Een Starter website kan binnen 2-3 weken klaar zijn, terwijl een Enterprise website 4-6 weken kan duren. We stellen altijd een realistische tijdlijn op aan het begin van het project.'
                : 'The turnaround time depends on the chosen package and the complexity of your website. A Starter website can be ready within 2-3 weeks, while an Enterprise website can take 4-6 weeks. We always establish a realistic timeline at the beginning of the project.';
        }
        
        // FAQ 6
        const faq6Question = faqItems[5].querySelector('h3');
        if (faq6Question) {
            faq6Question.textContent = lang === 'nl'
                ? 'Wat zijn de betalingsvoorwaarden?'
                : 'What are the payment terms?';
        }
        
        const faq6Answer = faqItems[5].querySelector('p');
        if (faq6Answer) {
            faq6Answer.textContent = lang === 'nl'
                ? 'We vragen een aanbetaling van 50% bij de start van het project. De resterende 50% wordt gefactureerd bij oplevering van de website. Het maandelijkse bedrag voor hosting en updates wordt maandelijks gefactureerd, beginnend vanaf de livegang van je website.'
                : 'We ask for a 50% down payment at the start of the project. The remaining 50% is invoiced upon delivery of the website. The monthly fee for hosting and updates is invoiced monthly, starting from the launch of your website.';
        }
        
        // FAQ 7
        const faq7Question = faqItems[6].querySelector('h3');
        if (faq7Question) {
            faq7Question.textContent = lang === 'nl'
                ? 'Wat houdt het hybride prijsmodel precies in?'
                : 'What exactly does the hybrid pricing model entail?';
        }
        
        const faq7Answer = faqItems[6].querySelector('p');
        if (faq7Answer) {
            faq7Answer.textContent = lang === 'nl'
                ? 'Ons hybride prijsmodel bestaat uit twee delen: een eenmalig bedrag voor het ontwerpen en bouwen van je website, en een maandelijks bedrag voor hosting en kleine updates. Dit zorgt ervoor dat je website niet alleen professioneel wordt opgezet, maar ook goed blijft draaien en up-to-date blijft zonder onverwachte kosten.'
                : 'Our hybrid pricing model consists of two parts: a one-time fee for designing and building your website, and a monthly fee for hosting and small updates. This ensures that your website is not only professionally set up, but also continues to run well and stays up-to-date without unexpected costs.';
        }
    }
}

// Function to update the contact page content
function updateContactPage(lang) {
    // Update page title
    const pageHeader = document.querySelector('.page-header h1');
    if (pageHeader) {
        pageHeader.textContent = lang === 'nl' ? 'Neem Contact Op' : 'Contact Us';
    }
    
    // Update contact intro
    const introTitle = document.querySelector('.contact-intro h2');
    if (introTitle) {
        introTitle.textContent = lang === 'nl' ? 'Laten we samenwerken' : 'Let\'s work together';
    }
    
    const introText = document.querySelector('.contact-intro p');
    if (introText) {
        introText.textContent = lang === 'nl'
            ? 'Heb je vragen over onze diensten of wil je een offerte aanvragen? Vul het formulier in of neem direct contact met ons op. We reageren binnen 24 uur op je bericht.'
            : 'Do you have questions about our services or would you like to request a quote? Fill out the form or contact us directly. We will respond to your message within 24 hours.';
    }
    
    // Update contact info section
    const emailTitle = document.querySelector('.contact-info .info-card:nth-of-type(1) h3');
    if (emailTitle) {
        emailTitle.textContent = lang === 'nl' ? 'E-mail' : 'Email';
    }
    
    const phoneTitle = document.querySelector('.contact-info .info-card:nth-of-type(2) h3');
    if (phoneTitle) {
        phoneTitle.textContent = lang === 'nl' ? 'Telefoon' : 'Phone';
    }
    
    const locationTitle = document.querySelector('.contact-info .info-card:nth-of-type(3) h3');
    if (locationTitle) {
        locationTitle.textContent = lang === 'nl' ? 'Locatie' : 'Location';
    }
    
    const hoursTitle = document.querySelector('.contact-info .info-card:nth-of-type(4) h3');
    if (hoursTitle) {
        hoursTitle.textContent = lang === 'nl' ? 'Openingstijden' : 'Opening Hours';
    }
    
    const hoursText = document.querySelector('.contact-info .info-card:nth-of-type(4) p');
    if (hoursText) {
        hoursText.textContent = lang === 'nl' 
            ? 'Maandag - Vrijdag: 9:00 - 17:00' 
            : 'Monday - Friday: 9:00 - 17:00';
    }
    
    // Update contact form
    const formTitle = document.querySelector('.form-header h3');
    if (formTitle) {
        formTitle.textContent = lang === 'nl' ? 'Stuur ons een bericht' : 'Send us a message';
    }
    
    const formText = document.querySelector('.form-header p');
    if (formText) {
        formText.textContent = lang === 'nl'
            ? 'Vul het formulier in en we nemen zo snel mogelijk contact met je op.'
            : 'Fill out the form and we will contact you as soon as possible.';
    }
    
    // Update form labels
    const nameLabel = document.querySelector('label[for="name"]');
    if (nameLabel) {
        nameLabel.textContent = lang === 'nl' ? 'Naam *' : 'Name *';
    }
    
    const emailLabel = document.querySelector('label[for="email"]');
    if (emailLabel) {
        emailLabel.textContent = lang === 'nl' ? 'E-mail *' : 'Email *';
    }
    
    const phoneLabel = document.querySelector('label[for="phone"]');
    if (phoneLabel) {
        phoneLabel.textContent = lang === 'nl' ? 'Telefoonnummer' : 'Phone number';
    }
    
    const subjectLabel = document.querySelector('label[for="subject"]');
    if (subjectLabel) {
        subjectLabel.textContent = lang === 'nl' ? 'Onderwerp *' : 'Subject *';
    }
    
    const messageLabel = document.querySelector('label[for="message"]');
    if (messageLabel) {
        messageLabel.textContent = lang === 'nl' ? 'Bericht *' : 'Message *';
    }
    
    // Update form button
    const formButton = document.querySelector('.contact-form button');
    if (formButton) {
        formButton.textContent = lang === 'nl' ? 'Verstuur bericht' : 'Send message';
    }
    
    // Update consultation section
    const consultTitle = document.querySelector('.consultation-section h2');
    if (consultTitle) {
        consultTitle.textContent = lang === 'nl' ? 'Vraag een gratis consult aan' : 'Request a free consultation';
    }
    
    const consultText = document.querySelector('.consultation-section > p');
    if (consultText) {
        consultText.textContent = lang === 'nl'
            ? 'Wil je weten wat wij voor jou kunnen betekenen? Plan een gratis consult in en we bespreken samen de mogelijkheden.'
            : 'Want to know what we can do for you? Schedule a free consultation and we will discuss the possibilities together.';
    }
    
    // Update consultation steps
    const consultSteps = document.querySelectorAll('.consultation-steps .step');
    if (consultSteps.length >= 3) {
        // Step 1
        const step1Title = consultSteps[0].querySelector('h3');
        if (step1Title) {
            step1Title.textContent = lang === 'nl' ? 'Plan een afspraak' : 'Schedule an appointment';
        }
        
        const step1Desc = consultSteps[0].querySelector('p');
        if (step1Desc) {
            step1Desc.textContent = lang === 'nl'
                ? 'Kies een datum en tijd die jou uitkomt voor een videogesprek of telefoongesprek.'
                : 'Choose a date and time that suits you for a video call or phone call.';
        }
        
        // Step 2
        const step2Title = consultSteps[1].querySelector('h3');
        if (step2Title) {
            step2Title.textContent = lang === 'nl' ? 'Deel je wensen' : 'Share your wishes';
        }
        
        const step2Desc = consultSteps[1].querySelector('p');
        if (step2Desc) {
            step2Desc.textContent = lang === 'nl'
                ? 'Vertel ons over je bedrijf, doelstellingen en wensen voor je website.'
                : 'Tell us about your business, objectives, and wishes for your website.';
        }
        
        // Step 3
        const step3Title = consultSteps[2].querySelector('h3');
        if (step3Title) {
            step3Title.textContent = lang === 'nl' ? 'Ontvang advies' : 'Receive advice';
        }
        
        const step3Desc = consultSteps[2].querySelector('p');
        if (step3Desc) {
            step3Desc.textContent = lang === 'nl'
                ? 'Wij geven je vrijblijvend advies over de beste aanpak voor jouw project.'
                : 'We provide you with non-binding advice on the best approach for your project.';
        }
    }
    
    const consultButton = document.querySelector('.consultation-section .btn');
    if (consultButton) {
        consultButton.textContent = lang === 'nl' ? 'Plan een gratis consult' : 'Schedule a free consultation';
    }
    
    // Update FAQ section
    const faqTitle = document.querySelector('.contact-faq h2');
    if (faqTitle) {
        faqTitle.textContent = lang === 'nl' ? 'Veelgestelde Vragen' : 'Frequently Asked Questions';
    }
    
    // Update FAQ items
    const faqItems = document.querySelectorAll('.contact-faq .faq-item');
    if (faqItems.length >= 4) {
        // FAQ 1
        const faq1Question = faqItems[0].querySelector('h3');
        if (faq1Question) {
            faq1Question.textContent = lang === 'nl'
                ? 'Hoe snel kunnen jullie mijn website opleveren?'
                : 'How quickly can you deliver my website?';
        }
        
        const faq1Answer = faqItems[0].querySelector('p');
        if (faq1Answer) {
            faq1Answer.textContent = lang === 'nl'
                ? 'De doorlooptijd hangt af van de complexiteit van je website. Een eenvoudige website kan binnen 2-3 weken klaar zijn, terwijl complexere projecten 4-6 weken of langer kunnen duren. We stellen altijd een realistische tijdlijn op aan het begin van het project.'
                : 'The turnaround time depends on the complexity of your website. A simple website can be ready within 2-3 weeks, while more complex projects can take 4-6 weeks or longer. We always establish a realistic timeline at the beginning of the project.';
        }
        
        // FAQ 2
        const faq2Question = faqItems[1].querySelector('h3');
        if (faq2Question) {
            faq2Question.textContent = lang === 'nl'
                ? 'Wat kost een website?'
                : 'How much does a website cost?';
        }
        
        const faq2Answer = faqItems[1].querySelector('p');
        if (faq2Answer) {
            faq2Answer.textContent = lang === 'nl'
                ? 'De kosten van een website hangen af van je specifieke wensen en behoeften. We bieden verschillende pakketten aan, beginnend bij €499 voor een eenvoudige website. Bekijk onze prijzenpagina voor meer informatie of vraag een vrijblijvende offerte aan.'
                : 'The cost of a website depends on your specific wishes and needs. We offer different packages, starting at €499 for a simple website. Check our pricing page for more information or request a free quote.';
        }
        
        // FAQ 3
        const faq3Question = faqItems[2].querySelector('h3');
        if (faq3Question) {
            faq3Question.textContent = lang === 'nl'
                ? 'Kan ik mijn website later uitbreiden?'
                : 'Can I expand my website later?';
        }
        
        const faq3Answer = faqItems[2].querySelector('p');
        if (faq3Answer) {
            faq3Answer.textContent = lang === 'nl'
                ? 'Absoluut! We bouwen websites die gemakkelijk uit te breiden zijn. Of je nu later een webshop wilt toevoegen, meer pagina\'s wilt of extra functionaliteiten nodig hebt, we kunnen je website altijd aanpassen aan je groeiende behoeften.'
                : 'Absolutely! We build websites that are easy to expand. Whether you want to add a webshop later, want more pages, or need additional functionalities, we can always adapt your website to your growing needs.';
        }
        
        // FAQ 4
        const faq4Question = faqItems[3].querySelector('h3');
        if (faq4Question) {
            faq4Question.textContent = lang === 'nl'
                ? 'Hoe werkt het proces van offerte tot oplevering?'
                : 'How does the process work from quote to delivery?';
        }
        
        const faq4Answer = faqItems[3].querySelector('p');
        if (faq4Answer) {
            faq4Answer.textContent = lang === 'nl'
                ? 'Na een eerste gesprek stellen we een gedetailleerde offerte op. Na akkoord beginnen we met het ontwerp, gevolgd door development, testen en lancering. Gedurende het hele proces houden we je op de hoogte en vragen we regelmatig om feedback.'
                : 'After an initial conversation, we prepare a detailed quote. After approval, we start with the design, followed by development, testing, and launch. Throughout the entire process, we keep you informed and regularly ask for feedback.';
        }
    }
}
