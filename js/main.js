// TwinPixel Website JavaScript

// --- I18N Setup ---
let currentTranslations = {}; // Will hold the loaded language JSON
let currentLang = 'nl'; // Default language

// Function to fetch and load translations from JSON files
async function loadTranslations(lang) {
    try {
        // Fetch the JSON file from the 'trans' directory
        const response = await fetch(`trans/${lang}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, lang: ${lang}`);
        }
        currentTranslations = await response.json();
        console.log(`Translations loaded successfully for ${lang}`);
        // After loading, update the page content
        updatePageContent(lang);
    } catch (error) {
        console.error(`Could not load translations for ${lang}:`, error);
        // Fallback to default language if the requested one failed (and it wasn't the default)
        if (lang !== 'nl') {
            console.warn("Falling back to default language 'nl'");
            await loadTranslations('nl'); // Use await to ensure fallback finishes
        } else {
            // If default 'nl' fails, show a basic error to the user
            alert("Error loading website text. Please try refreshing the page.");
        }
    }
}

// Function to determine the current page key for translations
function determineCurrentPageKey() {
    const path = window.location.pathname.split("/").pop().toLowerCase();
    if (path === "" || path.startsWith("index.html")) return "home";
    if (path.startsWith("about.html")) return "about";
    if (path.startsWith("services.html")) return "services";
    if (path.startsWith("portfolio.html")) return "portfolio";
    if (path.startsWith("pricing.html")) return "pricing";
    if (path.startsWith("contact.html")) return "contact";
    // Add other pages if needed
    return null; // Return null if no specific page key is identified (e.g., error pages)
}

// Function to update page content using loaded translations and data-i18n attributes
function updatePageContent(lang) {
    if (!currentTranslations || Object.keys(currentTranslations).length === 0) {
        console.error("Translations not loaded or empty!");
        return;
    }

    console.log(`Applying translations for lang: ${lang}`);

    // Update all elements with a data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const keyParts = key.split('.'); // Split key like "common.nav_home" or "home.hero_title"

        let translation = currentTranslations;
        let translationFound = true;

        // Traverse the nested translation object
        for (const part of keyParts) {
            if (translation && translation.hasOwnProperty(part)) {
                translation = translation[part];
            } else {
                translation = null; // Key path not found
                translationFound = false;
                console.warn(`Translation key "${key}" not found in ${lang}.json`);
                break;
            }
        }

        // Apply the translation if it's a string
        if (translationFound && typeof translation === 'string') {
            // Handle elements that might contain HTML tags within the translation
            if (translation.includes('<') && translation.includes('>')) {
                el.innerHTML = translation;
            }
            // Handle specific element types or attributes
            else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                 if (el.placeholder !== undefined) { // Check if placeholder attribute exists
                    el.placeholder = translation;
                 } else {
                     el.textContent = translation; // Fallback for other input types if needed
                 }
            } else if (el.tagName === 'META' && el.name === 'description') {
                el.content = translation;
            }
            // Default: set textContent for most elements
            else {
                el.textContent = translation;
            }
        } else if (translation !== null) {
             // Log warning if the found translation is not a string (e.g., it's an object or array)
             console.warn(`Translation value for key "${key}" is not a string.`);
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;
}



// --- Form Validation ---
// Modified to use loaded translations
function validateContactForm(form) {
    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const subject = form.querySelector("#subject");
    const message = form.querySelector("#message");

    // Use the globally loaded translations
    const t = currentTranslations.common;
    if (!t) {
        alert('Language data not loaded correctly. Please refresh the page.'); // Basic fallback
        return false;
    }

    // Clear previous errors if any (optional)
    // ...

    // Validate required fields
    if (!name.value.trim()) {
        alert(t.form_name_required);
        name.focus();
        return false;
    }

    if (!email.value.trim()) {
        alert(t.form_email_required);
        email.focus();
        return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        alert(t.form_email_invalid);
        email.focus();
        return false;
    }

    if (!subject.value.trim()) {
        alert(t.form_subject_required);
        subject.focus();
        return false;
    }

    if (!message.value.trim()) {
        alert(t.form_message_required);
        message.focus();
        return false;
    }

    // If all validations pass
    return true;
}




