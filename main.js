/* ─────────────────────────────────────────────────────
   66-Planet · main.js  v6
   ───────────────────────────────────────────────────── */
const grid = document.getElementById('grid');
const cards = Array.from(grid.querySelectorAll('.recipe-card'));
let currentPlanet = 'all';
let currentTerm   = null;   // 目前選中的節氣

/* ══════════════════════════════════════════════
   Planet filter
══════════════════════════════════════════════ */
function applyFilters() {
  let v = 0;
  cards.forEach(c => {
    const mp = currentPlanet === 'all' || c.dataset.planet === currentPlanet;
    const mt = !currentTerm || c.dataset.term === currentTerm;
    c.classList.toggle('hidden', !(mp && mt));
    if (mp && mt) v++;
  });
  document.getElementById('count').textContent = v;
  document.getElementById('empty').classList.toggle('visible', v === 0);
  currentPage = 1;
  paginate();
}

document.querySelectorAll('.filter-btn[data-type="planet"]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn[data-type="planet"]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentPlanet = btn.dataset.val;
    applyFilters();
  });
});

/* ══════════════════════════════════════════════
   Sort — 用 data-date ISO 精確排序
══════════════════════════════════════════════ */
function sortCards(by) {
  document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('sort-' + by).classList.add('active');

  const sorted = [...cards].sort((a, b) => {
    if (by === 'rating') {
      const diff = parseInt(b.dataset.stars) - parseInt(a.dataset.stars);
      if (diff !== 0) return diff;
      return b.dataset.date.localeCompare(a.dataset.date);
    }
    if (by === 'oldest') return a.dataset.date.localeCompare(b.dataset.date);
    return b.dataset.date.localeCompare(a.dataset.date);
  });

  const empty = document.getElementById('empty');
  sorted.forEach(c => grid.insertBefore(c, empty));
  currentPage = 1;
  paginate();
}

/* ══════════════════════════════════════════════
   View Recipe 展開
══════════════════════════════════════════════ */
function toggleExpand(btn) {
  const panel = btn.nextElementSibling;
  const exp = btn.getAttribute('aria-expanded') === 'true';
  panel.hidden = exp;
  btn.setAttribute('aria-expanded', String(!exp));
  btn.querySelector('.vrl').textContent = exp ? 'View Recipe' : 'Close';
}

/* ══════════════════════════════════════════════
   ✦ Lore 星球誌機關
══════════════════════════════════════════════ */
function toggleLore(btn) {
  const card = btn.closest('.recipe-card');
  const panel = card.querySelector('.lore-panel');
  if (!panel) return;
  const exp = btn.getAttribute('aria-expanded') === 'true';

  // 關閉所有其他
  document.querySelectorAll('.lore-btn[aria-expanded="true"]').forEach(b => {
    if (b !== btn) {
      b.setAttribute('aria-expanded', 'false');
      b.closest('.recipe-card')?.querySelector('.lore-panel')?.setAttribute('hidden', '');
    }
  });

  if (exp) {
    panel.setAttribute('hidden', '');
    btn.setAttribute('aria-expanded', 'false');
  } else {
    panel.removeAttribute('hidden');
    btn.setAttribute('aria-expanded', 'true');
  }
}

// 點擊卡片外部關閉 lore
document.addEventListener('click', (e) => {
  if (!e.target.closest('.recipe-card')) {
    document.querySelectorAll('.lore-btn[aria-expanded="true"]').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.closest('.recipe-card')?.querySelector('.lore-panel')?.setAttribute('hidden', '');
    });
  }
});

