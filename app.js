const app = document.querySelector('#app');
const gendingAudio = document.querySelector('#gending-audio');
const gendingToggle = document.querySelector('#gending-toggle');
let catalogue;
let disposeAncientScene = () => {};

gendingAudio.volume = .38;
function updateGendingControl() {
  const playing = !gendingAudio.paused && !gendingAudio.muted;
  gendingToggle.textContent = playing ? '♫' : '♪';
  gendingToggle.setAttribute('aria-pressed', String(playing));
  gendingToggle.setAttribute('aria-label', playing ? 'Matikan musik gamelan Jawa' : 'Nyalakan musik gamelan Jawa');
}
function startGending() {
  gendingAudio.muted = false;
  gendingAudio.play().then(updateGendingControl).catch(updateGendingControl);
}
gendingToggle.addEventListener('click', event => {
  event.stopPropagation();
  if (gendingAudio.paused || gendingAudio.muted) startGending();
  else { gendingAudio.muted = true; updateGendingControl(); }
});
document.addEventListener('pointerdown', startGending, { once: true, capture: true });

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
  video.addEventListener('ended', () => {
    video.classList.add('film-fade-out');
    setTimeout(tableOfContents, 440);
  });
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
  app.innerHTML = `<section class="reference-contents scene-enter"><button class="back-button" id="reader-back">← Kembali</button><div class="reference-book"><img src="/contents-book-blank-v2.png" alt="Buku naskah Jawa terbuka dengan halaman kosong" /><div class="book-contents-overlay" aria-label="Daftar Isi Legenda Jawa Timur"><section class="toc-page toc-page-left"><header><p>NASKAH LEGENDA</p><h2>DAFTAR ISI</h2><div>✦</div></header><nav aria-label="Daftar daerah 1 sampai 15">${leftEntries}</nav></section><section class="toc-page toc-page-right" aria-label="Daftar isi lanjutan"><header><p>JAWA TIMUR</p><h2>LANJUTAN</h2><div>✦</div></header><nav aria-label="Daftar daerah 16 sampai 30">${rightEntries}</nav></section></div></div></section>`;
  document.querySelector('#reader-back').addEventListener('click', playBookFilm);
  document.querySelectorAll('[data-region]').forEach(button => button.addEventListener('click', () => turnPage(() => regionPage(Number(button.dataset.region)))));
}

function regionPage(index) {
  clearAncientScene();
  const region = catalogue.regions[index];
  const midpoint = Math.ceil(region.legends.length / 2);
  const makeEntries = (legends, offset) => legends.map((legend, localIndex) => {
    const legendIndex = offset + localIndex;
    return `<button class="toc-entry region-entry" data-legend="${legendIndex}" aria-label="Buka kisah ${esc(legend.title)}"><span>${String(legend.episode).padStart(2, '0')}</span><b>${esc(legend.title)}</b><i></i><em>→</em></button>`;
  }).join('');
  const leftEntries = makeEntries(region.legends.slice(0, midpoint), 0);
  const rightEntries = makeEntries(region.legends.slice(midpoint), midpoint);
  app.innerHTML = `<section class="reference-contents region-contents scene-enter"><button class="back-button" id="reader-back">← Kembali</button><div class="reference-book"><img src="/contents-book-blank-v2.png" alt="Buku naskah Jawa terbuka untuk ${esc(region.name)}" /><div class="book-contents-overlay" aria-label="Daftar kisah ${esc(region.name)}"><section class="toc-page toc-page-left"><header><p>BAB DAERAH</p><h2>${esc(region.name)}</h2><div>✦</div></header><nav aria-label="Kisah ${esc(region.name)} bagian pertama">${leftEntries}</nav></section><section class="toc-page toc-page-right" aria-label="Kisah lanjutan ${esc(region.name)}"><header><p>${region.legends.length} KISAH LEGENDA</p><h2>LANJUTAN</h2><div>✦</div></header><nav aria-label="Kisah ${esc(region.name)} bagian lanjutan">${rightEntries}</nav></section></div></div></section>`;
  document.querySelector('#reader-back').addEventListener('click', tableOfContents);
  document.querySelectorAll('[data-legend]').forEach(button => button.addEventListener('click', () => turnPage(() => legendCover(index, Number(button.dataset.legend)))));
}

