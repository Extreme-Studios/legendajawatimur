const app = document.querySelector('#app');
let catalogue;

const esc = (value) => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const flatLegends = () => catalogue.regions.flatMap(region => region.legends.map(legend => ({ ...legend, region })));

function opening() {
  app.innerHTML = `
    <section class="opening scene-enter">
      <div class="mist mist-one"></div><div class="mist mist-two"></div>
      <div class="opening-light"></div>
      <div class="opening-copy">
        <p class="eyebrow">SEBUAH PERJALANAN MENEMBUS WAKTU</p>
        <h1>LEGENDA<br><em>JAWA TIMUR</em></h1>
        <p class="byline">By PARFI Jawa Timur</p>
        <button class="open-portal" id="enter">Masuk ke dalam kisah <span>→</span></button>
      </div>
      <p class="sound-note">◌  Nyalakan suara untuk pengalaman penuh</p>
    </section>`;
  document.querySelector('#enter').addEventListener('click', bookCover);
}

function bookCover() {
  app.innerHTML = `
    <section class="book-stage scene-enter">
      <div class="stage-glow"></div>
      <button class="back-button" data-back="opening">← Kembali</button>
      <button class="book-object" id="open-book" aria-label="Buka buku Legenda Jawa Timur">
        <div class="book-spine"></div>
        <div class="book-front">
          <p class="book-mark">JAWA TIMUR</p>
          <p class="book-word">LEGENDA</p>
          <p class="book-title">JAWA<br>TIMUR</p>
          <div class="book-ornament">✦</div>
          <p class="book-byline">BY PARFI JAWA TIMUR</p>
        </div>
      </button>
      <p class="instruction">Klik buku untuk membuka daftar isi</p>
    </section>`;
  document.querySelector('#open-book').addEventListener('click', tableOfContents);
  bindBack();
}

function tableOfContents() {
  const regions = catalogue.regions.map((region, index) => `
    <button class="region-row" data-region="${index}">
      <span>${String(index + 1).padStart(2, '0')}</span>
      <strong>${esc(region.name)}</strong>
      <small>${region.legends.length} legenda</small><i>→</i>
    </button>`).join('');
  app.innerHTML = `
    <section class="contents scene-enter">
      <header><button class="back-button" data-back="book">← Tutup daftar isi</button><p class="eyebrow">BUKU I</p><h2>Daftar Isi</h2><p>Jelajahi cerita yang hidup dari setiap sudut Jawa Timur.</p></header>
      <div class="region-list">${regions}</div>
    </section>`;
  document.querySelectorAll('[data-region]').forEach(button => button.addEventListener('click', () => regionPage(Number(button.dataset.region))));
  bindBack();
}

function regionPage(index) {
  const region = catalogue.regions[index];
  const cards = region.legends.map((legend, i) => `
    <button class="legend-card" data-legend="${index}:${i}">
      <img src="${legend.cover}" alt="Cover ${esc(legend.title)}" loading="lazy" />
      <span class="card-wash"></span><span class="episode">${String(legend.episode).padStart(2, '0')}</span>
      <strong>${esc(legend.title)}</strong><small>Buka cover</small>
    </button>`).join('');
  app.innerHTML = `
    <section class="region-page scene-enter">
      <header class="region-header"><button class="back-button" data-back="contents">← Daftar isi</button><p class="eyebrow">BAB DAERAH</p><h2>${esc(region.name)}</h2><p>${region.legends.length} legenda untuk dijelajahi</p></header>
      <div class="cover-grid">${cards}</div>
    </section>`;
  document.querySelectorAll('[data-legend]').forEach(button => button.addEventListener('click', () => {
    const [regionIndex, legendIndex] = button.dataset.legend.split(':').map(Number);
    legendCover(regionIndex, legendIndex);
  }));
  bindBack();
}

function legendCover(regionIndex, legendIndex) {
  const region = catalogue.regions[regionIndex];
  const legend = region.legends[legendIndex];
  const previous = legendIndex > 0 ? legendIndex - 1 : null;
  const next = legendIndex < region.legends.length - 1 ? legendIndex + 1 : null;
  app.innerHTML = `
    <section class="legend-stage scene-enter">
      <button class="back-button" data-back="region">← Kembali ke ${esc(region.name)}</button>
      <div class="legend-book">
        <div class="legend-spine"></div>
        <img src="${legend.cover}" alt="Cover ${esc(legend.title)}" />
      </div>
      <div class="legend-meta"><p class="eyebrow">${esc(region.name)} · LEGENDA ${String(legend.episode).padStart(2, '0')}</p><h2>${esc(legend.title)}</h2><p>Cover legenda. Cerita lengkap akan hadir di lembar buku pada edisi berikutnya.</p></div>
      <nav class="legend-nav">${previous !== null ? `<button data-move="${previous}">← Sebelumnya</button>` : '<span></span>'}<button data-back="region">Koleksi ${esc(region.name)}</button>${next !== null ? `<button data-move="${next}">Berikutnya →</button>` : '<span></span>'}</nav>
    </section>`;
  document.querySelectorAll('[data-move]').forEach(button => button.addEventListener('click', () => legendCover(regionIndex, Number(button.dataset.move))));
  bindBack(regionIndex);
}

function bindBack(regionIndex) {
  document.querySelectorAll('[data-back]').forEach(button => button.addEventListener('click', () => {
    const where = button.dataset.back;
    if (where === 'opening') opening();
    if (where === 'book') bookCover();
    if (where === 'contents') tableOfContents();
    if (where === 'region') regionPage(regionIndex);
  }));
}

fetch('/data/legends.json').then(response => response.json()).then(data => { catalogue = data; opening(); }).catch(() => {
  app.innerHTML = '<p class="fatal">Katalog belum dapat dimuat.</p>';
});
