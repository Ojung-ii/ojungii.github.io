(() => {
  'use strict';

  const container = document.querySelector('[data-portfolio-network]');
  const detailPanel = document.getElementById('network-detail');
  if (!container || !detailPanel) return;

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let language = document.documentElement.dataset.language === 'en' ? 'en' : 'ko';
  let width = Math.max(container.clientWidth, 320);
  let height = Math.max(container.clientHeight, 420);
  let nodes = [];
  let links = [];
  let expandedGroup = null;
  let selectedId = 'jh';
  let alpha = reduceMotion ? 0.04 : 1;
  let dragState = null;
  let animationFrame = null;
  let lastTime = performance.now();

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Interactive portfolio relationship network');

  const linkLayer = document.createElementNS(SVG_NS, 'g');
  linkLayer.setAttribute('class', 'network-link-layer');
  const nodeLayer = document.createElementNS(SVG_NS, 'g');
  nodeLayer.setAttribute('class', 'network-node-layer');
  svg.append(linkLayer, nodeLayer);
  container.replaceChildren(svg);

  const categoryDefinitions = [
    {
      id: 'research',
      ko: '연구',
      en: 'Research',
      captionKo: 'Graph · LLM · Retrieval',
      captionEn: 'Graph · LLM · Retrieval',
      color: '#2764a5',
      angle: -2.5,
      descriptionKo: 'Graph Learning, LLM Systems, Retrieval 연구',
      descriptionEn: 'Graph learning, LLM systems, and retrieval research',
      overviewUrl: '/research/'
    },
    {
      id: 'education',
      ko: '학력',
      en: 'Education',
      captionKo: 'Education',
      captionEn: 'Education',
      color: '#5b83b3',
      angle: -1.58,
      descriptionKo: '충남대학교 석사과정, 전북대학교 학사',
      descriptionEn: 'CNU M.S. and JBNU B.S.',
      overviewUrl: '/about/#journey'
    },
    {
      id: 'awards',
      ko: '수상',
      en: 'Awards',
      captionKo: 'Awards',
      captionEn: 'Awards',
      color: '#6f76aa',
      angle: -0.66,
      descriptionKo: '논문, 대회, 장학·연구지원, 프로젝트 수상',
      descriptionEn: 'Publication, competition, fellowship, and project awards',
      overviewUrl: '/about/#all-awards'
    },
    {
      id: 'contact',
      ko: 'Contact',
      en: 'Contact',
      captionKo: 'Email · LinkedIn',
      captionEn: 'Email · LinkedIn',
      color: '#3c8190',
      angle: 0.15,
      descriptionKo: '이메일과 외부 프로필',
      descriptionEn: 'Email and external profiles',
      overviewUrl: '/#contact'
    },
    {
      id: 'linkedin',
      ko: 'LinkedIn',
      en: 'LinkedIn',
      captionKo: '@ojungii',
      captionEn: '@ojungii',
      color: '#4474a7',
      angle: 0.98,
      descriptionKo: 'LinkedIn 프로필',
      descriptionEn: 'LinkedIn profile',
      overviewUrl: 'https://www.linkedin.com/in/ojungii',
      external: true
    },
    {
      id: 'scholar',
      ko: 'Scholar',
      en: 'Scholar',
      captionKo: 'Google Scholar',
      captionEn: 'Google Scholar',
      color: '#4f79a9',
      angle: 2.12,
      descriptionKo: 'Google Scholar 프로필과 연구실적',
      descriptionEn: 'Google Scholar profile and research outputs',
      overviewUrl: 'https://scholar.google.com/citations?user=sHkiTMQAAAAJ&hl=ko',
      external: true
    },
    {
      id: 'projects',
      ko: '프로젝트',
      en: 'Projects',
      captionKo: 'Case Studies',
      captionEn: 'Case Studies',
      color: '#2c6f84',
      angle: 3.02,
      descriptionKo: '대회, 산업 RAG, Geo AI 프로젝트',
      descriptionEn: 'Competitions, industrial RAG, and Geo AI projects',
      overviewUrl: '/projects/'
    }
  ];

  const detailDefinitions = {
    research: [
      { id: 'mot', ko: 'MoT', en: 'MoT', captionKo: 'LLM Systems · 2026', captionEn: 'LLM Systems · 2026', url: 'https://arxiv.org/abs/2607.28979', external: true, related: ['scholar'] },
      { id: 'star', ko: 'StAR', en: 'StAR', captionKo: 'SIGIR 2026', captionEn: 'SIGIR 2026', url: '/research/#star', related: ['awards'] },
      { id: 'gref', ko: 'GRef-RAG', en: 'GRef-RAG', captionKo: 'Manuscript', captionEn: 'Manuscript', url: '/research/#gref', related: ['projects'] },
      { id: 'mpr', ko: 'MPR-CiteG', en: 'MPR-CiteG', captionKo: 'CIKM Workshop', captionEn: 'CIKM Workshop', url: '/projects/scienceon-mpr-citeg/', related: ['projects', 'awards'] }
    ],
    projects: [
      { id: 'scienceon', ko: 'ScienceON', en: 'ScienceON', captionKo: 'RAG · LLM', captionEn: 'RAG · LLM', url: '/projects/scienceon-mpr-citeg/', related: ['research', 'awards'] },
      { id: 'alibaba', ko: 'Alibaba', en: 'Alibaba', captionKo: 'Multilingual IR · LLM', captionEn: 'Multilingual IR · LLM', url: '/projects/alibaba-search/', related: ['research', 'awards'] },
      { id: 'steel', ko: 'Steel RAG', en: 'Steel RAG', captionKo: 'Industrial RAG', captionEn: 'Industrial RAG', url: '/projects/steel-rag/', related: ['awards'] },
      { id: 'bluecarbon', ko: 'Blue Carbon', en: 'Blue Carbon', captionKo: 'Geo AI', captionEn: 'Geo AI', url: '/projects/blue-carbon/', related: ['awards', 'education'] },
      { id: 'bioai', ko: 'BioAI', en: 'BioAI', captionKo: 'Competition', captionEn: 'Competition', url: '/projects/bioai/', related: ['awards', 'education'] }
    ],
    education: [
      { id: 'cnu', ko: 'CNU M.S.', en: 'CNU M.S.', captionKo: '2025–2027', captionEn: '2025–2027', url: '/about/#journey', related: ['research'] },
      { id: 'jbnu', ko: 'JBNU B.S.', en: 'JBNU B.S.', captionKo: '2017–2023', captionEn: '2017–2023', url: '/about/#journey', related: ['projects'] },
      { id: 'aischool', ko: 'AI School', en: 'AI School', captionKo: '2023', captionEn: '2023', url: '/about/#journey', related: ['projects'] }
    ],
    awards: [
      { id: 'sigir-award', ko: 'SIGIR ’26', en: 'SIGIR ’26', captionKo: 'Short Paper', captionEn: 'Short Paper', url: '/about/#all-awards', related: ['research'] },
      { id: 'nrf', ko: 'NRF', en: 'NRF', captionKo: 'Research Grant', captionEn: 'Research Grant', url: '/about/#all-awards', related: ['research', 'education'] },
      { id: 'scienceon-award', ko: 'ScienceON 2nd', en: 'ScienceON 2nd', captionKo: 'KISTI Award', captionEn: 'KISTI Award', url: '/about/#all-awards', related: ['projects'] },
      { id: 'alibaba-award', ko: 'Alibaba Award', en: 'Alibaba Award', captionKo: 'Special Award', captionEn: 'Special Award', url: '/about/#all-awards', related: ['projects'] },
      { id: 'cnu-star', ko: 'CNU-Star', en: 'CNU-Star', captionKo: 'Fellowship', captionEn: 'Fellowship', url: '/about/#all-awards', related: ['education'] }
    ],
    contact: [
      { id: 'email', ko: 'Email', en: 'Email', captionKo: 'CNU', captionEn: 'CNU', url: 'mailto:ojh7839@o.cnu.ac.kr' },
      { id: 'github', ko: 'GitHub', en: 'GitHub', captionKo: '@Ojung-ii', captionEn: '@Ojung-ii', url: 'https://github.com/Ojung-ii', external: true, related: ['projects', 'research'] },
      { id: 'contact-linkedin', ko: 'LinkedIn', en: 'LinkedIn', captionKo: '@ojungii', captionEn: '@ojungii', url: 'https://www.linkedin.com/in/ojungii', external: true, related: ['linkedin'] }
    ],
    scholar: [
      { id: 'scholar-profile', ko: 'Google Scholar', en: 'Google Scholar', captionKo: 'Profile', captionEn: 'Profile', url: 'https://scholar.google.com/citations?user=sHkiTMQAAAAJ&hl=ko', external: true, related: ['research'] },
      { id: 'scholar-mot', ko: 'MoT', en: 'MoT', captionKo: 'LLM Systems', captionEn: 'LLM Systems', url: 'https://arxiv.org/abs/2607.28979', external: true, related: ['research'] },
      { id: 'scholar-research', ko: 'Publications', en: 'Publications', captionKo: 'Research', captionEn: 'Research', url: '/research/', related: ['research'] }
    ],
    linkedin: [
      { id: 'linkedin-profile', ko: 'Profile', en: 'Profile', captionKo: '@ojungii', captionEn: '@ojungii', url: 'https://www.linkedin.com/in/ojungii', external: true, related: ['contact'] },
      { id: 'linkedin-email', ko: 'Email', en: 'Email', captionKo: 'Contact', captionEn: 'Contact', url: 'mailto:ojh7839@o.cnu.ac.kr', related: ['contact'] }
    ]
  };

  const categoryCrossLinks = [
    ['research', 'projects'],
    ['research', 'education'],
    ['research', 'awards'],
    ['research', 'scholar'],
    ['projects', 'education'],
    ['projects', 'awards'],
    ['contact', 'linkedin'],
    ['contact', 'scholar'],
    ['linkedin', 'scholar'],
    ['education', 'awards']
  ];

  const categoryById = new Map(categoryDefinitions.map(item => [item.id, item]));
  const nodeElements = new Map();
  const linkElements = [];

  const labelFor = node => language === 'en' ? node.en : node.ko;
  const captionFor = node => language === 'en' ? node.captionEn : node.captionKo;
  const descriptionFor = category => language === 'en' ? category.descriptionEn : category.descriptionKo;

  function initialBaseNodes(previousPositions = new Map()) {
    const center = previousPositions.get('jh') || { x: width / 2, y: height / 2 };
    const result = [{
      id: 'jh', type: 'center', ko: 'JH.Oh', en: 'JH.Oh', captionKo: 'Portfolio', captionEn: 'Portfolio',
      color: '#0b2b53', radius: 36, collisionRadius: 54,
      x: center.x, y: center.y, vx: 0, vy: 0, fx: center.x, fy: center.y
    }];

    const radiusX = Math.min(width * 0.36, 205);
    const radiusY = Math.min(height * 0.34, 170);

    categoryDefinitions.forEach((definition, index) => {
      const previous = previousPositions.get(definition.id);
      const targetX = width / 2 + Math.cos(definition.angle) * radiusX;
      const targetY = height / 2 + Math.sin(definition.angle) * radiusY;
      result.push({
        ...definition,
        type: 'category',
        radius: 24,
        collisionRadius: 48,
        x: previous?.x ?? targetX,
        y: previous?.y ?? targetY,
        vx: previous?.vx ?? 0,
        vy: previous?.vy ?? 0,
        anchorX: targetX,
        anchorY: targetY
      });
    });
    return result;
  }

  function buildGraph() {
    const previousPositions = new Map(nodes.map(node => [node.id, node]));
    nodes = initialBaseNodes(previousPositions);
    links = categoryDefinitions.map(category => ({ source: 'jh', target: category.id, kind: 'primary' }));
    categoryCrossLinks.forEach(([source, target]) => links.push({ source, target, kind: 'cross' }));

    if (expandedGroup && detailDefinitions[expandedGroup]) {
      const parent = nodes.find(node => node.id === expandedGroup);
      const detailItems = detailDefinitions[expandedGroup];
      detailItems.forEach((definition, index) => {
        const previous = previousPositions.get(definition.id);
        const angle = (Math.PI * 2 * index) / Math.max(detailItems.length, 1) + 0.35;
        const spawnRadius = 70 + (index % 2) * 12;
        const node = {
          ...definition,
          type: 'detail',
          parent: expandedGroup,
          color: parent?.color || '#2764a5',
          radius: 16,
          collisionRadius: 34,
          x: previous?.x ?? (parent?.x ?? width / 2) + Math.cos(angle) * spawnRadius,
          y: previous?.y ?? (parent?.y ?? height / 2) + Math.sin(angle) * spawnRadius,
          vx: previous?.vx ?? 0,
          vy: previous?.vy ?? 0
        };
        nodes.push(node);
        links.push({ source: expandedGroup, target: node.id, kind: 'detail' });
        (definition.related || []).forEach(relatedId => {
          if (categoryById.has(relatedId)) links.push({ source: node.id, target: relatedId, kind: 'relation' });
        });
      });
    }

    renderGraphElements();
    alpha = reduceMotion ? 0.06 : 1;
  }

  function createSvgElement(name, className) {
    const element = document.createElementNS(SVG_NS, name);
    if (className) element.setAttribute('class', className);
    return element;
  }

  function renderGraphElements() {
    linkLayer.replaceChildren();
    nodeLayer.replaceChildren();
    nodeElements.clear();
    linkElements.length = 0;

    links.forEach(link => {
      const line = createSvgElement('line', `network-link is-${link.kind}`);
      line.dataset.source = link.source;
      line.dataset.target = link.target;
      linkLayer.appendChild(line);
      linkElements.push({ link, element: line });
    });

    nodes.forEach(node => {
      const group = createSvgElement('g', `network-node is-${node.type}`);
      group.dataset.nodeId = node.id;
      group.setAttribute('tabindex', '0');
      group.setAttribute('role', node.type === 'detail' || node.type === 'center' ? 'link' : 'button');
      group.setAttribute('aria-label', `${labelFor(node)} ${captionFor(node)}`.trim());
      if (node.type === 'category') group.setAttribute('aria-pressed', String(expandedGroup === node.id));

      const halo = createSvgElement('circle', 'node-halo');
      halo.setAttribute('r', String(node.radius + 13));
      halo.style.fill = node.color;

      const core = createSvgElement('circle', 'node-core');
      core.setAttribute('r', String(node.radius));
      if (node.type === 'center') {
        core.style.fill = 'var(--navy)';
        core.style.stroke = 'var(--sky)';
      } else if (node.type === 'category') {
        core.style.fill = 'var(--surface)';
        core.style.stroke = node.color;
      } else {
        core.style.fill = 'var(--surface)';
        core.style.stroke = node.color;
      }

      const label = createSvgElement('text', 'node-label');
      label.textContent = labelFor(node);
      label.setAttribute('y', node.type === 'center' ? '-1' : String(node.radius + 18));

      const caption = createSvgElement('text', 'node-caption');
      caption.textContent = captionFor(node);
      caption.setAttribute('y', node.type === 'center' ? '16' : String(node.radius + 31));

      group.append(halo, core, label, caption);
      attachNodeInteractions(group, node);
      nodeLayer.appendChild(group);
      nodeElements.set(node.id, { group, halo, core, label, caption });
    });

    updateSelectedClasses();
    renderPositions();
  }

  function attachNodeInteractions(group, node) {
    group.addEventListener('mouseenter', () => highlightNeighborhood(node.id));
    group.addEventListener('mouseleave', clearNeighborhoodHighlight);
    group.addEventListener('focus', () => highlightNeighborhood(node.id));
    group.addEventListener('blur', clearNeighborhoodHighlight);
    group.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activateNode(node);
      }
    });
    group.addEventListener('pointerdown', event => beginDrag(event, node, group));
  }

  function beginDrag(event, node, group) {
    if (event.button !== 0) return;
    event.preventDefault();
    const point = pointerToGraph(event);
    dragState = {
      node,
      group,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      moved: false
    };
    node.fx = point.x;
    node.fy = point.y;
    group.setPointerCapture?.(event.pointerId);
    alpha = Math.max(alpha, 0.7);
  }

  function pointerToGraph(event) {
    const rect = container.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * width,
      y: ((event.clientY - rect.top) / rect.height) * height
    };
  }

  window.addEventListener('pointermove', event => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    const point = pointerToGraph(event);
    const movement = Math.hypot(event.clientX - dragState.startClientX, event.clientY - dragState.startClientY);
    if (movement > 5) dragState.moved = true;
    dragState.node.fx = point.x;
    dragState.node.fy = point.y;
    dragState.node.x = point.x;
    dragState.node.y = point.y;
    dragState.node.vx = 0;
    dragState.node.vy = 0;
    alpha = Math.max(alpha, 0.65);
  }, { passive: true });

  window.addEventListener('pointerup', event => {
    if (!dragState || event.pointerId !== dragState.pointerId) return;
    const { node, group, moved } = dragState;
    group.releasePointerCapture?.(event.pointerId);
    if (node.type !== 'center') {
      node.fx = null;
      node.fy = null;
    }
    dragState = null;
    if (!moved) activateNode(node);
  });

  function activateNode(node) {
    selectedId = node.id;
    if (node.type === 'center') {
      window.location.href = '/about/';
      return;
    }
    if (node.type === 'detail') {
      openNodeUrl(node);
      return;
    }
    if (node.type === 'category') {
      expandedGroup = expandedGroup === node.id ? null : node.id;
      updateDetailPanel(node.id);
      buildGraph();
    }
  }

  function openNodeUrl(node) {
    if (!node.url) return;
    if (node.external) window.open(node.url, '_blank', 'noopener,noreferrer');
    else window.location.href = node.url;
  }

  function updateDetailPanel(categoryId = null) {
    if (!categoryId) {
      detailPanel.innerHTML = `
        <div><p class="network-detail-kicker">NAVIGATOR</p><strong>${language === 'en' ? 'Select a node' : '노드를 선택하세요'}</strong></div>
        <p>${language === 'en' ? 'Select a category to reveal its detail nodes. Drag any node to rearrange the network.' : '카테고리 노드를 누르면 세부 노드가 열립니다. 노드는 드래그할 수 있습니다.'}</p>`;
      return;
    }

    const category = categoryById.get(categoryId);
    if (!category) return;
    const detailItems = detailDefinitions[categoryId] || [];
    const linksMarkup = [
      `<a href="${category.overviewUrl}"${category.external ? ' target="_blank" rel="noreferrer"' : ''}>${language === 'en' ? 'Overview' : '전체 보기'}</a>`,
      ...detailItems.map(item => `<a href="${item.url}"${item.external ? ' target="_blank" rel="noreferrer"' : ''}>${labelFor(item)}</a>`)
    ].join('');

    detailPanel.innerHTML = `
      <div>
        <p class="network-detail-kicker">${labelFor(category)}</p>
        <strong>${descriptionFor(category)}</strong>
        <div class="network-detail-links">${linksMarkup}</div>
      </div>
      <p>${expandedGroup === categoryId
        ? (language === 'en' ? 'Detail nodes are open. Select a detail node to navigate.' : '세부 노드가 열려 있습니다. 세부 노드를 누르면 해당 페이지로 이동합니다.')
        : (language === 'en' ? 'Select the category again to reveal its detail nodes.' : '카테고리를 다시 누르면 세부 노드가 열립니다.')}</p>`;
  }

  function updateSelectedClasses() {
    nodeElements.forEach(({ group }, id) => {
      group.classList.toggle('is-selected', id === selectedId || id === expandedGroup);
      if (group.classList.contains('is-category')) group.setAttribute('aria-pressed', String(id === expandedGroup));
    });
  }

  function neighborIds(nodeId) {
    const neighbors = new Set([nodeId]);
    links.forEach(link => {
      if (link.source === nodeId) neighbors.add(link.target);
      if (link.target === nodeId) neighbors.add(link.source);
    });
    return neighbors;
  }

  function highlightNeighborhood(nodeId) {
    const connected = neighborIds(nodeId);
    nodeElements.forEach(({ group }, id) => group.classList.toggle('is-dimmed', !connected.has(id)));
    linkElements.forEach(({ link, element }) => {
      const connectedLink = link.source === nodeId || link.target === nodeId;
      element.classList.toggle('is-highlighted', connectedLink);
      element.classList.toggle('is-dimmed', !connectedLink);
    });
  }

  function clearNeighborhoodHighlight() {
    nodeElements.forEach(({ group }) => group.classList.remove('is-dimmed'));
    linkElements.forEach(({ element }) => element.classList.remove('is-highlighted', 'is-dimmed'));
  }

  function nodeById(id) {
    return nodes.find(node => node.id === id);
  }

  function simulateStep(delta) {
    if (alpha < 0.001 && !dragState) return;
    const dt = Math.min(delta / 16.67, 2);
    const activeAlpha = Math.max(alpha, dragState ? 0.25 : 0);

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < 1) {
          dx = (Math.random() - 0.5) * 2;
          dy = (Math.random() - 0.5) * 2;
          distanceSquared = dx * dx + dy * dy;
        }
        const distance = Math.sqrt(distanceSquared);
        const repulsion = ((a.collisionRadius + b.collisionRadius) * 40) / distanceSquared;
        const forceX = (dx / distance) * repulsion * activeAlpha;
        const forceY = (dy / distance) * repulsion * activeAlpha;
        if (a.fx == null) { a.vx -= forceX * dt; a.vy -= forceY * dt; }
        if (b.fx == null) { b.vx += forceX * dt; b.vy += forceY * dt; }

        const minimumDistance = a.collisionRadius + b.collisionRadius;
        if (distance < minimumDistance) {
          const overlap = (minimumDistance - distance) * 0.035;
          if (a.fx == null) { a.vx -= (dx / distance) * overlap; a.vy -= (dy / distance) * overlap; }
          if (b.fx == null) { b.vx += (dx / distance) * overlap; b.vy += (dy / distance) * overlap; }
        }
      }
    }

    links.forEach(link => {
      const source = nodeById(link.source);
      const target = nodeById(link.target);
      if (!source || !target) return;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.max(Math.hypot(dx, dy), 1);
      const targetDistance = link.kind === 'detail' ? 74 : link.kind === 'relation' ? 108 : link.kind === 'cross' ? 145 : 128;
      const strength = link.kind === 'detail' ? 0.018 : link.kind === 'relation' ? 0.006 : link.kind === 'cross' ? 0.004 : 0.009;
      const displacement = (distance - targetDistance) * strength * activeAlpha;
      const forceX = (dx / distance) * displacement;
      const forceY = (dy / distance) * displacement;
      if (source.fx == null) { source.vx += forceX * dt; source.vy += forceY * dt; }
      if (target.fx == null) { target.vx -= forceX * dt; target.vy -= forceY * dt; }
    });

    nodes.forEach(node => {
      if (node.type === 'category' && node.anchorX != null && node.fx == null) {
        node.vx += (node.anchorX - node.x) * 0.0018 * activeAlpha * dt;
        node.vy += (node.anchorY - node.y) * 0.0018 * activeAlpha * dt;
      }
      if (node.type === 'detail' && node.parent && node.fx == null) {
        const parent = nodeById(node.parent);
        if (parent) {
          node.vx += (parent.x - node.x) * 0.00055 * activeAlpha * dt;
          node.vy += (parent.y - node.y) * 0.00055 * activeAlpha * dt;
        }
      }
      if (node.fx != null) {
        node.x = node.fx;
        node.y = node.fy;
        node.vx = 0;
        node.vy = 0;
        return;
      }
      node.vx *= 0.86;
      node.vy *= 0.86;
      node.vx = Math.max(-9, Math.min(9, node.vx));
      node.vy = Math.max(-9, Math.min(9, node.vy));
      node.x += node.vx * dt;
      node.y += node.vy * dt;

      const margin = node.collisionRadius + 12;
      if (node.x < margin) { node.x = margin; node.vx *= -0.35; }
      if (node.x > width - margin) { node.x = width - margin; node.vx *= -0.35; }
      if (node.y < margin) { node.y = margin; node.vy *= -0.35; }
      if (node.y > height - margin) { node.y = height - margin; node.vy *= -0.35; }
    });

    if (!dragState) alpha *= reduceMotion ? 0.84 : 0.986;
  }

  function renderPositions() {
    linkElements.forEach(({ link, element }) => {
      const source = nodeById(link.source);
      const target = nodeById(link.target);
      if (!source || !target) return;
      element.setAttribute('x1', source.x.toFixed(2));
      element.setAttribute('y1', source.y.toFixed(2));
      element.setAttribute('x2', target.x.toFixed(2));
      element.setAttribute('y2', target.y.toFixed(2));
    });
    nodeElements.forEach(({ group }, id) => {
      const node = nodeById(id);
      if (node) group.setAttribute('transform', `translate(${node.x.toFixed(2)} ${node.y.toFixed(2)})`);
    });
  }

  function animate(now) {
    const delta = now - lastTime;
    lastTime = now;
    simulateStep(delta);
    renderPositions();
    animationFrame = requestAnimationFrame(animate);
  }

  function updateLanguage(nextLanguage) {
    language = nextLanguage === 'en' ? 'en' : 'ko';
    nodes.forEach(node => {
      const elements = nodeElements.get(node.id);
      if (!elements) return;
      elements.label.textContent = labelFor(node);
      elements.caption.textContent = captionFor(node);
      elements.group.setAttribute('aria-label', `${labelFor(node)} ${captionFor(node)}`.trim());
    });
    if (selectedId && categoryById.has(selectedId)) updateDetailPanel(selectedId);
    else updateDetailPanel(null);
  }

  const resizeObserver = new ResizeObserver(entries => {
    const entry = entries[0];
    if (!entry) return;
    const nextWidth = Math.max(entry.contentRect.width, 320);
    const nextHeight = Math.max(entry.contentRect.height, 420);
    if (Math.abs(nextWidth - width) < 2 && Math.abs(nextHeight - height) < 2) return;
    const scaleX = nextWidth / width;
    const scaleY = nextHeight / height;
    width = nextWidth;
    height = nextHeight;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    nodes.forEach(node => {
      node.x *= scaleX;
      node.y *= scaleY;
      if (node.fx != null) node.fx *= scaleX;
      if (node.fy != null) node.fy *= scaleY;
      if (node.anchorX != null) node.anchorX *= scaleX;
      if (node.anchorY != null) node.anchorY *= scaleY;
    });
    const center = nodeById('jh');
    if (center) {
      center.fx = width / 2;
      center.fy = height / 2;
    }
    alpha = Math.max(alpha, 0.75);
  });
  resizeObserver.observe(container);

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && expandedGroup) {
      expandedGroup = null;
      selectedId = 'jh';
      updateDetailPanel(null);
      buildGraph();
    }
  });


  function applyManagedContent(content) {
    if (!content) return;
    const managedResearch = [
      ...(content['research-projects']?.items || []).filter(item => item.network).map(item => ({
        id: item.slug,
        ko: item.title.replace(/:.*$/, ''),
        en: item.title.replace(/:.*$/, ''),
        captionKo: `${item.area || 'Research'} · ${item.year || ''}`.trim(),
        captionEn: `${item.area || 'Research'} · ${item.year || ''}`.trim(),
        url: item.url || '/research/',
        external: /^https?:\/\//i.test(item.url || ''),
        related: ['scholar']
      })),
      ...(content.publications?.items || []).filter(item => item.network).map(item => ({
        id: item.slug,
        ko: item.slug === 'mot' ? 'MoT' : item.slug === 'gref-rag' ? 'GRef-RAG' : item.slug === 'mpr-citeg' ? 'MPR-CiteG' : item.slug === 'star' ? 'StAR' : item.title.split(':')[0],
        en: item.slug === 'mot' ? 'MoT' : item.slug === 'gref-rag' ? 'GRef-RAG' : item.slug === 'mpr-citeg' ? 'MPR-CiteG' : item.slug === 'star' ? 'StAR' : item.title.split(':')[0],
        captionKo: `${item.area || item.type} · ${item.year}`,
        captionEn: `${item.area || item.type} · ${item.year}`,
        url: item.url || `/research/#${item.slug}`,
        external: /^https?:\/\//i.test(item.url || ''),
        related: item.slug === 'mpr-citeg' ? ['projects', 'awards'] : item.slug === 'star' ? ['awards'] : ['scholar']
      }))
    ].sort((a, b) => {
      const order = id => {
        const p = (content['research-projects']?.items || []).find(x => x.slug === id);
        const q = (content.publications?.items || []).find(x => x.slug === id);
        return (p || q)?.order ?? 999;
      };
      return order(a.id) - order(b.id);
    }).slice(0, 8);
    if (managedResearch.length) detailDefinitions.research.splice(0, detailDefinitions.research.length, ...managedResearch);

    const managedProjects = (content.projects?.items || []).filter(item => item.network).sort((a,b) => (a.order ?? 999) - (b.order ?? 999)).slice(0, 8).map(item => ({
      id: item.slug,
      ko: item.title.length > 18 ? item.title.split('—')[0].trim() : item.title,
      en: item.title_en || (item.title.length > 18 ? item.title.split('—')[0].trim() : item.title),
      captionKo: item.domain || item.type,
      captionEn: item.domain || item.type,
      url: item.detail_url || `/projects/view/?id=${encodeURIComponent(item.slug)}`,
      related: ['research', 'awards']
    }));
    if (managedProjects.length) detailDefinitions.projects.splice(0, detailDefinitions.projects.length, ...managedProjects);

    const managedAwards = (content.awards?.items || []).sort((a,b) => (a.order ?? 999) - (b.order ?? 999)).slice(0, 6).map(item => ({
      id: `award-${item.slug}`,
      ko: item.title_en && language === 'en' ? item.title_en : item.title,
      en: item.title_en || item.title,
      captionKo: `${item.year} · ${item.organization}`,
      captionEn: `${item.year} · ${item.organization}`,
      url: '/about/#all-awards',
      related: item.type === 'competition' ? ['projects'] : ['research']
    }));
    if (managedAwards.length) detailDefinitions.awards.splice(0, detailDefinitions.awards.length, ...managedAwards);

    const profile = content.profile || {};
    const contact = detailDefinitions.contact.find(item => item.id === 'email');
    if (contact && profile.email) contact.url = `mailto:${profile.email}`;
    const github = detailDefinitions.contact.find(item => item.id === 'github');
    if (github && profile.github) github.url = profile.github;
    const linked = detailDefinitions.contact.find(item => item.id === 'contact-linkedin');
    if (linked && profile.linkedin) linked.url = profile.linkedin;
    const scholarCategory = categoryById.get('scholar');
    if (scholarCategory && profile.scholar) scholarCategory.overviewUrl = profile.scholar;
    const linkedinCategory = categoryById.get('linkedin');
    if (linkedinCategory && profile.linkedin) linkedinCategory.overviewUrl = profile.linkedin;

    if (expandedGroup && !detailDefinitions[expandedGroup]) expandedGroup = null;
    buildGraph();
    updateDetailPanel(expandedGroup);
    alpha = Math.max(alpha, 0.85);
  }

  document.addEventListener('portfolio-content-ready', event => applyManagedContent(event.detail));
  if (window.ojungiiContent) applyManagedContent(window.ojungiiContent);

  document.addEventListener('portfolio-language-change', event => updateLanguage(event.detail?.language));
  window.addEventListener('pagehide', () => {
    resizeObserver.disconnect();
    if (animationFrame) cancelAnimationFrame(animationFrame);
  }, { once: true });

  buildGraph();
  updateDetailPanel(null);
  animationFrame = requestAnimationFrame(animate);
})();
