//    1. DOM READY INITIALIZER

document.addEventListener('DOMContentLoaded', function () {

    console.log('Sphere Style Boutique — JS Loaded Successfully');

    // ---- Run all initializers ----
    initProductFilters();
    initProductWishlist();
    initContactForm();
    initEnquiryForm();
    initNavbarScroll();
    initCloseMenuOnOutsideClick();
    initCloseMenuOnLinkClick();
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

// 1.2 PRODUCT CATALOGUE — PERSISTENT FAVOURITES

function initProductWishlist() {

    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const wishlistButtons = productsGrid.querySelectorAll('.wishlist-btn');
    const storageKey = 'sphereStyleFavourites';
    let favouriteIds = new Set();

    try {
        const savedFavourites = window.localStorage.getItem(storageKey);

        if (savedFavourites !== null) {
            const parsedFavourites = JSON.parse(savedFavourites);
            if (!Array.isArray(parsedFavourites) || parsedFavourites.some(function (id) {
                return typeof id !== 'string';
            })) {
                throw new TypeError('Saved favourites must be an array of product IDs.');
            }

            favouriteIds = new Set(parsedFavourites);
        }
    } catch (error) {
        console.error('Unable to load saved product favourites.', error);
    }

    function updateButton(button, productCard) {
        const productName = productCard.querySelector('.product-card-name').textContent.trim();
        const isFavourite = favouriteIds.has(productCard.id);
        const heartIcon = button.querySelector('i');

        button.setAttribute('aria-pressed', String(isFavourite));
        button.setAttribute(
            'aria-label',
            (isFavourite ? 'Remove ' : 'Add ') + productName + ' ' + (isFavourite ? 'from' : 'to') + ' favourites'
        );
        heartIcon.classList.toggle('fa-solid', isFavourite);
        heartIcon.classList.toggle('fa-regular', !isFavourite);
    }

    wishlistButtons.forEach(function (button) {
        const productCard = button.closest('.product-card');
        if (!productCard || !productCard.id || !productCard.querySelector('.product-card-name') || !button.querySelector('i')) {
            console.error('A product favourite button is missing its product ID, name, or heart icon.', button);
            return;
        }

        updateButton(button, productCard);

        button.addEventListener('click', function () {
            if (favouriteIds.has(productCard.id)) {
                favouriteIds.delete(productCard.id);
            } else {
                favouriteIds.add(productCard.id);
            }

            updateButton(button, productCard);

            try {
                window.localStorage.setItem(storageKey, JSON.stringify(Array.from(favouriteIds)));
            } catch (error) {
                console.error('Unable to save product favourites.', error);
            }
        });
    });
}

// 1.1 PRODUCT CATALOGUE — COMBINED SEASON, CATEGORY, AND COLOUR FILTERS

function initProductFilters() {

    const filterPanel = document.getElementById('filterPanel');
    const productsGrid = document.getElementById('productsGrid');
    const outfitCards = Array.from(document.querySelectorAll('.outfit-library-card'));
    const outfitLibraryCount = document.getElementById('outfitLibraryCount');

    if (!filterPanel || !productsGrid) return;

    const filterButtons = filterPanel.querySelectorAll('[data-filter-type][data-filter]');
    const productCards = Array.from(productsGrid.querySelectorAll('.product-card'));
    const seasonCards = document.querySelectorAll('.season-card[data-filter-type][data-filter]');
    const productCount = document.getElementById('productCount');
    const clearFiltersButton = document.getElementById('clearFilters');
    const clearNoResultsButton = document.getElementById('clearFiltersNoResults');
    const noResults = document.getElementById('noResults');
    const selectedFilters = {
        season: 'all',
        category: 'all',
        colour: 'all'
    };

    function matchesFilters(card) {
        return Object.keys(selectedFilters).every(function (filterType) {
            const selectedValue = selectedFilters[filterType];
            if (selectedValue === 'all') return true;

            const cardValue = card.dataset[filterType] || '';
            return filterType === 'colour'
                ? cardValue.split(/\s+/).includes(selectedValue)
                : cardValue === selectedValue;
        });
    }

    function updateProducts() {
        let visibleCount = 0;

        productCards.forEach(function (card) {
            const matches = matchesFilters(card);

            card.classList.toggle('filter-hidden', !matches);
            if (matches) visibleCount += 1;
        });

        if (productCount) {
            productCount.textContent = String(visibleCount);
        }

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        let visibleOutfitCount = 0;
        outfitCards.forEach(function (card) {
            const matches = matchesFilters(card);
            card.hidden = !matches;
            if (matches) visibleOutfitCount += 1;
        });

        if (outfitLibraryCount) {
            outfitLibraryCount.textContent = visibleOutfitCount === 0
                ? 'No complete outfits match your selected filters.'
                : 'Showing ' + visibleOutfitCount + ' of ' + outfitCards.length + ' outfits';
        }
    }

    function resetFilters() {
        Object.keys(selectedFilters).forEach(function (filterType) {
            selectedFilters[filterType] = 'all';
        });

        filterButtons.forEach(function (button) {
            const isAllButton = button.dataset.filter === 'all';
            const isActive = isAllButton && button.dataset.filterType in selectedFilters;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });

        updateProducts();
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const filterType = button.dataset.filterType;
            if (!(filterType in selectedFilters)) return;

            selectedFilters[filterType] = button.dataset.filter;

            filterButtons.forEach(function (groupButton) {
                if (groupButton.dataset.filterType !== filterType) return;
                const isActive = groupButton === button;
                groupButton.classList.toggle('active', isActive);
                groupButton.setAttribute('aria-pressed', String(isActive));
            });

            updateProducts();
        });
    });

    seasonCards.forEach(function (card) {
        card.addEventListener('click', function () {
            const matchingFilter = Array.from(filterButtons).find(function (button) {
                return button.dataset.filterType === card.dataset.filterType
                    && button.dataset.filter === card.dataset.filter;
            });

            if (matchingFilter) {
                resetFilters();
                matchingFilter.click();
            }
        });
    });

    if (clearFiltersButton) {
        clearFiltersButton.addEventListener('click', resetFilters);
    }

    if (clearNoResultsButton) {
        clearNoResultsButton.addEventListener('click', resetFilters);
    }

    updateProducts();
}

