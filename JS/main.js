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
