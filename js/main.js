// Main JavaScript for Drishka Library Reading Hall Website

(function() {
    'use strict';

    // DOM Elements
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('nav');
    const backToTop = document.getElementById('backToTop');
    const testimonialsSlider = document.getElementById('testimonialsSlider');
    const testimonialPrev = document.getElementById('testimonialPrev');
    const testimonialNext = document.getElementById('testimonialNext');
    const statNumbers = document.querySelectorAll('.stat-number');
    const header = document.querySelector('.header');

    // State
    let currentTestimonial = 0;
    let isScrolling = false;
    let statsAnimated = false;

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initMobileMenu();
        initBackToTop();
        initTestimonialSlider();
        initScrollAnimations();
        initSmoothScrolling();
        initStatsCounter();
        initHeaderScroll();
        initLazyLoading();
        
        // Add error handling for missing elements
        handleMissingElements();
    });

    // Mobile Menu Functionality
    function initMobileMenu() {
        if (!mobileMenuToggle || !nav) {
            console.warn('Mobile menu elements not found for Drishka');
            return;
        }

        mobileMenuToggle.addEventListener('click', function() {
            try {
                nav.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
                
                // Toggle hamburger animation
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans.forEach((span, index) => {
                    span.style.transform = nav.classList.contains('active') 
                        ? getHamburgerTransform(index) 
                        : 'none';
                });

                // Prevent body scroll when menu is open
                document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
                
            } catch (error) {
                console.error('Error toggling mobile menu:', error);
            }
        });

        // Close menu when clicking on nav links
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
                
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                });
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.style.overflow = '';
                
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                });
            }
        });
    }

    function getHamburgerTransform(index) {
        switch(index) {
            case 0: return 'rotate(45deg) translate(5px, 5px)';
            case 1: return 'opacity(0)';
            case 2: return 'rotate(-45deg) translate(7px, -6px)';
            default: return 'none';
        }
    }

    // Back to Top Button
    function initBackToTop() {
        if (!backToTop) {
            console.warn('Back to top button not found for Drishka');
            return;
        }

        window.addEventListener('scroll', throttle(function() {
            try {
                if (window.pageYOffset > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            } catch (error) {
                console.error('Error handling scroll for back to top:', error);
            }
        }, 100));

        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            try {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } catch (error) {
                // Fallback for older browsers
                window.scrollTo(0, 0);
            }
        });
    }

    // Header Scroll Effect
    function initHeaderScroll() {
        if (!header) {
            console.warn('Header element not found for Drishka');
            return;
        }

        window.addEventListener('scroll', throttle(function() {
            try {
                if (window.pageYOffset > 100) {
                    header.style.background = 'rgba(255, 255, 255, 0.98)';
                    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    header.style.background = 'rgba(255, 255, 255, 0.95)';
                    header.style.boxShadow = 'none';
                }
            } catch (error) {
                console.error('Error handling header scroll:', error);
            }
        }, 100));
    }

    // Testimonial Slider
    function initTestimonialSlider() {
        if (!testimonialsSlider) {
            console.warn('Testimonials slider not found for Drishka');
            return;
        }

        const testimonialItems = testimonialsSlider.querySelectorAll('.testimonial-item');
        
        if (testimonialItems.length === 0) {
            console.warn('No testimonial items found for Drishka');
            return;
        }

        // Auto-play testimonials
        setInterval(function() {
            try {
                nextTestimonial();
            } catch (error) {
                console.error('Error in testimonial auto-play:', error);
            }
        }, 5000);

        // Previous button
        if (testimonialPrev) {
            testimonialPrev.addEventListener('click', function() {
                try {
                    prevTestimonial();
                } catch (error) {
                    console.error('Error going to previous testimonial:', error);
                }
            });
        }

        // Next button
        if (testimonialNext) {
            testimonialNext.addEventListener('click', function() {
                try {
                    nextTestimonial();
                } catch (error) {
                    console.error('Error going to next testimonial:', error);
                }
            });
        }

        function showTestimonial(index) {
            testimonialItems.forEach((item, i) => {
                item.classList.toggle('active', i === index);
            });
        }

        function nextTestimonial() {
            currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
            showTestimonial(currentTestimonial);
        }

        function prevTestimonial() {
            currentTestimonial = currentTestimonial === 0 ? testimonialItems.length - 1 : currentTestimonial - 1;
            showTestimonial(currentTestimonial);
        }
    }

    // Stats Counter Animation
    function initStatsCounter() {
        if (statNumbers.length === 0) {
            console.warn('No stat numbers found for Drishka');
            return;
        }

        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) {
            console.warn('Stats section not found for Drishka');
            return;
        }

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    animateStats();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);

        function animateStats() {
            statNumbers.forEach(stat => {
                try {
                    const target = parseInt(stat.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;

                    const timer = setInterval(function() {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        
                        // Format large numbers
                        if (target >= 1000000) {
                            stat.textContent = (current / 1000000).toFixed(current >= target ? 0 : 1) + 'M+';
                        } else if (target >= 1000) {
                            stat.textContent = (current / 1000).toFixed(current >= target ? 0 : 1) + 'K+';
                        } else {
                            stat.textContent = Math.floor(current) + '+';
                        }
                    }, 16);
                } catch (error) {
                    console.error('Error animating stat:', error);
                    // Fallback: show target value
                    const target = parseInt(stat.getAttribute('data-target'));
                    if (target >= 1000000) {
                        stat.textContent = (target / 1000000) + 'M+';
                    } else if (target >= 1000) {
                        stat.textContent = (target / 1000) + 'K+';
                    } else {
                        stat.textContent = target + '+';
                    }
                }
            });
        }
    }

    // Scroll Animations
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        if (animatedElements.length === 0) {
            // Add animation class to elements that should animate
            const elementsToAnimate = document.querySelectorAll('.service-card, .feature-item, .section-content, .subject-item');
            elementsToAnimate.forEach(el => el.classList.add('animate-on-scroll'));
        }

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // Smooth Scrolling for Anchor Links
    function initSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#' || href === '#top') {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Lazy Loading for Images
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => {
                imageObserver.observe(img);
                
                // Add error handling for failed image loads
                img.addEventListener('error', function() {
                    this.style.display = 'none';
                    console.warn('Failed to load image:', this.src);
                });
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.classList.add('loaded');
            });
        }
    }

    // Handle Missing Elements
    function handleMissingElements() {
        const requiredElements = [
            { selector: '#mobileMenuToggle', name: 'Mobile menu toggle' },
            { selector: '#nav', name: 'Navigation' },
            { selector: '#backToTop', name: 'Back to top button' },
            { selector: '.header', name: 'Header' }
        ];

        requiredElements.forEach(element => {
            if (!document.querySelector(element.selector)) {
                console.warn(`${element.name} element not found for Drishka: ${element.selector}`);
            }
        });
    }

    // Utility Functions
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Form Handling (if forms are added later)
    function initFormHandling() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Add loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;
                }

                // Simulate form submission (replace with actual logic)
                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }
                    
                    // Show success message
                    showMessage('Form submitted successfully!', 'success');
                }, 2000);
            });
        });
    }

    // Message Display
    function showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Set background color based on type
        switch(type) {
            case 'success':
                messageEl.style.backgroundColor = '#4caf50';
                break;
            case 'error':
                messageEl.style.backgroundColor = '#f44336';
                break;
            case 'warning':
                messageEl.style.backgroundColor = '#ff9800';
                break;
            default:
                messageEl.style.backgroundColor = '#2196f3';
        }

        document.body.appendChild(messageEl);

        // Animate in
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 5000);
    }

    // Performance Monitoring
    function initPerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', function() {
                setTimeout(() => {
                    const perfData = performance.timing;
                    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                    
                    if (loadTime > 3000) {
                        console.warn('Drishka page load time is slow:', loadTime + 'ms');
                    }
                }, 0);
            });
        }
    }

    // Initialize performance monitoring
    initPerformanceMonitoring();

    // Expose some functions globally for debugging
    window.DrishkaApp = {
        showMessage,
        initFormHandling,
        version: '1.0.0'
    };

    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden, pause animations if needed
            console.log('Drishka page hidden');
        } else {
            // Page is visible, resume animations if needed
            console.log('Drishka page visible');
        }
    });

    // Error handling for uncaught errors
    window.addEventListener('error', function(e) {
        console.error('Uncaught error in Drishka app:', e.error);
        // Could send error to analytics service here
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection in Drishka app:', e.reason);
        // Could send error to analytics service here
    });

})();
