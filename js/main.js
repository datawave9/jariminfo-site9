/* =====================================================================
   자림인포시스템(주) — 렌더링 스크립트
   ⚠ 이 파일은 "동작"을 담당합니다. 문구 수정은 js/site-data.js 에서 하세요.
   ===================================================================== */

/* ---------- 유틸 ---------- */
function currentPage() {
  const p = location.pathname.split('/').pop();
  return p === '' ? 'index.html' : p;
}

/* ---------- 헤더 ---------- */
function renderHeader() {
  const mount = document.getElementById('site-header-mount');
  if (!mount) return;
  const active = currentPage();
  const navHtml = SITE.nav.map(item => {
    const isActive = item.href === active ? ' active' : '';
    return `<a href="${item.href}" class="${isActive.trim()}">${item.label}</a>`;
  }).join('');

  mount.innerHTML = `
    <header class="site-header">
      <div class="wrap">
        <a href="index.html" class="brand">
          <img class="brand-logo" src="${SITE.company.partnerLogo}" alt="iPECS 공식 로고" loading="lazy" onerror="this.style.display='none'">
          <span>자림인포시스템<span class="dot">(주)</span></span>
          <span class="brand-en">iPECS OFFICIAL PARTNER</span>
        </a>
        <nav class="main-nav" id="main-nav">${navHtml}</nav>
        <div style="display:flex; align-items:center; gap:10px;">
          <a class="header-cta" href="${SITE.company.telHref}">
            <span class="ping"></span> ${SITE.company.tel}
          </a>
          <button class="nav-toggle" id="nav-toggle" aria-label="메뉴 열기"><span></span></button>
        </div>
      </div>
    </header>
  `;

  document.getElementById('nav-toggle').addEventListener('click', () => {
    document.getElementById('main-nav').classList.toggle('open');
  });
}

/* ---------- 푸터 ---------- */
function renderFooter() {
  const mount = document.getElementById('site-footer-mount');
  if (!mount) return;
  const c = SITE.company;
  const f = SITE.footer;
  const navHtml = SITE.nav.map(i => `<a href="${i.href}">${i.label}</a>`).join('');
  const footerMainNav = navHtml;
  const footerPolicyNav = `<a href="privacy.html">개인정보처리방침</a><a href="email-collection-refusal.html">이메일무단수집거부</a><a href="safety.html">안전·윤리·인권 선언</a>`;

  mount.innerHTML = `
    <footer class="site-footer site-footer--horizontal">
      <div class="wrap">
        <div class="footer-row footer-row--top">
          <div class="footer-brand">자림인포시스템<span class="dot">(주)</span></div>
          <nav class="footer-nav footer-nav--primary" aria-label="주요 메뉴">${footerMainNav}</nav>
        </div>
        
        <div class="footer-row footer-row--mid">
          <div class="footer-info-group">
            <div class="footer-meta-line">
              <span>대표이사 ${c.ceo}</span>
              <span>사업자등록번호 ${c.bizNo}</span>
              <span>대표번호 ${c.tel}</span>
            </div>
            <div class="footer-meta-line">
              <span>이메일 ${c.email}</span>
              <span>${c.hours}</span>
            </div>
            <div class="footer-meta-line footer-address">
              <span>${c.address}</span>
            </div>
          </div>
          <div class="footer-policy-group">
            <nav class="footer-policy-nav" aria-label="정책 및 고지">${footerPolicyNav}</nav>
          </div>
        </div>

        <div class="footer-row footer-row--bottom">
          <p class="footer-copyright-notice">${f.copyrightNotice}</p>
          <div class="footer-copy">© ${c.copyrightYear} ${c.name}. All Rights Reserved. · 취급 브랜드 iPECS(舊 에릭슨엘지 엔터프라이즈)는 각 사의 상표입니다.</div>
        </div>
      </div>
    </footer>
  `;
}

