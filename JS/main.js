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