/* ══════════════════════════════════════════════
   節氣帶 — 作為 sorting/filter
══════════════════════════════════════════════ */
const SOLAR_TERMS = [
  { name:'小寒', en:'Minor Cold',       date:'1/5-7',   season:'winter', desc:'寒氣漸盛，滴水成冰',   color:'#546E7A' },
  { name:'大寒', en:'Major Cold',       date:'1/20-21', season:'winter', desc:'寒至極點，待春來臨',   color:'#455A64' },
  { name:'立春', en:'Start of Spring',  date:'2/4-5',   season:'spring', desc:'東風解凍，萬物始生',   color:'#C8E6C9' },
  { name:'雨水', en:'Rain Water',       date:'2/19-20', season:'spring', desc:'冰雪消融，春雨潤物',   color:'#B3E5FC' },
  { name:'驚蟄', en:'Awakening',        date:'3/6-7',   season:'spring', desc:'春雷始鳴，萬物復甦',   color:'#DCEDC8' },
  { name:'春分', en:'Spring Equinox',   date:'3/21-22', season:'spring', desc:'晝夜平分，陰陽調和',   color:'#A5D6A7' },
  { name:'清明', en:'Pure Brightness',  date:'4/5-6',   season:'spring', desc:'天清地明，草木繁茂',   color:'#81C784' },
  { name:'穀雨', en:'Grain Rain',       date:'4/20-21', season:'spring', desc:'雨生百穀，春茶最盛',   color:'#66BB6A' },
  { name:'立夏', en:'Start of Summer',  date:'5/6-7',   season:'summer', desc:'夏季始立，萬物繁盛',   color:'#FFF59D' },
  { name:'小滿', en:'Grain Buds',       date:'5/21-22', season:'summer', desc:'麥穗漸滿，夏熟將至',   color:'#FFEE58' },
  { name:'芒種', en:'Grain in Ear',     date:'6/6-7',   season:'summer', desc:'麥穗成熟，稀秧插種',   color:'#FFD54F' },
  { name:'夏至', en:'Summer Solstice',  date:'6/21-22', season:'summer', desc:'日長之至，陰氣始生',   color:'#FFCA28' },
  { name:'小暑', en:'Minor Heat',       date:'7/7-8',   season:'summer', desc:'暑氣漸盛，荷花初開',   color:'#FFC107' },
  { name:'大暑', en:'Major Heat',       date:'7/23-24', season:'summer', desc:'暑熱至極，萬物蒸騰',   color:'#FFB300' },
  { name:'立秋', en:'Start of Autumn',  date:'8/8-9',   season:'autumn', desc:'秋氣始至，暑去涼來',   color:'#FFCC80' },
  { name:'處暑', en:'End of Heat',      date:'8/23-24', season:'autumn', desc:'暑氣漸消，秋意漸濃',   color:'#FFB74D' },
  { name:'白露', en:'White Dew',        date:'9/8-9',   season:'autumn', desc:'露凝而白，天氣轉涼',   color:'#FFA726' },
  { name:'秋分', en:'Autumn Equinox',   date:'9/23-24', season:'autumn', desc:'晝夜平分，秋收時節',   color:'#FF9800' },
  { name:'寒露', en:'Cold Dew',         date:'10/8-9',  season:'autumn', desc:'露氣寒涼，菊花盛開',   color:'#FB8C00' },
  { name:'霜降', en:'Frost Descent',    date:'10/23-24',season:'autumn', desc:'初霜降臨，秋末冬初',   color:'#F57C00' },
  { name:'立冬', en:'Start of Winter',  date:'11/7-8',  season:'winter', desc:'冬季始立，萬物收藏',   color:'#B0BEC5' },
  { name:'小雪', en:'Minor Snow',       date:'11/22-23',season:'winter', desc:'初雪微降，天寒地凍',   color:'#90A4AE' },
  { name:'大雪', en:'Major Snow',       date:'12/7-8',  season:'winter', desc:'大雪紛飛，萬物蟄伏',   color:'#78909C' },
  { name:'冬至', en:'Winter Solstice',  date:'12/22-23',season:'winter', desc:'日短之至，陽氣始生',   color:'#607D8B' },
];

function getCurrentTermName() {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const idx = ((m - 1) * 2 + (d >= 15 ? 1 : 0)) % 24;
  return SOLAR_TERMS[idx].name;
}

