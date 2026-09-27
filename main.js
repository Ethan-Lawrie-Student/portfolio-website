(() => {
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionStyle = getComputedStyle(document.documentElement);
const motionEase = motionStyle.getPropertyValue('--motion-ease').trim() || 'ease-out';
const motionTime = name => Number.parseFloat(motionStyle.getPropertyValue(`--motion-${name}`)) || 180;
const activeAnimations = new Set();
const animate = (element, frames, options) => {
  if (motionPreference.matches || document.hidden || !element.animate) return null;
  const animation = element.animate(frames, { easing: motionEase, ...options });
  activeAnimations.add(animation);
  const forget = () => activeAnimations.delete(animation);
  animation.addEventListener('finish', forget, { once: true });
  animation.addEventListener('cancel', forget, { once: true });
  return animation;
};
const cancelMotion = () => activeAnimations.forEach(animation => animation.cancel());
motionPreference.addEventListener('change', () => { if (motionPreference.matches) cancelMotion(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) cancelMotion(); });

(() => {
  const root = document.documentElement;
  const button = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-navigation]');
  const desktop = window.matchMedia('(min-width: 56rem)');
  const links = nav ? [...nav.querySelectorAll('a')] : [];
  const sectionLinks = links.filter(a => a.getAttribute('href')?.startsWith('#'));
  const setCurrent = id => sectionLinks.forEach(a => {
    if (a.getAttribute('href') === `#${id}`) a.setAttribute('aria-current', 'location');
    else a.removeAttribute('aria-current');
  });
  root.classList.add('js');
  const header = document.querySelector('[data-site-header]');
  if (header) {
    const sizeHeader = () => root.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`);
    sizeHeader();
    if ('ResizeObserver' in window) new ResizeObserver(sizeHeader).observe(header);
    else window.addEventListener('resize', sizeHeader);
  }
  document.querySelectorAll('[data-current-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  if (!button || !nav) return;
  const isOpen = () => button.getAttribute('aria-expanded') === 'true';
  let menuAnimation = null;
  const close = (restoreFocus = false, immediate = false) => {
    const wasOpen = isOpen();
    const from = getComputedStyle(nav).clipPath;
    menuAnimation?.cancel();
    button.setAttribute('aria-expanded', 'false');
    nav.inert = !desktop.matches;
    if (restoreFocus) button.focus();
    const finish = () => nav.classList.remove('is-open');
    if (!wasOpen || immediate || desktop.matches) { finish(); return; }
    const closing = animate(nav, [{ clipPath: from === 'none' ? 'inset(0)' : from }, { clipPath: 'inset(0 0 100% 0)' }], { duration: motionTime('exit') });
    menuAnimation = closing;
    if (!closing) finish();
    else closing.finished.then(() => { if (!isOpen()) finish(); }, () => { if (!isOpen()) finish(); });
  };
  const open = () => {
    const from = nav.classList.contains('is-open') ? getComputedStyle(nav).clipPath : 'inset(0 0 100% 0)';
    menuAnimation?.cancel();
    nav.inert = false;
    nav.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
    menuAnimation = animate(nav, [{ clipPath: from }, { clipPath: 'inset(0)' }], { duration: motionTime('panel') });
  };
  nav.inert = !desktop.matches;
  button.addEventListener('click', () => {
    if (isOpen()) close();
    else open();
  });
  document.addEventListener('keydown', event => {
    if (!isOpen() || desktop.matches) return;
    if (event.key === 'Escape') { event.preventDefault(); close(true); }
    if (event.key === 'Tab') {
      const last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === button) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); button.focus(); }
    }
  });
  document.addEventListener('click', event => {
    if (isOpen() && !nav.contains(event.target) && !button.contains(event.target)) close();
  });
  links.forEach(link => link.addEventListener('click', () => {
    close();
    const href = link.getAttribute('href');
    if (href?.startsWith('#')) {
      const target = document.getElementById(href.slice(1));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        setCurrent(target.id);
      }
    }
  }));
  desktop.addEventListener('change', () => {
    const active = document.activeElement;
    close(false, true);
    if (desktop.matches && active === button) links[0]?.focus();
    else if (!desktop.matches && nav.contains(active)) button.focus();
  });
  const sections = [...document.querySelectorAll('main > section[id]')];
  if (sections.length) {
    const updateCurrent = () => {
      // Short final sections cannot always reach the usual reading threshold.
      const atBottom = window.scrollY > 0 && window.scrollY + window.innerHeight >= root.scrollHeight - 2;
      const section = atBottom ? sections[sections.length - 1] : [...sections].reverse().find(el => el.getBoundingClientRect().top <= window.innerHeight * .4);
      setCurrent(section?.id);
    };
    let framePending = false;
    const scheduleCurrent = () => {
      if (framePending) return;
      framePending = true;
      window.requestAnimationFrame(() => { framePending = false; updateCurrent(); });
    };
    window.addEventListener('scroll', scheduleCurrent, { passive: true });
    window.addEventListener('resize', scheduleCurrent);
    window.addEventListener('hashchange', scheduleCurrent);
    window.addEventListener('pageshow', scheduleCurrent);
    updateCurrent();
  }
})();

// Native page transitions retain normal links, history, and browser fallbacks.
window.addEventListener('pagereveal', event => {
  if (!event.viewTransition) return;
  document.documentElement.classList.add('route-transition');
  const restore = () => document.documentElement.classList.remove('route-transition');
  // A hidden tab or rapid second navigation can legitimately skip the snapshot.
  event.viewTransition.ready.catch(() => {});
  event.viewTransition.finished.then(restore, restore);
});

// Only borders and image framing move on arrival; reading text is never hidden.
(() => {
  if (!('IntersectionObserver' in window)) return;
  const rules = document.querySelectorAll('.section-heading:not(.section-heading--quiet), .experience-row, .case-facts, .word-dossier__chapter, .case-next');
  rules.forEach(element => element.classList.add('motion-rule'));
  const images = document.querySelectorAll('.project-image img, .portrait img, .word-release__screen img');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (motionPreference.matches || document.hidden) return;
      if (entry.target.matches('img')) {
        const frame = () => {
          const bounds = entry.target.getBoundingClientRect();
          if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
          animate(entry.target, [{ clipPath: 'inset(0 10% 0 0)' }, { clipPath: 'inset(0)' }], { duration: motionTime('image') });
        };
        if (entry.target.complete) frame();
        else entry.target.addEventListener('load', frame, { once: true });
      } else entry.target.classList.add('motion-rule-play');
    });
  }, { threshold: .12 });
  [...rules, ...images].forEach(element => observer.observe(element));
})();

// An illustrative word ladder makes the game mechanic tangible without a game embed.
(() => {
  const demo = document.querySelector('[data-word-demo]');
  if (!demo) return;
  const words = ['COLD', 'CORD', 'CARD', 'WARD', 'WARM'];
  const letters = [...demo.querySelectorAll('.word-demo__letters span')];
  const button = demo.querySelector('button');
  const status = demo.querySelector('[role="status"]');
  let step = 0;
  let letterAnimation = null;
  button.addEventListener('click', () => {
    letterAnimation?.cancel();
    const previous = words[step];
    step = (step + 1) % words.length;
    const word = words[step];
    letters.forEach((letter, index) => {
      const changed = step > 0 && previous[index] !== word[index];
      const glyph = letter.querySelector('b');
      glyph.textContent = word[index];
      letter.classList.toggle('is-changed', changed);
      if (changed) letterAnimation = animate(glyph, [
        { transform: 'translateY(-4px)' }, { transform: 'translateY(0)' }
      ], { duration: motionTime('panel') });
    });
    button.textContent = step === words.length - 1 ? 'Start again' : 'Change one letter';
    status.textContent = step === 0 ? 'COLD. Back at the start. Four changes to WARM.'
      : `${word}. ${step} of 4 changes.${step === 4 ? ' COLD to WARM, one letter at a time.' : ''}`;
  });
  button.hidden = false;
})();
})();

// The project index controls a single typographic accent; links remain ordinary anchors.
(() => {
  const poster = document.querySelector('.hero-poster');
  const directory = document.querySelector('.project-directory');
  if (!poster || !directory) return;
  let hovered = null;
  let focused = null;
  const render = () => { poster.dataset.heroProject = hovered || focused || 'word'; };
  directory.querySelectorAll('[data-project]').forEach(link => {
    link.addEventListener('pointerenter', event => {
      if (event.pointerType === 'touch') return;
      hovered = link.dataset.project;
      render();
    });
  });
  directory.addEventListener('pointerleave', () => { hovered = null; render(); });
  directory.addEventListener('focusin', event => {
    hovered = null;
    focused = event.target.closest('[data-project]')?.dataset.project || null;
    render();
  });
  directory.addEventListener('focusout', event => {
    focused = directory.contains(event.relatedTarget) ? event.relatedTarget.closest('[data-project]')?.dataset.project : null;
    render();
  });
})();
