// Melodia — interações da landing page
(() => {
  // ---------- Navbar: aparência ao rolar ----------
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Menu mobile ----------
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const setMenu = (open) => {
    menu.classList.toggle('hidden', !open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menuIcon.className = open ? 'fa-solid fa-xmark text-lg' : 'fa-solid fa-bars text-lg';
    if (open) navbar.classList.add('scrolled'); else onScroll();
  };
  menuBtn.addEventListener('click', () => setMenu(menu.classList.contains('hidden')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // ---------- Animação de entrada ----------
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // ---------- Player simulado ----------
  const playBtn = document.getElementById('play-btn');
  const playIcon = document.getElementById('play-icon');
  const progress = document.getElementById('progress');
  const timeNow = document.getElementById('time-now');
  const timeTotal = document.getElementById('time-total');
  const titleEl = document.getElementById('track-title');
  const artistEl = document.getElementById('track-artist');
  const tracks = [...document.querySelectorAll('.track')];
  let current = 0, elapsed = 0, timer = null;

  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const length = () => Number(tracks[current].dataset.length);
  const isPlaying = () => playIcon.classList.contains('fa-pause');

  const render = () => {
    progress.value = (elapsed / length()) * 100;
    timeNow.textContent = fmt(elapsed);
  };
  const setPlaying = (on) => {
    playIcon.className = on ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    playBtn.setAttribute('aria-label', on ? 'Pausar' : 'Tocar');
    clearInterval(timer);
    if (on) timer = setInterval(() => { elapsed += 1; if (elapsed >= length()) select(current + 1, true); else render(); }, 1000);
  };
  const select = (i, autoplay) => {
    current = (i + tracks.length) % tracks.length;
    elapsed = 0;
    const t = tracks[current].dataset;
    titleEl.textContent = t.title; artistEl.textContent = t.artist; timeTotal.textContent = fmt(length());
    tracks.forEach((b, idx) => b.classList.toggle('active', idx === current));
    render();
    setPlaying(autoplay);
  };

  playBtn.addEventListener('click', () => setPlaying(!isPlaying()));
  document.getElementById('next-btn').addEventListener('click', () => select(current + 1, isPlaying()));
  document.getElementById('prev-btn').addEventListener('click', () => select(current - 1, isPlaying()));
  tracks.forEach((b, i) => b.addEventListener('click', () => select(i, true)));
  progress.addEventListener('input', () => { elapsed = (progress.value / 100) * length(); render(); });
  select(0, false);

  // ---------- Formulário ----------
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const rules = {
    name: (v) => (v.trim().length < 3 ? 'Informe seu nome com pelo menos 3 letras.' : ''),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Digite um e-mail válido, como nome@exemplo.com.'),
    message: (v) => (v.trim().length < 10 ? 'Escreva uma mensagem com pelo menos 10 caracteres.' : ''),
  };
  const validate = (id) => {
    const input = form.elements[id];
    const msg = rules[id](input.value);
    document.getElementById(`${id}-error`).textContent = msg;
    input.classList.toggle('invalid', Boolean(msg));
    input.setAttribute('aria-invalid', String(Boolean(msg)));
    return !msg;
  };
  Object.keys(rules).forEach((id) => form.elements[id].addEventListener('blur', () => validate(id)));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = Object.keys(rules).map(validate).every(Boolean);
    success.classList.toggle('hidden', !valid);
    if (valid) form.reset(); // simulação de envio (sem backend)
    else form.querySelector('.invalid').focus();
  });
})();