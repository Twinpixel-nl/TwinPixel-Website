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
        // Navigation
        'nav_home': 'Home',
        'nav_about': 'Over ons',
        'nav_services': 'Diensten',
        'nav_portfolio': 'Portfolio',
        'nav_pricing': 'Prijzen',
        'nav_contact': 'Contact',
        
        // Portfolio page
        'portfolio_title': 'Ons Portfolio',
        'portfolio_intro_title': 'Ontdek onze projecten',
        'portfolio_intro_1': 'Bij TwinPixel zijn we trots op de websites die we hebben ontworpen en ontwikkeld voor onze klanten. Elk project is uniek en op maat gemaakt om aan de specifieke behoeften en doelstellingen van onze klanten te voldoen.',
        'portfolio_intro_2': 'Bekijk hieronder een selectie van onze recente projecten en laat je inspireren door wat wij voor jou kunnen betekenen.',
        'portfolio_filter_all': 'Alle projecten',
        'portfolio_filter_webshop': 'Webshops',
        'portfolio_filter_business': 'Zakelijke websites',
        'portfolio_filter_portfolio': 'Portfolio websites',
        'portfolio_filter_blog': 'Blogs',
        'portfolio_cta_title': 'Klaar voor jouw eigen unieke website?',
        'portfolio_cta_text': 'Laat ons je helpen om jouw online aanwezigheid naar een hoger niveau te tillen.',
        'portfolio_cta_button': 'Neem contact op',
        
        // About page
        'about_title': 'Over TwinPixel',
        'about_story_title': 'Het verhaal achter TwinPixel',
        'about_story_1': 'TwinPixel is opgericht door Emma de Heer (UX designer) en Twan Meurs (developer), twee studenten met een passie voor webdesign en development. Samen hebben we ook uitgebreide business expertise, waardoor we niet alleen technisch sterke websites bouwen, maar ook websites die echt bijdragen aan het succes van jouw bedrijf.',
        'about_story_2': 'Wat begon als een hobby tijdens onze studie, is uitgegroeid tot een professioneel webdesignbureau met een duidelijke missie: betaalbare, hoogwaardige websites leveren aan ZZP\'ers en MKB\'ers.',
        'about_story_3': 'Wij geloven dat elke ondernemer recht heeft op een professionele online aanwezigheid, zonder de hoge kosten die grote bureaus vaak rekenen. Door onze efficiënte werkwijze en focus op wat écht belangrijk is, kunnen wij kwalitatief hoogwaardige websites leveren tegen betaalbare prijzen.',
        'about_vision_title': 'Onze visie',
        'about_vision': 'Wij zien een wereld waarin elke ondernemer, groot of klein, toegang heeft tot professionele webdesign diensten die hun bedrijf helpen groeien. Geen generieke templates, maar op maat gemaakte websites die perfect aansluiten bij de identiteit en doelstellingen van jouw bedrijf.',
        'about_approach_title': 'Onze aanpak',
        'about_approach_1': 'Bij TwinPixel geloven we in een persoonlijke aanpak. We nemen de tijd om jouw bedrijf, doelgroep en doelstellingen te begrijpen voordat we aan de slag gaan. Dit stelt ons in staat om een website te creëren die niet alleen mooi is, maar ook effectief in het bereiken van jouw doelen.',
        'about_approach_2': 'Onze werkwijze is transparant en direct. Je hebt altijd rechtstreeks contact met de designers en developers die aan jouw project werken, zonder tussenlagen of account managers. Dit zorgt voor snellere communicatie, kortere lijnen en uiteindelijk een beter eindresultaat.',
        'about_features_title': 'Waarom kiezen voor TwinPixel?',
        'about_feature_1_title': 'Snelle levering',
        'about_feature_1_desc': 'Geen lange wachttijden. Wij leveren binnen afgesproken deadlines, zodat jij snel online kunt gaan.',
        'about_feature_2_title': '100% maatwerk',
        'about_feature_2_desc': 'Geen standaard templates, maar een uniek design dat perfect past bij jouw merk en doelstellingen.',
        'about_feature_3_title': 'Scherpe prijzen',
        'about_feature_3_desc': 'Professionele kwaliteit zonder de hoge kosten van grote bureaus. Transparante prijzen, geen verborgen kosten.',
        'about_feature_4_title': 'Persoonlijke aanpak',
        'about_feature_4_desc': 'Direct contact met de designers en developers die aan jouw project werken. Korte lijnen, snelle communicatie.',
        'about_feature_5_title': 'Responsive design',
        'about_feature_5_desc': 'Alle websites zijn volledig responsive en werken perfect op alle apparaten, van desktop tot smartphone.',
        'about_feature_6_title': 'SEO-geoptimaliseerd',
        'about_feature_6_desc': 'Alle websites worden geoptimaliseerd voor zoekmachines, zodat jij beter gevonden wordt door potentiële klanten.',
        'about_team_title': 'Ons Team',
        'about_team_member_1': 'Twan Meurs',
        'about_team_role_1': 'Mede-oprichter & Web Developer',
        'about_team_bio_1': 'Twan is onze technische expert. Hij zorgt ervoor dat alle websites niet alleen mooi zijn, maar ook snel, veilig en technisch perfect werken.',
        'about_team_member_2': 'Emma de Heer',
        'about_team_role_2': 'Mede-oprichter & UX/UI Designer',
        'about_team_bio_2': 'Emma is gespecialiseerd in gebruiksvriendelijk en visueel aantrekkelijk design. Zij zorgt ervoor dat elke website niet alleen mooi is, maar ook intuïtief in gebruik.',
        'about_cta_title': 'Klaar om samen te werken?',
        'about_cta_text': 'Laat ons je helpen om jouw online aanwezigheid naar een hoger niveau te tillen.',
        'about_cta_button': 'Neem contact op'
    },
    'en': {
        // Navigation
        'nav_home': 'Home',
        'nav_about': 'About us',
        'nav_services': 'Services',
        'nav_portfolio': 'Portfolio',
        'nav_pricing': 'Pricing',
        'nav_contact': 'Contact',
        
        // Portfolio page
        'portfolio_title': 'Our Portfolio',
        'portfolio_intro_title': 'Discover our projects',
        'portfolio_intro_1': 'At TwinPixel, we are proud of the websites we have designed and developed for our clients. Each project is unique and tailored to meet the specific needs and objectives of our clients.',
        'portfolio_intro_2': 'Take a look at a selection of our recent projects below and get inspired by what we can do for you.',
        'portfolio_filter_all': 'All projects',
        'portfolio_filter_webshop': 'Webshops',
        'portfolio_filter_business': 'Business websites',
        'portfolio_filter_portfolio': 'Portfolio websites',
        'portfolio_filter_blog': 'Blogs',
        'portfolio_cta_title': 'Ready for your own unique website?',
        'portfolio_cta_text': 'Let us help you take your online presence to the next level.',
        'portfolio_cta_button': 'Contact us',
        
        // About page
        'about_title': 'About TwinPixel',
        'about_story_title': 'The story behind TwinPixel',
        'about_story_1': 'TwinPixel was founded by Emma de Heer (UX designer) and Twan Meurs (developer), two students with a passion for web design and development. Together, we also have extensive business expertise, which means we not only build technically strong websites, but also websites that truly contribute to the success of your business.',
        'about_story_2': 'What started as a hobby during our studies has grown into a professional web design agency with a clear mission: to deliver affordable, high-quality websites to freelancers and SMEs.',
        'about_story_3': 'We believe that every entrepreneur deserves a professional online presence, without the high costs that large agencies often charge. Through our efficient approach and focus on what really matters, we can deliver high-quality websites at affordable prices.',
        'about_vision_title': 'Our vision',
        'about_vision': 'We envision a world where every entrepreneur, large or small, has access to professional web design services that help their business grow. No generic templates, but custom-made websites that perfectly match the identity and objectives of your business.',
        'about_approach_title': 'Our approach',
        'about_approach_1': 'At TwinPixel, we believe in a personal approach. We take the time to understand your business, target audience, and objectives before we get started. This allows us to create a website that is not only beautiful, but also effective in achieving your goals.',
        'about_approach_2': 'Our way of working is transparent and direct. You always have direct contact with the designers and developers working on your project, without intermediaries or account managers. This ensures faster communication, shorter lines, and ultimately a better end result.',
        'about_features_title': 'Why choose TwinPixel?',
        'about_feature_1_title': 'Fast delivery',
        'about_feature_1_desc': 'No long waiting times. We deliver within agreed deadlines, so you can go online quickly.',
        'about_feature_2_title': '100% custom',
        'about_feature_2_desc': 'No standard templates, but a unique design that perfectly fits your brand and objectives.',
        'about_feature_3_title': 'Competitive prices',
        'about_feature_3_desc': 'Professional quality without the high costs of large agencies. Transparent prices, no hidden costs.',
        'about_feature_4_title': 'Personal approach',
        'about_feature_4_desc': 'Direct contact with the designers and developers working on your project. Short lines, fast communication.',
        'about_feature_5_title': 'Responsive design',
        'about_feature_5_desc': 'All websites are fully responsive and work perfectly on all devices, from desktop to smartphone.',
        'about_feature_6_title': 'SEO-optimized',
        'about_feature_6_desc': 'All websites are optimized for search engines, so you can be found more easily by potential customers.',
        'about_team_title': 'Our Team',
        'about_team_member_1': 'Twan Meurs',
        'about_team_role_1': 'Co-founder & Web Developer',
        'about_team_bio_1': 'Twan is our technical expert. He ensures that all websites are not only beautiful, but also fast, secure, and technically perfect.',
        'about_team_member_2': 'Emma de Heer',
        'about_team_role_2': 'Co-founder & UX/UI Designer',
        'about_team_bio_2': 'Emma specializes in user-friendly and visually appealing design. She ensures that every website is not only beautiful, but also intuitive to use.',
        'about_cta_title': 'Ready to work together?',
        'about_cta_text': 'Let us help you take your online presence to the next level.',
        'about_cta_button': 'Contact us'
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
    
    // Update page header based on current page
    const pageHeader = document.querySelector('.page-header h1');
    if (pageHeader) {
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage.includes('portfolio')) {
            pageHeader.textContent = t.portfolio_title;
        } else if (currentPage.includes('about')) {
            pageHeader.textContent = t.about_title;
        }
    }
    
    // Update portfolio page specific elements
    const portfolioIntroTitle = document.querySelector('.portfolio-intro h2');
    if (portfolioIntroTitle) {
        portfolioIntroTitle.textContent = t.portfolio_intro_title;
    }
    
    const portfolioIntroParagraphs = document.querySelectorAll('.portfolio-intro p');
    if (portfolioIntroParagraphs.length >= 2) {
        if (portfolioIntroParagraphs[0]) {
            portfolioIntroParagraphs[0].textContent = t.portfolio_intro_1;
        }
        if (portfolioIntroParagraphs[1]) {
            portfolioIntroParagraphs[1].textContent = t.portfolio_intro_2;
        }
    }
    
    // Update portfolio filters
    const portfolioFilters = document.querySelectorAll('.filter-btn');
    if (portfolioFilters.length > 0) {
        const filterItems = ['portfolio_filter_all', 'portfolio_filter_webshop', 'portfolio_filter_business', 'portfolio_filter_portfolio', 'portfolio_filter_blog'];
        portfolioFilters.forEach((filter, index) => {
            if (index < filterItems.length) {
                filter.textContent = t[filterItems[index]];
            }
        });
    }
    
    // Update portfolio CTA section
    const portfolioCtaTitle = document.querySelector('.cta-section h2');
    if (portfolioCtaTitle) {
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage.includes('portfolio')) {
            portfolioCtaTitle.textContent = t.portfolio_cta_title;
        } else if (currentPage.includes('about')) {
            portfolioCtaTitle.textContent = t.about_cta_title;
        } else {
            portfolioCtaTitle.textContent = t.cta_title;
        }
    }
    
    const portfolioCtaText = document.querySelector('.cta-section p');
    if (portfolioCtaText) {
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage.includes('portfolio')) {
            portfolioCtaText.textContent = t.portfolio_cta_text;
        } else if (currentPage.includes('about')) {
            portfolioCtaText.textContent = t.about_cta_text;
        } else {
            portfolioCtaText.textContent = t.cta_subtitle;
        }
    }
    
    const portfolioCtaButton = document.querySelector('.cta-section .btn');
    if (portfolioCtaButton) {
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentPage.includes('portfolio')) {
            portfolioCtaButton.textContent = t.portfolio_cta_button;
        } else if (currentPage.includes('about')) {
            portfolioCtaButton.textContent = t.about_cta_button;
        } else {
            portfolioCtaButton.textContent = t.cta_button;
        }
    }
    
    // Update about page specific elements
    const aboutContentHeadings = document.querySelectorAll('.about-content h2');
    if (aboutContentHeadings.length > 0) {
        aboutContentHeadings.forEach(heading => {
            if (heading.textContent.includes('Het verhaal') || heading.textContent.includes('The story')) {
                heading.textContent = t.about_story_title;
            } else if (heading.textContent.includes('Onze visie') || heading.textContent.includes('Our vision')) {
                heading.textContent = t.about_vision_title;
            } else if (heading.textContent.includes('Onze aanpak') || heading.textContent.includes('Our approach')) {
                heading.textContent = t.about_approach_title;
            }
        });
    }
    
    const aboutContentParagraphs = document.querySelectorAll('.about-content p');
    if (aboutContentParagraphs.length >= 6) {
        // Story paragraphs
        if (aboutContentParagraphs[0]) aboutContentParagraphs[0].textContent = t.about_story_1;
        if (aboutContentParagraphs[1]) aboutContentParagraphs[1].textContent = t.about_story_2;
        if (aboutContentParagraphs[2]) aboutContentParagraphs[2].textContent = t.about_story_3;
        
        // Vision paragraph
        if (aboutContentParagraphs[3]) aboutContentParagraphs[3].textContent = t.about_vision;
        
        // Approach paragraphs
        if (aboutContentParagraphs[4]) aboutContentParagraphs[4].textContent = t.about_approach_1;
        if (aboutContentParagraphs[5]) aboutContentParagraphs[5].textContent = t.about_approach_2;
    }
    
    // Update about features section
    const aboutFeaturesTitle = document.querySelector('.about-features h2');
    if (aboutFeaturesTitle) {
        aboutFeaturesTitle.textContent = t.about_features_title;
    }
    
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length >= 6) {
        // Feature 1
        const feature1Title = featureCards[0].querySelector('h3');
        const feature1Desc = featureCards[0].querySelector('p');
        if (feature1Title) feature1Title.textContent = t.about_feature_1_title;
        if (feature1Desc) feature1Desc.textContent = t.about_feature_1_desc;
        
        // Feature 2
        const feature2Title = featureCards[1].querySelector('h3');
        const feature2Desc = featureCards[1].querySelector('p');
        if (feature2Title) feature2Title.textContent = t.about_feature_2_title;
        if (feature2Desc) feature2Desc.textContent = t.about_feature_2_desc;
        
        // Feature 3
        const feature3Title = featureCards[2].querySelector('h3');
        const feature3Desc = featureCards[2].querySelector('p');
        if (feature3Title) feature3Title.textContent = t.about_feature_3_title;
        if (feature3Desc) feature3Desc.textContent = t.about_feature_3_desc;
        
        // Feature 4
        const feature4Title = featureCards[3].querySelector('h3');
        const feature4Desc = featureCards[3].querySelector('p');
        if (feature4Title) feature4Title.textContent = t.about_feature_4_title;
        if (feature4Desc) feature4Desc.textContent = t.about_feature_4_desc;
        
        // Feature 5
        const feature5Title = featureCards[4].querySelector('h3');
        const feature5Desc = featureCards[4].querySelector('p');
        if (feature5Title) feature5Title.textContent = t.about_feature_5_title;
        if (feature5Desc) feature5Desc.textContent = t.about_feature_5_desc;
        
        // Feature 6
        const feature6Title = featureCards[5].querySelector('h3');
        const feature6Desc = featureCards[5].querySelector('p');
        if (feature6Title) feature6Title.textContent = t.about_feature_6_title;
        if (feature6Desc) feature6Desc.textContent = t.about_feature_6_desc;
    }
    
    // Update team section
    const teamSectionTitle = document.querySelector('.team-section h2');
    if (teamSectionTitle) {
        teamSectionTitle.textContent = t.about_team_title;
    }
    
    const teamMembers = document.querySelectorAll('.team-member');
    if (teamMembers.length >= 2) {
        // Team member 1
        const member1Name = teamMembers[0].querySelector('h3');
        const member1Role = teamMembers[0].querySelector('.team-role');
        const member1Bio = teamMembers[0].querySelector('.team-bio');
        if (member1Name) member1Name.textContent = t.about_team_member_1;
        if (member1Role) member1Role.textContent = t.about_team_role_1;
        if (member1Bio) member1Bio.textContent = t.about_team_bio_1;
        
        // Team member 2
        const member2Name = teamMembers[1].querySelector('h3');
        const member2Role = teamMembers[1].querySelector('.team-role');
        const member2Bio = teamMembers[1].querySelector('.team-bio');
        if (member2Name) member2Name.textContent = t.about_team_member_2;
        if (member2Role) member2Role.textContent = t.about_team_role_2;
        if (member2Bio) member2Bio.textContent = t.about_team_bio_2;
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
