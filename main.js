(() => {
  const header = document.querySelector('[data-site-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const navigation = document.querySelector('[data-navigation]');
  const desktopMedia = window.matchMedia('(min-width: 48rem)');

  const closeMenu = ({ restoreFocus = false } = {}) => {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    if (restoreFocus) menuToggle.focus();
  };

  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', () => {
      const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(opening));
      navigation.classList.toggle('is-open', opening);
      document.body.classList.toggle('menu-open', opening);
    });

    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu({ restoreFocus: true });
      }
    });

    desktopMedia.addEventListener('change', (event) => {
      if (event.matches) closeMenu();
    });
  }

  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 16);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const sectionLinks = [...document.querySelectorAll('[data-navigation] a[href^="#"]')];
  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (!visible) return;
      sectionLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${visible.target.id}`;
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });

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

  const projectIndex = document.querySelector('[data-project-index]');
  const projectContext = document.querySelector('[data-project-context]');

  if (projectIndex && projectContext) {
    const defaultContext = projectContext.textContent;
    const projectLinks = [...projectIndex.querySelectorAll('[data-project-label]')];

    const showProjectContext = (link) => {
      projectContext.textContent = link.dataset.projectLabel || defaultContext;
      projectIndex.dataset.activeProject = link.querySelector('strong')?.textContent || '';
    };

    const resetProjectContext = () => {
      projectContext.textContent = defaultContext;
      delete projectIndex.dataset.activeProject;
    };

    projectLinks.forEach((link) => {
      link.addEventListener('mouseenter', () => showProjectContext(link));
      link.addEventListener('focus', () => showProjectContext(link));
      link.addEventListener('mouseleave', resetProjectContext);
      link.addEventListener('blur', resetProjectContext);
    });
  }

  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const submitButton = form.querySelector('[data-submit-button]');
  const submitLabel = form.querySelector('[data-submit-label]');
  const status = form.querySelector('[data-form-status]');

  const setStatus = (message, state = '') => {
    status.textContent = message;
    status.classList.toggle('is-error', state === 'error');
    status.classList.toggle('is-success', state === 'success');
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    submitButton.disabled = true;
    submitButton.setAttribute('aria-disabled', 'true');
    submitLabel.textContent = 'Sending…';
    setStatus('Sending your message.');

    try {
      await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        mode: 'no-cors'
      });

      form.reset();
      setStatus('Thanks — your message has been sent.', 'success');
    } catch (error) {
      setStatus('The message could not be sent. Check your connection and try again.', 'error');
    } finally {
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-disabled');
      submitLabel.textContent = 'Send message';
    }
  });
})();