// --- Initial Load & Event Listeners ---
document.addEventListener("DOMContentLoaded", async () => { // Make async to wait for initial load
    // Determine initial language
    let initialLang = 'nl'; // Default
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        if (hash === "en" || hash === "nl") {
            initialLang = hash;
        }
    } else {
        const cookieLang = getCookie("preferredLanguage");
        if (cookieLang === "en" || cookieLang === "nl") {
            initialLang = cookieLang;
        }
    }
    currentLang = initialLang; // Set global currentLang

    // Load initial translations and wait for them
    await loadTranslations(currentLang);


    // --- UI Initializations AFTER translations are loaded ---

    // Update language selector UI
    const languageSelector = document.querySelector(".language-switcher select");
    if (languageSelector) {
        languageSelector.value = currentLang;
        languageSelector.addEventListener("change", function () {
            switchLanguage(this.value);
        });
    }

    // Update language button states and add listeners
    const langButtons = document.querySelectorAll(".lang-btn");
    if (langButtons.length > 0) {
        updateLangButtonActiveState(currentLang); // Set initial active state
        langButtons.forEach((btn) => {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                const lang = this.getAttribute("href").substring(1);
                switchLanguage(lang);
            });
        });
    }

    // Add event listener for form submission
    const formSubmitBtn = document.querySelector(".form-submit-btn");
    if (formSubmitBtn) {
        formSubmitBtn.addEventListener("click", function (e) {
            e.preventDefault();
            const form = document.querySelector(".contact-form");
            if (form && validateContactForm(form)) {
                // Consider using fetch API for form submission for better UX
                form.submit();
            }
        });
    }

    // Listen for hash changes to switch language
    window.addEventListener("hashchange", function () {
        const hash = window.location.hash.substring(1);
        if ((hash === "en" || hash === "nl") && hash !== currentLang) {
            console.log("Hash changed to:", hash);
            switchLanguage(hash, false); // Don't update hash again
        }
    });

    // Initialize other website features
    highlightActivePage();
    initAnimations();
    initSmoothScrolling();
    initMobileMenu();
    initHeaderScroll();
    initFaqRipple(); // Renamed for clarity
    initLightbox(); // Renamed for clarity

    // Initialize testimonial slider only if it exists
    if (document.querySelector(".testimonial-slider")) {
        initTestimonialSlider();
    }
});



// --- Language Switching Functionality ---
function switchLanguage(lang, updateHash = true) {
    if (lang !== 'nl' && lang !== 'en') return; // Only allow supported languages
    if (lang === currentLang && Object.keys(currentTranslations).length > 0) return; // Don't reload if lang same & loaded

    console.log("Attempting to switch language to:", lang);
    const previousLang = currentLang;
    currentLang = lang; // Update global variable

    setCookie("preferredLanguage", lang, 30);

    if (updateHash) {
        // Use replaceState to avoid multiple history entries for language changes
        history.replaceState(null, '', `#${lang}`);
        // window.location.hash = lang; // Alternative, adds to history
    }

    // Update UI elements immediately for responsiveness
    updateLangButtonActiveState(lang);
    const langSelect = document.querySelector(".language-switcher select");
    if (langSelect) {
        langSelect.value = lang;
    }

    // Add a subtle page transition effect
    const body = document.body;
    body.style.opacity = "0.8";
    body.style.transition = "opacity 0.1s ease-out";

    // Load new translations
    loadTranslations(lang).then(() => {
        // Fade back in smoothly only after translations are applied
        setTimeout(() => {
            body.style.opacity = "1";
            body.style.transition = "opacity 0.3s ease-in";
        }, 50); // Adjust delay if needed
        updateChatbotLanguage(lang); 
    }).catch(error => {
        // Handle potential error during the switch (e.g., network issue)
        console.error(`Failed to switch language to ${lang}:`, error);
        currentLang = previousLang; // Revert lang state if switch failed
        // Optionally revert UI changes or show error message
        updateLangButtonActiveState(currentLang);
         if (langSelect) langSelect.value = currentLang;
        alert(`Failed to load ${lang} language. Please check your connection.`);
        body.style.opacity = "1"; // Ensure body is visible
    });
}


// Helper to update button active states and indicator
function updateLangButtonActiveState(lang) {
    const langButtons = document.querySelectorAll(".lang-btn");
    if (langButtons.length > 0) {
        langButtons.forEach((btn) => {
            const btnLang = btn.getAttribute("href")?.substring(1); // Use optional chaining
            if (btnLang && btnLang.toLowerCase() === lang.toLowerCase()) {
                btn.classList.add("active");
                 // re-trigger pulse animation if desired
                 btn.style.animation = 'none';
                 requestAnimationFrame(() => {
                     setTimeout(() => { btn.style.animation = ''; }, 0);
                 });
            } else {
                btn.classList.remove("active");
            }
        });

        // Update indicator position class
        const languageButtonsContainer = document.querySelector(".language-buttons");
        if (languageButtonsContainer) {
            if (lang.toLowerCase() === "en") {
                languageButtonsContainer.classList.add("en-active");
            } else {
                languageButtonsContainer.classList.remove("en-active");
            }
        }
    }
}