function legendCover(regionIndex, legendIndex) {
  clearAncientScene();
  const region = catalogue.regions[regionIndex];
  const legend = region.legends[legendIndex];
  app.innerHTML = `<section class="legend-showcase scene-enter"><img class="legend-ritual-table" src="/ritual-book-hero.png" alt="Meja ritual Jawa dengan buku kuno" /><div class="legend-showcase-shade"></div><button class="back-button" id="reader-back">← Kembali</button><div class="legend-volume"><div class="legend-volume-spine"></div><img class="legend-volume-cover" src="${legend.cover}" alt="Cover ${esc(legend.title)}" /></div><div class="legend-showcase-title"><p>${esc(region.name)} · LEGENDA ${String(legend.episode).padStart(2, '0')}</p><h2>${esc(legend.title)}</h2><div>✦</div><small>Cover kisah</small></div></section>`;
  initCoverParallax(app.querySelector('.legend-showcase'));
  document.querySelector('#reader-back').addEventListener('click', () => regionPage(regionIndex));
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

function initLegendParallax(scene) {
  if (!scene || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = scene.querySelector('.legend-webgl');
  const mistLayer = scene.querySelector('.touch-mist-layer');
  const book = scene.querySelector('.legend-volume');
  const title = scene.querySelector('.legend-showcase-title');
  const gl = canvas?.getContext('webgl', { alpha: true, antialias: false });
  let pointer = [0, 0], target = [0, 0], frame;
  const onMove = event => {
    const rect = scene.getBoundingClientRect();
    target = [((event.clientX - rect.left) / rect.width - .5) * 2, ((event.clientY - rect.top) / rect.height - .5) * 2];
  };
  const releaseMist = event => {
    const rect = scene.getBoundingClientRect();
    const x = `${((event.clientX - rect.left) / rect.width) * 100}%`;
    const y = `${((event.clientY - rect.top) / rect.height) * 100}%`;
    [-48, -20, 11, 37].forEach((angle, index) => {
      const mist = document.createElement('i');
      mist.className = 'touch-wisp';
      mist.style.left = x; mist.style.top = y;
      mist.style.setProperty('--angle', `${angle}deg`);
      mist.style.setProperty('--drift-x', `${(index - 1.5) * 18}px`);
      mist.style.setProperty('--delay', `${index * 70}ms`);
      mistLayer.append(mist);
      mist.addEventListener('animationend', () => mist.remove(), { once: true });
    });
  };
  scene.addEventListener('pointermove', onMove, { passive: true });
  scene.addEventListener('pointerleave', () => { target = [0, 0]; }, { passive: true });
  scene.addEventListener('pointerdown', releaseMist, { passive: true });
  if (gl) {
    const vertexSource = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fragmentSource = 'precision mediump float;uniform vec2 r;uniform float t;uniform vec2 m;float n(vec2 p){return sin(p.x)*sin(p.y);}void main(){vec2 u=gl_FragCoord.xy/r;u.x*=r.x/r.y;vec2 q=u*3.+vec2(t*.035,-t*.02);float fog=smoothstep(.16,.82,n(q+vec2(sin(t*.08),cos(t*.06))));float halo=1.-smoothstep(.04,.75,length(u-vec2(.48,.48)-m*.055));vec3 smoke=vec3(.62,.63,.6);gl_FragColor=vec4(smoke,(fog*.004+halo*.006)*(1.-length(u-vec2(.5))*.62));}';
    const compile = (type, source) => { const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader); return shader; };
    const program = gl.createProgram(); gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource)); gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource)); gl.linkProgram(program); gl.useProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'p'); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, 'r'), time = gl.getUniformLocation(program, 't'), mouse = gl.getUniformLocation(program, 'm');
    const resize = () => { const dpr = Math.min(devicePixelRatio, 1.5); canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; gl.viewport(0, 0, canvas.width, canvas.height); };
    addEventListener('resize', resize); resize();
    disposeAncientScene = () => { cancelAnimationFrame(frame); removeEventListener('resize', resize); scene.removeEventListener('pointermove', onMove); scene.removeEventListener('pointerdown', releaseMist); gl.getExtension('WEBGL_lose_context')?.loseContext(); };
    const render = stamp => { if (!scene.isConnected) return; pointer[0] += (target[0] - pointer[0]) * .055; pointer[1] += (target[1] - pointer[1]) * .055; const driftX = Math.sin(stamp * .00031) * .7, driftY = Math.cos(stamp * .00023) * .5; book.style.transform = `perspective(1450px) rotateY(${-15 + pointer[0] * 5 + driftX}deg) rotateX(${pointer[1] * -3 + driftY}deg) rotateZ(${1.2 + pointer[0] * .8 + driftX * .15}deg) translate(${pointer[0] * 10}px,${pointer[1] * 7}px)`; title.style.transform = `translate(${pointer[0] * -12 + driftX * -2}px,${pointer[1] * -7 + driftY * -2}px)`; gl.uniform2f(resolution, canvas.width, canvas.height); gl.uniform1f(time, stamp * .001); gl.uniform2f(mouse, pointer[0], pointer[1]); gl.drawArrays(gl.TRIANGLES, 0, 3); frame = requestAnimationFrame(render); };
    frame = requestAnimationFrame(render);
  } else {
    const animate = stamp => { pointer[0] += (target[0] - pointer[0]) * .055; pointer[1] += (target[1] - pointer[1]) * .055; const driftX = Math.sin(stamp * .00031) * .7, driftY = Math.cos(stamp * .00023) * .5; book.style.transform = `perspective(1450px) rotateY(${-15 + pointer[0] * 5 + driftX}deg) rotateX(${pointer[1] * -3 + driftY}deg) rotateZ(${1.2 + pointer[0] * .8 + driftX * .15}deg)`; title.style.transform = `translate(${pointer[0] * -12 + driftX * -2}px,${pointer[1] * -7 + driftY * -2}px)`; frame = requestAnimationFrame(animate); }; frame = requestAnimationFrame(animate); disposeAncientScene = () => { cancelAnimationFrame(frame); scene.removeEventListener('pointermove', onMove); scene.removeEventListener('pointerdown', releaseMist); };
  }
}

