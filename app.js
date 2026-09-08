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
  document.querySelector('#enter').addEventListener('click', playBookFilm);
}

function playBookFilm() {
  app.innerHTML = `
    <section class="book-film scene-enter">
      <video id="book-film-video" autoplay muted playsinline preload="auto" aria-label="Perjalanan kamera menuju buku Kisah Legenda Jawa Timur">
        <source src="/opening-book-blank-flow.mp4" type="video/mp4" />
      </video>
      <button class="back-button" data-back="opening">← Kembali</button>
    </section>`;
  const video = document.querySelector('#book-film-video');
  video.addEventListener('ended', tableOfContents);
  document.querySelector('[data-back]').addEventListener('click', opening);
}

function tableOfContents() {
  clearAncientScene();
  const makeEntries = (regions, start) => regions.map((region, offset) => {
    const index = start + offset;
    return `<button class="toc-entry" data-region="${index}" aria-label="Buka Bab ${String(index + 1).padStart(2, '0')}: ${esc(region.name)}"><span>${String(index + 1).padStart(2, '0')}</span><b>${esc(region.name)}</b><i></i><em>${String(index + 7).padStart(2, '0')}</em></button>`;
  }).join('');
  const leftEntries = makeEntries(catalogue.regions.slice(0, 15), 0);
  const rightEntries = makeEntries(catalogue.regions.slice(15, 30), 15);
  app.innerHTML = `<section class="reference-contents scene-enter"><button class="back-button" id="reader-back">← Kembali</button><div class="reference-book"><video src="/opening-book-blank-flow.mp4" autoplay muted loop playsinline preload="auto" aria-label="Buku naskah Jawa terbuka"></video><div class="book-contents-overlay" aria-label="Daftar Isi Legenda Jawa Timur"><section class="toc-page toc-page-left"><header><p>NASKAH LEGENDA</p><h2>DAFTAR ISI</h2><div>✦</div></header><nav>${leftEntries}</nav></section><section class="toc-page toc-page-right" aria-label="Daftar isi lanjutan"><header><p>JAWA TIMUR</p><h2>DAFTAR ISI</h2><div>✦</div></header><nav>${rightEntries}</nav></section></div></div></section>`;
  document.querySelector('#reader-back').addEventListener('click', playBookFilm);
  document.querySelectorAll('[data-region]').forEach(button => button.addEventListener('click', () => turnPage(() => regionPage(Number(button.dataset.region)))));
}

function regionPage(index) {
  clearAncientScene();
  const region = catalogue.regions[index];
  const legends = region.legends.map((legend, i) => `<button class="chapter-line legend-line" data-legend="${i}"><span>${String(legend.episode).padStart(2, '0')} · ${esc(legend.title)}</span><i></i><b>→</b></button>`).join('');
  readerLayout({
    back: tableOfContents,
    left: `<p class="page-kicker">BAB DAERAH</p><h2>${esc(region.name)}</h2><div class="page-rule">✦</div><p class="page-copy">Di lembar ini tersimpan ${region.legends.length} kisah dari ${esc(region.name)}. Pilih judul untuk membuka halamannya.</p><div class="page-number">${String(index + 1).padStart(2, '0')}</div>`,
    right: `<div class="contents-heading"><p>KOLEKSI KISAH</p><h2>${esc(region.name)}</h2><div class="page-rule">✦</div></div><div class="chapter-list">${legends}</div>`
  });
  document.querySelectorAll('[data-legend]').forEach(button => button.addEventListener('click', () => turnPage(() => legendCover(index, Number(button.dataset.legend)))));
}

function legendCover(regionIndex, legendIndex) {
  clearAncientScene();
  const region = catalogue.regions[regionIndex];
  const legend = region.legends[legendIndex];
  readerLayout({
    back: () => regionPage(regionIndex),
    left: `<img class="story-illustration" src="${legend.cover}" alt="Ilustrasi ${esc(legend.title)}" /><p class="illustration-caption">${esc(region.name)} · LEGENDA ${String(legend.episode).padStart(2, '0')}</p>`,
    right: `<p class="page-kicker">LEMBAR KISAH</p><h2>${esc(legend.title)}</h2><div class="page-rule">✦</div><p class="page-copy">Lembar cerita ini telah dibuka. Naskah lengkap untuk legenda ini sedang disusun pada edisi berikutnya.</p><div class="page-number">${String(legend.episode).padStart(2, '0')}</div>`
  });
}

function readerLayout({ left, right, back }) {
  app.innerHTML = `<section class="reader-stage scene-enter"><div class="reader-vignette"></div><button class="back-button" id="reader-back">← Kembali</button><div class="open-manuscript"><article class="manuscript-page page-left">${left}</article><article class="manuscript-page page-right">${right}</article><div class="turning-sheet" aria-hidden="true"></div><div class="manuscript-spine"></div></div></section>`;
  document.querySelector('#reader-back').addEventListener('click', back);
}

function turnPage(next) {
  const sheet = document.querySelector('.turning-sheet');
  if (!sheet) { next(); return; }
  sheet.classList.add('is-turning');
  setTimeout(next, 540);
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
