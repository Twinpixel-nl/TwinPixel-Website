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
    
    // If no language in URL hash, try to get from localStorage as fallback
    if (!savedLanguage) {
        try {
            savedLanguage = localStorage.getItem('preferredLanguage');
        } catch (e) {
            console.log('localStorage not available:', e);
        }
    }
    
    // Apply the saved language if it exists
    if (savedLanguage) {
        // Apply the saved language
        switchLanguage(savedLanguage, false);
        
        // Update language selector UI
        const languageSelector = document.querySelector('.language-switcher select');
        if (languageSelector) {
            languageSelector.value = savedLanguage;
        }
        
        // Update language buttons UI
        const langButtons = document.querySelectorAll('.lang-btn');
        if (langButtons.length > 0) {
            langButtons.forEach(btn => {
                if (btn.textContent.toLowerCase() === savedLanguage.toUpperCase()) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    }
    
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
        // Meta tags
        'meta_description': 'TwinPixel - Modern webdesignbureau voor ZZP\'ers en MKB. Snelle, op maat gemaakte websites met een professionele uitstraling tegen betaalbare prijzen.',
        'meta_keywords': 'webdesign, website, webdevelopment, SEO, UX/UI, responsive, maatwerk, betaalbaar',
        'meta_title': 'TwinPixel | Modern Webdesignbureau',
        
        // Navigation
        'nav_home': 'Home',
        'nav_about': 'Over ons',
        'nav_services': 'Diensten',
        'nav_portfolio': 'Portfolio',
        'nav_pricing': 'Prijzen',
        'nav_contact': 'Contact',
        
        // Hero section
        'hero_title': 'Jouw <span>unieke</span> website.<br>Snel, op maat & betaalbaar.',
        'hero_subtitle': 'TwinPixel levert professionele websites die perfect aansluiten bij jouw bedrijf. Geen standaard templates, maar maatwerk met persoonlijke aandacht.',
        'hero_cta': 'Vraag een gratis consult aan',
        
        // About section
        'about_title': 'Over TwinPixel',
        'about_subtitle': 'Het verhaal achter TwinPixel',
        'about_text': 'TwinPixel is opgericht door twee studenten met een passie voor webdesign en development. Wij combineren onze technische kennis met een creatieve blik om websites te maken die niet alleen mooi zijn, maar ook functioneel en gebruiksvriendelijk.',
        'about_unique': 'Waarom wij uniek zijn',
        'about_feature1': 'Snelle levering',
        'about_feature1_desc': 'Geen lange wachttijden, wij leveren binnen afgesproken deadlines.',
        'about_feature2': '100% maatwerk',
        'about_feature2_desc': 'Geen standaard templates, maar een uniek design dat past bij jouw merk.',
        'about_feature3': 'Scherpe prijzen',
        'about_feature3_desc': 'Professionele kwaliteit zonder de hoge kosten van grote bureaus.',
        'about_feature4': 'Persoonlijke aanpak',
        'about_feature4_desc': 'Direct contact met de designers en developers die aan jouw project werken.',
        
        // Services section
        'services_title': 'Onze Diensten',
        'service1_title': 'Webdesign',
        'service1_desc': 'Op maat gemaakte websites die perfect aansluiten bij jouw merk en doelstellingen. Modern, responsive en gebruiksvriendelijk.',
        'service2_title': 'SEO-optimalisatie',
        'service2_desc': 'Zorg dat je gevonden wordt door potentiële klanten. Wij optimaliseren je website voor zoekmachines met snelle laadtijden en mobile-first design.',
        'service3_title': 'UX/UI-Design',
        'service3_desc': 'Gebruiksvriendelijke en visueel aantrekkelijke interfaces die bezoekers omzetten in klanten. Intuïtief, toegankelijk en conversiegericht.',
        
        // Testimonials section
        'testimonials_title': 'Wat Klanten Zeggen',
        'testimonial1_text': '"TwinPixel heeft onze verwachtingen overtroffen. Ze hebben niet alleen een prachtige website opgeleverd, maar ook meegedacht over onze online strategie. De website is snel, gebruiksvriendelijk en ziet er fantastisch uit!"',
        'testimonial1_author': 'Lisa Jansen',
        'testimonial1_company': 'Eigenaar, Bloemen & Zo',
        'testimonial2_text': '"Als ZZP\'er had ik een professionele website nodig, maar ik had een beperkt budget. TwinPixel heeft me een website op maat gegeven die er professioneel uitziet zonder de hoge kosten. Ik krijg regelmatig complimenten over mijn site!"',
        'testimonial2_author': 'Mark de Vries',
        'testimonial2_company': 'Freelance Fotograaf',
        'testimonial3_text': '"De snelheid waarmee TwinPixel werkt is indrukwekkend. Binnen twee weken hadden we een volledig functionerende webshop die er geweldig uitziet. De communicatie was uitstekend en ze waren altijd bereid om aanpassingen te maken."',
        'testimonial3_author': 'Sandra Bakker',
        'testimonial3_company': 'Oprichter, EcoStyle',
        
        // Portfolio section
        'portfolio_title': 'Ons Portfolio',
        'portfolio1_title': 'De wet van staal',
        'portfolio1_category': 'Informatieve website met contact pagina',
        'portfolio2_title': 'studievereniging NULL',
        'portfolio2_category': 'Website met database en CMS systeem',
        'portfolio3_title': 'Restaurant De Smaak',
        'portfolio3_category': 'Horeca Website',
        
        // Pricing section
        'pricing_title': 'Onze Prijzen',
        'pricing_starter': 'Starter',
        'pricing_professional': 'Professional',
        'pricing_enterprise': 'Enterprise',
        'pricing_once': 'eenmalig',
        'pricing_cta': 'Offerte aanvragen',
        'pricing_note': 'Alle prijzen zijn exclusief BTW. Heb je specifieke wensen of past geen van bovenstaande pakketten bij jouw behoeften? Neem contact met ons op voor een op maat gemaakte offerte.',
        
        // Pricing features
        'pricing_feature1': 'Responsive website (5 pagina\'s)',
        'pricing_feature2': 'SEO-basisoptimalisatie',
        'pricing_feature3': 'Contactformulier',
        'pricing_feature4': 'Google Maps integratie',
        'pricing_feature5': 'Social media links',
        'pricing_feature6': '1 revisieronde',
        'pricing_feature7': 'Responsive website (10 pagina\'s)',
        'pricing_feature8': 'Uitgebreide SEO-optimalisatie',
        'pricing_feature9': 'Geavanceerd contactformulier',
        'pricing_feature10': 'Google Analytics integratie',
        'pricing_feature11': 'Social media integratie',
        'pricing_feature12': 'Content management systeem',
        'pricing_feature13': '2 revisierondes',
        'pricing_feature14': '3 maanden gratis ondersteuning',
        'pricing_feature15': 'Responsive website (onbeperkt pagina\'s)',
        'pricing_feature16': 'Geavanceerde SEO-optimalisatie',
        'pricing_feature17': 'E-commerce functionaliteit',
        'pricing_feature18': 'Betalingssysteem integratie',
        'pricing_feature19': 'Nieuwsbrief integratie',
        'pricing_feature20': 'Uitgebreid content management',
        'pricing_feature21': 'Onbeperkte revisierondes',
        'pricing_feature22': '6 maanden gratis ondersteuning',
        'pricing_feature23': 'Maandelijks onderhoudspakket beschikbaar',
        
        // Contact section
        'contact_title': 'Neem Contact Op',
        'contact_subtitle': 'Laten we samenwerken',
        'contact_text': 'Heb je vragen of wil je een offerte aanvragen? Vul het formulier in of neem direct contact met ons op.',
        'contact_name': 'Naam',
        'contact_email': 'E-mail',
        'contact_subject': 'Onderwerp',
        'contact_message': 'Bericht',
        'contact_send': 'Verstuur bericht',
        'contact_placeholder_name': 'Jouw naam',
        'contact_placeholder_email': 'Jouw e-mailadres',
        'contact_placeholder_subject': 'Onderwerp van je bericht',
        'contact_placeholder_message': 'Jouw bericht',
        'contact_success': 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.',
        
        // Form validation
        'validation_name_required': 'Naam is verplicht',
        'validation_email_required': 'E-mail is verplicht',
        'validation_email_invalid': 'Voer een geldig e-mailadres in',
        'validation_message_required': 'Bericht is verplicht',
        
        // Footer
        'copyright': '© 2025 TwinPixel. Alle rechten voorbehouden.'
    },
    'en': {
        // Meta tags
        'meta_description': 'TwinPixel - Modern web design agency for freelancers and SMEs. Fast, custom-made websites with a professional look at affordable prices.',
        'meta_keywords': 'web design, website, web development, SEO, UX/UI, responsive, custom, affordable',
        'meta_title': 'TwinPixel | Modern Web Design Agency',
        
        // Navigation
        'nav_home': 'Home',
        'nav_about': 'About us',
        'nav_services': 'Services',
        'nav_portfolio': 'Portfolio',
        'nav_pricing': 'Pricing',
        'nav_contact': 'Contact',
        
        // Hero section
        'hero_title': 'Your <span>unique</span> website.<br>Fast, custom & affordable.',
        'hero_subtitle': 'TwinPixel delivers professional websites that perfectly match your business. No standard templates, but custom work with personal attention.',
        'hero_cta': 'Request a free consultation',
        
        // About section
        'about_title': 'About TwinPixel',
        'about_subtitle': 'The story behind TwinPixel',
        'about_text': 'TwinPixel was founded by two students with a passion for web design and development. We combine our technical knowledge with a creative vision to create websites that are not only beautiful, but also functional and user-friendly.',
        'about_unique': 'Why we are unique',
        'about_feature1': 'Fast delivery',
        'about_feature1_desc': 'No long waiting times, we deliver within agreed deadlines.',
        'about_feature2': '100% custom work',
        'about_feature2_desc': 'No standard templates, but a unique design that fits your brand.',
        'about_feature3': 'Competitive prices',
        'about_feature3_desc': 'Professional quality without the high costs of large agencies.',
        'about_feature4': 'Personal approach',
        'about_feature4_desc': 'Direct contact with the designers and developers working on your project.',
        
        // Services section
        'services_title': 'Our Services',
        'service1_title': 'Web Design',
        'service1_desc': 'Custom-made websites that perfectly match your brand and objectives. Modern, responsive and user-friendly.',
        'service2_title': 'SEO Optimization',
        'service2_desc': 'Make sure you are found by potential customers. We optimize your website for search engines with fast loading times and mobile-first design.',
        'service3_title': 'UX/UI Design',
        'service3_desc': 'User-friendly and visually appealing interfaces that convert visitors into customers. Intuitive, accessible and conversion-oriented.',
        
        // Testimonials section
        'testimonials_title': 'What Clients Say',
        'testimonial1_text': '"TwinPixel exceeded our expectations. They not only delivered a beautiful website, but also contributed to our online strategy. The website is fast, user-friendly and looks fantastic!"',
        'testimonial1_author': 'Lisa Jansen',
        'testimonial1_company': 'Owner, Bloemen & Zo',
        'testimonial2_text': '"As a freelancer, I needed a professional website, but I had a limited budget. TwinPixel gave me a custom website that looks professional without the high costs. I regularly receive compliments about my site!"',
        'testimonial2_author': 'Mark de Vries',
        'testimonial2_company': 'Freelance Photographer',
        'testimonial3_text': '"The speed at which TwinPixel works is impressive. Within two weeks we had a fully functioning webshop that looks great. The communication was excellent and they were always willing to make adjustments."',
        'testimonial3_author': 'Sandra Bakker',
        'testimonial3_company': 'Founder, EcoStyle',
        
        // Portfolio section
        'portfolio_title': 'Our Portfolio',
        'portfolio1_title': 'De wet van staal',
        'portfolio1_category': 'Informative website with contact page',
        'portfolio2_title': 'studievereniging NULL',
        'portfolio2_category': 'Website with database and CMS system',
        'portfolio3_title': 'Restaurant De Smaak',
        'portfolio3_category': 'Restaurant Website',
        
        // Pricing section
        'pricing_title': 'Our Pricing',
        'pricing_starter': 'Starter',
        'pricing_professional': 'Professional',
        'pricing_enterprise': 'Enterprise',
        'pricing_once': 'one-time',
        'pricing_cta': 'Request a quote',
        'pricing_note': 'All prices exclude VAT. Do you have specific wishes or does none of the above packages meet your needs? Contact us for a custom quote.',
        
        // Pricing features
        'pricing_feature1': 'Responsive website (5 pages)',
        'pricing_feature2': 'Basic SEO optimization',
        'pricing_feature3': 'Contact form',
        'pricing_feature4': 'Google Maps integration',
        'pricing_feature5': 'Social media links',
        'pricing_feature6': '1 revision round',
        'pricing_feature7': 'Responsive website (10 pages)',
        'pricing_feature8': 'Advanced SEO optimization',
        'pricing_feature9': 'Advanced contact form',
        'pricing_feature10': 'Google Analytics integration',
        'pricing_feature11': 'Social media integration',
        'pricing_feature12': 'Content management system',
        'pricing_feature13': '2 revision rounds',
        'pricing_feature14': '3 months free support',
        'pricing_feature15': 'Responsive website (unlimited pages)',
        'pricing_feature16': 'Advanced SEO optimization',
        'pricing_feature17': 'E-commerce functionality',
        'pricing_feature18': 'Payment system integration',
        'pricing_feature19': 'Newsletter integration',
        'pricing_feature20': 'Advanced content management',
        'pricing_feature21': 'Unlimited revision rounds',
        'pricing_feature22': '6 months free support',
        'pricing_feature23': 'Monthly maintenance package available',
        
        // Contact section
        'contact_title': 'Get in Touch',
        'contact_subtitle': 'Let\'s work together',
        'contact_text': 'Do you have questions or would you like to request a quote? Fill out the form or contact us directly.',
        'contact_name': 'Name',
        'contact_email': 'Email',
        'contact_subject': 'Subject',
        'contact_message': 'Message',
        'contact_send': 'Send message',
        'contact_placeholder_name': 'Your name',
        'contact_placeholder_email': 'Your email address',
        'contact_placeholder_subject': 'Subject of your message',
        'contact_placeholder_message': 'Your message',
        'contact_success': 'Thank you for your message! We will contact you as soon as possible.',
        
        // Form validation
        'validation_name_required': 'Name is required',
        'validation_email_required': 'Email is required',
        'validation_email_invalid': 'Please enter a valid email address',
        'validation_message_required': 'Message is required',
        
        // Footer
        'copyright': '© 2025 TwinPixel. All rights reserved.'
    }
};

// Language switcher functionality
function switchLanguage(lang, updateHash = true) {
    // Store the selected language in localStorage as a fallback
    try {
        localStorage.setItem('preferredLanguage', lang);
    } catch (e) {
        console.log('localStorage not available:', e);
    }
    
    // Update URL hash if needed
    if (updateHash) {
        window.location.hash = lang;
    }
    
    // Update the HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update the active state of language buttons if they exist
    const langButtons = document.querySelectorAll('.lang-btn');
    if (langButtons.length > 0) {
        langButtons.forEach(btn => {
            if (btn.textContent.toLowerCase() === lang.toUpperCase()) {
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
    }
    
    // Update the content on the page
    updatePageContent(lang);
}

// Function to update the content on the page based on the selected language
function updatePageContent(lang) {
    const t = translations[lang];
    if (!t) return; // If translations for this language don't exist, do nothing
    
    // Update meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const metaTitle = document.querySelector('title');
    
    if (metaDescription) metaDescription.setAttribute('content', t.meta_description);
    if (metaKeywords) metaKeywords.setAttribute('content', t.meta_keywords);
    if (metaTitle) metaTitle.textContent = t.meta_title;
    
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
    
    // Update hero section
    const heroTitle = document.querySelector('.hero-content h1');
    const heroSubtitle = document.querySelector('.hero-content p');
    const heroCta = document.querySelector('.hero-content .btn');
    
    if (heroTitle) heroTitle.innerHTML = t.hero_title;
    if (heroSubtitle) heroSubtitle.textContent = t.hero_subtitle;
    if (heroCta) heroCta.textContent = t.hero_cta;
    
    // Update about section
    const aboutTitle = document.querySelector('.section-title h2');
    const aboutSubtitle = document.querySelector('.about-text h3');
    const aboutText = document.querySelector('.about-text p');
    const aboutUnique = document.querySelector('.about-text h3:nth-of-type(2)');
    
    if (aboutTitle && aboutTitle.textContent.includes('TwinPixel')) aboutTitle.textContent = t.about_title;
    if (aboutSubtitle) aboutSubtitle.textContent = t.about_subtitle;
    if (aboutText) aboutText.textContent = t.about_text;
    if (aboutUnique) aboutUnique.textContent = t.about_unique;
    
    // Update about features
    const aboutFeatures = document.querySelectorAll('.about-text ul li');
    if (aboutFeatures.length >= 4) {
        const featureItems = [
            { title: 'about_feature1', desc: 'about_feature1_desc' },
            { title: 'about_feature2', desc: 'about_feature2_desc' },
            { title: 'about_feature3', desc: 'about_feature3_desc' },
            { title: 'about_feature4', desc: 'about_feature4_desc' }
        ];
        
        aboutFeatures.forEach((feature, index) => {
            if (index < featureItems.length) {
                // Clear the list item content first
                feature.innerHTML = '';
                
                // Recreate the icon
                const icon = document.createElement('i');
                icon.className = 'fas fa-check-circle';
                feature.appendChild(icon);
                
                // Add a space
                feature.appendChild(document.createTextNode(' '));
                
                // Create and add the strong element
                const strong = document.createElement('strong');
                strong.textContent = t[featureItems[index].title];
                feature.appendChild(strong);
                
                // Add the description
                feature.appendChild(document.createTextNode(' - ' + t[featureItems[index].desc]));
            }
        });
    }
    
    // Update services section
    const servicesTitle = document.querySelector('#diensten .section-title h2');
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (servicesTitle) servicesTitle.textContent = t.services_title;
    if (serviceCards.length >= 3) {
        const serviceItems = [
            { title: 'service1_title', desc: 'service1_desc' },
            { title: 'service2_title', desc: 'service2_desc' },
            { title: 'service3_title', desc: 'service3_desc' }
        ];
        
        serviceCards.forEach((card, index) => {
            if (index < serviceItems.length) {
                const title = card.querySelector('h3');
                const desc = card.querySelector('p');
                
                if (title) title.textContent = t[serviceItems[index].title];
                if (desc) desc.textContent = t[serviceItems[index].desc];
            }
        });
    }
    
    // Update testimonials section
    const testimonialsTitle = document.querySelector('#testimonials .section-title h2');
    if (testimonialsTitle) testimonialsTitle.textContent = t.testimonials_title;
    
    // Update testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (testimonialCards.length >= 3) {
        const testimonialItems = [
            { text: 'testimonial1_text', author: 'testimonial1_author', company: 'testimonial1_company' },
            { text: 'testimonial2_text', author: 'testimonial2_author', company: 'testimonial2_company' },
            { text: 'testimonial3_text', author: 'testimonial3_author', company: 'testimonial3_company' }
        ];
        
        testimonialCards.forEach((card, index) => {
            if (index < testimonialItems.length) {
                const text = card.querySelector('.testimonial-text');
                const author = card.querySelector('.testimonial-author');
                const company = card.querySelector('.testimonial-company');
                
                if (text) text.textContent = t[testimonialItems[index].text];
                if (author) author.textContent = t[testimonialItems[index].author];
                if (company) company.textContent = t[testimonialItems[index].company];
            }
        });
    }
    
    // Update portfolio section
    const portfolioTitle = document.querySelector('#portfolio .section-title h2');
    if (portfolioTitle) portfolioTitle.textContent = t.portfolio_title;
    
    // Update portfolio items
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    if (portfolioItems.length >= 3) {
        const portfolioTitles = [
            { title: 'portfolio1_title', category: 'portfolio1_category' },
            { title: 'portfolio2_title', category: 'portfolio2_category' },
            { title: 'portfolio3_title', category: 'portfolio3_category' }
        ];
        
        portfolioItems.forEach((item, index) => {
            if (index < portfolioTitles.length) {
                const title = item.querySelector('.portfolio-title');
                const category = item.querySelector('.portfolio-category');
                
                if (title) title.textContent = t[portfolioTitles[index].title];
                if (category) category.textContent = t[portfolioTitles[index].category];
            }
        });
    }
    
    // Update pricing section
    const pricingTitle = document.querySelector('#prijzen .section-title h2');
    const pricingCards = document.querySelectorAll('.pricing-card');
    const pricingNote = document.querySelector('.pricing-note p');
    
    if (pricingTitle) pricingTitle.textContent = t.pricing_title;
    if (pricingCards.length >= 3) {
        const pricingItems = ['pricing_starter', 'pricing_professional', 'pricing_enterprise'];
        pricingCards.forEach((card, index) => {
            if (index < pricingItems.length) {
                const title = card.querySelector('.pricing-title');
                const price = card.querySelector('.pricing-price span');
                const cta = card.querySelector('.btn');
                
                if (title) title.textContent = t[pricingItems[index]];
                if (price) price.textContent = t.pricing_once;
                if (cta) cta.textContent = t.pricing_cta;
                
                // Update pricing features
                const features = card.querySelectorAll('.pricing-features li');
                if (features.length > 0) {
                    // Define the starting index for each pricing card
                    let startIndex = 1;
                    if (index === 1) startIndex = 7; // Professional card starts at feature 7
                    if (index === 2) startIndex = 15; // Enterprise card starts at feature 15
                    
                    features.forEach((feature, featureIndex) => {
                        const featureKey = `pricing_feature${startIndex + featureIndex}`;
                        if (t[featureKey]) {
                            feature.textContent = t[featureKey];
                        }
                    });
                }
            }
        });
    }
    if (pricingNote) pricingNote.textContent = t.pricing_note;
    
    // Update contact section
    const contactTitle = document.querySelector('#contact .section-title h2');
    const contactSubtitle = document.querySelector('.contact-info h3');
    const contactText = document.querySelector('.contact-info p');
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactTitle) contactTitle.textContent = t.contact_title;
    if (contactSubtitle) contactSubtitle.textContent = t.contact_subtitle;
    if (contactText) contactText.textContent = t.contact_text;
    
    if (contactForm) {
        const nameLabel = contactForm.querySelector('label[for="name"]');
        const emailLabel = contactForm.querySelector('label[for="email"]');
        const subjectLabel = contactForm.querySelector('label[for="subject"]');
        const messageLabel = contactForm.querySelector('label[for="message"]');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        
        if (nameLabel) nameLabel.textContent = t.contact_name;
        if (emailLabel) emailLabel.textContent = t.contact_email;
        if (subjectLabel) subjectLabel.textContent = t.contact_subject;
        if (messageLabel) messageLabel.textContent = t.contact_message;
        if (submitButton) submitButton.textContent = t.contact_send;
        
        // Update form placeholders
        const nameInput = contactForm.querySelector('input[name="name"]');
        const emailInput = contactForm.querySelector('input[name="email"]');
        const subjectInput = contactForm.querySelector('input[name="subject"]');
        const messageInput = contactForm.querySelector('textarea[name="message"]');
        
        if (nameInput) nameInput.placeholder = t.contact_placeholder_name;
        if (emailInput) emailInput.placeholder = t.contact_placeholder_email;
        if (subjectInput) subjectInput.placeholder = t.contact_placeholder_subject;
        if (messageInput) messageInput.placeholder = t.contact_placeholder_message;
        
        // Update success message if it exists
        const successMessage = document.querySelector('.success-message');
        if (successMessage) {
            successMessage.textContent = t.contact_success;
        }
    }
    
    // Update footer
    const copyright = document.querySelector('.copyright');
    if (copyright) copyright.textContent = t.copyright;
    
    // Update footer links
    const footerLinks = document.querySelectorAll('.footer-links li a');
    if (footerLinks.length > 0) {
        const navItems = ['nav_home', 'nav_about', 'nav_services', 'nav_portfolio', 'nav_pricing', 'nav_contact'];
        footerLinks.forEach((link, index) => {
            if (index < navItems.length) {
                link.textContent = t[navItems[index]];
            }
        });
    }
}

// Form validation for contact form
function validateContactForm(form) {
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const messageInput = form.querySelector('textarea[name="message"]');
    
    // Get current language
    const currentLang = document.documentElement.lang || 'nl';
    const t = translations[currentLang];
    
    let isValid = true;
    
    // Simple validation
    if (!nameInput.value.trim()) {
        markInvalid(nameInput, t.validation_name_required);
        isValid = false;
    } else {
        markValid(nameInput);
    }
    
    if (!emailInput.value.trim()) {
        markInvalid(emailInput, t.validation_email_required);
        isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
        markInvalid(emailInput, t.validation_email_invalid);
        isValid = false;
    } else {
        markValid(emailInput);
    }
    
    if (!messageInput.value.trim()) {
        markInvalid(messageInput, t.validation_message_required);
        isValid = false;
    } else {
        markValid(messageInput);
    }
    
    return isValid;
}

// Helper function to validate email format
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Helper function to mark form field as invalid
function markInvalid(field, message) {
    field.classList.add('invalid');
    
    // Create or update error message
    let errorElement = field.parentElement.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

// Helper function to mark form field as valid
function markValid(field) {
    field.classList.remove('invalid');
    const errorElement = field.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm(this)) {
                // In a real implementation, you would send the form data to a server
                // For now, we'll just show a success message
                const formData = new FormData(this);
                const formValues = {};
                
                for (let [key, value] of formData.entries()) {
                    formValues[key] = value;
                }
                
                console.log('Form submitted:', formValues);
                
                // Get current language for success message
                const currentLang = document.documentElement.lang || 'nl';
                const t = translations[currentLang];
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = t.contact_success;
                
                // Replace form with success message
                this.innerHTML = '';
                this.appendChild(successMessage);
            }
        });
    }
});

// Portfolio item hover effect enhancement
document.addEventListener('DOMContentLoaded', function() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('.portfolio-overlay').style.opacity = '1';
            this.querySelector('.portfolio-img').style.transform = 'scale(1.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.querySelector('.portfolio-overlay').style.opacity = '0';
            this.querySelector('.portfolio-img').style.transform = 'scale(1)';
        });
    });
});

// Service card hover effect enhancement
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
            this.querySelector('.service-icon').style.color = 'var(--secondary-color)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
            this.querySelector('.service-icon').style.color = 'var(--primary-color)';
        });
    });
});

// Listen for hash changes to update language
window.addEventListener('hashchange', function() {
    if (window.location.hash) {
        const hash = window.location.hash.substring(1); // Remove the # symbol
        if (hash === 'en' || hash === 'nl') {
            switchLanguage(hash, false); // Don't update hash again to avoid infinite loop
        }
    }
});
