const app = document.querySelector('#app');
let catalogue;
let disposeAncientScene = () => {};

function clearAncientScene() {
  disposeAncientScene();
  disposeAncientScene = () => {};
}

const esc = (value) => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const flatLegends = () => catalogue.regions.flatMap(region => region.legends.map(legend => ({ ...legend, region })));

function opening() {
  clearAncientScene();
  app.innerHTML = `
    <section class="opening scene-enter">
      <video class="opening-video" autoplay muted loop playsinline preload="auto" aria-hidden="true">
        <source src="/opening-legend-jatim.mp4" type="video/mp4" />
      </video>
      <div class="mist mist-one"></div><div class="mist mist-two"></div>
      <div class="opening-light"></div>
      <div class="opening-copy">
        <p class="eyebrow">SEBUAH PERJALANAN MENEMBUS WAKTU</p>
        <h1>LEGENDA<br><em>JAWA TIMUR</em></h1>
        <p class="byline">Written By WIRALINA (PARFI JATIM)</p>
        <button class="open-portal" id="enter">Masuk ke dalam kisah <span>→</span></button>
      </div>
      <p class="sound-note">This Site Powered By <a href="https://extremestudiosai.com" target="_blank" rel="noopener noreferrer">Extreme Studios AI</a></p>
    </section>`;
  document.querySelector('#enter').addEventListener('click', ritualStill);
}

function ritualStill() {
  clearAncientScene();
  app.innerHTML = `
    <section class="ritual-still scene-enter">
      <img src="/ritual-book-hero.png" alt="Buku kuno Kisah Legenda Jawa Timur di atas meja ritual Jawa" />
      <div class="ritual-still-shade"></div>
      <button class="back-button" data-back="opening">← Kembali</button>
      <button class="ritual-start" id="start-book-film"><span>✦</span> Sentuh buku untuk membuka kisah</button>
    </section>`;
  document.querySelector('#start-book-film').addEventListener('click', playBookFilm);
  bindBack();
}

function playBookFilm() {
  app.innerHTML = `
    <section class="book-film scene-enter">
      <video id="book-film-video" autoplay muted playsinline preload="auto" aria-label="Perjalanan kamera menuju buku Kisah Legenda Jawa Timur">
        <source src="/opening-book-flow.mp4" type="video/mp4" />
      </video>
      <button class="back-button" data-back="book">← Kembali ke buku</button>
      <p class="film-note">Kisah Legenda Jawa Timur</p>
    </section>`;
  const video = document.querySelector('#book-film-video');
  video.addEventListener('ended', tableOfContents);
  bindBack();
}

function tableOfContents() {
  clearAncientScene();
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
  clearAncientScene();
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
  clearAncientScene();
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
    if (where === 'book') ritualStill();
    if (where === 'contents') tableOfContents();
    if (where === 'region') regionPage(regionIndex);
  }));
}

fetch('/data/legends.json').then(response => response.json()).then(data => { catalogue = data; opening(); }).catch(() => {
  app.innerHTML = '<p class="fatal">Katalog belum dapat dimuat.</p>';
});

function initCinematicWebGL(scene) {
  const canvas = scene.querySelector('.cinematic-webgl');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
  if (!gl) return;
  const vertex = 'attribute vec2 p; void main(){gl_Position=vec4(p,0.,1.);}';
  const fragment = 'precision mediump float; uniform vec2 resolution; uniform float time; uniform vec2 pointer; float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);} float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);} void main(){vec2 uv=gl_FragCoord.xy/resolution.xy;uv.x*=resolution.x/resolution.y;vec2 m=pointer;m.x*=resolution.x/resolution.y;float fog=n(uv*3.2+vec2(time*.024,-time*.016))*.55+n(uv*7.-time*.035)*.24;float glow=.075/(length(uv-m)*length(uv-m)+.18);float spark=step(.994,h(floor(uv*vec2(100.,60.))+floor(time*1.2)))*(.5+.5*sin(time*3.+uv.y*42.));vec3 c=vec3(.28,.19,.08)*fog+vec3(.79,.54,.20)*(glow*.28+spark*.95);gl_FragColor=vec4(c,min(.76,fog*.24+glow*.18+spark));}';
  const compile = (type, source) => { const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader); return shader; };
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(program); gl.useProgram(program);
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
  const p = gl.getAttribLocation(program, 'p'); gl.enableVertexAttribArray(p); gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0);
  const resolution = gl.getUniformLocation(program, 'resolution'), time = gl.getUniformLocation(program, 'time'), pointer = gl.getUniformLocation(program, 'pointer');
  let mouse = [.52,.48], target = [...mouse];
  const resize = () => { const dpr = Math.min(devicePixelRatio, 2); canvas.width = innerWidth*dpr; canvas.height = innerHeight*dpr; gl.viewport(0,0,canvas.width,canvas.height); };
  scene.addEventListener('pointermove', event => { const rect = canvas.getBoundingClientRect(); target = [(event.clientX-rect.left)/rect.width, 1-(event.clientY-rect.top)/rect.height]; });
  window.addEventListener('resize', resize); resize();
  const render = stamp => { if (!scene.isConnected) return; mouse[0]+=(target[0]-mouse[0])*.04; mouse[1]+=(target[1]-mouse[1])*.04; gl.uniform2f(resolution,canvas.width,canvas.height); gl.uniform1f(time,stamp*.001); gl.uniform2f(pointer,mouse[0],mouse[1]); gl.drawArrays(gl.TRIANGLES,0,3); requestAnimationFrame(render); };
  requestAnimationFrame(render);
}