function initCoverParallax(scene) {
  if (!scene || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const book = scene.querySelector('.legend-volume');
  const title = scene.querySelector('.legend-showcase-title');
  let pointer = [0, 0];
  let target = [0, 0];
  let frame;

  const onMove = event => {
    const rect = scene.getBoundingClientRect();
    target = [
      ((event.clientX - rect.left) / rect.width - .5) * 2,
      ((event.clientY - rect.top) / rect.height - .5) * 2
    ];
  };
  const onLeave = () => { target = [0, 0]; };
  scene.addEventListener('pointermove', onMove, { passive: true });
  scene.addEventListener('pointerleave', onLeave, { passive: true });

  const animate = stamp => {
    if (!scene.isConnected) return;
    pointer[0] += (target[0] - pointer[0]) * .055;
    pointer[1] += (target[1] - pointer[1]) * .055;
    const driftX = Math.sin(stamp * .00031) * .7;
    const driftY = Math.cos(stamp * .00023) * .5;
    book.style.transform = `perspective(1450px) rotateY(${-15 + pointer[0] * 5 + driftX}deg) rotateX(${pointer[1] * -3 + driftY}deg) rotateZ(${1.2 + pointer[0] * .8 + driftX * .15}deg) translate(${pointer[0] * 10}px,${pointer[1] * 7}px)`;
    title.style.transform = `translate(${pointer[0] * -12 + driftX * -2}px,${pointer[1] * -7 + driftY * -2}px)`;
    frame = requestAnimationFrame(animate);
  };
  frame = requestAnimationFrame(animate);
  disposeAncientScene = () => {
    cancelAnimationFrame(frame);
    scene.removeEventListener('pointermove', onMove);
    scene.removeEventListener('pointerleave', onLeave);
  };
}