/* ---------- 노드(네트워크 토폴로지) 배경 SVG 생성 ---------- */
function renderNodeField(mountId, opts) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  const o = Object.assign({ nodes: 26, w: 1200, h: 520, seed: 7 }, opts || {});
  let seed = o.seed;
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

  const pts = [];
  for (let i = 0; i < o.nodes; i++) {
    pts.push({ x: rand() * o.w, y: rand() * o.h, live: rand() > 0.82 });
  }
  let lines = '';
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 190) {
        const cls = (pts[i].live && pts[j].live) ? 'ln-live' : 'ln';
        lines += `<line class="${cls}" x1="${pts[i].x.toFixed(1)}" y1="${pts[i].y.toFixed(1)}" x2="${pts[j].x.toFixed(1)}" y2="${pts[j].y.toFixed(1)}"/>`;
      }
    }
  }
  let nodes = '';
  pts.forEach(p => {
    nodes += `<circle class="${p.live ? 'nd-live' : 'nd'}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.live ? 3 : 2.2}"/>`;
  });

  mount.innerHTML = `
    <div class="node-field">
      <svg viewBox="0 0 ${o.w} ${o.h}" preserveAspectRatio="xMidYMid slice">
        ${lines}${nodes}
      </svg>
    </div>
  `;
}

/* ---------- 홈: 히어로 ---------- */
function renderHero() {
  const mount = document.getElementById('hero-mount');
  if (!mount) return;
  const h = SITE.hero;
  mount.innerHTML = `
    <div class="eyebrow hero-fade" style="--d:0s">${h.eyebrow}</div>
    <h1><span class="hero-fade" style="--d:.08s">${h.title1}</span><span class="hero-fade" style="--d:.18s">${h.title2}</span></h1>
    <p class="desc hero-fade" style="--d:.28s">${h.desc}</p>
    <div class="hero-cta hero-fade" style="--d:.38s">
      <a class="btn btn-primary" href="${h.ctaPrimary.href}">${h.ctaPrimary.label}</a>
      <a class="btn btn-ghost" href="${h.ctaSecondary.href}">${h.ctaSecondary.label}</a>
    </div>
  `;
}

