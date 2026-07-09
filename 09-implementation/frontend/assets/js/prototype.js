// Prototype interactif Scoolize — JS volontairement simple (pas de framework),
// simule des comportements clés pour rendre la démonstration crédible en soutenance.
// Aucune donnée réelle n'est envoyée : tout est simulé en local (localStorage).

document.addEventListener('DOMContentLoaded', () => {
  initScoreGauges();
  initWeightSliders();
  initComparator();
  initMobileNav();
  initFileDrop();
  initTooltips();
});

// Anime les jauges de score circulaires (data-score="78")
function initScoreGauges() {
  document.querySelectorAll('.score-gauge').forEach((el) => {
    const target = parseInt(el.dataset.score || '0', 10);
    let current = 0;
    el.style.setProperty('--pct', 0);
    const step = () => {
      current += Math.max(1, Math.round(target / 30));
      if (current >= target) { current = target; }
      el.style.setProperty('--pct', current);
      if (current < target) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

// Curseurs de pondération (Prepare) : met à jour le libellé % et le total
function initWeightSliders() {
  const sliders = document.querySelectorAll('.weight-slider');
  if (!sliders.length) return;

  const updateTotal = () => {
    let total = 0;
    sliders.forEach((s) => { total += parseInt(s.value, 10); });
    const totalEl = document.getElementById('weight-total');
    if (totalEl) {
      totalEl.textContent = total + ' %';
      const wrap = document.getElementById('weight-total-wrap');
      if (wrap) {
        wrap.classList.toggle('badge-success', total === 100);
        wrap.classList.toggle('badge-warning', total !== 100);
      }
    }
  };

  sliders.forEach((s) => {
    const out = s.parentElement.querySelector('.range-value');
    s.addEventListener('input', () => {
      if (out) out.textContent = s.value + ' %';
      updateTotal();
    });
  });
  updateTotal();
}

// Comparateur Predict : ajouter/retirer une formation via localStorage, partagé entre pages
function initComparator() {
  const KEY = 'scoolize_comparateur';
  const getList = () => JSON.parse(localStorage.getItem(KEY) || '[]');
  const setList = (list) => localStorage.setItem(KEY, JSON.stringify(list));

  document.querySelectorAll('[data-compare-toggle]').forEach((btn) => {
    const id = btn.dataset.compareToggle;
    const sync = () => {
      const active = getList().includes(id);
      btn.classList.toggle('btn-primary', active);
      btn.classList.toggle('btn-secondary', !active);
      btn.textContent = active ? 'Ajouté au comparateur ✓' : 'Ajouter au comparateur';
    };
    btn.addEventListener('click', () => {
      let list = getList();
      if (list.includes(id)) {
        list = list.filter((x) => x !== id);
      } else {
        if (list.length >= 3) {
          alert('Vous pouvez comparer 3 formations maximum. Retirez-en une avant d\'en ajouter une nouvelle.');
          return;
        }
        list.push(id);
      }
      setList(list);
      sync();
      updateComparatorCount();
    });
    sync();
  });

  updateComparatorCount();
}

function updateComparatorCount() {
  const list = JSON.parse(localStorage.getItem('scoolize_comparateur') || '[]');
  document.querySelectorAll('[data-comparator-count]').forEach((el) => {
    el.textContent = list.length;
    el.style.display = list.length > 0 ? 'inline-flex' : 'none';
  });
}

// Navigation mobile (hamburger)
function initMobileNav() {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Simule un dépôt / import de fichier (bulletin scolaire) avec un état de progression
function initFileDrop() {
  const dropzone = document.querySelector('[data-dropzone]');
  if (!dropzone) return;
  const input = dropzone.querySelector('input[type=file]');
  const status = document.querySelector('[data-dropzone-status]');
  const cta = document.querySelector('[data-dropzone-next]');

  const simulateImport = (name) => {
    if (status) {
      status.innerHTML = `<div class="flex gap-2" style="align-items:center;">
        <div class="progress" style="flex:1;"><span style="width:0%"></span></div>
        <span class="text-sm text-muted" data-progress-label>0 %</span>
      </div>`;
      const bar = status.querySelector('.progress > span');
      const label = status.querySelector('[data-progress-label]');
      let pct = 0;
      const t = setInterval(() => {
        pct += 8;
        if (pct >= 100) { pct = 100; clearInterval(t); }
        bar.style.width = pct + '%';
        label.textContent = pct + ' %';
        if (pct === 100) {
          status.innerHTML = `<div class="alert alert-info"><svg class="icon" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg><div><strong>${name}</strong> importé et analysé avec succès. 12 matières détectées.</div></div>`;
          if (cta) cta.removeAttribute('disabled');
        }
      }, 120);
    }
  };

  dropzone.addEventListener('click', () => input && input.click());
  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragging'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragging'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragging');
    const name = e.dataTransfer.files[0]?.name || 'bulletin.pdf';
    simulateImport(name);
  });
  if (input) {
    input.addEventListener('change', () => simulateImport(input.files[0]?.name || 'bulletin.pdf'));
  }
  const demoBtn = document.querySelector('[data-dropzone-demo]');
  if (demoBtn) demoBtn.addEventListener('click', () => simulateImport('bulletin_1er_trimestre.pdf'));
}

// Infobulles lexique (langage clair)
function initTooltips() {
  document.querySelectorAll('[data-term]').forEach((el) => {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-expanded', 'false');
    el.addEventListener('click', () => toggleTooltip(el));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTooltip(el); }
    });
  });
}

function toggleTooltip(el) {
  let tip = el.querySelector('.tooltip-bubble');
  if (tip) { tip.remove(); el.setAttribute('aria-expanded', 'false'); return; }
  tip = document.createElement('span');
  tip.className = 'tooltip-bubble';
  tip.textContent = el.dataset.term;
  el.appendChild(tip);
  el.setAttribute('aria-expanded', 'true');
}