// --- UI Initializations & Helpers ---

// Highlight the active page in the navigation menu
function highlightActivePage() {
    try {
        const currentPage = window.location.pathname.split("/").pop() || "index.html"; // Default to index.html
        const body = document.body;

        // Remove previous page classes
        body.classList.remove("home-page", "inner-page");

        // Add current page class to body
        if (currentPage === "index.html") {
            body.classList.add("home-page");
        } else {
            body.classList.add("inner-page");
             // Add specific page class e.g., 'about-page' based on currentPage filename
             const pageName = currentPage.replace('.html', '');
             body.classList.add(`${pageName}-page`);
        }

        // Update nav link active states
        const navLinks = document.querySelectorAll(".nav-links a, .footer-links a"); // Include footer
        navLinks.forEach((link) => {
            link.classList.remove("active"); // Remove active from all first
            const linkHref = link.getAttribute("href");
            if (!linkHref) return; // Skip links without href

            // Handle root link ('index.html' or '/')
            if ((currentPage === "index.html") && (linkHref === "index.html" || linkHref === "/")) {
                link.classList.add("active");
            }
            // Handle other pages (exact match or starts with)
            else if (currentPage !== "index.html" && linkHref === currentPage) {
                 link.classList.add("active");
            }
        });
    } catch (error) {
        console.error("Error highlighting active page:", error);
    }
}


// Initialize fade-in animations on scroll
function initAnimations() {
    const fadeElements = document.querySelectorAll(".fade-in");
    if (!("IntersectionObserver" in window)) {
        console.warn("IntersectionObserver not supported, animations might not work.");
        fadeElements.forEach(el => el.style.opacity = "1"); // Make visible anyway
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => { // Pass observer instance
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    obs.unobserve(entry.target); // Use observer instance 'obs'
                }
            });
        },
        {
            threshold: 0.1, // Trigger when 10% visible
            rootMargin: "0px 0px -50px 0px", // Trigger slightly before element fully enters viewport
        }
    );

    fadeElements.forEach((element) => {
        // Set initial state for animation
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"; // Smooth transition
        observer.observe(element);
    });
}

// Initialize smooth scrolling for internal anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Allow language hash links and external links
            if (href === "#en" || href === "#nl" || href.includes('.html')) {
                return;
            }
             if (href === "#") { // Prevent scrolling for empty hash
                 e.preventDefault();
                 return;
             }

            try {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault(); // Prevent default jump only if target exists

                     // Close mobile menu if open before scrolling
                    const mobileMenu = document.querySelector(".nav-links.active");
                    const mobileMenuOverlay = document.querySelector(".mobile-menu-overlay.active");
                    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
                    if (mobileMenu) mobileMenu.classList.remove("active");
                    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove("active");
                    if (mobileMenuBtn) mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>'; // Reset icon


                    const headerOffset = document.querySelector('header')?.offsetHeight || 80; // Get header height dynamically
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                } else {
                    console.warn(`Smooth scroll target not found: ${href}`);
                }
            } catch (error) {
                console.error(`Error during smooth scroll for ${href}:`, error);
                // Allow default behavior if querySelector fails
            }
        });
    });
}


// Initialize mobile menu toggle functionality
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
    const navLinks = document.querySelector(".nav-links");
    const mobileMenuOverlay = document.querySelector(".mobile-menu-overlay");

    if (!mobileMenuBtn || !navLinks) {
        console.warn("Mobile menu elements not found.");
        return;
    }

    mobileMenuBtn.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("active");
        if (mobileMenuOverlay) {
            mobileMenuOverlay.classList.toggle("active");
        }
        mobileMenuBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        mobileMenuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false"); // Accessibility
    });

    // Close menu when clicking overlay
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener("click", () => {
            navLinks.classList.remove("active");
            mobileMenuOverlay.classList.remove("active");
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            mobileMenuBtn.setAttribute("aria-expanded", "false");
        });
    }

    // Close menu when clicking a nav link (for single-page navigation)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
             // Don't close for external links or language switchers
             const href = link.getAttribute('href');
             if (!href || href.startsWith('#') && href !== '#en' && href !== '#nl') {
                 if (navLinks.classList.contains("active")) {
                     navLinks.classList.remove("active");
                     if (mobileMenuOverlay) mobileMenuOverlay.classList.remove("active");
                     mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                     mobileMenuBtn.setAttribute("aria-expanded", "false");
                 }
             }
        });
    });
}


