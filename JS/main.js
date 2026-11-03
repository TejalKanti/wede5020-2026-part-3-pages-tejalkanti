//    1. DOM READY INITIALIZER

document.addEventListener('DOMContentLoaded', function () {

    console.log('Sphere Style Boutique — JS Loaded Successfully');

    // ---- Run all initializers ----
    initNavbarScroll();
    initHamburgerMenu();
    initCloseMenuOnOutsideClick();
    initCloseMenuOnLinkClick();
    initCartBadge();
    initScrollIndicator();
    initOutfitFilter();
    initScrollAnimations();
    initBackToTop();
    initAnnouncementStrip();
    initCollectionCardTilt();
    initActiveNavLink();
    initSmoothScroll();
    initPageLoadAnimation();

});

// 2. NAVIGATION BAR — STICKY SCROLL EFFECT

function initNavbarScroll() {

    const navbar = document.getElementById('navbar');

    if (!navbar) return;

    const SCROLL_THRESHOLD = 80;

    function handleNavbarScroll() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Run once on load in case page is already scrolled
    handleNavbarScroll();

    // Listen for scroll events (throttled for performance)
    let navScrollTicking = false;

    window.addEventListener('scroll', function () {
        if (!navScrollTicking) {
            window.requestAnimationFrame(function () {
                handleNavbarScroll();
                navScrollTicking = false;
            });
            navScrollTicking = true;
        }
    });
}

// 3. NAVIGATION BAR — CLOSE MENU ON OUTSIDE CLICK

function initCloseMenuOnOutsideClick() {

    document.addEventListener('click', function (event) {

        const hamburger = document.getElementById('hamburger');
        const navMenu   = document.getElementById('navMenu');

        if (!hamburger || !navMenu) return;

        const isMenuOpen        = navMenu.classList.contains('open');
        const clickedHamburger  = hamburger.contains(event.target);
        const clickedMenu       = navMenu.contains(event.target);

        if (isMenuOpen && !clickedHamburger && !clickedMenu) {
            if (typeof window.closeMobileMenu === 'function') {
                window.closeMobileMenu();
            }
        }
    });
}


 //  4. NAVIGATION BAR — CLOSE MENU ON NAV LINK CLICK

function initCloseMenuOnLinkClick() {

    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (typeof window.closeMobileMenu === 'function') {
                window.closeMobileMenu();
            }
        });
    });
}


/* ============================================================
   5. HERO SECTION — SCROLL INDICATOR
   ============================================================
   Hides the scroll indicator arrow once the user starts
   scrolling down the page.
   ============================================================ */

function initScrollIndicator() {

    const scrollIndicator = document.querySelector('.hero-scroll-indicator');

    if (!scrollIndicator) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'all';
        }
    }, { passive: true });
}

/* ============================================================
   6. OUTFIT BUILDER — FILTER FUNCTIONALITY
   ============================================================
   Filters outfit cards on the homepage outfit builder section
   based on data-category and data-season attributes.
   Clicking a filter button shows only matching cards.
   ============================================================ */

function initOutfitFilter() {

    const filterBar  = document.getElementById('outfitFilterBar');
    const outfitGrid = document.getElementById('outfitGrid');

    if (!filterBar || !outfitGrid) return;

    const filterButtons = filterBar.querySelectorAll('.filter-btn');
    const outfitCards   = outfitGrid.querySelectorAll('.outfit-card');

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {

            const filterValue = this.getAttribute('data-filter');

            // ---- Update active button state ----
            filterButtons.forEach(function (btn) {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });

            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');

            // ---- Filter outfit cards ----
            outfitCards.forEach(function (card) {
                const cardCategory = card.getAttribute('data-category');
                const cardSeason   = card.getAttribute('data-season');

                if (filterValue === 'all') {
                    showCard(card);
                } else if (
                    cardCategory === filterValue ||
                    cardSeason   === filterValue
                ) {
                    showCard(card);
                } else {
                    hideCard(card);
                }
            });

        });
    });

    // ---- Helper: Show card with animation ----
    function showCard(card) {
        card.classList.remove('hidden');
        card.style.display = '';

        // Trigger reflow for transition
        void card.offsetWidth;

        card.style.opacity  = '1';
        card.style.transform = 'translateY(0)';
    }

    // ---- Helper: Hide card ----
    function hideCard(card) {
        card.style.opacity  = '0';
        card.style.transform = 'translateY(10px)';

        setTimeout(function () {
            card.classList.add('hidden');
            card.style.display = 'none';
        }, 300);
    }
}

