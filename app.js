/**
 * PIXEL PHOTOGRAPHY — Luxury Photography & Creative Studio
 * Core Application Javascript
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. PRELOADER ANIMATION ──────────────────────────────────────────
  const preloader = document.getElementById('preloader');
  const plFill = document.getElementById('pl-fill');
  const plPct = document.getElementById('pl-pct');
  
  let percent = 0;
  const interval = setInterval(() => {
    percent += Math.floor(Math.random() * 15) + 5;
    if (percent >= 100) {
      percent = 100;
      clearInterval(interval);
      
      // Update bar and text to 100%
      plFill.style.width = '100%';
      plPct.textContent = '100%';
      
      // Fade out preloader
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        
        // Trigger hero reveal after preloader is gone
        revealHeroElements();
      }, 400);
    } else {
      plFill.style.width = `${percent}%`;
      plPct.textContent = `${percent}%`;
    }
  }, 100);

  // Helper to trigger hero anims
  function revealHeroElements() {
    document.querySelectorAll('.hero-body .reveal').forEach(el => {
      el.classList.add('active');
    });
  }


  // ── 2. HEADER SCROLL & MOBILE NAVIGATION ───────────────────────────
  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const menuLinks = document.querySelectorAll('.nl');

  // Change header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Hamburger Menu Toggle
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close Mobile Menu on link click
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });


  // ── 3. SCROLL REVEAL ANIMATIONS ────────────────────────────────────
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once shown
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    // Avoid double observing hero elements which are manually animated
    if (!el.closest('.hero')) {
      revealObserver.observe(el);
    }
  });


  // ── 4. STATS COUNTER ANIMATION ─────────────────────────────────────
  const stats = document.querySelectorAll('.rs-num');
  
  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds duration
    const stepTime = Math.max(Math.floor(duration / target), 10);
    let current = 0;
    
    const timer = setInterval(() => {
      current += Math.ceil(target / 100);
      if (current >= target) {
        element.textContent = target + (target === 8 || target === 25 ? '+' : '');
        clearInterval(timer);
      } else {
        element.textContent = current;
      }
    }, stepTime);
  };

  const ribbonObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        stats.forEach(stat => countUp(stat));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const ribbonSection = document.querySelector('.ribbon');
  if (ribbonSection) {
    ribbonObserver.observe(ribbonSection);
  }


  // ── 5. PORTFOLIO FILTERING ─────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.pf-btn');
  const pfItems = document.querySelectorAll('.pf-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active classes
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      pfItems.forEach(item => {
        const itemCat = item.getAttribute('data-cat');
        if (filterVal === 'all' || itemCat === filterVal) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });


  // ── 6. FULLSCREEN LIGHTBOX ─────────────────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  const lbCaption = document.getElementById('lb-caption');

  let currentGalleryIndex = 0;
  let activeGalleryItems = [];

  // Open Lightbox
  const openLightbox = (index) => {
    // Collect active (non-hidden) items
    activeGalleryItems = Array.from(pfItems).filter(item => !item.classList.contains('hide'));
    currentGalleryIndex = index;
    
    const currentItem = activeGalleryItems[currentGalleryIndex];
    if (!currentItem) return;

    const imgEl = currentItem.querySelector('img');
    const captionEl = currentItem.querySelector('h4');
    
    lbImg.classList.remove('loaded');
    lbImg.src = imgEl.src;
    lbCaption.textContent = captionEl ? captionEl.textContent : '';
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // stop scroll

    setTimeout(() => {
      lbImg.classList.add('loaded');
    }, 50);
  };

  // Attach click to zoom actions
  pfItems.forEach((item, index) => {
    const zoomBtn = item.querySelector('.pf-zoom');
    const mediaWrap = item.querySelector('.pf-media');

    const handleOpen = (e) => {
      e.stopPropagation();
      // recalculate exact index in the filtered list
      const currentFilteredList = Array.from(pfItems).filter(i => !i.classList.contains('hide'));
      const activeIdx = currentFilteredList.indexOf(item);
      openLightbox(activeIdx);
    };

    if (zoomBtn) zoomBtn.addEventListener('click', handleOpen);
    if (mediaWrap) mediaWrap.addEventListener('click', handleOpen);
  });

  // Navigate Gallery
  const navigateGallery = (direction) => {
    currentGalleryIndex += direction;
    
    if (currentGalleryIndex >= activeGalleryItems.length) {
      currentGalleryIndex = 0;
    } else if (currentGalleryIndex < 0) {
      currentGalleryIndex = activeGalleryItems.length - 1;
    }

    const nextItem = activeGalleryItems[currentGalleryIndex];
    if (!nextItem) return;

    const imgEl = nextItem.querySelector('img');
    const captionEl = nextItem.querySelector('h4');

    lbImg.classList.remove('loaded');
    setTimeout(() => {
      lbImg.src = imgEl.src;
      lbCaption.textContent = captionEl ? captionEl.textContent : '';
      lbImg.classList.add('loaded');
    }, 150);
  };

  // Close Lightbox
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => navigateGallery(-1));
  lbNext.addEventListener('click', () => navigateGallery(1));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateGallery(-1);
    if (e.key === 'ArrowRight') navigateGallery(1);
  });

  // Click outside to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lb-img-wrap')) {
      closeLightbox();
    }
  });


  // ── 7. BEFORE & AFTER SLIDER ───────────────────────────────────────
  const baSlider = document.getElementById('ba-slider');
  const baAfter = document.getElementById('ba-after');
  const baHandle = document.getElementById('ba-handle');

  if (baSlider) {
    let isResizing = false;

    // Adjust width of raw image overlay dynamically to maintain seamless positioning
    const setRawImageWidth = () => {
      const sliderWidth = baSlider.getBoundingClientRect().width;
      const allImgs = baSlider.querySelectorAll('.ba-img');
      allImgs.forEach(img => {
        img.style.width = `${sliderWidth}px`;
      });
    };

    window.addEventListener('resize', setRawImageWidth);
    setRawImageWidth();

    const updateSlider = (clientX) => {
      const rect = baSlider.getBoundingClientRect();
      const position = clientX - rect.left;
      let percentage = (position / rect.width) * 100;
      
      // boundaries
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      baAfter.style.width = `${percentage}%`;
      baHandle.style.left = `${percentage}%`;
    };

    const startResize = (e) => {
      isResizing = true;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      updateSlider(clientX);
    };

    const resize = (e) => {
      if (!isResizing) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      updateSlider(clientX);
    };

    const stopResize = () => {
      isResizing = false;
    };

    // Mouse events
    baSlider.addEventListener('mousedown', startResize);
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize);

    // Touch events
    baSlider.addEventListener('touchstart', startResize);
    window.addEventListener('touchmove', resize);
    window.addEventListener('touchend', stopResize);
  }


  // ── 8. CONTACT FORM SIMULATION ─────────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  const successMsg = document.getElementById('cf-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const msg = document.getElementById('cf-msg').value.trim();

      if (!name || !email || !msg) {
        alert('Please fill in all required fields.');
        return;
      }

      // Simulate successful submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending... <i class="ri-loader-4-line ri-spin"></i>';

      setTimeout(() => {
        submitBtn.innerHTML = 'Sent!';
        successMsg.style.display = 'block';
        contactForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          successMsg.style.display = 'none';
        }, 5000);
      }, 1500);
    });
  }


  // ── 9. NAV LINK ACTIVE HIGHLIGHT ON SCROLL ────────────────────────
  const sections = document.querySelectorAll('section');
  
  const scrollSpy = () => {
    const scrollPos = window.scrollY + 200;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        menuLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', scrollSpy);


  // ── 10. CURRENT YEAR IN FOOTER ─────────────────────────────────────
  const copyYear = document.getElementById('copy-year');
  if (copyYear) {
    copyYear.textContent = new Date().getFullYear();
  }

});
