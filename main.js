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
  const playedSystems = new WeakSet();
  let systemMotionCleanup = null;
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

  const runHeroEntrance = (cover) => {
    const heroSystem = cover.querySelector('[data-hero-flow]');
    const heroSteps = cover.querySelectorAll('[data-hero-step]');

    animateAndClear(cover.querySelectorAll('[data-hero-line]'), {
      opacity: [0, 1],
      transform: ['translate3d(0,105%,0)', 'translate3d(0,0,0)'],
      clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)']
    }, {
      duration: 0.64,
      delay: Motion.stagger(0.075, { startDelay: 0.04 }),
      ease: ENTER_EASE
    }, {
      keyframes: { opacity: [0.5, 1] },
      options: {
        duration: 0.38,
        delay: Motion.stagger(0.055, { startDelay: 0.02 }),
        ease: 'linear'
      }
    });

    animateAndClear(cover.querySelector('[data-hero-copy]'), {
      opacity: [0, 1],
      transform: ['translate3d(0,10px,0)', 'translate3d(0,0,0)']
    }, { duration: 0.48, delay: 0.2, ease: ENTER_EASE }, {
      keyframes: { opacity: [0.55, 1] },
      options: { duration: 0.34, delay: 0.16, ease: 'linear' }
    });

    animateAndClear(heroSystem?.querySelector('.hero-system__head'), {
      opacity: [0.35, 1],
      clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)']
    }, { duration: 0.42, delay: 0.24, ease: ENTER_EASE }, {
      keyframes: { opacity: [0.6, 1] },
      options: { duration: 0.28, delay: 0.14, ease: 'linear' }
    });

    animateAndClear(heroSteps, {
      opacity: [0.18, 1],
      transform: ['translate3d(0,7px,0)', 'translate3d(0,0,0)']
    }, {
      duration: 0.34,
      delay: Motion.stagger(0.105, { startDelay: 0.39 }),
      ease: ENTER_EASE
    }, {
      keyframes: { opacity: [0.52, 1] },
      options: {
        duration: 0.3,
        delay: Motion.stagger(0.045, { startDelay: 0.22 }),
        ease: 'linear'
      }
    });

    animateAndClear(cover.querySelector('[data-hero-rail]'), {
      transform: tabletHeroFlow.matches ? ['scaleX(0)', 'scaleX(1)'] : ['scaleY(0)', 'scaleY(1)']
    }, { duration: 0.62, delay: 0.3, ease: 'linear' });

    if (!reducedMotion.matches && heroSystem) {
      heroSystem.classList.add('is-sequencing');
      heroSteps.forEach((step, index) => {
        scheduleMotion(() => step.classList.add('is-reached'), 420 + (index * 105));
      });
      scheduleMotion(clearSequencingState, 1080);
    }
  };

  const runCaseEntrance = (caseHero) => {
    animateAndClear(caseHero.querySelector('[data-case-title]'), {
      opacity: [0, 1],
      transform: ['translate3d(0,14px,0)', 'translate3d(0,0,0)'],
      clipPath: ['inset(0 0 18% 0)', 'inset(0 0 0% 0)']
    }, { duration: 0.58, delay: 0.04, ease: ENTER_EASE }, {
      keyframes: { opacity: [0.48, 1] },
      options: { duration: 0.4, delay: 0.02, ease: 'linear' }
    });

    animateAndClear(caseHero.querySelector('[data-case-copy]'), {
      opacity: [0, 1],
      transform: ['translate3d(0,7px,0)', 'translate3d(0,0,0)']
    }, { duration: 0.4, delay: 0.16, ease: ENTER_EASE }, {
      keyframes: { opacity: [0.6, 1] },
      options: { duration: 0.3, delay: 0.12, ease: 'linear' }
    });

    animateAndClear(caseHero.querySelector('[data-case-meta]'), {
      opacity: [0.35, 1],
      clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']
    }, { duration: 0.5, delay: 0.2, ease: ENTER_EASE }, {
      keyframes: { opacity: [0.65, 1] },
      options: { duration: 0.28, delay: 0.16, ease: 'linear' }
    });

    animateAndClear(caseHero.querySelector('[data-case-actions]'), {
      opacity: [0, 1],
      transform: ['translate3d(0,5px,0)', 'translate3d(0,0,0)']
    }, { duration: 0.34, delay: 0.26, ease: ENTER_EASE }, {
      keyframes: { opacity: [0.65, 1] },
      options: { duration: 0.26, delay: 0.2, ease: 'linear' }
    });

    animateAndClear(caseHero.querySelector('[data-case-media]'), {
      opacity: [0.35, 1],
      clipPath: ['inset(0 0 18% 0)', 'inset(0 0 0% 0)'],
      filter: ['blur(3px)', 'blur(0px)']
    }, { duration: 0.62, delay: 0.14, ease: ENTER_EASE }, {
      keyframes: { opacity: [0.62, 1] },
      options: { duration: 0.34, delay: 0.12, ease: 'linear' }
    });
  };

  const runEntranceMotion = () => {
    if (heroPlayed || !Motion?.animate) return;
    heroPlayed = true;

    const cover = document.querySelector('[data-motion-hero]');
    if (cover) {
      runHeroEntrance(cover);
      return;
    }

    const caseHero = document.querySelector('[data-motion-case]');
    if (caseHero) runCaseEntrance(caseHero);
  };

  const animateSystemStep = (step, delay) => {
    animateAndClear(step, {
      opacity: [0.38, 1],
      transform: ['translate3d(0,6px,0)', 'translate3d(0,0,0)']
    }, { duration: 0.34, delay, ease: ENTER_EASE });
  };

  const runAzureSystem = (system) => {
    const rail = system.querySelector('[data-motion-rail]');
    const steps = [...system.querySelectorAll('[data-motion-step]')];
    const proof = document.querySelector('[data-motion-proof]');

    system.classList.add('is-sequencing');
    animateAndClear(rail, {
      transform: desktopFlow.matches ? ['scaleX(0)', 'scaleX(1)'] : ['scaleY(0)', 'scaleY(1)']
    }, { duration: 0.72, ease: 'linear' });

    steps.forEach((step, index) => {
      const delay = 0.08 + (index * 0.11);
      animateSystemStep(step, delay);
      scheduleMotion(() => step.classList.add('is-reached'), (delay * 1000) + 80);
    });

    animateAndClear(proof, {
      opacity: [0.35, 1],
      clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)']
    }, { duration: 0.46, delay: 0.62, ease: ENTER_EASE });
    scheduleMotion(clearSequencingState, 1050);
  };

  const runCmvSystem = (system) => {
    const rail = system.querySelector('[data-motion-rail]');
    const fork = system.querySelector('[data-motion-fork]');
    const steps = [...system.querySelectorAll('[data-motion-step]')];
    const delays = [0.04, 0.16, 0.36, 0.36];

    system.classList.add('is-sequencing');
    animateAndClear(rail, {
      transform: desktopFlow.matches ? ['scaleX(0)', 'scaleX(1)'] : ['scaleY(0)', 'scaleY(1)']
    }, { duration: 0.5, ease: 'linear' });

    animateAndClear(fork, {
      clipPath: desktopFlow.matches
        ? ['inset(0 100% 0 0)', 'inset(0 0% 0 0)']
        : ['inset(0 0 100% 0)', 'inset(0 0 0% 0)']
    }, { duration: 0.4, delay: 0.27, ease: ENTER_EASE });

    steps.forEach((step, index) => {
      animateSystemStep(step, delays[index]);
      scheduleMotion(() => step.classList.add('is-reached'), (delays[index] * 1000) + 90);
    });
    scheduleMotion(clearSequencingState, 900);
  };

  const setupSystemMotion = () => {
    systemMotionCleanup?.();
    systemMotionCleanup = null;
    if (!Motion?.inView) return;

    systemMotionCleanup = Motion.inView('[data-motion-system]', (system) => {
      if (reducedMotion.matches || playedSystems.has(system)) return;
      playedSystems.add(system);
      if (system.dataset.motionSystem === 'azure') runAzureSystem(system);
      if (system.dataset.motionSystem === 'cmv') runCmvSystem(system);
    }, { amount: 0.18, margin: '0px 0px -10% 0px' });
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
        keyframes: { opacity: [0.58, 1] },
        options: {
          duration: 0.12,
          delay: Motion.stagger(0.018, { startDelay: 0.015 }),
          ease: 'linear'
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

  /* Preserve native form submission while exposing specific validation and loading state. */
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
      const field = event.target;
      const label = form.querySelector(`label[for="${field.id}"]`)?.textContent?.trim() || 'This field';
      field.setAttribute('aria-invalid', 'true');
      if (status) {
        status.textContent = field.validity.typeMismatch
          ? `Enter a valid ${label.toLowerCase()}.`
          : `${label} is required.`;
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
        status.textContent = 'Sending your message…';
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

  runEntranceMotion();
  setupSystemMotion();

  reducedMotion.addEventListener('change', () => {
    menuAnimation?.complete?.();
    cancelTransientMotion();
    if (!reducedMotion.matches) setupSystemMotion();
  });
})();
