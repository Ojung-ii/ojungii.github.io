(() => {
  'use strict';

  const root = document.documentElement;
  const languageToggle = document.getElementById('language-toggle');
  const themeToggle = document.getElementById('theme-toggle');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const siteHeader = document.getElementById('site-header');
  const backToTop = document.getElementById('back-to-top');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
        // The interface remains functional when storage is unavailable.
      }
    },
  };

  const pageMeta = {
    ko: {
      title: '오정현 | GraphRAG & AI Researcher',
      description:
        'GraphRAG, 구조 인식 검색, 다중 홉 추론을 연구하는 AI 연구자 오정현의 포트폴리오입니다.',
      themeDark: '다크 모드로 전환',
      themeLight: '라이트 모드로 전환',
      menuOpen: '메뉴 열기',
      menuClose: '메뉴 닫기',
    },
    en: {
      title: 'Junghyun Oh | GraphRAG & AI Researcher',
      description:
        'Portfolio of Junghyun Oh, an AI researcher working on GraphRAG, structure-aware retrieval, and multi-hop reasoning.',
      themeDark: 'Switch to dark mode',
      themeLight: 'Switch to light mode',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
    },
  };

  const getSavedLanguage = () => {
    const saved = storage.get('ojungii-language');
    if (saved === 'ko' || saved === 'en') return saved;
    return navigator.language?.toLowerCase().startsWith('ko') ? 'ko' : 'en';
  };

  let currentLanguage = getSavedLanguage();

  const updateTranslatedAttributes = (language) => {
    const attributePairs = [
      ['aria-label', `data-${language}-aria-label`],
      ['title', `data-${language}-title`],
      ['placeholder', `data-${language}-placeholder`],
    ];

    for (const [targetAttribute, sourceAttribute] of attributePairs) {
      document.querySelectorAll(`[${sourceAttribute}]`).forEach((element) => {
        const value = element.getAttribute(sourceAttribute);
        if (value) element.setAttribute(targetAttribute, value);
      });
    }
  };

  const updateThemeControlLabel = () => {
    if (!themeToggle) return;
    const isDark = root.dataset.theme === 'dark';
    const label = isDark
      ? pageMeta[currentLanguage].themeLight
      : pageMeta[currentLanguage].themeDark;
    themeToggle.setAttribute('aria-label', label);
    themeToggle.setAttribute('title', label);
  };

  const updateMenuControlLabel = () => {
    if (!menuToggle) return;
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute(
      'aria-label',
      isOpen ? pageMeta[currentLanguage].menuClose : pageMeta[currentLanguage].menuOpen
    );
  };

  const setLanguage = (language, persist = true) => {
    currentLanguage = language === 'en' ? 'en' : 'ko';
    root.lang = currentLanguage;
    root.dataset.language = currentLanguage;

    document.querySelectorAll('[data-ko][data-en]').forEach((element) => {
      const translatedText = element.getAttribute(`data-${currentLanguage}`);
      if (translatedText !== null) element.textContent = translatedText;
    });

    updateTranslatedAttributes(currentLanguage);

    document.title = pageMeta[currentLanguage].title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', pageMeta[currentLanguage].description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute('content', pageMeta[currentLanguage].title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute('content', pageMeta[currentLanguage].description);
    document
      .querySelector('meta[name="twitter:title"]')
      ?.setAttribute('content', pageMeta[currentLanguage].title);
    document
      .querySelector('meta[name="twitter:description"]')
      ?.setAttribute('content', pageMeta[currentLanguage].description);
    document
      .querySelector('meta[property="og:locale"]')
      ?.setAttribute('content', currentLanguage === 'ko' ? 'ko_KR' : 'en_US');

    document.querySelectorAll('[data-language-option]').forEach((option) => {
      const isActive = option.getAttribute('data-language-option') === currentLanguage;
      option.classList.toggle('active', isActive);
      option.setAttribute('aria-hidden', String(!isActive));
    });

    updateThemeControlLabel();
    updateMenuControlLabel();

    if (persist) storage.set('ojungii-language', currentLanguage);
  };

  const setTheme = (theme, persist = true) => {
    const safeTheme = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = safeTheme;
    themeColorMeta?.setAttribute('content', safeTheme === 'dark' ? '#07111f' : '#ffffff');
    updateThemeControlLabel();
    if (persist) storage.set('ojungii-theme', safeTheme);
  };

  languageToggle?.addEventListener('click', () => {
    setLanguage(currentLanguage === 'ko' ? 'en' : 'ko');
  });

  themeToggle?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  const closeMenu = () => {
    if (!menuToggle || !navLinks) return;
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    updateMenuControlLabel();
  };

  menuToggle?.addEventListener('click', () => {
    if (!navLinks) return;
    const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    navLinks.classList.toggle('open', willOpen);
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    document.body.classList.toggle('menu-open', willOpen);
    updateMenuControlLabel();
  });

  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 920) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const updateScrollState = () => {
    const scrollTop = window.scrollY;
    siteHeader?.classList.toggle('scrolled', scrollTop > 16);
    backToTop?.classList.toggle('visible', scrollTop > 760);
  };

  updateScrollState();
  window.addEventListener('scroll', updateScrollState, { passive: true });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal');

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -9% 0px', threshold: 0.08 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  const sectionElements = [...document.querySelectorAll('main section[id]')];
  const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];

  if ('IntersectionObserver' in window) {
    const activeSectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const activeId = visibleEntries[0]?.target.id;
        if (!activeId) return;

        navAnchors.forEach((anchor) => {
          const isActive = anchor.getAttribute('href') === `#${activeId}`;
          anchor.classList.toggle('active', isActive);
          if (isActive) anchor.setAttribute('aria-current', 'location');
          else anchor.removeAttribute('aria-current');
        });
      },
      { rootMargin: '-28% 0px -58% 0px', threshold: [0, 0.1, 0.3] }
    );

    sectionElements.forEach((section) => activeSectionObserver.observe(section));
  }

  document.getElementById('current-year').textContent = String(new Date().getFullYear());

  setLanguage(currentLanguage, false);
  setTheme(root.dataset.theme || 'light', false);
})();
