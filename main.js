(() => {
  const root = document.documentElement;
  const Motion = window.Motion;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopFlow = window.matchMedia('(min-width: 64rem)');
  const tabletHeroFlow = window.matchMedia('(min-width: 48rem) and (max-width: 63.999rem)');
  const desktopMenu = window.matchMedia('(min-width: 56rem)');
  const ENTER_EASE = [0.22, 1, 0.36, 1];
  const EXIT_EASE = [0.4, 0, 1, 1];
  const activeAnimations = new Set();
  const motionTimers = new Set();
  let scrollCleanups = [];
  let inViewCleanup = null;
  let heroPlayed = false;

  root.classList.add('js');
  if (Motion) root.classList.add('motion-ready');

  const elementsFor = (target) => {
    if (!target) return [];
    if (typeof target === 'string') return [...document.querySelectorAll(target)];
    if (target instanceof Element) return [target];
    return [...target].filter(Boolean);
  };

  const clearAnimatedStyles = (target) => {
    elementsFor(target).forEach((element) => {
      element.classList.remove('is-motion-active');
      ['opacity', 'transform', 'clip-path', 'filter', 'will-change'].forEach((property) => {
        element.style.removeProperty(property);
      });
    });
  };

  const animateAndClear = (target, keyframes, options = {}, reduced = {}) => {
    const elements = elementsFor(target);
    const resolvedKeyframes = reducedMotion.matches ? reduced.keyframes : keyframes;
    const resolvedOptions = reducedMotion.matches
      ? { ...options, ...reduced.options }
      : options;

    if (!Motion?.animate || !elements.length || !resolvedKeyframes) {
      clearAnimatedStyles(elements);
      return null;
    }

    elements.forEach((element) => element.classList.add('is-motion-active'));
    let controls;
    try {
      controls = Motion.animate(elements, resolvedKeyframes, resolvedOptions);
    } catch {
      clearAnimatedStyles(elements);
      return null;
    }
    activeAnimations.add(controls);
    controls.finished
      .catch(() => {})
      .finally(() => {
        activeAnimations.delete(controls);
        clearAnimatedStyles(elements);
      });
    return controls;
  };

  const scheduleMotion = (callback, delay) => {
    const timer = window.setTimeout(() => {
      motionTimers.delete(timer);
      callback();
    }, delay);
    motionTimers.add(timer);
  };

  const clearSequencingState = () => {
    motionTimers.forEach((timer) => window.clearTimeout(timer));
    motionTimers.clear();
    document.querySelectorAll('.is-sequencing').forEach((element) => {
      element.classList.remove('is-sequencing');
    });
    document.querySelectorAll('.is-reached').forEach((element) => {
      element.classList.remove('is-reached');
    });
  };

  const cancelTransientMotion = () => {
    activeAnimations.forEach((controls) => controls.cancel?.());
    activeAnimations.clear();
    clearAnimatedStyles(document.querySelectorAll('.is-motion-active'));
    clearSequencingState();
  };

  const runEntranceMotion = () => {
    if (heroPlayed || !Motion?.animate) return;
    heroPlayed = true;

    animateAndClear(document.querySelector('[data-header-inner]'), {
      opacity: [0, 1],
      transform: ['translate3d(0,-6px,0)', 'translate3d(0,0,0)']
    }, { duration: 0.36, ease: ENTER_EASE }, {
      keyframes: { opacity: [0.55, 1] },
      options: { duration: 0.28, ease: 'linear' }
    });

    const cover = document.querySelector('[data-motion-hero]');
    if (cover) {
      const heroSystem = cover.querySelector('[data-hero-flow]');
      const heroSteps = cover.querySelectorAll('[data-hero-step]');

      animateAndClear(cover.querySelectorAll('[data-hero-line]'), {
        opacity: [0, 1],
        transform: ['translate3d(0,105%,0)', 'translate3d(0,0,0)']
      }, {
        duration: 0.64,
        delay: Motion.stagger(0.075, { startDelay: 0.04 }),
        ease: ENTER_EASE
      }, {
        keyframes: { opacity: [0.42, 1] },
        options: {
          duration: 0.42,
          delay: Motion.stagger(0.065, { startDelay: 0.02 }),
          ease: 'linear'
        }
      });

      animateAndClear(cover.querySelectorAll('.cover-thesis, .cover-context, .cover-actions'), {
        opacity: [0, 1],
        transform: ['translate3d(0,12px,0)', 'translate3d(0,0,0)']
      }, {
        duration: 0.46,
        delay: Motion.stagger(0.06, { startDelay: 0.18 }),
        ease: ENTER_EASE
      }, {
        keyframes: { opacity: [0.52, 1] },
        options: {
          duration: 0.36,
          delay: Motion.stagger(0.045, { startDelay: 0.18 }),
          ease: 'linear'
        }
      });

      animateAndClear(heroSystem?.querySelector('.hero-system__head'), {
        opacity: [0.25, 1],
        transform: ['translate3d(0,6px,0)', 'translate3d(0,0,0)']
      }, { duration: 0.38, delay: 0.22, ease: ENTER_EASE }, {
        keyframes: { opacity: [0.55, 1] },
        options: { duration: 0.3, delay: 0.15, ease: 'linear' }
      });

      animateAndClear(heroSteps, {
        opacity: [0.12, 1],
        transform: ['translate3d(0,9px,0)', 'translate3d(0,0,0)']
      }, {
        duration: 0.34,
        delay: Motion.stagger(0.115, { startDelay: 0.39 }),
        ease: ENTER_EASE
      }, {
        keyframes: { opacity: [0.46, 1] },
        options: {
          duration: 0.32,
          delay: Motion.stagger(0.055, { startDelay: 0.27 }),
          ease: 'linear'
        }
      });

      animateAndClear(cover.querySelector('[data-hero-rail]'), {
        transform: tabletHeroFlow.matches ? ['scaleX(0)', 'scaleX(1)'] : ['scaleY(0)', 'scaleY(1)']
      }, { duration: 0.62, delay: 0.29, ease: 'linear' });

      if (!reducedMotion.matches && heroSystem) {
        heroSystem.classList.add('is-sequencing');
        heroSteps.forEach((step, index) => {
          scheduleMotion(() => step.classList.add('is-reached'), 410 + (index * 115));
        });
        scheduleMotion(clearSequencingState, 1120);
      }
      return;
    }

    const caseHero = document.querySelector('[data-motion-case]');
    if (!caseHero) return;

    animateAndClear(caseHero.querySelectorAll('[data-case-meta]'), {
      opacity: [0, 1],
      transform: ['translate3d(0,-5px,0)', 'translate3d(0,0,0)']
    }, {
      duration: 0.3,
      delay: Motion.stagger(0.045, { startDelay: 0.02 }),
      ease: ENTER_EASE
    }, {
      keyframes: { opacity: [0.55, 1] },
      options: { duration: 0.3, delay: Motion.stagger(0.04), ease: 'linear' }
    });

    animateAndClear(caseHero.querySelector('[data-case-title]'), {
      opacity: [0, 1],
      transform: ['translate3d(0,18px,0)', 'translate3d(0,0,0)']
    }, { duration: 0.62, delay: 0.05, ease: ENTER_EASE }, {
      keyframes: { opacity: [0.42, 1] },
      options: { duration: 0.42, delay: 0.03, ease: 'linear' }
    });

    animateAndClear(caseHero.querySelector('[data-case-copy]'), {
      opacity: [0, 1],
      transform: ['translate3d(0,8px,0)', 'translate3d(0,0,0)']
    }, { duration: 0.42, delay: 0.16, ease: ENTER_EASE }, {
      keyframes: { opacity: [0.55, 1] },
      options: { duration: 0.34, delay: 0.16, ease: 'linear' }
    });

    animateAndClear(caseHero.querySelector('[data-case-actions]'), {
      opacity: [0, 1],
      transform: ['translate3d(0,6px,0)', 'translate3d(0,0,0)']
    }, { duration: 0.36, delay: 0.24, ease: ENTER_EASE }, {
      keyframes: { opacity: [0.6, 1] },
      options: { duration: 0.28, delay: 0.24, ease: 'linear' }
    });
  };

  const setupInViewMotion = () => {
    inViewCleanup?.();
    inViewCleanup = null;
    if (!Motion?.inView) return;

    const revealed = new WeakSet();
    if (document.querySelector('[data-motion-hero]')) {
      document.querySelectorAll('[data-reveal]').forEach((element) => {
        const bounds = element.getBoundingClientRect();
        if (bounds.top < window.innerHeight * 0.92 && bounds.bottom > 0) {
          revealed.add(element);
        }
      });
    }

    inViewCleanup = Motion.inView('[data-reveal]', (element) => {
      if (revealed.has(element)) return;
      revealed.add(element);

      const type = element.dataset.reveal;
      if (reducedMotion.matches && !['section', 'contact', 'case'].includes(type)) return;
      const distance = type === 'project' ? 14 : type === 'section' || type === 'contact' ? 12 : 8;
      const duration = type === 'project' ? 0.52 : type === 'media' ? 0.46 : 0.42;

      animateAndClear(element, {
        opacity: [0.28, 1],
        transform: [`translate3d(0,${distance}px,0)`, 'translate3d(0,0,0)']
      }, { duration, ease: ENTER_EASE }, {
        keyframes: { opacity: [0.7, 1] },
        options: { duration: 0.28, ease: 'linear' }
      });
    }, { amount: 0.12, margin: '0px 0px -8% 0px' });
  };

  const clearScrollMotion = () => {
    scrollCleanups.forEach((cleanup) => cleanup?.());
    scrollCleanups = [];
    document.querySelectorAll('[data-scroll-rail], [data-flow-rail]').forEach((rail) => {
      rail.style.removeProperty('transform');
      rail.style.removeProperty('will-change');
    });
  };

  const attachScrollAnimation = (animation, options) => {
    if (!animation || !Motion?.scroll) return;
    const cleanup = Motion.scroll(animation, options);
    if (typeof cleanup === 'function') scrollCleanups.push(cleanup);
  };

  const setupScrollMotion = () => {
    clearScrollMotion();
    if (!Motion?.animate || !Motion?.scroll || reducedMotion.matches) return;

    document.querySelectorAll('[data-scroll-container]').forEach((container) => {
      const rail = container.querySelector('[data-scroll-rail]');
      if (!rail) return;
      const animation = Motion.animate(rail, {
        transform: ['scaleY(0)', 'scaleY(1)']
      }, { ease: 'linear' });
      attachScrollAnimation(animation, {
        target: container,
        offset: ['start 78%', 'end 78%']
      });
    });

    document.querySelectorAll('[data-scroll-flow]').forEach((container) => {
      const rail = container.querySelector('[data-flow-rail]');
      if (!rail) return;
      const horizontal = desktopFlow.matches;
      const animation = Motion.animate(rail, {
        transform: horizontal ? ['scaleX(0)', 'scaleX(1)'] : ['scaleY(0)', 'scaleY(1)']
      }, { ease: 'linear' });
      attachScrollAnimation(animation, {
        target: container,
        offset: ['start 82%', 'end 62%']
      });
    });
  };

  const setupMotion = ({ initial = false } = {}) => {
    cancelTransientMotion();
    if (initial) runEntranceMotion();
    setupInViewMotion();
    setupScrollMotion();
  };

  /* Mobile navigation keeps focus and assistive technology inside the open panel. */
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const navigation = document.querySelector('[data-navigation]');
  const pageSurfaces = [document.querySelector('main'), document.querySelector('footer')].filter(Boolean);
  let menuAnimation = null;

  const setPageInert = (value) => {
    pageSurfaces.forEach((surface) => {
      surface.inert = value;
      if (value) surface.setAttribute('inert', '');
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

    if (wasOpen && Motion?.animate && !immediate && !desktopMenu.matches) {
      clearMenuMotion();
      menuAnimation = Motion.animate(navigation, {
        opacity: [1, 0],
        ...(reducedMotion.matches ? {} : {
          transform: ['translate3d(0,0,0)', 'translate3d(0,-4px,0)']
        })
      }, { duration: reducedMotion.matches ? 0.08 : 0.12, ease: EXIT_EASE });
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
    if (Motion?.animate) {
      menuAnimation = Motion.animate(navigation, {
        opacity: [0, 1],
        ...(reducedMotion.matches ? {} : {
          transform: ['translate3d(0,-6px,0)', 'translate3d(0,0,0)']
        })
      }, { duration: reducedMotion.matches ? 0.1 : 0.18, ease: ENTER_EASE });

      animateAndClear(links, {
        opacity: [0, 1],
        transform: ['translate3d(0,-4px,0)', 'translate3d(0,0,0)']
      }, {
        duration: 0.18,
        delay: Motion.stagger(0.025, { startDelay: 0.03 }),
        ease: ENTER_EASE
      }, {
        keyframes: { opacity: [0.55, 1] },
        options: {
          duration: 0.12,
          delay: Motion.stagger(0.018, { startDelay: 0.015 })
        }
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
      if (event.target.closest('a')) closeMenu({ immediate: true });
    });

    document.addEventListener('keydown', (event) => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      if (event.key === 'Escape' && open) {
        closeMenu({ restoreFocus: true });
        return;
      }

      if (event.key !== 'Tab' || !open) return;
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
    });

    desktopMenu.addEventListener('change', (event) => {
      if (event.matches) closeMenu({ immediate: true });
    });
  }

  /* Current section marker on the homepage. */
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
    }, { rootMargin: '-18% 0px -70% 0px', threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const mainContent = document.getElementById('main-content');
  document.querySelector('.skip-link')?.addEventListener('click', () => {
    window.requestAnimationFrame(() => mainContent?.focus());
  });

  document.querySelectorAll('.footer-inner a[href="#main-content"]').forEach((link) => {
    link.addEventListener('click', () => {
      window.requestAnimationFrame(() => mainContent?.focus({ preventScroll: true }));
    });
  });

  /* Preserve native form submission while exposing useful validation and loading state. */
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const submitButton = form.querySelector('[data-submit-button]');
    const submitLabel = form.querySelector('[data-submit-label]');
    const status = form.querySelector('[data-form-status]');

    form.addEventListener('input', (event) => {
      event.target.removeAttribute?.('aria-invalid');
      if (status) {
        status.textContent = '';
        status.classList.remove('is-error');
      }
    });

    form.addEventListener('invalid', (event) => {
      event.target.setAttribute('aria-invalid', 'true');
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

  setupMotion({ initial: true });

  reducedMotion.addEventListener('change', () => {
    cancelTransientMotion();
    if (!reducedMotion.matches) heroPlayed = false;
    setupMotion({ initial: !reducedMotion.matches });
  });

  desktopFlow.addEventListener('change', setupScrollMotion);
})();
