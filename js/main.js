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
    
    // Update all section titles
    const sectionTitles = document.querySelectorAll('.section-title h2');
    sectionTitles.forEach(title => {
        if (title.textContent.includes('TwinPixel') || title.textContent.includes('About')) {
            title.textContent = t.about_title;
        } else if (title.textContent.includes('Diensten') || title.textContent.includes('Services')) {
            title.textContent = t.services_title;
        } else if (title.textContent.includes('Klanten') || title.textContent.includes('Clients')) {
            title.textContent = t.testimonials_title;
        } else if (title.textContent.includes('Portfolio')) {
            title.textContent = t.portfolio_title;
        } else if (title.textContent.includes('Prijzen') || title.textContent.includes('Pricing')) {
            title.textContent = t.pricing_title;
        } else if (title.textContent.includes('Contact') || title.textContent.includes('Touch')) {
            title.textContent = t.contact_title;
        }
    });
    
    // Update CTA buttons
    const ctaButtons = document.querySelectorAll('.btn.btn-large');
    ctaButtons.forEach(button => {
        if (button.textContent.includes('consult') || button.textContent.includes('consultation')) {
            button.textContent = t.hero_cta;
        } else if (button.textContent.includes('contact') || button.textContent.includes('Contact')) {
            button.textContent = lang === 'nl' ? 'Neem contact op' : 'Contact us';
        } else if (button.textContent.includes('prijzen') || button.textContent.includes('pricing')) {
            button.textContent = lang === 'nl' ? 'Bekijk alle prijzen en pakketten' : 'View all pricing and packages';
        }
    });
    
    // Update services section
    const serviceCards = document.querySelectorAll('.service-card');
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
    
    // Update pricing section
    const pricingTitle = document.querySelector('.page-header h1');
    if (pricingTitle && (pricingTitle.textContent.includes('Prijzen') || pricingTitle.textContent.includes('Pricing'))) {
        pricingTitle.textContent = t.pricing_title;
    }
    
    // Update pricing intro text
    const pricingIntroTitle = document.querySelector('.pricing-intro h2');
    if (pricingIntroTitle) {
        pricingIntroTitle.textContent = lang === 'nl' ? 
            'Transparante prijzen, geen verborgen kosten' : 
            'Transparent pricing, no hidden costs';
    }
    
    const pricingIntroParagraphs = document.querySelectorAll('.pricing-intro p');
    if (pricingIntroParagraphs.length >= 2) {
        if (pricingIntroParagraphs[0]) {
            pricingIntroParagraphs[0].textContent = lang === 'nl' ? 
                'Bij TwinPixel werken we met een hybride prijsmodel: een eenmalig bedrag voor het maken van je website, en daarna een maandelijks bedrag voor hosting en kleine updates. Zo weet je precies waar je aan toe bent, zonder verrassingen achteraf.' : 
                'At TwinPixel, we work with a hybrid pricing model: a one-time fee for creating your website, and then a monthly fee for hosting and small updates. This way, you know exactly what to expect, with no surprises afterward.';
        }
        if (pricingIntroParagraphs[1]) {
            pricingIntroParagraphs[1].textContent = lang === 'nl' ? 
                'We bieden verschillende pakketten aan die aansluiten bij verschillende behoeften en budgetten. Heb je specifieke wensen of past geen van onze pakketten bij jouw behoeften? Kies dan voor ons maatwerk pakket of neem contact met ons op voor een persoonlijke offerte.' : 
                'We offer different packages that cater to different needs and budgets. Do you have specific requirements or does none of our packages meet your needs? Then choose our custom package or contact us for a personalized quote.';
        }
    }
    
    // Update pricing model section
    const pricingModelTitle = document.querySelector('.pricing-info h3');
    if (pricingModelTitle) {
        pricingModelTitle.textContent = lang === 'nl' ? 
            'Ons hybride prijsmodel' : 
            'Our hybrid pricing model';
    }
    
    const pricingModelLabels = document.querySelectorAll('.pricing-info h4');
    if (pricingModelLabels.length >= 2) {
        if (pricingModelLabels[0]) {
            pricingModelLabels[0].textContent = lang === 'nl' ? 
                'Eenmalig bedrag' : 
                'One-time fee';
        }
        if (pricingModelLabels[1]) {
            pricingModelLabels[1].textContent = lang === 'nl' ? 
                'Maandelijks bedrag' : 
                'Monthly fee';
        }
    }
    
    const pricingModelDescriptions = document.querySelectorAll('.pricing-info p');
    if (pricingModelDescriptions.length >= 2) {
        if (pricingModelDescriptions[0]) {
            pricingModelDescriptions[0].textContent = lang === 'nl' ? 
                'Voor het ontwerpen en bouwen van je website' : 
                'For designing and building your website';
        }
        if (pricingModelDescriptions[1]) {
            pricingModelDescriptions[1].textContent = lang === 'nl' ? 
                'Voor hosting en kleine updates' : 
                'For hosting and small updates';
        }
    }
    
    // Update pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    if (pricingCards.length > 0) {
        pricingCards.forEach(card => {
            const title = card.querySelector('.pricing-title');
            const period = card.querySelector('.period');
            const cta = card.querySelector('.btn');
            const hostingText = card.querySelector('.pricing-price div:nth-of-type(2)');
            const note = card.querySelector('.pricing-note p');
            const features = card.querySelectorAll('.pricing-features li');
            
            if (title && title.textContent.includes('Starter')) {
                title.textContent = t.pricing_starter;
            } else if (title && (title.textContent.includes('Standaard') || title.textContent.includes('Standard'))) {
                title.textContent = lang === 'nl' ? 'Standaard' : 'Standard';
            } else if (title && title.textContent.includes('Premium')) {
                title.textContent = 'Premium';
            } else if (title && (title.textContent.includes('Maatwerk') || title.textContent.includes('Custom'))) {
                title.textContent = lang === 'nl' ? 'Maatwerk' : 'Custom';
            }
            
            if (period) period.textContent = t.pricing_once;
            if (cta) cta.textContent = t.pricing_cta;
            
            if (hostingText) {
                hostingText.textContent = lang === 'nl' ? 
                    'voor hosting & updates' : 
                    'for hosting & updates';
            }
            
            // Translate features
            if (features && features.length > 0) {
                features.forEach(feature => {
                    // Check if it's an available or unavailable feature
                    const isAvailable = !feature.classList.contains('unavailable');
                    
                    // Get the feature text (without the icon)
                    const featureText = feature.textContent.trim().replace(/^[✓✕]\s*/, '');
                    
                    // Translate common features
                    if (featureText.includes('One-page website') || featureText.includes('One-page')) {
                        feature.innerHTML = isAvailable ? 
                            `<i class="fas fa-check"></i> ${lang === 'nl' ? 'One-page website' : 'One-page website'}` : 
                            `<i class="fas fa-times"></i> ${lang === 'nl' ? 'One-page website' : 'One-page website'}`;
                    } else if (featureText.includes('Responsive design')) {
                        feature.innerHTML = isAvailable ? 
                            `<i class="fas fa-check"></i> ${lang === 'nl' ? 'Responsive design' : 'Responsive design'}` : 
                            `<i class="fas fa-times"></i> ${lang === 'nl' ? 'Responsive design' : 'Responsive design'}`;
                    } else if (featureText.includes('Basis-SEO') || featureText.includes('Basic SEO')) {
                        feature.innerHTML = isAvailable ? 
                            `<i class="fas fa-check"></i> ${lang === 'nl' ? 'Basis-SEO' : 'Basic SEO optimization'}` : 
                            `<i class="fas fa-times"></i> ${lang === 'nl' ? 'Basis-SEO' : 'Basic SEO optimization'}`;
                    } else if (featureText.includes('Contactformulier') || featureText.includes('Contact form')) {
                        feature.innerHTML = isAvailable ? 
                            `<i class="fas fa-check"></i> ${lang === 'nl' ? 'Contactformulier' : 'Contact form'}` : 
                            `<i class="fas fa-times"></i> ${lang === 'nl' ? 'Contactformulier' : 'Contact form'}`;
                    } else if (featureText.includes('Social media links')) {
                        feature.innerHTML = isAvailable ? 
                            `<i class="fas fa-check"></i> ${lang === 'nl' ? 'Social media links' : 'Social media links'}` : 
                            `<i class="fas fa-times"></i> ${lang === 'nl' ? 'Social media links' : 'Social media links'}`;
                    } else if (featureText.includes('Mobiel-vriendelijk design') || featureText.includes('Mobile-friendly design')) {
                        feature.innerHTML = isAvailable ? 
                            `<i class="fas fa-check"></i> ${lang === 'nl' ? 'Mobiel-vriendelijk design' : 'Mobile-friendly design'}` : 
                            `<i class="fas fa-times"></i> ${lang === 'nl' ? 'Mobiel-vriendelijk design' : 'Mobile-friendly design'}`;
                    } else if (featureText.includes('revisieronde') || featureText.includes('revision round')) {
                        feature.innerHTML = isAvailable ? 
                            `<i class="fas fa-check"></i> ${lang === 'nl' ? '1 revisieronde' : '1 revision round'}` : 
                            `<i class="fas fa-times"></i> ${lang === 'nl' ? '1 revisieronde' : '1 revision round'}`;
                    } else if (featureText.includes('Portfolio of blog-optie') || featureText.includes('Portfolio or blog option')) {
                        feature.innerHTML = isAvailable ? 
                            `<i class="fas fa-check"></i> ${lang === 'nl' ? 'Portfolio of blog-optie' : 'Portfolio or blog option'}` : 
                            `<i class="fas fa-times"></i> ${lang === 'nl' ? 'Portfolio of blog-optie' : 'Portfolio or blog option'}`;
                    } else if (featureText.includes('Content management systeem') || featureText.includes('Content management system')) {
                        feature.innerHTML = isAvailable ? 
                            `<i class="fas fa-check"></i> ${lang === 'nl' ? 'Content management systeem' : 'Content management system'}` : 
                            `<i class="fas fa-times"></i> ${lang === 'nl' ? 'Content management systeem' : 'Content management system'}`;
                    } else if (featureText.includes('E-commerce functionaliteit') || featureText.includes('E-commerce functionality')) {
                        feature.innerHTML = isAvailable ? 
                            `<i class="fas fa-check"></i> ${lang === 'nl' ? 'E-commerce functionaliteit' : 'E-commerce functionality'}` : 
                            `<i class="fas fa-times"></i> ${lang === 'nl' ? 'E-commerce functionaliteit' : 'E-commerce functionality'}`;
                    } else if (featureText.includes('Meerdere pagina\'s') || featureText.includes('Multiple pages')) {
                        feature.innerHTML = isAvailable ? 
                            `<i class="fas fa-check"></i> ${lang === 'nl' ? 'Meerdere pagina\'s' : 'Multiple pages'}` : 
                            `<i class="fas fa-times"></i> ${lang === 'nl' ? 'Meerdere pagina\'s' : 'Multiple pages'}`;
                    } else if (featureText.includes('SEO-optimalisatie') || featureText.includes('SEO optimization')) {
                        feature.innerHTML = isAvailable ? 
                            `<i class="fas fa-check"></i> ${lang === 'nl' ? 'SEO-optimalisatie' : 'SEO optimization'}` : 
                            `<i class="fas fa-times"></i> ${lang === 'nl' ? 'SEO-optimalisatie' : 'SEO optimization'}`;
                    } else if (featureText.includes('Google Analytics integratie') || featureText.includes('Google Analytics integration')) {
                        feature.innerHTML = isAvailable ? 
                            `<i class="fas fa-check"></i> ${lang === 'nl' ? 'Google Analytics integratie' : 'Google Analytics integration'}` : 
                            `<i class="fas fa-times"></i> ${lang === 'nl' ? 'Google Analytics integratie' : 'Google Analytics integration'}`;
                    } else if (featureText.includes('Social media integratie') || featureText.includes('Social media integration')) {
                        feature.innerHTML = isAvailable ? 
                            `<i class="fas fa-check"></i> ${lang === 'nl' ? 'Social media integratie' : 'Social media integration'}` : 
                            `<i class="fas fa-times"></i> ${lang === 'nl' ? 'Social media integratie' : 'Social media integration'}`;
                    } else if (featureText.includes('revisierondes') || featureText.includes('revision rounds')) {
                        feature.innerHTML = isAvailable ? 
                            `<i class="fas fa-check"></i> ${lang === 'nl' ? '2 revisierondes' : '2 revision rounds'}` : 
                            `<i class="fas fa-times"></i> ${lang === 'nl' ? '2 revisierondes' : '2 revision rounds'}`;
                    } else if (featureText.includes('Snelle oplevering') || featureText.includes('Fast delivery')) {
                        feature.innerHTML = isAvailable ? 
                            `<i class="fas fa-check"></i> ${lang === 'nl' ? 'Snelle oplevering' : 'Fast delivery'}` : 
                            `<i class="fas fa-times"></i> ${lang === 'nl' ? 'Snelle oplevering' : 'Fast delivery'}`;
                    } else if (featureText.includes('Maatwerk functionaliteiten') || featureText.includes('Custom functionalities')) {
                        feature.innerHTML = isAvailable ? 
                            `<i class="fas fa-check"></i> ${lang === 'nl' ? 'Maatwerk functionaliteiten' : 'Custom functionalities'}` : 
                            `<i class="fas fa-times"></i> ${lang === 'nl' ? 'Maatwerk functionaliteiten' : 'Custom functionalities'}`;
                    }
                });
            }
            
            if (note) {
                if (title && title.textContent.includes('Starter')) {
                    note.textContent = lang === 'nl' ? 
                        'Ideaal voor ZZP\'ers en starters die een professionele online aanwezigheid willen.' : 
                        'Ideal for freelancers and startups who want a professional online presence.';
                } else if (title && (title.textContent.includes('Standaard') || title.textContent.includes('Standard'))) {
                    note.textContent = lang === 'nl' ? 
                        'Perfect voor groeiende bedrijven die meer controle willen over hun website.' : 
                        'Perfect for growing businesses that want more control over their website.';
                } else if (title && title.textContent.includes('Premium')) {
                    note.textContent = lang === 'nl' ? 
                        'De professionele oplossing voor bedrijven die een uitgebreide online aanwezigheid nodig hebben.' : 
                        'The professional solution for businesses that need an extensive online presence.';
                } else if (title && (title.textContent.includes('Maatwerk') || title.textContent.includes('Custom'))) {
                    note.textContent = lang === 'nl' ? 
                        'Voor bedrijven met specifieke wensen en behoeften die een unieke website nodig hebben.' : 
                        'For businesses with specific wishes and needs that require a unique website.';
                }
            }
        });
    }
    
    // Update pricing disclaimer
    const pricingDisclaimer = document.querySelector('.pricing-disclaimer p');
    if (pricingDisclaimer) {
        pricingDisclaimer.textContent = lang === 'nl' ? 
            'Alle prijzen zijn exclusief BTW. Ons hybride prijsmodel bestaat uit een eenmalig bedrag voor het ontwerp en de ontwikkeling van je website, plus een maandelijks bedrag voor hosting en kleine updates. Zo heb je geen onverwachte kosten en blijft je website altijd up-to-date.' : 
            'All prices exclude VAT. Our hybrid pricing model consists of a one-time fee for the design and development of your website, plus a monthly fee for hosting and small updates. This way, you have no unexpected costs and your website always stays up-to-date.';
    }
    
    // Update additional services section
    const additionalServicesTitle = document.querySelector('.additional-pricing h2');
    if (additionalServicesTitle) {
        additionalServicesTitle.textContent = lang === 'nl' ? 
            'Aanvullende Diensten' : 
            'Additional Services';
    }
    
    // Update footer
    const copyright = document.querySelector('.copyright');
    if (copyright) copyright.textContent = t.copyright;
}

// Form validation for contact form
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

// Listen for hash changes to update language
window.addEventListener('hashchange', function() {
    if (window.location.hash) {
        const hash = window.location.hash.substring(1); // Remove the # symbol
        if (hash === 'en' || hash === 'nl') {
            switchLanguage(hash, false); // Don't update hash again to avoid infinite loop
        }
    }
});