// Initialize lightbox functionality
function initLightbox() {
    const lightboxElement = document.querySelector(".lightbox");
    const portfolioImages = document.querySelectorAll(".portfolio-img"); // Make sure this selector is correct

    if (portfolioImages.length > 0 && lightboxElement) {
        portfolioImages.forEach((img) => {
            img.addEventListener("click", (e) => {
                 e.preventDefault(); // Prevent default if images are links
                const imageSrc = img.getAttribute('src'); // Or data-lightbox-src if preferred
                const imageAlt = img.getAttribute('alt') || 'Portfolio Image'; // Get alt text

                if (imageSrc) {
                     lightboxElement.innerHTML = `<img src="${imageSrc}" alt="${imageAlt}"> <button class="lightbox-close" aria-label="Close lightbox">×</button>`;
                     lightboxElement.classList.add("active");
                     document.body.style.overflow = 'hidden'; // Prevent background scroll

                     // Add event listener for the close button inside this scope
                     lightboxElement.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
                }
            });
        });

        // Close lightbox on background click
        lightboxElement.addEventListener("click", (e) => {
            // Close only if clicking the background itself, not the image
            if (e.target === lightboxElement) {
                closeLightbox();
            }
        });

         // Close lightbox with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightboxElement.classList.contains('active')) {
                closeLightbox();
            }
        });

    } else {
        console.log("Lightbox elements or portfolio images not found.");
    }
}

// Helper function to close the lightbox
function closeLightbox() {
    const lightboxElement = document.querySelector(".lightbox");
    if (lightboxElement) {
        lightboxElement.classList.remove("active");
        lightboxElement.innerHTML = ''; // Clear content
        document.body.style.overflow = ''; // Restore scroll
    }
}


