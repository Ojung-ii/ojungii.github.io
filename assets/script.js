
(() => {
  'use strict';
  const root = document.documentElement;
  const languageToggle = document.getElementById('language-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const header = document.getElementById('site-header');
  const backToTop = document.getElementById('back-to-top');

  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch {} }
  };

  const meta = {
    ko: {
      themeDark: '다크 모드로 전환',
      themeLight: '라이트 모드로 전환',
      menuOpen: '메뉴 열기',
      menuClose: '메뉴 닫기',
      copied: '이메일 주소를 복사했습니다',
      copy: '이메일 복사'
    },
    en: {
      themeDark: 'Switch to dark mode',
      themeLight: 'Switch to light mode',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
      copied: 'Email address copied',
      copy: 'Copy email'
    }
  };

  let language = storage.get('ojungii-language');
  if (language !== 'ko' && language !== 'en') {
    language = navigator.language?.toLowerCase().startsWith('ko') ? 'ko' : 'en';
  }

  const translateAttributes = () => {
    const pairs = [
      ['aria-label', `data-${language}-aria-label`],
      ['title', `data-${language}-title`],
      ['alt', `data-${language}-alt`]
    ];
    pairs.forEach(([target, source]) => {
      document.querySelectorAll(`[${source}]`).forEach(el => {
        const value = el.getAttribute(source);
        if (value !== null) el.setAttribute(target, value);
      });
    });
  };

  const updateControls = () => {
    document.querySelectorAll('[data-language-option]').forEach(el => {
      el.classList.toggle('is-active', el.dataset.languageOption === language);
    });
    if (themeToggle) {
      const dark = root.dataset.theme === 'dark';
      const label = dark ? meta[language].themeLight : meta[language].themeDark;
      themeToggle.setAttribute('aria-label', label);
      themeToggle.setAttribute('title', label);
    }
    if (menuToggle) {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-label', open ? meta[language].menuClose : meta[language].menuOpen);
    }
  };

  const setLanguage = (next, persist = true) => {
    language = next === 'en' ? 'en' : 'ko';
    root.lang = language;
    root.dataset.language = language;
    document.querySelectorAll('[data-ko][data-en]').forEach(el => {
      const text = el.getAttribute(`data-${language}`);
      if (text !== null) el.textContent = text;
    });
    document.querySelectorAll('[data-ko-html][data-en-html]').forEach(el => {
      const html = el.getAttribute(`data-${language}-html`);
      if (html !== null) el.innerHTML = html;
    });
    translateAttributes();
    const pageTitle = document.body.getAttribute(`data-title-${language}`);
    const pageDescription = document.body.getAttribute(`data-description-${language}`);
    if (pageTitle) {
      document.title = pageTitle;
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', pageTitle);
      document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', pageTitle);
    }
    if (pageDescription) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', pageDescription);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', pageDescription);
      document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', pageDescription);
    }
    if (persist) storage.set('ojungii-language', language);
    updateControls();
  };

  const preferredTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  let theme = storage.get('ojungii-theme');
  if (theme !== 'dark' && theme !== 'light') theme = preferredTheme;

  const setTheme = (next, persist = true) => {
    theme = next === 'dark' ? 'dark' : 'light';
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content', theme === 'dark' ? '#07111f' : '#ffffff'
    );
    if (persist) storage.set('ojungii-theme', theme);
    updateControls();
  };

  languageToggle?.addEventListener('click', () => setLanguage(language === 'ko' ? 'en' : 'ko'));
  themeToggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  const closeMenu = () => {
    if (!navLinks || !menuToggle) return;
    navLinks.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    updateControls();
  };
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    navLinks?.classList.toggle('is-open', !open);
    updateControls();
  });
  navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  addEventListener('resize', () => { if (innerWidth > 980) closeMenu(); });

  const onScroll = () => {
    header?.classList.toggle('is-scrolled', scrollY > 16);
    backToTop?.classList.toggle('is-visible', scrollY > 620);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backToTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: .12 })
    : null;
  document.querySelectorAll('.reveal').forEach(el => observer ? observer.observe(el) : el.classList.add('is-visible'));
  setTimeout(() => document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => el.classList.add('is-visible')), 2200);

  document.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      if (img.dataset.fallback && img.src !== new URL(img.dataset.fallback, location.href).href) {
        img.src = img.dataset.fallback;
      }
    }, { once: true });
  });

  document.querySelectorAll('[data-copy-email]').forEach(button => {
    button.addEventListener('click', async () => {
      const email = button.dataset.copyEmail;
      try {
        await navigator.clipboard.writeText(email);
        const label = button.querySelector('[data-copy-label]');
        if (label) {
          label.textContent = meta[language].copied;
          setTimeout(() => label.textContent = meta[language].copy, 1700);
        }
      } catch {
        location.href = `mailto:${email}`;
      }
    });
  });

  document.querySelectorAll('[data-filter-toolbar]').forEach(toolbar => {
    const targetSelector = toolbar.getAttribute('data-filter-target');
    const target = targetSelector ? document.querySelector(targetSelector) : document;
    const emptyState = document.querySelector(toolbar.getAttribute('data-empty-target') || '');
    const applyFilters = () => {
      const criteria = {};
      toolbar.querySelectorAll('[data-filter-group]').forEach(group => {
        const key = group.dataset.filterGroup;
        const active = group.querySelector('[data-filter].is-active') || group.querySelector('[data-filter]');
        if (key && active) criteria[key] = active.dataset.filter;
      });
      let visibleCount = 0;
      target?.querySelectorAll('[data-filter-item]').forEach(item => {
        const visible = Object.entries(criteria).every(([key, value]) => value === 'all' || item.dataset[key] === value);
        item.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      if (emptyState) emptyState.hidden = visibleCount !== 0;
    };

    toolbar.querySelectorAll('[data-filter]').forEach(button => {
      button.addEventListener('click', () => {
        const group = button.closest('[data-filter-group]');
        group?.querySelectorAll('[data-filter]').forEach(btn => btn.classList.toggle('is-active', btn === button));
        applyFilters();
      });
    });
    applyFilters();
  });

  const visual = document.querySelector('[data-parallax-visual]');
  if (visual && !matchMedia('(prefers-reduced-motion: reduce)').matches && matchMedia('(pointer:fine)').matches) {
    visual.addEventListener('pointermove', event => {
      const rect = visual.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
      visual.style.setProperty('--mx', `${x * 7}px`);
      visual.style.setProperty('--my', `${y * 7}px`);
    });
    visual.addEventListener('pointerleave', () => {
      visual.style.setProperty('--mx', '0px');
      visual.style.setProperty('--my', '0px');
    });
  }

  document.querySelectorAll('[data-current-year]').forEach(el => el.textContent = new Date().getFullYear());
  setTheme(theme, false);
  setLanguage(language, false);
})();
