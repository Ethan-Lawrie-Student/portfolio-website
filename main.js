(() => {
  document.documentElement.classList.add('js');

  const siteHeader = document.querySelector('[data-site-header]');
  const scrollProgress = document.querySelector('[data-scroll-progress]');
  let scrollFrame = 0;

  const updatePageChrome = () => {
    scrollFrame = 0;
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
    if (scrollProgress) scrollProgress.style.transform = `scaleX(${progress})`;
    siteHeader?.classList.toggle('is-scrolled', window.scrollY > 8);
  };

  const requestPageChromeUpdate = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updatePageChrome);
  };

  updatePageChrome();
  window.addEventListener('scroll', requestPageChromeUpdate, { passive: true });
  window.addEventListener('resize', requestPageChromeUpdate, { passive: true });

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const navigation = document.querySelector('[data-navigation]');
  const desktopMedia = window.matchMedia('(min-width: 56rem)');
  const pageSurfaces = [document.querySelector('main'), document.querySelector('footer')].filter(Boolean);

  const setPageInert = (inert) => {
    pageSurfaces.forEach((surface) => {
      surface.inert = inert;
      if (inert) surface.setAttribute('inert', '');
      else surface.removeAttribute('inert');
    });
  };

  const closeMenu = ({ restoreFocus = false } = {}) => {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    setPageInert(false);
    if (restoreFocus) menuToggle.focus();
  };

  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', () => {
      const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(opening));
      navigation.classList.toggle('is-open', opening);
      document.body.classList.toggle('menu-open', opening);
      setPageInert(opening);

      if (opening) {
        const firstLink = navigation.querySelector('a');
        window.requestAnimationFrame(() => firstLink?.focus());
      }
    });

    navigation.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link) return;

      closeMenu();
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
      if (event.matches) closeMenu();
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

  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  if (revealItems.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
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
  if (!form) return;

  const submitButton = form.querySelector('[data-submit-button]');
  const submitLabel = form.querySelector('[data-submit-label]');
  const status = form.querySelector('[data-form-status]');

  const setStatus = (message = '', state = '') => {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', state === 'error');
    status.classList.toggle('is-success', state === 'success');
  };

  form.addEventListener('input', () => {
    if (status?.textContent) setStatus();
  });

  form.addEventListener('invalid', () => {
    if (status?.textContent) setStatus();
  }, true);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    setStatus();
    if (!form.reportValidity()) return;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute('aria-disabled', 'true');
    }
    if (submitLabel) submitLabel.textContent = 'Sending…';
    setStatus('Submitting your message.');

    try {
      await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        mode: 'no-cors'
      });

      form.reset();
      setStatus('Thanks — your message was submitted.', 'success');
    } catch (error) {
      setStatus('The message could not be sent. Check your connection and try again.', 'error');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-disabled');
      }
      if (submitLabel) submitLabel.textContent = 'Send message';
    }
  });
})();