/* ---------- 홈: 상태판 ---------- */
function renderStats() {
  const mount = document.getElementById('stats-mount');
  if (!mount) return;
  mount.innerHTML = SITE.stats.map(s => `
    <div class="stat">
      <div class="stat-value"><span class="count" data-final="${s.value}">0</span>${s.unit ? `<span class="unit">${s.unit}</span>` : ''}</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join('');
}

/* ---------- 브랜드 변경 안내 ---------- */
function renderBrandNotice() {
  const mount = document.getElementById('brand-notice-mount');
  if (!mount) return;
  const b = SITE.brandNotice;
  mount.innerHTML = `
    <div class="brand-notice">
      <div class="badge-col">
        <div class="rename-chip">에릭슨엘지<br>엔터프라이즈</div>
        <div class="rename-arrow">↓ 2025 사명변경</div>
        <div class="rename-chip now">iPECS<br>(아이펙스)</div>
      </div>
      <div>
        <h3>${b.title}</h3>
        <p>${b.body}</p>
      </div>
    </div>
  `;
}

/* ---------- 홈: 제품 요약 카드 ---------- */
function renderProductSummary() {
  const mount = document.getElementById('product-summary-mount');
  if (!mount) return;
  mount.innerHTML = SITE.productSummary.map(p => `
    <a class="pcard" href="products.html#${p.id}">
      ${p.img ? `<div class="pcard-img"><img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.closest('.pcard-img').style.display='none'"></div>` : ''}
      <span class="tag">${p.tag}</span>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <span class="pcard-more">자세히 보기 →</span>
    </a>
  `).join('');
}

/* ---------- 아이콘: 자료실 ---------- */
const RES_ICONS = {
  'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  'book-open': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  'external-link': '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6"/><path d="M10 14 21 3"/>',
  'cpu': '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="8" y="8" width="8" height="8"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>',
};
const resIcon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${RES_ICONS[name] || RES_ICONS['file-text']}</svg>`;
const PARTNER_ICONS = {
  factory: '<path d="M3 21V9l6 3V9l6 3V5h6v16H3Z"/><path d="M7 16h1M11 16h1M15 16h1M19 16h1M7 19h1M11 19h1M15 19h1M19 19h1"/>',
  repair: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18a2.1 2.1 0 0 0 3 3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.2 2.2-2.1-.5-.5-2.1 2.2-2.2Z"/><path d="m15 15 5 5"/>',
};
const partnerIcon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PARTNER_ICONS[name] || PARTNER_ICONS.factory}</svg>`;

/* ---------- 홈: 자료실 미리보기(3종) ---------- */
/* ---------- 자료실 페이지: 전체 목록 ---------- */
function renderResourcesList() {
  const mount = document.getElementById('resources-list-mount');
  if (!mount) return;
  const r = SITE.resources;
  const groups = {};
  r.items.forEach(it => {
    groups[it.category] = groups[it.category] || [];
    groups[it.category].push(it);
  });
  mount.innerHTML = Object.entries(groups).map(([cat, items]) => `
    <div class="res-group">
      <h3 class="res-group__title">${cat}</h3>
      <div class="res-list">
        ${items.map(it => it.type === 'folder' ? `
          <div class="res-row res-row--placeholder">
            <span class="res-row__icon">${resIcon(it.icon)}</span>
            <span class="res-row__body">
              <strong>${it.title}</strong>
              <span>${it.desc}</span>
            </span>
            <span class="res-row__badge">${it.badge}</span>
            <span class="res-row__arrow">＋</span>
          </div>
        ` : `
          <a class="res-row" href="${it.href}" ${it.type === 'external' ? 'target="_blank" rel="noopener"' : 'download'}>
            <span class="res-row__icon">${resIcon(it.icon)}</span>
            <span class="res-row__body">
              <strong>${it.title}</strong>
              <span>${it.desc}</span>
            </span>
            <span class="res-row__badge">${it.badge}</span>
            <span class="res-row__arrow">${it.type === 'external' ? '↗' : '↓'}</span>
          </a>
        `).join('')}
      </div>
    </div>
  `).join('');
}


/* ---------- 홈: 실적 로고 스트립 ---------- */
function renderWhyIpecs() {
  const mount = document.getElementById('why-ipecs-mount');
  if (!mount) return;
  const w = SITE.whyIpecs;
  mount.innerHTML = `
    <div class="section-head">
      <span class="kicker">${w.kicker}</span>
      <h2>${w.title}</h2>
      <p>${w.desc}</p>
    </div>
    <div class="fact-grid">
      ${w.facts.map(f => `
        <div class="fact-card">
          <div class="fact-card__value">${f.value}<span>${f.suffix}</span></div>
          <h4>${f.label}</h4>
          <p>${f.desc}</p>
        </div>
      `).join('')}
    </div>
    <div class="fact-grid-more">
      <a href="about.html#achievements-mount">광주·전남·전북 공공기관 구축 실적 전체 보기 →</a>
    </div>
  `;
}

/* ---------- 회사소개: 인트로 ---------- */
function renderAboutIntro() {
  const mount = document.getElementById('about-intro-mount');
  if (!mount) return;
  const a = SITE.aboutIntro;
  mount.innerHTML = `<h1 class="hero-fade" style="--d:0s; max-width:20ch;">${a.title}</h1><p class="desc hero-fade" style="--d:.12s;">${a.body}</p>`;
}

/* ---------- 회사소개: 연혁 ---------- */
function renderHistory() {
  const mount = document.getElementById('history-mount');
  if (!mount) return;
  mount.innerHTML = `<div class="timeline">${
    SITE.history.map(h => `
      <div class="tl-item">
        <div class="tl-year">${h.year}</div>
        <div class="tl-text">${h.text}</div>
      </div>
    `).join('')
  }</div>`;
}

/* ---------- 회사소개: 주요 실적 전체 ---------- */
function renderAchievements() {
  const mount = document.getElementById('achievements-mount');
  if (!mount) return;
  mount.innerHTML = `<div class="achv-table">${
    SITE.achievements.map(a => `
      <div class="achv-row">
        <div class="yy">${a.year}</div>
        <div class="tx">${a.text}</div>
      </div>
    `).join('')
  }</div>`;
}

/* ---------- 제품소개: 목차 + 상세 ---------- */
function renderProducts() {
  const jumpMount = document.getElementById('product-jump-mount');
  const listMount = document.getElementById('product-list-mount');
  if (!listMount) return;

  if (jumpMount) {
    jumpMount.innerHTML = SITE.products.map(p => `<a href="#${p.id}">${p.name}</a>`).join('');
  }

  listMount.innerHTML = SITE.products.map(p => `
    <div class="product-detail" id="${p.id}">
      ${p.img ? `<div class="product-detail-img"><img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.closest('.product-detail-img').style.display='none'"></div>` : ''}
      <div class="product-detail-body">
        <div class="cat">${p.category}</div>
        <h3>${p.name}</h3>
        <div class="tagline">${p.tagline}</div>
        <p class="desc">${p.desc}</p>
        <div class="spec-table">
          ${p.specs.map(s => `
            <div class="spec-row">
              <div class="k">${s.k}</div>
              <div class="v">${s.v}</div>
            </div>
          `).join('')}
        </div>
        <button type="button" class="btn btn-ghost product-detail-cta" data-open-quickform>이 제품 문의하기 →</button>
      </div>
    </div>
  `).join('');
}

/* ---------- 고객지원: 연락처 카드 ---------- */
function renderContactInfo() {
  const mount = document.getElementById('contact-info-mount');
  if (!mount) return;
  const c = SITE.company;
  mount.innerHTML = `
    <div class="info-card">
      <div class="info-row"><div class="k">TEL</div><div class="v"><a href="${c.telHref}">${c.tel}</a></div></div>
      <div class="info-row"><div class="k">EMAIL</div><div class="v"><a href="mailto:${c.email}">${c.email}</a></div></div>
      <div class="info-row"><div class="k">ADDRESS</div><div class="v">${c.address}</div></div>
      <div class="info-row"><div class="k">HOURS</div><div class="v">${c.hours}</div></div>
      <div class="info-row"><div class="k">대표이사</div><div class="v">${c.ceo}</div></div>
      <div class="info-row"><div class="k">사업자번호</div><div class="v">${c.bizNo}</div></div>
      <div class="info-row"><div class="k">사업내용</div><div class="v">${c.bizScope}</div></div>
    </div>
  `;
}

/* ---------- 고객지원: 협력사 링크 ---------- */
function renderPartnerLinks() {
  const mount = document.getElementById('partner-links-mount');
  if (!mount) return;
  const p = SITE.partnerLinks;
  mount.innerHTML = `
    <div class="section-head" style="margin-bottom:24px;">
      <span class="kicker">${p.kicker}</span>
      <h2 style="font-size:22px;">${p.title}</h2>
      <p>${p.desc}</p>
    </div>
    <div class="partner-links-grid">
      ${p.items.map(item => `
        <a class="partner-link-card" href="${item.href}" target="_blank" rel="noopener noreferrer">
          <span class="partner-link-card__visual" aria-hidden="true">
            ${partnerIcon(item.icon)}
          </span>
          <span class="partner-link-card__label">${item.label}</span>
          <span class="partner-link-card__name">${item.name}</span>
          <span class="partner-link-card__arrow">↗</span>
        </a>
      `).join('')}
    </div>
  `;
}

/* ---------- 고객지원: 찾아오시는 길 ---------- */
function renderDirections() {
  const mount = document.getElementById('directions-mount');
  if (!mount) return;
  const c = SITE.company;
  const d = SITE.directions;
  /* 지도 검색용 주소 정리
     "(우)62396 전남광주통합특별시 광산구 광주여대길 6, 8119호 (하계유니버시아드체육관)"
     → 우편번호 접두어 "(우)62396", 쉼표, 끝의 괄호(건물명)를 제거해
       "전남광주통합특별시 광산구 광주여대길 6 8119호" 형태로 만듭니다.
     특히 네이버지도는 괄호·쉼표가 섞인 주소를 업체명으로 오인해 검색이
     안 되는 경우가 있어, 지도 링크는 항상 이 정리된 주소를 사용합니다.
     ★ 2026년 7월 행정통합으로 "광주광역시"가 "전남광주통합특별시"로
       개칭되었는데, 지도 서비스(특히 네이버) 데이터베이스가 아직 새
       명칭을 인식하지 못해 검색이 실패하는 경우가 있습니다. 그래서
       지도 검색에 한해서만 구 명칭("광주광역시")으로 바꿔 보냅니다.
       추후 지도 서비스들이 새 명칭을 인식하게 되면 아래 replace 줄을
       지우고 mapAddress를 그대로 사용하면 됩니다. */
  const mapAddress = c.address
    .replace(/^\(우\)\s*\d+\s*/, '')
    .replace(/,\s*/g, ' ')
    .replace(/\s*\([^)]*\)\s*$/, '')
    .replace(/\s+/g, ' ')
    .replace('전남광주통합특별시', '광주광역시')
    .trim();
  const q = encodeURIComponent(mapAddress);
  const mapEmbedSrc = `https://www.google.com/maps?q=${q}&output=embed`;
  const kakaoUrl = `https://map.kakao.com/link/search/${q}`;
  const naverUrl = `https://map.naver.com/p/search/${q}`;
  const googleUrl = `https://www.google.com/maps/search/?api=1&query=${q}`;
  mount.innerHTML = `
    <div class="section-head" style="margin-bottom:24px;">
      <span class="kicker">${d.kicker}</span>
      <h2 style="font-size:22px;">${d.title}</h2>
      <p>${d.desc}</p>
    </div>
    <div class="directions-card">
      <div class="map-frame">
        <iframe src="${mapEmbedSrc}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="자림인포시스템(주) 위치 지도"></iframe>
      </div>
      <div class="directions-body">
        <div class="info-row"><div class="k">ADDRESS</div><div class="v">${c.address}</div></div>
        <div class="info-row"><div class="k">TEL</div><div class="v"><a href="${c.telHref}">${c.tel}</a></div></div>
        <div class="info-row"><div class="k">HOURS</div><div class="v">${c.hours}</div></div>
        <p class="directions-note">${d.transitNote}</p>
        <p class="directions-note">${d.parkingNote}</p>
        <div class="directions-actions">
          <a class="btn btn-ghost" href="${kakaoUrl}" target="_blank" rel="noopener">카카오맵에서 길찾기 ↗</a>
          <a class="btn btn-ghost" href="${naverUrl}" target="_blank" rel="noopener">네이버지도에서 길찾기 ↗</a>
          <a class="btn btn-ghost" href="${googleUrl}" target="_blank" rel="noopener">구글지도에서 길찾기 ↗</a>
        </div>
      </div>
    </div>
  `;
}