/* ============================================================
   7. SCROLL ANIMATIONS — INTERSECTIONOBSERVER
   ============================================================
   Uses IntersectionObserver to add a 'visible' class to
   elements with the 'fade-in-up', 'fade-in-left', or
   'fade-in-right' classes when they enter the viewport.
   ============================================================ */

function initScrollAnimations() {

    // Assign animation classes to specific homepage elements
    assignAnimationClasses();

    const animatedElements = document.querySelectorAll(
        '.fade-in-up, .fade-in-left, .fade-in-right'
    );

    if (animatedElements.length === 0) return;

    // Check if browser supports IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        // Fallback: show all elements immediately
        animatedElements.forEach(function (el) {
            el.classList.add('visible');
        });
        return;
    }

    const observerOptions = {
        root:       null,         // Observe relative to the viewport
        rootMargin: '0px 0px -60px 0px', // Trigger 60px before entering viewport
        threshold:  0.1           // Trigger when 10% of element is visible
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to save performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(function (el) {
        observer.observe(el);
    });
}

/* Assigns animation classes to homepage elements */
function assignAnimationClasses() {

    // Section headers
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(function (header) {
        header.classList.add('fade-in-up');
    });

    // Collection cards
    const collectionCards = document.querySelectorAll('.collection-card');
    collectionCards.forEach(function (card) {
        card.classList.add('fade-in-up');
    });

    // Outfit cards
    const outfitCards = document.querySelectorAll('.outfit-card');
    outfitCards.forEach(function (card) {
        card.classList.add('fade-in-up');
    });

    // Feature cards (Why Choose Us)
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(function (card) {
        card.classList.add('fade-in-up');
    });

    // Promo cards
    const promoCards = document.querySelectorAll('.promo-card');
    promoCards.forEach(function (card) {
        card.classList.add('fade-in-up');
    });

    // Testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(function (card) {
        card.classList.add('fade-in-up');
    });

    // CTA strip content
    const ctaText    = document.querySelector('.cta-strip-text');
    const ctaButtons = document.querySelector('.cta-strip-buttons');
    if (ctaText)    ctaText.classList.add('fade-in-left');
    if (ctaButtons) ctaButtons.classList.add('fade-in-right');

    // Announcement strip
    const announcementStrip = document.querySelector('.announcement-strip');
    if (announcementStrip) announcementStrip.classList.add('fade-in-up');
}

/* ============================================================
   8. BACK TO TOP BUTTON
   ============================================================
   Shows the Back to Top button when the user scrolls down
   and smoothly scrolls back to the top when clicked.
   ============================================================ */

function initBackToTop() {

    const backToTopBtn = document.getElementById('backToTop');

    if (!backToTopBtn) return;

    const SHOW_THRESHOLD = 400;

    // ---- Show / hide button on scroll ----
    let backToTopTicking = false;

    window.addEventListener('scroll', function () {
        if (!backToTopTicking) {
            window.requestAnimationFrame(function () {
                if (window.scrollY > SHOW_THRESHOLD) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
                backToTopTicking = false;
            });
            backToTopTicking = true;
        }
    }, { passive: true });

    // ---- Scroll to top on click ----
    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top:      0,
            behavior: 'smooth'
        });
    });
}

/* ============================================================
   9. ANNOUNCEMENT STRIP — AUTO ROTATE
   ============================================================
   Rotates the announcement strip messages every few seconds
   to highlight different promotions.
   ============================================================ */

function initAnnouncementStrip() {

    const stripContainer = document.querySelector('.announcement-container');

    if (!stripContainer) return;

    // Announcement messages to rotate
    const messages = [
        '<i class="fa-solid fa-truck"></i> Free delivery on orders over R1,500',
        '<i class="fa-solid fa-star"></i> New Arrivals — Shop the Latest Collection',
        '<i class="fa-solid fa-tag"></i> Women\'s Day Special — 20% Off Selected Items',
        '<i class="fa-solid fa-gift"></i> Holiday Collection Now Available — Shop Festive Looks',
        '<i class="fa-solid fa-rotate"></i> New Season, New Style — Explore Our Collections'
    ];

    let currentIndex  = 0;
    const ROTATE_DELAY = 4000; // 4 seconds

    function rotateMessage() {
        currentIndex = (currentIndex + 1) % messages.length;

        // Fade out
        stripContainer.style.opacity    = '0';
        stripContainer.style.transition = 'opacity 0.4s ease';

        setTimeout(function () {
            // Update content with all 3 items visible
            const messageCount = Math.min(3, messages.length);
            let html = '';

            for (let i = 0; i < messageCount; i++) {
                const msgIndex = (currentIndex + i) % messages.length;
                html += '<span>' + messages[msgIndex] + '</span>';
                if (i < messageCount - 1) {
                    html += '<span class="strip-divider">|</span>';
                }
            }

            stripContainer.innerHTML = html;

            // Fade back in
            stripContainer.style.opacity = '1';

        }, 400);
    }

    // Start rotation
    const stripInterval = setInterval(rotateMessage, ROTATE_DELAY);

    // Pause rotation when page is not visible
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            clearInterval(stripInterval);
        }
    });
}

