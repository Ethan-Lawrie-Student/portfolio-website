(() => {
  document.documentElement.classList.add('js');

  const Motion = window.Motion;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ENTER_EASE = [0.22, 1, 0.36, 1];
  const EXIT_EASE = [0.4, 0, 1, 1];
  const activeAnimations = new Set();

  if (Motion) document.documentElement.classList.add('motion-ready');

  const elementsFor = (target) => {
    if (!target) return [];
    if (typeof target === 'string') return [...document.querySelectorAll(target)];
    if (target instanceof Element) return [target];
    return [...target];
  };

  const clearAnimatedStyles = (target) => {
    elementsFor(target).forEach((element) => {
      element.classList.remove('is-motion-active');
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
      element.style.removeProperty('will-change');
    });
  };

  const animateAndClear = (target, keyframes, options) => {
    const elements = elementsFor(target);
    if (!Motion?.animate || !elements.length || reducedMotion.matches) {
      clearAnimatedStyles(elements);
      return null;
    }

    elements.forEach((element) => element.classList.add('is-motion-active'));
    const animation = Motion.animate(elements, keyframes, options);
    activeAnimations.add(animation);
    animation.finished
      .catch(() => {})
      .finally(() => {
        activeAnimations.delete(animation);
        clearAnimatedStyles(elements);
      });
    return animation;
  };

  const stopMotion = () => {
    activeAnimations.forEach((animation) => animation.cancel?.());
    activeAnimations.clear();
    clearAnimatedStyles(document.querySelectorAll('.is-motion-active'));
  };

  const runHeroMotion = () => {
    const cover = document.querySelector('.cover-hero[data-motion-hero]');
    if (cover) {
      animateAndClear(cover.querySelectorAll('.cover-meta > p'), {
        opacity: [0, 1],
        transform: ['translate3d(0,-6px,0)', 'translate3d(0,0,0)']
      }, {
        duration: 0.32,
        delay: Motion.stagger(0.035),
        ease: ENTER_EASE
      });

      animateAndClear(cover.querySelectorAll('.cover-line > span'), {
        opacity: [0, 1],
        transform: ['translate3d(0,12px,0)', 'translate3d(0,0,0)']
      }, {
        duration: 0.56,
        delay: Motion.stagger(0.055, { startDelay: 0.05 }),
        ease: ENTER_EASE
      });

      animateAndClear(cover.querySelector('.cover-side'), {
        opacity: [0, 1],
        transform: ['translate3d(0,10px,0)', 'translate3d(0,0,0)']
      }, {
        duration: 0.42,
        delay: 0.14,
        ease: ENTER_EASE
      });
      return;
    }

    const caseHero = document.querySelector('.case-hero[data-motion-hero]');
    if (!caseHero) return;

    animateAndClear(caseHero.querySelector('h1'), {
      opacity: [0, 1],
      transform: ['translate3d(0,12px,0)', 'translate3d(0,0,0)']
    }, { duration: 0.56, delay: 0.05, ease: ENTER_EASE });

    animateAndClear(caseHero.querySelector('.case-deck'), {
      opacity: [0, 1],
      transform: ['translate3d(0,8px,0)', 'translate3d(0,0,0)']
    }, { duration: 0.42, delay: 0.13, ease: ENTER_EASE });

    animateAndClear(caseHero.querySelectorAll('.case-meta > div, .case-actions'), {
      opacity: [0, 1],
      transform: ['translate3d(0,6px,0)', 'translate3d(0,0,0)']
    }, {
      duration: 0.34,
      delay: Motion.stagger(0.035, { startDelay: 0.18 }),
      ease: ENTER_EASE
    });
  };

  const setupMotion = () => {
    stopMotion();
    if (!Motion || reducedMotion.matches) return;
    runHeroMotion();
  };

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const navigation = document.querySelector('[data-navigation]');
  const desktopMedia = window.matchMedia('(min-width: 56rem)');
  const pageSurfaces = [document.querySelector('main'), document.querySelector('footer')].filter(Boolean);
  let menuAnimation = null;

  const setPageInert = (inert) => {
    pageSurfaces.forEach((surface) => {
      surface.inert = inert;
      if (inert) surface.setAttribute('inert', '');
      else surface.removeAttribute('inert');
    });
  };

  const clearMenuMotion = () => {
    menuAnimation?.cancel?.();
    menuAnimation = null;
    clearAnimatedStyles(navigation);
    clearAnimatedStyles(navigation?.querySelectorAll('a'));
  };

  const closeMenu = async ({ restoreFocus = false, immediate = false } = {}) => {
    if (!menuToggle || !navigation) return;
    const wasOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', 'false');

    if (wasOpen && Motion?.animate && !reducedMotion.matches && !immediate && !desktopMedia.matches) {
      clearMenuMotion();
      menuAnimation = Motion.animate(navigation, {
        opacity: [1, 0],
        transform: ['translate3d(0,0,0)', 'translate3d(0,-4px,0)']
      }, { duration: 0.12, ease: EXIT_EASE });
      await menuAnimation.finished.catch(() => {});
    }

    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    setPageInert(false);
    clearMenuMotion();
    if (restoreFocus) menuToggle.focus();
  };

  const openMenu = () => {
    if (!menuToggle || !navigation) return;
    clearMenuMotion();
    menuToggle.setAttribute('aria-expanded', 'true');
    navigation.classList.add('is-open');
    document.body.classList.add('menu-open');
    setPageInert(true);

    const links = navigation.querySelectorAll('a');
    if (Motion?.animate && !reducedMotion.matches) {
      menuAnimation = Motion.animate(navigation, {
        opacity: [0, 1],
        transform: ['translate3d(0,-6px,0)', 'translate3d(0,0,0)']
      }, { duration: 0.18, ease: ENTER_EASE });
      animateAndClear(links, {
        opacity: [0, 1],
        transform: ['translate3d(0,-4px,0)', 'translate3d(0,0,0)']
      }, {
        duration: 0.18,
        delay: Motion.stagger(0.025, { startDelay: 0.03 }),
        ease: ENTER_EASE
      });
    }

    window.requestAnimationFrame(() => links[0]?.focus());
  };

  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', () => {
      const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
      if (opening) openMenu();
      else closeMenu({ restoreFocus: true });
    });

    navigation.addEventListener('click', (event) => {
      if (!event.target.closest('a')) return;
      closeMenu({ immediate: true });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu({ restoreFocus: true });
      }

      if (event.key === 'Tab' && menuToggle.getAttribute('aria-expanded') === 'true') {
        const focusable = [...document.querySelectorAll('.header-inner a[href], .header-inner button:not([disabled])')]
          .filter((element) => element.offsetParent !== null);
        const first = focusable[0];
        const last = focusable.at(-1);

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    });

    desktopMedia.addEventListener('change', (event) => {
      if (event.matches) closeMenu({ immediate: true });
    });
  }

  const sectionLinks = [...document.querySelectorAll('[data-navigation] a[href^="#"]')];
  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const visibleSections = new Map();
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleSections.set(entry.target.id, entry);
        else visibleSections.delete(entry.target.id);
      });

      const visible = [...visibleSections.values()]
        .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];

      sectionLinks.forEach((link) => {
        const active = visible && link.getAttribute('href') === `#${visible.target.id}`;
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-18% 0px -72% 0px', threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.getElementById('main-content');
  if (skipLink && mainContent) {
    skipLink.addEventListener('click', () => {
      window.requestAnimationFrame(() => mainContent.focus());
    });
  }

  document.querySelectorAll('.footer-inner a[href="#main-content"]').forEach((link) => {
    link.addEventListener('click', () => {
      window.requestAnimationFrame(() => mainContent?.focus({ preventScroll: true }));
    });
  });

  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const submitButton = form.querySelector('[data-submit-button]');
    const submitLabel = form.querySelector('[data-submit-label]');
    const status = form.querySelector('[data-form-status]');

    form.addEventListener('input', () => {
      if (status) {
        status.textContent = '';
        status.classList.remove('is-error');
      }
    });

    form.addEventListener('invalid', () => {
      if (status) {
        status.textContent = 'Check the highlighted field and try again.';
        status.classList.add('is-error');
      }
    }, true);

    form.addEventListener('submit', () => {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.setAttribute('aria-disabled', 'true');
      }
      if (submitLabel) submitLabel.textContent = 'Sending…';
      if (status) {
        status.classList.remove('is-error');
        status.textContent = 'Submitting securely…';
      }
    });

    window.addEventListener('pageshow', () => {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-disabled');
      }
      if (submitLabel) submitLabel.textContent = 'Send message';
      if (status) status.textContent = '';
    });
  }

  setupMotion();
  reducedMotion.addEventListener('change', setupMotion);
})();
