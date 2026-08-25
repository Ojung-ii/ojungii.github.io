(() => {
  'use strict';

  const state = {
    data: null,
    language: document.documentElement.dataset.language === 'en' ? 'en' : 'ko'
  };

  const contentFiles = [
    'profile', 'publications', 'research-projects', 'research-areas', 'projects', 'awards', 'highlights'
  ];

  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));

  const lang = (item, key) => {
    if (!item) return '';
    if (state.language === 'en' && item[`${key}_en`]) return item[`${key}_en`];
    if (state.language === 'ko' && item[`${key}_ko`]) return item[`${key}_ko`];
    return item[key] ?? '';
  };

  const sortByOrder = list => [...(list || [])].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const internalOrExternalAttrs = url => /^https?:\/\//i.test(url || '') ? ' target="_blank" rel="noreferrer"' : '';
  const projectUrl = project => project.detail_url || `/projects/view/?id=${encodeURIComponent(project.slug)}`;

  async function loadJson(name) {
    const response = await fetch(`/content/${name}.json`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Failed to load ${name}.json`);
    return response.json();
  }

  async function loadAll() {
    const entries = await Promise.all(contentFiles.map(async name => [name, await loadJson(name)]));
    state.data = Object.fromEntries(entries);
    window.ojungiiContent = state.data;
    document.dispatchEvent(new CustomEvent('portfolio-content-ready', { detail: state.data }));
    renderAll();
  }

  function renderProfile() {
    const profile = state.data?.profile;
    if (!profile) return;

    document.querySelectorAll('[data-profile-text]').forEach(el => {
      const key = el.dataset.profileText;
      const value = lang(profile, key);
      if (value !== undefined && value !== null && value !== '') el.textContent = value;
    });

    document.querySelectorAll('[data-profile-link]').forEach(el => {
      const key = el.dataset.profileLink;
      const value = profile[key];
      if (!value) return;
      if (el.tagName === 'A') el.href = key === 'email' ? `mailto:${value}` : value;
    });

    document.querySelectorAll('[data-profile-image]').forEach(img => {
      if (profile.profile_image) img.src = profile.profile_image;
    });

    const linkRules = [
      ['a[href^="mailto:"]', profile.email ? `mailto:${profile.email}` : null],
      ['a[href*="github.com/Ojung-ii"]', profile.github],
      ['a[href*="linkedin.com/in/ojungii"]', profile.linkedin],
      ['a[href*="scholar.google.com/citations"]', profile.scholar]
    ];
    linkRules.forEach(([selector, href]) => {
      if (!href) return;
      document.querySelectorAll(selector).forEach(anchor => anchor.href = href);
    });

    document.querySelectorAll('[data-profile-keywords]').forEach(container => {
      container.innerHTML = (profile.keywords || []).map(tag => `<span class="tag">${esc(tag)}</span>`).join('');
    });
  }

  function renderHighlights() {
    const container = document.querySelector('[data-cms-highlights]');
    const items = sortByOrder(state.data?.highlights?.items);
    if (!container || !items?.length) return;
    const cards = items.map(item => `<div class="highlight-card"><strong>${esc(item.title)}</strong><span>${esc(lang(item, 'subtitle'))}</span></div>`).join('');
    container.innerHTML = cards + cards;
  }

  function renderResearchAreas() {
    document.querySelectorAll('[data-cms-research-areas]').forEach(container => {
      const items = sortByOrder(state.data?.['research-areas']?.items);
      if (!items?.length) return;
      const cardClass = container.dataset.cmsResearchAreas === 'research' ? 'thesis-card reveal is-visible' : 'bento-card span-3 reveal is-visible';
      container.innerHTML = items.map(item => `
        <article class="${cardClass}">
          <span class="${container.dataset.cmsResearchAreas === 'research' ? 'kicker' : 'index'}">${esc(item.index)}</span>
          <h3>${esc(item.title)}</h3>
          <div class="tag-row compact-tags">${(item.tags || []).map(tag => `<span class="tag">${esc(tag)}</span>`).join('')}</div>
          <p class="${container.dataset.cmsResearchAreas === 'research' ? 'muted' : ''}">${esc(lang(item, 'summary'))}</p>
        </article>`).join('');
    });
  }

  function researchCard(item, index) {
    const isProject = item.kind === 'project';
    const number = String(index + 1).padStart(2, '0');
    const status = isProject ? item.status : item.venue || item.status;
    const url = item.url || (isProject ? `/research/#${item.slug}` : `/research/#${item.slug}`);
    const classes = `status ${String(item.status || '').toLowerCase().includes('under') ? 'review' : String(item.status || '').toLowerCase().includes('published') ? 'published' : ''}`;
    return `<a class="work-card reveal is-visible" id="${esc(item.slug)}" href="${esc(url)}"${internalOrExternalAttrs(url)}>
      <div class="work-card-top"><span class="work-card-number">${number} / ${esc(item.area || 'AI RESEARCH')}</span><span class="${classes}">${esc(status)}</span></div>
      <h3>${esc(item.title)}</h3>
      <p>${esc(lang(item, 'summary'))}</p>
      <div class="work-card-footer"><div class="tag-row">${(item.tags || []).slice(0,4).map(tag => `<span class="tag">${esc(tag)}</span>`).join('')}</div><span class="work-card-arrow">↗</span></div>
    </a>`;
  }

  function renderFeaturedResearch() {
    document.querySelectorAll('[data-cms-featured-research]').forEach(container => {
      const projects = (state.data?.['research-projects']?.items || []).filter(item => item.featured_home || container.dataset.cmsFeaturedResearch === 'research').map(item => ({...item, kind: 'project'}));
      const pubs = (state.data?.publications?.items || []).filter(item => container.dataset.cmsFeaturedResearch === 'research' ? item.featured_research : item.featured_home).map(item => ({...item, kind: 'publication'}));
      const items = sortByOrder([...projects, ...pubs]);
      if (!items.length) return;
      container.innerHTML = items.map(researchCard).join('');
    });
  }

  function publicationMarkup(item) {
    const url = item.url || '';
    const tag = url ? 'a' : 'article';
    const attrs = url ? ` href="${esc(url)}"${internalOrExternalAttrs(url)}` : '';
    const statusClass = String(item.status || '').toLowerCase().includes('under') ? 'review' : 'published';
    return `<${tag} class="publication reveal is-visible" id="${esc(item.slug)}" data-filter-item data-type="${esc(item.type)}" data-region="${esc(item.region)}"${attrs}>
      <div class="pub-year">${esc(item.year)}<br><span class="status ${statusClass}">${esc(item.venue || item.status)}</span></div>
      <div><h3>${esc(item.title)}</h3><p>${esc(lang(item, 'summary'))}</p>
        <div class="tag-row">${item.first_author ? `<span class="tag accent">${state.language === 'en' ? 'First author' : '제1저자'}</span>` : ''}${(item.tags || []).map(tag => `<span class="tag">${esc(tag)}</span>`).join('')}</div>
      </div><div class="pub-action">${esc(item.link_label || item.status || '')}</div>
    </${tag}>`;
  }

  function renderPublications() {
    document.querySelectorAll('[data-cms-publications]').forEach(container => {
      const items = sortByOrder(state.data?.publications?.items);
      if (!items?.length) return;
      container.innerHTML = items.map(publicationMarkup).join('');
    });
  }

  function projectCard(item) {
    const url = projectUrl(item);
    const title = state.language === 'en' && item.title_en ? item.title_en : item.title;
    return `<a class="work-card project-card reveal is-visible" data-filter-item="${esc(item.type)}" href="${esc(url)}">
      <div class="project-meta"><span class="project-type">${esc(item.domain)}</span><span>${esc(item.year)}</span></div>
      <h3>${esc(title)}</h3><p>${esc(lang(item, 'summary'))}</p>
      <div class="metric-row">${(item.metrics || []).map(metric => `<span class="metric-chip">${esc(metric)}</span>`).join('')}</div>
      <div class="work-card-footer"><div class="tag-row">${(item.tags || []).slice(0,4).map(tag => `<span class="tag">${esc(tag)}</span>`).join('')}</div><span class="work-card-arrow">↗</span></div>
    </a>`;
  }

  function renderProjects() {
    document.querySelectorAll('[data-cms-projects]').forEach(container => {
      let items = sortByOrder(state.data?.projects?.items);
      if (container.dataset.cmsProjects === 'featured') items = items.filter(item => item.featured_home);
      if (!items?.length) return;
      container.innerHTML = items.map(projectCard).join('');
    });
  }

  function awardMarkup(item) {
    const title = state.language === 'en' && item.title_en ? item.title_en : item.title;
    return `<article class="publication reveal is-visible" data-filter-item data-type="${esc(item.type)}" data-region="${esc(item.region)}">
      <div class="pub-year">${esc(item.year)}<br><span class="status published">${esc(item.type)}</span></div>
      <div><h3>${esc(title)}</h3><p>${esc(lang(item, 'description'))}</p><div class="tag-row"><span class="tag">${esc(item.type)}</span><span class="tag">${esc(item.region)}</span></div></div>
      <div class="pub-action">${esc(item.organization)}</div>
    </article>`;
  }

  function renderAwards() {
    document.querySelectorAll('[data-cms-awards]').forEach(container => {
      const items = sortByOrder(state.data?.awards?.items);
      if (!items?.length) return;
      container.innerHTML = items.map(awardMarkup).join('');
    });
  }

  function renderProjectDetail() {
    const container = document.querySelector('[data-cms-project-detail]');
    if (!container) return;
    const id = new URLSearchParams(location.search).get('id');
    const project = state.data?.projects?.items?.find(item => item.slug === id);
    if (!project) {
      container.innerHTML = `<div class="notice">${state.language === 'en' ? 'Project not found.' : '프로젝트를 찾을 수 없습니다.'}</div>`;
      return;
    }
    const title = state.language === 'en' && project.title_en ? project.title_en : project.title;
    document.title = `${title} | Junghyun Oh`;
    container.innerHTML = `
      <section class="case-hero"><div class="case-hero-grid shell"><div><div class="breadcrumbs"><a href="/">Home</a><span>/</span><a href="/projects/">Projects</a></div><p class="eyebrow">${esc(project.domain)}</p><h1>${esc(title)}</h1><p class="case-summary">${esc(lang(project, 'summary'))}</p></div>
      <div class="case-facts"><div class="case-fact"><span>Year</span><strong>${esc(project.year)}</strong></div><div class="case-fact"><span>Role</span><strong>${esc(project.role || '')}</strong></div><div class="case-fact"><span>Type</span><strong>${esc(project.type)}</strong></div><div class="case-fact"><span>Tags</span><strong>${esc((project.tags || []).join(' · '))}</strong></div></div></div></section>
      <section class="section-compact"><div class="shell"><div class="case-layout"><aside class="case-nav"><strong>Contents</strong><a href="#problem">Problem</a><a href="#approach">Approach</a><a href="#result">Result</a></aside><div class="case-body">
        <section id="problem"><p class="eyebrow">PROBLEM</p><h2>${state.language === 'en' ? 'Problem' : '문제'}</h2><p>${esc(lang(project, 'problem'))}</p></section>
        <section id="approach"><p class="eyebrow">APPROACH</p><h2>${state.language === 'en' ? 'Approach' : '접근 방법'}</h2><p>${esc(lang(project, 'approach'))}</p></section>
        <section id="result"><p class="eyebrow">RESULT</p><h2>${state.language === 'en' ? 'Result' : '결과'}</h2><p>${esc(lang(project, 'result'))}</p><div class="metric-row">${(project.metrics || []).map(metric => `<span class="metric-chip">${esc(metric)}</span>`).join('')}</div></section>
      </div></div></div></section>`;
  }

  function renderAll() {
    if (!state.data) return;
    state.language = document.documentElement.dataset.language === 'en' ? 'en' : 'ko';
    renderProfile();
    renderHighlights();
    renderResearchAreas();
    renderFeaturedResearch();
    renderPublications();
    renderProjects();
    renderAwards();
    renderProjectDetail();
  }

  document.addEventListener('portfolio-language-change', event => {
    state.language = event.detail?.language === 'en' ? 'en' : 'ko';
    renderAll();
  });

  loadAll().catch(error => {
    console.warn('[portfolio content] using static fallback:', error);
  });
})();