/* ============================================================
   10. COLLECTION CARDS — HOVER TILT EFFECT
   ============================================================
   Adds a subtle 3D tilt effect to collection cards on
   desktop when the user hovers over them.
   ============================================================ */

function initCollectionCardTilt() {

    // Only apply on non-touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const cards = document.querySelectorAll('.collection-card');

    if (cards.length === 0) return;

    cards.forEach(function (card) {

        card.addEventListener('mousemove', function (event) {
            const rect     = card.getBoundingClientRect();
            const centerX  = rect.left + rect.width  / 2;
            const centerY  = rect.top  + rect.height / 2;
            const deltaX   = event.clientX - centerX;
            const deltaY   = event.clientY - centerY;
            const maxTilt  = 6; // Maximum tilt in degrees

            const tiltX = -(deltaY / (rect.height / 2)) * maxTilt;
            const tiltY =  (deltaX / (rect.width  / 2)) * maxTilt;

            card.style.transform =
                'translateY(-8px) perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg)';
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform  = '';
            card.style.transition = 'transform 0.4s ease';
        });
    });
}


/* ============================================================
   11. PROMO CARDS — ENTRANCE ANIMATION
   ============================================================
   Adds a sequential entrance animation to promo cards
   using staggered delays when they scroll into view.
   ============================================================ */

function initPromoCardsAnimation() {

    const promoCards = document.querySelectorAll('.promo-card');

    if (promoCards.length === 0) return;

    promoCards.forEach(function (card, index) {
        card.style.transitionDelay = (index * 0.1) + 's';
    });
}

/* ============================================================
   12. TESTIMONIALS — SIMPLE SCROLL REVEAL
   ============================================================
   Reveals testimonial cards one by one with a staggered
   delay as the user scrolls into the testimonials section.
   ============================================================ */

function initTestimonialsReveal() {

    const testimonialCards = document.querySelectorAll('.testimonial-card');

    if (testimonialCards.length === 0) return;

    testimonialCards.forEach(function (card, index) {
        card.style.transitionDelay = (index * 0.15) + 's';
    });
}

/* ============================================================
   16. GLOBAL — ACTIVE NAVIGATION LINK HIGHLIGHTER
   ============================================================
   Automatically highlights the correct navigation link
   based on the current page URL.
   ============================================================ */

function initActiveNavLink() {

    const navLinks      = document.querySelectorAll('.nav-link');
    const currentPage   = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(function (link) {
        const linkHref = link.getAttribute('href');

        if (!linkHref) return;

        const linkPage = linkHref.split('/').pop().split('#')[0];

        // Remove existing active class
        link.classList.remove('active');

        // Set active based on current page
        if (
            linkPage === currentPage ||
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')
        ) {
            link.classList.add('active');
        }
    });
}


/* ============================================================
   13. GLOBAL — SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================
   Enables smooth scrolling for all internal anchor links
   (links starting with #) across all pages.
   Accounts for the fixed navigation bar height offset.
   ============================================================ */

function initSmoothScroll() {

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    const NAV_OFFSET  = 90; // px — accounts for fixed navbar height

    anchorLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {

            const href   = this.getAttribute('href');

            // Skip if just '#' or empty
            if (!href || href === '#') return;

            const target = document.querySelector(href);

            if (!target) return;

            event.preventDefault();

            const targetPosition = target.getBoundingClientRect().top
                                 + window.pageYOffset
                                 - NAV_OFFSET;

            window.scrollTo({
                top:      targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (typeof window.closeMobileMenu === 'function') {
                window.closeMobileMenu();
            }
        });
    });
}


/* ============================================================
   14. GLOBAL — PAGE LOAD ANIMATION
   ============================================================
   Adds a smooth fade-in effect to the page body when
   the page first loads.
   ============================================================ */

function initPageLoadAnimation() {

    // Set initial state
    document.body.style.opacity    = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    // Trigger fade in
    window.addEventListener('load', function () {
        document.body.style.opacity = '1';
    });

    // Fallback if load event already fired
    if (document.readyState === 'complete') {
        document.body.style.opacity = '1';
    }
}