// 1.1 CONTACT FORM — CLIENT-SIDE VALIDATION

function initContactForm() {

    const form = document.getElementById('contactForm');

    if (!form) return;

    const errorSummary = document.getElementById('contactErrorSummary');
    const errorList = document.getElementById('contactErrorList');
    const successMessage = document.getElementById('contactSuccessMessage');
    const messageField = document.getElementById('contactMessage');
    const messageCount = document.getElementById('contactMessageCount');
    const errorIds = {
        contactFullName: 'contactFullNameError',
        contactEmail: 'contactEmailError',
        contactPhone: 'contactPhoneError',
        contactSubject: 'contactSubjectError',
        contactMessage: 'contactMessageError',
        contactAgreeTerms: 'contactTermsError'
    };

    function clearFieldError(field) {
        const errorElement = document.getElementById(errorIds[field.id]);

        field.removeAttribute('aria-invalid');

        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    function clearFormErrors() {
        form.querySelectorAll('[aria-invalid="true"]').forEach(function (field) {
            field.removeAttribute('aria-invalid');
        });
        form.querySelectorAll('.form-error-msg').forEach(function (error) {
            error.textContent = '';
        });

        if (errorList) {
            errorList.replaceChildren();
        }

        if (errorSummary) {
            errorSummary.style.display = 'none';
        }
    }

    form.addEventListener('input', function (event) {
        if (event.target.matches('input, select, textarea')) {
            clearFieldError(event.target);
            if (successMessage) {
                successMessage.style.display = 'none';
            }
        }

        if (event.target === messageField && messageCount) {
            messageCount.textContent = messageField.value.length + ' / 1500';
        }
    });

    form.addEventListener('change', function (event) {
        if (event.target.matches('input, select, textarea')) {
            clearFieldError(event.target);
            if (successMessage) {
                successMessage.style.display = 'none';
            }
        }
    });

    form.addEventListener('reset', function () {
        window.setTimeout(function () {
            clearFormErrors();
            if (successMessage) {
                successMessage.style.display = 'none';
            }
            if (messageCount) {
                messageCount.textContent = '0 / 1500';
            }
        }, 0);
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        clearFormErrors();

        const invalidFields = [];
        const fieldsToValidate = Array.from(form.querySelectorAll('[required]'));
        const phoneField = document.getElementById('contactPhone');

        if (phoneField && phoneField.value.trim()) {
            fieldsToValidate.push(phoneField);
        }

        fieldsToValidate.forEach(function (field) {
            let errorMessage = '';

            if (!field.checkValidity()) {
                errorMessage = field.validationMessage;
            } else if (field.id === 'contactFullName' && !field.value.trim()) {
                errorMessage = 'Enter your name.';
            } else if (field.id === 'contactSubject' && !field.value.trim()) {
                errorMessage = 'Enter a subject for your message.';
            } else if (field.id === 'contactMessage' && !field.value.trim()) {
                errorMessage = 'Enter a message.';
            } else if (field.id === 'contactPhone' && !validatePhoneNumber(field.value)) {
                errorMessage = 'Enter a valid South African phone number, such as 082 000 0000.';
            }

            if (!errorMessage) return;

            field.setAttribute('aria-invalid', 'true');
            invalidFields.push(field);

            const errorElement = document.getElementById(errorIds[field.id]);
            if (errorElement) {
                errorElement.textContent = errorMessage;
            }

            if (errorList) {
                const item = document.createElement('li');
                const label = form.querySelector('label[for="' + field.id + '"]');
                item.textContent = (label ? label.textContent.replace('*', '').trim() : 'This field') +
                    ': ' + errorMessage;
                errorList.appendChild(item);
            }
        });

        if (invalidFields.length) {
            if (errorSummary) {
                errorSummary.style.display = 'block';
                errorSummary.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            invalidFields[0].focus();
            return;
        }

        if (successMessage) {
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// 1.1 ENQUIRY FORM — CLIENT-SIDE VALIDATION

function initEnquiryForm() {

    const form = document.getElementById('enquiryForm');

    if (!form) return;

    const errorSummary = document.getElementById('formErrorSummary');
    const errorList = document.getElementById('errorList');
    const successMessage = document.getElementById('formSuccessMessage');
    const messageField = document.getElementById('enquiryMessage');
    const messageCount = document.getElementById('messageCount');
    const errorIds = {
        firstName: 'firstNameError',
        lastName: 'lastNameError',
        emailAddress: 'emailError',
        phoneNumber: 'phoneError',
        enquiryType: 'enquiryTypeError',
        enquiryMessage: 'messageError',
        agreeTerms: 'termsError'
    };

    function clearFieldError(field) {
        const errorElement = document.getElementById(errorIds[field.id]);

        field.removeAttribute('aria-invalid');

        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    function clearFormErrors() {
        form.querySelectorAll('[aria-invalid="true"]').forEach(function (field) {
            field.removeAttribute('aria-invalid');
        });
        form.querySelectorAll('.form-error-msg').forEach(function (error) {
            error.textContent = '';
        });

        if (errorList) {
            errorList.replaceChildren();
        }

        if (errorSummary) {
            errorSummary.style.display = 'none';
        }
    }

    form.addEventListener('input', function (event) {
        if (event.target.matches('input, select, textarea')) {
            clearFieldError(event.target);
            if (successMessage) {
                successMessage.style.display = 'none';
            }
        }

        if (event.target === messageField && messageCount) {
            messageCount.textContent = messageField.value.length + ' / 1000';
        }
    });

    form.addEventListener('change', function (event) {
        if (event.target.matches('input, select, textarea')) {
            clearFieldError(event.target);
            if (successMessage) {
                successMessage.style.display = 'none';
            }
        }
    });

    form.addEventListener('reset', function () {
        window.setTimeout(function () {
            clearFormErrors();
            if (successMessage) {
                successMessage.style.display = 'none';
            }
            if (messageCount) {
                messageCount.textContent = '0 / 1000';
            }
        }, 0);
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        clearFormErrors();

        const invalidFields = [];
        const fieldsToValidate = Array.from(form.querySelectorAll('[required]'));
        const phoneField = document.getElementById('phoneNumber');

        if (phoneField && phoneField.value.trim()) {
            fieldsToValidate.push(phoneField);
        }

        fieldsToValidate.forEach(function (field) {
            let errorMessage = '';

            if (!field.checkValidity()) {
                errorMessage = field.validationMessage;
            } else if (field.id === 'phoneNumber' && !validatePhoneNumber(field.value)) {
                errorMessage = 'Enter a valid South African phone number, such as 082 000 0000.';
            }

            if (!errorMessage) return;

            field.setAttribute('aria-invalid', 'true');
            invalidFields.push(field);

            const errorElement = document.getElementById(errorIds[field.id]);
            if (errorElement) {
                errorElement.textContent = errorMessage;
            }

            if (errorList) {
                const item = document.createElement('li');
                const label = form.querySelector('label[for="' + field.id + '"]');
                item.textContent = (label ? label.textContent.replace('*', '').trim() : 'This field') +
                    ': ' + errorMessage;
                errorList.appendChild(item);
            }
        });

        if (invalidFields.length) {
            if (errorSummary) {
                errorSummary.style.display = 'block';
                errorSummary.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            invalidFields[0].focus();
            return;
        }

        if (successMessage) {
            successMessage.style.display = 'block';
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

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
    const hideTimers    = new WeakMap();

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
        clearTimeout(hideTimers.get(card));
        card.classList.remove('hidden');
        card.style.display = '';

        // Trigger reflow for transition
        void card.offsetWidth;

        card.style.opacity  = '1';
        card.style.transform = 'translateY(0)';
    }

    // ---- Helper: Hide card ----
    function hideCard(card) {
        clearTimeout(hideTimers.get(card));
        card.style.opacity  = '0';
        card.style.transform = 'translateY(10px)';

        const timer = setTimeout(function () {
            card.classList.add('hidden');
            card.style.display = 'none';
            hideTimers.delete(card);
        }, 300);
        hideTimers.set(card, timer);
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

// 15. UTILITY FUNCTIONS

/* ---- Format currency (South African Rand) ---- */
function formatCurrency(amount) {
    return 'R ' + parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/* ---- Debounce function ---- */
function debounce(func, wait) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args    = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            func.apply(context, args);
        }, wait);
    };
}

/* ---- Throttle function ---- */
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const context = this;
        const args    = arguments;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function () {
                inThrottle = false;
            }, limit);
        }
    };
}

/* ---- Check if element is in viewport ---- */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top    >= 0 &&
        rect.left   >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right  <= (window.innerWidth  || document.documentElement.clientWidth)
    );
}

/* ---- Get element offset from top of page ---- */
function getOffsetTop(element) {
    let offsetTop = 0;
    while (element) {
        offsetTop += element.offsetTop;
        element    = element.offsetParent;
    }
    return offsetTop;
}

/* ---- Sanitize string input ---- */
function sanitizeInput(input) {
    const div       = document.createElement('div');
    div.appendChild(document.createTextNode(input));
    return div.innerHTML;
}

/* ---- Validate email address ---- */
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
}

/* ---- Validate South African phone number ---- */
function validatePhoneNumber(phone) {
    // Accepts formats: +27 82 000 0000, 082 000 0000, 0820000000
    const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
    const cleaned    = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleaned);
}

/* ---- Show toast notification ---- */
function showToast(message, type) {

    // type: 'success' | 'error' | 'warning' | 'info'
    type = type || 'success';

    // Remove any existing toasts
    const existingToast = document.querySelector('.ssb-toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Toast icons
    const icons = {
        success: 'fa-circle-check',
        error:   'fa-circle-xmark',
        warning: 'fa-triangle-exclamation',
        info:    'fa-circle-info'
    };

    // Toast colors
    const colors = {
        success: '#4CAF50',
        error:   '#D32F2F',
        warning: '#F57C00',
        info:    '#1976D2'
    };

    // Create toast element
    const toast = document.createElement('div');
    toast.className    = 'ssb-toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    toast.style.cssText = [
        'position: fixed',
        'bottom: 100px',
        'right: 24px',
        'background-color: ' + (colors[type] || colors.success),
        'color: #ffffff',
        'padding: 14px 20px',
        'border-radius: 8px',
        'display: flex',
        'align-items: center',
        'gap: 10px',
        'font-family: Poppins, sans-serif',
        'font-size: 14px',
        'font-weight: 500',
        'box-shadow: 0 8px 24px rgba(0,0,0,0.15)',
        'z-index: 9999',
        'max-width: 340px',
        'opacity: 0',
        'transform: translateY(20px)',
        'transition: all 0.3s ease'
    ].join(';');

    toast.innerHTML =
        '<i class="fa-solid ' + (icons[type] || icons.success) + '" style="font-size: 18px; flex-shrink: 0;"></i>' +
        '<span>' + sanitizeInput(message) + '</span>';

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(function () {
        toast.style.opacity   = '1';
        toast.style.transform = 'translateY(0)';
    });

    // Auto dismiss after 3.5 seconds
    setTimeout(function () {
        toast.style.opacity   = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(function () {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3500);
}

/* ---- Expose utilities globally ---- */
window.formatCurrency     = formatCurrency;
window.debounce           = debounce;
window.throttle           = throttle;
window.isInViewport       = isInViewport;
window.getOffsetTop       = getOffsetTop;
window.sanitizeInput      = sanitizeInput;
window.validateEmail      = validateEmail;
window.validatePhoneNumber = validatePhoneNumber;
window.showToast          = showToast;