function buildSolarBar() {
  const track = document.getElementById('solarTrack');
  if (!track) return;

  const currentName = getCurrentTermName();

  // tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'solar-tooltip';
  tooltip.innerHTML = '<div class="tt-name"></div><div class="tt-desc"></div><div class="tt-count"></div>';
  document.body.appendChild(tooltip);

  // 計算各節氣的料理數量
  const termCounts = {};
  cards.forEach(c => {
    const t = c.dataset.term;
    if (t && t !== 'none') termCounts[t] = (termCounts[t] || 0) + 1;
  });

  SOLAR_TERMS.forEach((t) => {
    const el = document.createElement('div');
    const isCurrent = t.name === currentName;
    const count = termCounts[t.name] || 0;
    el.className = 'solar-term' + (isCurrent ? ' current-term' : '') + (count === 0 ? ' no-entries' : '');
    el.style.background = t.color;
    const enHtml = t.en.includes(' ') ? t.en.replace(' ', '<br>') : t.en;
    el.innerHTML = `<span class="solar-zh">${t.name}</span><span class="solar-en">${enHtml}</span>`;
    el.dataset.term = t.name;

    // tooltip
    const positionTooltip = (e) => {
      const margin = 8;
      const tw = tooltip.offsetWidth;
      const th = tooltip.offsetHeight;
      let left = e.clientX + 12;
      let top  = e.clientY - 58;
      if (left + tw > window.innerWidth - margin) left = e.clientX - tw - 12;
      if (left < margin) left = margin;
      if (top < margin) top = margin;
      if (top + th > window.innerHeight - margin) top = window.innerHeight - th - margin;
      tooltip.style.left = left + 'px';
      tooltip.style.top  = top + 'px';
    };
    el.addEventListener('mouseenter', (e) => {
      tooltip.querySelector('.tt-name').textContent = `${t.name} · ${t.en}`;
      tooltip.querySelector('.tt-desc').textContent = t.desc;
      tooltip.querySelector('.tt-count').textContent = count ? `${count} 道料理` : '尚無料理';
      tooltip.classList.add('visible');
      positionTooltip(e);
    });
    el.addEventListener('mousemove', positionTooltip);
    el.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));

    // 點擊 → 節氣 sorting（切換）
    el.addEventListener('click', () => {
      const isActive = el.classList.contains('active');

      // 清除所有 active
      document.querySelectorAll('.solar-term').forEach(s => s.classList.remove('active'));

      if (isActive) {
        // 取消篩選，恢復全部
        currentTerm = null;
        applyFilters();
      } else {
        el.classList.add('active');
        currentTerm = t.name;
        // 按日期舊→新排列，讓節氣內的料理有時序感
        sortCards('oldest');
        applyFilters();
      }
    });

    track.appendChild(el);
  });
}

// 初始化節氣帶
buildSolarBar();

/* ══════════════════════════════════════════════
   分頁 — 只在手機（≤640px）啟用，桌機一次顯示全部
══════════════════════════════════════════════ */
const PAGE_SIZE = 8;
let currentPage = 1;
const isMobile = () => window.matchMedia('(max-width:640px)').matches;

function paginate() {
  const pag = document.getElementById('pagination');
  if (!isMobile()) {
    document.querySelectorAll('.recipe-card.page-hidden').forEach(c => c.classList.remove('page-hidden'));
    if (pag) pag.style.display = 'none';
    return;
  }
  // 用即時 DOM 順序（反映 sortCards 排序後的結果），不能用外層 cards 陣列（sort 後已過期）
  const domOrder = Array.from(grid.querySelectorAll('.recipe-card'));
  const visible = domOrder.filter(c => !c.classList.contains('hidden'));
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;
  visible.forEach((c, i) => {
    const onPage = i >= (currentPage - 1) * PAGE_SIZE && i < currentPage * PAGE_SIZE;
    c.classList.toggle('page-hidden', !onPage);
  });
  if (pag) {
    pag.style.display = totalPages > 1 ? 'flex' : 'none';
    document.getElementById('pagePrev').disabled = currentPage <= 1;
    document.getElementById('pageNext').disabled = currentPage >= totalPages;

    const numsEl = document.getElementById('pageNumbers');
    numsEl.innerHTML = '';
    const WINDOW = 5;
    let start = Math.max(1, currentPage - Math.floor(WINDOW / 2));
    let end = Math.min(totalPages, start + WINDOW - 1);
    start = Math.max(1, end - WINDOW + 1);
    for (let n = start; n <= end; n++) {
      const b = document.createElement('button');
      b.className = 'page-num' + (n === currentPage ? ' active' : '');
      b.textContent = n;
      b.addEventListener('click', () => goToPage(n));
      numsEl.appendChild(b);
    }
  }
}
function goToPage(n) {
  currentPage = n;
  paginate();
  grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    paginate();
    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
function nextPage() {
  currentPage++;
  paginate();
  grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.addEventListener('resize', () => paginate());
paginate();

/* ══════════════════════════════════════════════
   Reset — 清除所有篩選與排序
══════════════════════════════════════════════ */
function resetAll() {
  // 清除星球篩選
  currentPlanet = 'all';
  document.querySelectorAll('.filter-btn[data-type="planet"]').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-btn[data-val="all"]').classList.add('active');

  // 清除節氣篩選
  currentTerm = null;
  document.querySelectorAll('.solar-term').forEach(s => s.classList.remove('active'));

  // 恢復 Newest 排序（default）
  sortCards('newest');

  // 套用篩選（全部顯示）
  applyFilters();

  // reset 按鈕自己轉一圈的動畫效果
  const btn = document.querySelector('.reset-btn');
  if (btn) {
    btn.style.transition = 'transform 0.45s ease, color 0.2s, border-color 0.2s';
    btn.style.transform = 'rotate(-360deg)';
    setTimeout(() => { btn.style.transform = ''; }, 450);
  }
}