/* ---------- 고객지원: FAQ ---------- */
function renderFaq() {
  const mount = document.getElementById('faq-mount');
  if (!mount) return;
  mount.innerHTML = `
    <div class="info-card">
      ${SITE.contactPage.faq.map(f => `
        <div class="faq-item">
          <div class="faq-q">${f.q}</div>
          <div class="faq-a">${f.a}</div>
        </div>
      `).join('')}
    </div>
  `;
}

/* ---------- 하단 공통 CTA ---------- */
function renderCtaBand() {
  const mount = document.getElementById('cta-band-mount');
  if (!mount) return;
  const c = SITE.company;
  mount.innerHTML = `
    <div class="cta-band">
      <div>
        <h3>도입을 검토 중이신가요?</h3>
        <p>전화 한 통이면 규모에 맞는 견적을 안내해 드립니다. ${c.tel}</p>
      </div>
      <button type="button" class="btn btn-signal" data-open-quickform>지금 문의하기</button>
    </div>
  `;
}

/* ---------- 홈: 브랜드 필름(유튜브 썸네일 → 클릭 시 유튜브 재생) ---------- */
function renderVideo() {
  const mount = document.getElementById('video-section-mount');
  if (!mount) return;
  const v = SITE.video;
  const watchUrl = `https://www.youtube.com/watch?v=${v.youtubeId}`;
  const thumbHi = `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`;
  const thumbFallback = `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`;
  mount.innerHTML = `
    <div class="section-head">
      <span class="kicker">${v.kicker}</span>
      <h2>${v.title}</h2>
      <p>${v.desc}</p>
    </div>
    <div class="video-frame-wrap">
      <div class="video-frame video-frame--facade" id="video-frame-el" role="button" tabindex="0" aria-label="${v.title} 재생">
        <img src="${thumbHi}" alt="${v.title} 썸네일" loading="lazy"
             onerror="this.onerror=null; this.src='${thumbFallback}';">
        <span class="video-play-btn" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </span>
        <span class="video-frame__badge">클릭하여 재생</span>
      </div>
    </div>
    <p class="video-caption">
      ${v.caption}
      <a href="${watchUrl}" target="_blank" rel="noopener" class="video-fallback-link">재생이 안 되면 유튜브에서 보기 ↗</a>
    </p>
  `;

  const frameEl = document.getElementById('video-frame-el');
  const playVideo = () => {
    frameEl.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${v.youtubeId}?autoplay=1&rel=0"
        title="${v.title}"
        referrerpolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen>
      </iframe>`;
    frameEl.classList.remove('video-frame--facade');
  };
  frameEl.addEventListener('click', playVideo, { once: true });
  frameEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playVideo(); }
  }, { once: true });
}

/* ---------- 상태판 숫자 카운트업 애니메이션 ---------- */
function animateCount(el) {
  const final = el.dataset.final || el.textContent;
  const hasComma = final.includes(',');
  const suffixMatch = final.match(/[^0-9,]+$/);
  const suffix = suffixMatch ? suffixMatch[0] : '';
  const numeric = parseInt(final.replace(/[^0-9]/g, ''), 10) || 0;
  const duration = 1300;
  const startTime = performance.now();

  function tick(now) {
    const p = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(eased * numeric);
    el.textContent = (hasComma ? val.toLocaleString('en-US') : String(val)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = final;
  }
  requestAnimationFrame(tick);
}

function setupCounters() {
  const bar = document.getElementById('stats-mount');
  if (!bar) return;
  const counts = bar.querySelectorAll('.count');
  if (!counts.length) return;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counts.forEach(animateCount);
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(bar);
  } else {
    counts.forEach(animateCount);
  }
}

/* ---------- 제품 카드 3D 틸트(마우스 인터랙션) ---------- */
function setupTilt() {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (reduceMotion || coarsePointer) return;

  document.querySelectorAll('.pcard').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---------- 제품 이미지 동적 효과 (로딩 페이드인 · 스크롤 등장 · 은은한 플로팅) ---------- */
function setupImageEffects() {
  const boxes = document.querySelectorAll('.pcard-img, .product-detail-img');
  if (!boxes.length) return;

  boxes.forEach(box => {
    const img = box.querySelector('img');
    if (!img) return;
    const markLoaded = () => {
      img.classList.add('loaded');
      // 로딩 스켈레톤(shimmer) 애니메이션을 멈추고 은은한 플로팅 모션으로 전환
      requestAnimationFrame(() => box.classList.add('img-ready'));
    };
    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
    } else {
      img.addEventListener('load', markLoaded, { once: true });
      img.addEventListener('error', () => box.classList.remove('img-ready'), { once: true });
    }
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    boxes.forEach(box => io.observe(box));
  } else {
    boxes.forEach(box => box.classList.add('in-view'));
  }
}

/* ---------- 제품소개: 규모별 비교표 ---------- */
function renderComparisonTable() {
  const mount = document.getElementById('comparison-mount');
  if (!mount) return;
  const c = SITE.comparisonTable;
  mount.innerHTML = `
    <div class="compare-head">
      <h2>${c.title}</h2>
      <p>${c.desc}</p>
    </div>
    <div class="compare-table">
      <div class="compare-row compare-row--head">
        <div>사업장 규모</div><div>지점 구성</div><div>추천 제품</div><div>이유</div>
      </div>
      ${c.rows.map(r => `
        <div class="compare-row">
          <div class="mono" data-label="사업장 규모">${r.size}</div>
          <div data-label="지점 구성">${r.sites}</div>
          <div class="compare-pick" data-label="추천 제품">${r.pick}</div>
          <div data-label="이유">${r.reason}</div>
        </div>
      `).join('')}
    </div>
  `;
}

/* ---------- 홈: 도입 프로세스 ---------- */
function renderProcess() {
  const mount = document.getElementById('process-mount');
  if (!mount) return;
  const p = SITE.process;
  mount.innerHTML = `
    <div class="section-head">
      <span class="kicker">${p.kicker}</span>
      <h2>${p.title}</h2>
      <p>${p.desc}</p>
    </div>
    <div class="process-rail">
      ${p.steps.map((s, i) => `
        <div class="process-step" style="--i:${i}">
          <div class="process-step__no">${s.no}</div>
          <h4>${s.title}</h4>
          <p>${s.desc}</p>
        </div>
      `).join('')}
    </div>
  `;
}

/* ---------- 홈: 선택 이유 ---------- */
const DIFF_ICONS = {
  shield: '<path d="M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-4z"/>',
  map: '<path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2z"/><path d="M9 3v16"/><path d="M15 5v16"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  headset: '<path d="M3 13a9 9 0 0 1 18 0"/><path d="M21 13v4a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2z"/><path d="M3 13v4a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2z"/>',
};
function renderDifferentiators() {
  const mount = document.getElementById('differentiators-mount');
  if (!mount) return;
  mount.innerHTML = SITE.differentiators.map(d => `
    <div class="diff-card">
      <svg class="diff-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${DIFF_ICONS[d.icon] || ''}</svg>
      <h4>${d.title}</h4>
      <p>${d.desc}</p>
    </div>
  `).join('');
}

/* ---------- 헤더 스크롤 그림자 ---------- */
function setupHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const toggle = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* ---------- 공통: 플로팅 버튼(전화+카카오톡) + 빠른 문의 모달 (모든 페이지) ---------- */
function renderFloatingCtaAndModal() {
  const f = SITE.floatingCta;
  const k = SITE.kakaoTalk;
  const q = SITE.quickForm;

  const fab = document.createElement('div');
  fab.className = 'fab-wrap';
  fab.innerHTML = `
    <a class="fab-call" href="tel:${f.phone}" aria-label="${f.phoneLabel}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    </a>
    <a class="fab-main" href="${k.url}" target="_blank" rel="noopener" aria-label="${k.label} (새 창에서 카카오톡으로 연결)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span>${k.label}</span>
    </a>
  `;
  document.body.appendChild(fab);

  const modalWrap = document.createElement('div');
  modalWrap.className = 'qf-overlay';
  modalWrap.id = 'qf-overlay';
  modalWrap.innerHTML = `
    <div class="qf-modal" role="dialog" aria-modal="true" aria-labelledby="qf-title">
      <button type="button" class="qf-close" id="qf-close-btn" aria-label="닫기">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
      <div id="qf-body">
        <h3 id="qf-title">${q.title}</h3>
        <form id="qf-form">
          <div class="qf-field">
            <label>성함 <span>*</span></label>
            <input type="text" name="name" required placeholder="홍길동">
          </div>
          <div class="qf-field">
            <label>연락처 <span>*</span></label>
            <input type="tel" name="phone" required placeholder="010-0000-0000 (- 생략 가능)">
          </div>
          <div class="qf-field">
            <label>관심 서비스</label>
            <select name="interest">
              ${q.interestOptions.map(o => `<option>${o}</option>`).join('')}
            </select>
          </div>
          <div class="qf-field">
            <label>문의 내용</label>
            <textarea name="message" rows="3" placeholder="설치 규모, 희망 시기 등을 남겨주시면 더 정확한 상담이 가능합니다"></textarea>
          </div>
          <div class="qf-privacy-box">
            <div class="qf-consent-row">
              <label class="qf-consent">
                <input type="checkbox" name="privacyConsent" value="yes" required>
                <span><strong>[필수]</strong> ${q.privacy.consentLabel}</span>
              </label>
              <details class="qf-privacy-details">
                <summary>자세히 보기</summary>
              <dl>
                <div><dt>수집 항목</dt><dd>${q.privacy.items}</dd></div>
                <div><dt>수집 목적</dt><dd>${q.privacy.purpose}</dd></div>
                <div><dt>보유 기간</dt><dd>${q.privacy.retention}</dd></div>
                <div><dt>처리 위탁</dt><dd>${q.privacy.processor}</dd></div>
                <div><dt>처리 안내</dt><dd>${q.privacy.overseas}</dd></div>
              </dl>
              <p>상담 접수 과정에서 Formspree, Inc.의 미국 AWS 인프라를 통해 개인정보가 처리될 수 있습니다. 동의하지 않을 권리가 있으며, 동의하지 않으면 온라인 상담 신청을 이용할 수 없습니다. 전화 상담은 <a href="tel:${f.phone}">${f.phone}</a>으로 가능합니다.</p>
                <a class="qf-policy-link" href="${q.privacy.policyHref}" target="_blank" rel="noopener">개인정보처리방침 전문 보기 ↗</a>
              </details>
            </div>
          </div>
          <button type="submit" class="btn btn-primary qf-submit" id="qf-submit-btn">문의 보내기</button>
          <ul class="qf-trust">
            ${q.trustNotes.map(t => `<li>${t}</li>`).join('')}
          </ul>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(modalWrap);

  const openModal = () => {
    modalWrap.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    modalWrap.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  document.getElementById('qf-close-btn').addEventListener('click', closeModal);
  modalWrap.addEventListener('click', (e) => { if (e.target === modalWrap) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalWrap.classList.contains('is-open')) closeModal(); });

  document.getElementById('qf-form').addEventListener('submit', handleQuickFormSubmit);

  // 페이지 안에 [data-open-quickform] 요소가 있으면 그것도 모달을 엽니다.
  document.querySelectorAll('[data-open-quickform]').forEach(el => {
    el.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  });
}

async function handleQuickFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('qf-submit-btn');
  const q = SITE.quickForm;
  const originalLabel = btn.textContent;
  const consent = form.querySelector('input[name="privacyConsent"]');

  if (!consent || !consent.checked) {
    alert('상담 신청을 위해 개인정보 처리 안내에 동의해 주세요.');
    if (consent) consent.focus();
    return;
  }

  if (q.formspreeId === 'YOUR_FORM_ID') {
    console.warn('[자림인포시스템(주)] Formspree ID가 아직 설정되지 않았습니다. js/site-data.js의 quickForm.formspreeId를 실제 발급받은 ID로 교체해주세요.');
  }

  btn.disabled = true;
  btn.textContent = '전송 중...';

  try {
    const res = await fetch(`https://formspree.io/f/${q.formspreeId}`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form),
    });
    if (!res.ok) throw new Error('submit failed');
    showQuickFormSuccess();
  } catch (err) {
    btn.disabled = false;
    btn.textContent = originalLabel;
    alert('문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도하시거나 전화(' + SITE.floatingCta.phone + ')로 연락 주세요.');
  }
}

