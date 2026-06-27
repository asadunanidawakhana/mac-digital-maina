/* ==========================================================================
   MAC DIGITAL AGENCY - INTERACTIVE ENGINE (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. PRELOADER ENGINE
  const handlePreloader = () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 700); // Syncs with transition duration
      });
      // Fallback preloader removal in case load event takes too long
      setTimeout(() => {
        if (!preloader.classList.contains('fade-out')) {
          preloader.classList.add('fade-out');
          setTimeout(() => preloader.style.display = 'none', 700);
        }
      }, 3000);
    }
  };

  // 2. STICKY HEADER & SCROLL PROGRESS
  const handleScrollEffects = () => {
    const header = document.getElementById('header');
    const progressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    const updateScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

      // Sticky Header state
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Progress bar fill
      if (progressBar) {
        progressBar.style.width = `${scrollPercent}%`;
      }

      // Back to Top button visibility
      if (backToTopBtn) {
        if (scrollY > 500) {
          backToTopBtn.classList.add('show');
        } else {
          backToTopBtn.classList.remove('show');
        }
      }
    };

    window.addEventListener('scroll', updateScroll);
    updateScroll();

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  // 3. RESPONSIVENESS DRAWER & ACCESSIBLE NAV
  const handleNavigationDrawer = () => {
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const links = document.querySelectorAll('.mobile-nav-link');

    const toggleDrawer = (isOpen) => {
      hamburger.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        drawer.classList.add('open');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
      } else {
        drawer.classList.remove('open');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
      }
    };

    if (hamburger && drawer && overlay) {
      hamburger.addEventListener('click', () => {
        const isOpen = drawer.classList.contains('open');
        toggleDrawer(!isOpen);
      });

      overlay.addEventListener('click', () => toggleDrawer(false));

      links.forEach(link => {
        link.addEventListener('click', () => toggleDrawer(false));
      });
    }
  };

  // 4. SCROLLSPY (ACTIVE SECTIONS ACCENTS)
  const handleScrollspy = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    const scrollSpyAction = () => {
      const scrollY = window.scrollY;

      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120; // Match sticky nav offset
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
          mobileLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    };

    window.addEventListener('scroll', scrollSpyAction);
    scrollSpyAction();
  };

  // 5. ANIMATED NUMERICAL COUNTERS (Intersection Observer)
  const handleCounters = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const startCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 1800; // Counter duration in ms
      let startTime = null;

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const currentCount = Math.floor(progress * target);
        
        el.innerText = `${prefix}${currentCount.toLocaleString()}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          el.innerText = `${prefix}${target.toLocaleString()}${suffix}`;
        }
      };

      requestAnimationFrame(animate);
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    statNumbers.forEach(num => counterObserver.observe(num));
  };

  // 6. PORTFOLIO FILTERING AND LIGHTBOX
  const handlePortfolio = () => {
    const filters = document.querySelectorAll('.filter-chip');
    const items = document.querySelectorAll('.portfolio-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxTags = document.getElementById('lightbox-tags');
    const lightboxClose = document.getElementById('lightbox-close');

    // Filtering chips
    filters.forEach(filter => {
      filter.addEventListener('click', () => {
        filters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');

        const category = filter.getAttribute('data-filter');

        items.forEach(item => {
          const itemCat = item.getAttribute('data-category');
          if (category === 'all' || itemCat === category) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });

    // Lightbox modal logic
    const openLightbox = (item) => {
      const imgEl = item.querySelector('img.portfolio-img');
      const videoEl = item.querySelector('video.portfolio-img');
      const lightboxVideo = document.getElementById('lightbox-video');

      const title = item.querySelector('h3').innerText;
      const desc = item.querySelector('p').innerText;
      const tags = item.querySelectorAll('.portfolio-tag');

      if (videoEl) {
        if (lightboxImg) lightboxImg.style.display = 'none';
        if (lightboxVideo) {
          lightboxVideo.style.display = 'block';
          const videoSrc = videoEl.querySelector('source') ? videoEl.querySelector('source').src : videoEl.src;
          lightboxVideo.src = videoSrc;
          lightboxVideo.load();
          lightboxVideo.play().catch(err => console.log("Autoplay blocked: ", err));
        }
      } else if (imgEl) {
        if (lightboxVideo) {
          lightboxVideo.style.display = 'none';
          lightboxVideo.pause();
        }
        if (lightboxImg) {
          lightboxImg.style.display = 'block';
          lightboxImg.src = imgEl.src;
        }
      }

      if (lightboxTitle) lightboxTitle.innerText = title;
      if (lightboxDesc) lightboxDesc.innerText = desc;
      
      if (lightboxTags) {
        lightboxTags.innerHTML = '';
        tags.forEach(tag => {
          const badge = document.createElement('span');
          badge.className = 'badge badge-primary';
          badge.style.fontFamily = 'var(--font-mono)';
          badge.innerText = tag.innerText;
          lightboxTags.appendChild(badge);
        });
      }

      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      const lightboxVideo = document.getElementById('lightbox-video');
      if (lightboxVideo) {
        lightboxVideo.pause();
      }
    };

    items.forEach(item => {
      const trigger = item.querySelector('.portfolio-btn');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          openLightbox(item);
        });
      }
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }

    // Keyboard support for Lightbox
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
  };

  // 7. BEFORE & AFTER COMPARE SLIDER
  const handleBeforeAfterSlider = () => {
    const container = document.querySelector('.slider-container');
    if (!container) return;

    const sliderBefore = container.querySelector('.slider-before');
    const handle = container.querySelector('.slider-handle');
    let isResizing = false;

    const getXPosition = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      return clientX - rect.left;
    };

    const resizeSlider = (x) => {
      const containerWidth = container.offsetWidth;
      // Clamp bounds to prevent overflow issues
      const position = Math.max(0, Math.min(x, containerWidth));
      const percentage = (position / containerWidth) * 100;

      sliderBefore.style.width = `${percentage}%`;
      handle.style.left = `${percentage}%`;
    };

    const startDrag = (e) => {
      isResizing = true;
      e.preventDefault();
    };

    const stopDrag = () => {
      isResizing = false;
    };

    const drag = (e) => {
      if (!isResizing) return;
      const x = getXPosition(e);
      // Run rendering inside animation frame for maximum fluid performance
      requestAnimationFrame(() => resizeSlider(x));
    };

    // Desktop bindings
    handle.addEventListener('mousedown', startDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('mousemove', drag);

    // Mobile bindings
    handle.addEventListener('touchstart', startDrag, { passive: true });
    window.addEventListener('touchend', stopDrag);
    window.addEventListener('touchmove', drag, { passive: true });

    // Handle container resize adjustments
    window.addEventListener('resize', () => {
      const beforeImg = sliderBefore.querySelector('img');
      if (beforeImg) {
        beforeImg.style.width = `${container.offsetWidth}px`;
      }
    });
  };

  // 8. TESTIMONIALS CAROUSEL
  const handleTestimonials = () => {
    const wrapper = document.querySelector('.carousel-wrapper');
    if (!wrapper) return;

    const track = wrapper.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsNav = document.getElementById('carousel-dots');
    
    let currentIndex = 0;
    let autoPlayTimer = null;

    // Build navigation dot controls dynamically
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
      dot.setAttribute('data-slide', i);
      dotsNav.appendChild(dot);
    });
    const dots = Array.from(dotsNav.children);

    const updateSlidePosition = (targetIndex) => {
      currentIndex = targetIndex;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Update dot indices
      dots.forEach(dot => dot.classList.remove('active'));
      dots[currentIndex].classList.add('active');
    };

    const slideNext = () => {
      const nextIndex = (currentIndex + 1) % slides.length;
      updateSlidePosition(nextIndex);
    };

    const slidePrev = () => {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlidePosition(prevIndex);
    };

    const startAutoplay = () => {
      autoPlayTimer = setInterval(slideNext, 5000);
    };

    const stopAutoplay = () => {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    };

    // User controls
    if (nextBtn) nextBtn.addEventListener('click', () => {
      stopAutoplay();
      slideNext();
      startAutoplay();
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
      stopAutoplay();
      slidePrev();
      startAutoplay();
    });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const slideIndex = parseInt(dot.getAttribute('data-slide'), 10);
        stopAutoplay();
        updateSlidePosition(slideIndex);
        startAutoplay();
      });
    });

    // Touch Swipe Controls
    let touchStartX = 0;
    let touchEndX = 0;

    wrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay();
    }, { passive: true });

    const handleSwipe = () => {
      const difference = touchStartX - touchEndX;
      if (difference > 50) {
        slideNext();
      } else if (difference < -50) {
        slidePrev();
      }
    };

    // Autoplay cycle
    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);
    startAutoplay();
  };

  // 9. SKILLS ANIMATIONS (Intersection Observer)
  const handleSkills = () => {
    const progressFills = document.querySelectorAll('.skill-bar-fill');

    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const targetPercent = fill.getAttribute('data-progress') || '0%';
          fill.style.width = targetPercent;
          observer.unobserve(fill);
        }
      });
    }, { threshold: 0.15 });

    progressFills.forEach(fill => skillsObserver.observe(fill));
  };

  // 10. WORK PROCESS TIMELINE ACCENTS
  const handleTimeline = () => {
    const steps = document.querySelectorAll('.timeline-step');
    const progressBar = document.querySelector('.timeline-line-progress');
    const timelineContainer = document.querySelector('.timeline-container');
    if (steps.length === 0) return;

    // Scroll-linked connectors
    const updateTimelineProgress = () => {
      if (!timelineContainer) return;
      const rect = timelineContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Determine viewport ratio relative to container
      const startTrigger = windowHeight * 0.8;
      const endTrigger = windowHeight * 0.2;
      const totalDist = startTrigger - endTrigger;
      
      const relativeTop = rect.top - endTrigger;
      const progressRatio = 1 - (relativeTop / (rect.height + totalDist));
      const clampedRatio = Math.max(0, Math.min(progressRatio, 1));

      // Check if timeline layout is vertical or horizontal
      const isMobile = window.innerWidth <= 991;

      if (progressBar) {
        if (isMobile) {
          progressBar.style.height = `${clampedRatio * 100}%`;
          progressBar.style.width = '100%';
        } else {
          progressBar.style.width = `${clampedRatio * 100}%`;
          progressBar.style.height = '100%';
        }
      }

      // Highlight active steps sequentially
      steps.forEach((step, idx) => {
        const stepThreshold = (idx + 0.5) / steps.length;
        if (clampedRatio >= stepThreshold) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
    };

    // Staggered reveal observer
    const stepRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100);
        }
      });
    }, { threshold: 0.1 });

    steps.forEach(step => stepRevealObserver.observe(step));
    window.addEventListener('scroll', updateTimelineProgress);
    updateTimelineProgress();
  };

  // 11. FAQ ACCORDION ENGINE
  const handleFAQ = () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      const content = item.querySelector('.faq-content');

      if (trigger && content) {
        trigger.addEventListener('click', () => {
          const isActive = item.classList.contains('active');

          // Close other active drawers to satisfy single-open restriction
          faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
              otherItem.classList.remove('active');
              otherItem.querySelector('.faq-content').style.maxHeight = '0px';
            }
          });

          // Toggle current state
          if (isActive) {
            item.classList.remove('active');
            content.style.maxHeight = '0px';
          } else {
            item.classList.add('active');
            // Calculate scroll heights to accommodate smooth height animation
            content.style.maxHeight = `${content.scrollHeight}px`;
          }
        });
      }
    });
  };

  // 12. CONTACT FORM AND TOAST SYSTEM
  const handleContactForm = () => {
    const form = document.getElementById('contact-form');
    const toastContainer = document.getElementById('toast-container');
    if (!form) return;

    // Toast alert triggers
    const showToast = (message, type = 'success') => {
      if (!toastContainer) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      
      let icon = '';
      if (type === 'success') {
        icon = `<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
      } else if (type === 'error') {
        icon = `<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
      } else {
        icon = `<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
      }

      toast.innerHTML = `
        ${icon}
        <span class="toast-message">${message}</span>
      `;
      
      toastContainer.appendChild(toast);

      // Slide in animation frame delay
      setTimeout(() => toast.classList.add('show'), 50);

      // Self cleanup
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
      }, 4000);
    };

    // Client side regex matching helpers
    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePhone = (phone) => {
      // Optional check, but if provided should resemble phone digits
      if (!phone) return true;
      return /^[\d\s()+-]{7,20}$/.test(phone);
    };

    const validateField = (group, input, validationFn, errorMsg) => {
      const value = input.value.trim();
      const isValid = validationFn(value);

      if (!isValid) {
        group.classList.add('error');
        group.classList.remove('success');
        group.querySelector('.validation-message').innerText = errorMsg;
        return false;
      } else {
        group.classList.remove('error');
        group.classList.add('success');
        return true;
      }
    };

    // Event listeners for inputs to clear error classes on focus/input
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
      const group = input.closest('.form-group');
      input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
          group.classList.remove('error');
        }
      });
    });

    // Form Submission Interception
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameGroup = document.getElementById('group-name');
      const nameInput = document.getElementById('form-name');
      const emailGroup = document.getElementById('group-email');
      const emailInput = document.getElementById('form-email');
      const phoneGroup = document.getElementById('group-phone');
      const phoneInput = document.getElementById('form-phone');
      const msgGroup = document.getElementById('group-message');
      const msgInput = document.getElementById('form-message');
      const honeypot = document.getElementById('honeypot-input');

      // Honeypot spam test
      if (honeypot && honeypot.value !== '') {
        console.warn('Spam submission detected by honeypot.');
        // Fail silently to the bot
        form.reset();
        showToast('Inquiry sent successfully.', 'success');
        return;
      }

      let formIsValid = true;

      // Validate Name
      if (!validateField(nameGroup, nameInput, (v) => v.length >= 2, 'Please enter a name with at least 2 characters.')) {
        formIsValid = false;
      }

      // Validate Email
      if (!validateField(emailGroup, emailInput, validateEmail, 'Please enter a valid email address.')) {
        formIsValid = false;
      }

      // Validate Phone (optional but formats verified if exists)
      if (!validateField(phoneGroup, phoneInput, validatePhone, 'Please enter a valid phone number.')) {
        formIsValid = false;
      }

      // Validate Message
      if (!validateField(msgGroup, msgInput, (v) => v.length >= 10, 'Please write a message with at least 10 characters.')) {
        formIsValid = false;
      }

      if (!formIsValid) {
        showToast('Please correct the highlighted errors in the form.', 'error');
        return;
      }

      // Success branch simulation
      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn.innerText;
      submitBtn.disabled = true;
      submitBtn.innerText = 'Sending Inquiry...';

      setTimeout(() => {
        console.log('Form submission payload:', {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          phone: phoneInput.value.trim(),
          subject: document.getElementById('form-subject')?.value || 'General inquiry',
          message: msgInput.value.trim()
        });

        // Reset elements
        form.reset();
        inputs.forEach(input => {
          input.closest('.form-group').classList.remove('success', 'error');
        });

        submitBtn.disabled = false;
        submitBtn.innerText = origText;

        showToast('Your message has been sent successfully. We will get back to you soon!', 'success');
      }, 1200);
    });
  };

  // 13. BOOTSTRAPPING CONTROLLERS
  handlePreloader();
  handleScrollEffects();
  handleNavigationDrawer();
  handleScrollspy();
  handleCounters();
  handlePortfolio();
  handleBeforeAfterSlider();
  handleTestimonials();
  handleSkills();
  handleTimeline();
  handleFAQ();
  handleContactForm();

  // 14. INITIALIZE ICONSETS (Lucide fallback)
  if (window.lucide) {
    lucide.createIcons();
  }
});