// Initialize enhanced FAQ functionality with ripple effect
function initFaqRipple() {
    document.querySelectorAll(".faq-question").forEach((item) => {
        item.addEventListener("click", (e) => { // Pass event 'e'
            const parentItem = item.closest('.faq-item'); // Find the parent .faq-item
            if (!parentItem) return;

            const isActive = parentItem.classList.contains("active");

            // Close all other active FAQ items
            document.querySelectorAll(".faq-item.active").forEach((activeItem) => {
                if (activeItem !== parentItem) {
                    activeItem.classList.remove("active");
                     // Accessibility update for closed items
                     activeItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                     activeItem.querySelector('.faq-answer').setAttribute('hidden', '');
                }
            });

            // Toggle the clicked item
            parentItem.classList.toggle("active");

            // Accessibility update for the clicked item
             const isNowActive = parentItem.classList.contains('active');
             item.setAttribute('aria-expanded', isNowActive ? 'true' : 'false');
             const answer = parentItem.querySelector('.faq-answer');
             if (answer) {
                if (isNowActive) {
                    answer.removeAttribute('hidden');
                } else {
                    answer.setAttribute('hidden', '');
                }
             }


            // --- Ripple Effect ---
            // Ensure parent has relative positioning for absolute ripple
            parentItem.style.position = parentItem.style.position || "relative"; // Set only if not already set
            parentItem.style.overflow = "hidden"; // Contain ripple

            const ripple = document.createElement("span");
            const rect = item.getBoundingClientRect(); // Use item (the question) for positioning
            const size = Math.max(rect.width, rect.height);

             // Calculate click position relative to the faq-item (parent)
            const parentRect = parentItem.getBoundingClientRect();
            const x = e.clientX - parentRect.left;
            const y = e.clientY - parentRect.top;

            ripple.style.width = ripple.style.height = `${size * 2}px`; // Make ripple large enough
            ripple.style.left = `${x - size}px`; // Center ripple on click X
            ripple.style.top = `${y - size}px`; // Center ripple on click Y
            ripple.classList.add("faq-ripple-effect"); // Use a class for styling

            parentItem.appendChild(ripple);

            // Remove ripple after animation
            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
            // --- End Ripple Effect ---
        });
    });

    // Add ripple animation CSS dynamically if not present
    if (!document.getElementById("faq-ripple-styles")) {
        const style = document.createElement("style");
        style.id = "faq-ripple-styles";
        style.textContent = `
            .faq-ripple-effect {
                position: absolute;
                border-radius: 50%;
                background-color: rgba(0, 102, 255, 0.2);
                transform: scale(0);
                animation: faq-ripple-animation 0.6s linear;
                pointer-events: none; /* Prevent ripple from interfering with clicks */
            }

            @keyframes faq-ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

     // Initial Accessibility setup for FAQs
     document.querySelectorAll('.faq-item').forEach(item => {
         const question = item.querySelector('.faq-question');
         const answer = item.querySelector('.faq-answer');
         const isActive = item.classList.contains('active');
         if(question) question.setAttribute('aria-expanded', isActive ? 'true' : 'false');
         if(answer) {
             if(!isActive) answer.setAttribute('hidden', '');
             else answer.removeAttribute('hidden');
         }
     });
}


// Initialize header scroll effect (add class 'scrolled')
function initHeaderScroll() {
    const header = document.querySelector("header");
    if (!header) return;

    let lastScrollTop = 0;
    const scrollThreshold = 50; // Pixels to scroll before adding/removing class

    window.addEventListener("scroll", () => {
        let st = window.pageYOffset || document.documentElement.scrollTop;

        if (st > scrollThreshold) {
            header.classList.add("scrolled");
             // Add hide/show on scroll direction
             if (st > lastScrollTop) {
                 header.classList.add("header-hidden"); // Hide on scroll down
             } else {
                 header.classList.remove("header-hidden"); // Show on scroll up
             }
        } else {
            header.classList.remove("scrolled");
             header.classList.remove("header-hidden"); // Ensure visible when at top
        }
        lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    }, { passive: true }); // Improve scroll performance
}


// Simple testimonial slider (auto-advance)
function initTestimonialSlider() {
    const slider = document.querySelector(".testimonial-slider");
    if (!slider) return;
    const slides = Array.from(slider.querySelectorAll(".testimonial-card")); // Use Array.from for easier methods
    const controlsContainer = document.createElement('div'); // Optional: Add controls
    controlsContainer.className = 'testimonial-controls';


    if (slides.length <= 1) return; // No need for slider with 0 or 1 slide

    let currentSlide = 0;
    let intervalId = null;

    // Prepare slides and controls
    slides.forEach((slide, index) => {
        slide.style.display = index === 0 ? "block" : "none"; // Show only first initially
        slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true'); // Accessibility

    //     // Optional: Create dot indicators
    //     const dot = document.createElement('button');
    //     dot.className = 'testimonial-dot';
    //     dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
    //     if (index === 0) dot.classList.add('active');
    //     dot.addEventListener('click', () => showSlide(index));
    //     controlsContainer.appendChild(dot);
     });

    // Optional: Append controls to the slider
    if (controlsContainer.hasChildNodes()) {
        slider.appendChild(controlsContainer);
    }

    function showSlide(index) {
        if (index === currentSlide) return; // Do nothing if already on the slide

        slides[currentSlide].style.display = "none";
        slides[currentSlide].setAttribute('aria-hidden', 'true');
        const currentDot = controlsContainer.children[currentSlide];
        if(currentDot) currentDot.classList.remove('active');


        currentSlide = index;
        slides[currentSlide].style.display = "block";
        slides[currentSlide].setAttribute('aria-hidden', 'false');
        const nextDot = controlsContainer.children[currentSlide];
         if(nextDot) nextDot.classList.add('active');


        // Reset interval on manual navigation
        resetInterval();
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }

    function startInterval() {
        if (!intervalId) {
            intervalId = setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
        }
    }

    function resetInterval() {
        clearInterval(intervalId);
        intervalId = null;
        startInterval(); // Restart interval
    }

    // Start the auto-advance
    startInterval();
}


// --- Cookie Helper Functions ---
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    // Add SameSite=Lax for security and path=/ to make it available site-wide
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
}

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

function updateChatbotLanguage(lang) {
    const dfMessenger = document.querySelector('df-messenger');
    if (dfMessenger) {
        dfMessenger.setAttribute('language-code', lang);

        // Forceer iframe reload om de taal direct toe te passen
        const iframe = dfMessenger.shadowRoot?.querySelector("iframe");
        if (iframe) {
            const originalSrc = iframe.src;
            iframe.src = "";
            setTimeout(() => {
                iframe.src = originalSrc;
            }, 100); // delay voor herladen
        }
    }
}