function showQuickFormSuccess() {
  const q = SITE.quickForm;
  document.getElementById('qf-body').innerHTML = `
    <div class="qf-success">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
      <h3>${q.successTitle}</h3>
      <p>${q.successDesc}</p>
      <button type="button" class="btn btn-ghost" id="qf-close-btn-2">닫기</button>
    </div>
  `;
  document.getElementById('qf-close-btn-2').addEventListener('click', () => {
    document.getElementById('qf-overlay').classList.remove('is-open');
    document.body.style.overflow = '';
  });
}

/* ---------- 공통: 모바일 하단 고정 바 (전화 + 카카오톡 상담) ---------- */
function renderMobileStickyBar() {
  const f = SITE.floatingCta;
  const k = SITE.kakaoTalk;
  const bar = document.createElement('div');
  bar.className = 'mobile-sticky-bar';
  bar.innerHTML = `
    <a class="msb-btn msb-btn--ghost" href="tel:${f.phone}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      전화 걸기
    </a>
    <a class="msb-btn msb-btn--solid" href="${k.url}" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      ${k.label}
    </a>
  `;
  document.body.appendChild(bar);
}

/* ---------- 홈: 신뢰 요소 스트립 (실제 구축 실적 기관명) ---------- */
function renderTrustStrip() {
  const mount = document.getElementById('trust-strip-mount');
  if (!mount) return;
  const t = SITE.trustStrip;
  mount.innerHTML = `
    <div class="section-head" style="text-align:center; margin-left:auto; margin-right:auto;">
      <span class="kicker">${t.kicker}</span>
      <h2>${t.title}</h2>
    </div>
    <div class="trust-marquee">
      <div class="trust-track">
        ${[...t.orgs, ...t.orgs].map(o => `<span>${o}</span>`).join('')}
      </div>
    </div>
  `;
}

/* ---------- 페이지 로드 시 공통 실행 ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  renderHero();
  renderStats();
  renderBrandNotice();
  renderVideo();
  renderProductSummary();
  renderProcess();
  renderDifferentiators();
  renderTrustStrip();
  renderWhyIpecs();
  renderResourcesList();
  renderAboutIntro();
  renderHistory();
  renderAchievements();
  renderProducts();
  renderComparisonTable();
  renderContactInfo();
  renderPartnerLinks();
  renderDirections();
  renderFaq();
  renderCtaBand();

  renderNodeField('hero-node-field', { nodes: 30, seed: 11 });
  setupImageEffects();
  setupCounters();
  setupTilt();
  setupHeaderScroll();
  renderMobileStickyBar();
  renderFloatingCtaAndModal();
});
