/* GALLERIES */
var GALLERIES = {
  navstack: [
    'images/rov.gif',
    'https://m.media-amazon.com/images/I/71yrxY4KFFL._AC_SL1500_.jpg',
    'https://contents.mediadecathlon.com/p2582898/k$ce7ac14dab0c97a45fba5a22bd576e81/sq/yahboom-lidar-ros2-robot-slam-mapping-navigation-ranging-tof-ms200.jpg'
  ],
  fleet: [
    'images/rov.gif',
    'https://www.advantech.com/en/resources/case-study/~/media/C4D248BF38594DAA9C2C9A65E48AC1B5.PNG',
    'https://www.6river.com/wp-content/uploads/2021/10/Autonomous-Mobile-Robots.jpg'
  ]
};
var video_libraries = {
  inner_html: [
    '<div class="lb-video"><iframe width="504" height="399"frameborder="0" allowfullscreen=""src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7406566966297059328?compact=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>',
    '<div class="lb-video"><iframe width="504" height="399"frameborder="0" allowfullscreen=""src="https://www.youtube.com/embed/aNka-rvoDF8?si=maTWt0j3kVecvALI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>'
  ]
}

/* THUMBNAILS */
document.querySelectorAll('.thumb[data-proj]').forEach(function(t) {
  t.addEventListener('click', function(e) {
    e.stopPropagation();
    var proj = t.dataset.proj, idx = parseInt(t.dataset.i);
    document.getElementById(proj + '-main').src = GALLERIES[proj][idx];
    t.closest('.thumb-strip').querySelectorAll('.thumb').forEach(function(x){ x.classList.remove('active'); });
    t.classList.add('active');
  });
  t.addEventListener('dblclick', function(e) {
    e.stopPropagation();
    openImgLb(t.dataset.proj, parseInt(t.dataset.i));
  });
});
['navstack','fleet'].forEach(function(p) {
  var el = document.getElementById(p + '-main');
  if (el) el.addEventListener('click', function(){ openImgLb(p, 0); });
});

/* LIGHTBOX */
var lbImgs = [], lbI = 0;
function openVideoLb(caption, id) {
  document.getElementById('lb-body').innerHTML = video_libraries.inner_html[id];
  document.getElementById('lb-caption').textContent = caption;
  document.getElementById('lb-nav').style.display = 'none';
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function openImgLb(proj, idx) {
  lbImgs = GALLERIES[proj]; lbI = idx;
  renderLbImg();
  document.getElementById('lb-nav').style.display = lbImgs.length > 1 ? 'flex' : 'none';
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function renderLbImg() {
  document.getElementById('lb-body').innerHTML = '<img class="lb-img" src="' + lbImgs[lbI] + '" alt="Project image" onerror="this.src=\'https://placehold.co/900x500/111318/c8a96e?text=Image+Unavailable\'"/>';
  document.getElementById('lb-caption').textContent = 'Image ' + (lbI+1) + ' of ' + lbImgs.length + '  \u00b7  Esc to close  \u00b7  \u2190 \u2192 to navigate';
}
function lbStep(dir) { lbI = (lbI + dir + lbImgs.length) % lbImgs.length; renderLbImg(); }
function closeLb() { document.getElementById('lightbox').classList.remove('open'); document.getElementById('lb-body').innerHTML = ''; document.body.style.overflow = ''; }
function handleLbClick(e) { if (e.target === document.getElementById('lightbox')) closeLb(); }
document.addEventListener('keydown', function(e) {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') lbStep(-1);
  if (e.key === 'ArrowRight') lbStep(1);
});

/* ACHIEVEMENT SLIDER */
var curSlide = 0, slideTimer, rafId, rafStart;
function goSlide(idx) {
  document.getElementById('slide-' + curSlide).classList.remove('active');
  document.getElementById('dot-' + curSlide).classList.remove('active');
  curSlide = idx;
  document.getElementById('slide-' + curSlide).classList.add('active');
  document.getElementById('dot-' + curSlide).classList.add('active');
  startProgress();
}
function startProgress() {
  clearTimeout(slideTimer); cancelAnimationFrame(rafId);
  var bar = document.getElementById('sliderBar');
  if (!bar) return;
  bar.style.width = '0%'; rafStart = null;
  function tick(ts) {
    if (!rafStart) rafStart = ts;
    var pct = Math.min(((ts - rafStart) / 5000) * 100, 100);
    bar.style.width = pct + '%';
    if (pct < 100) rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);
  slideTimer = setTimeout(function(){ goSlide((curSlide + 1) % 2); }, 5000);
}
var sf = document.getElementById('sliderFrame');
if (sf) {
  sf.addEventListener('mouseenter', function(){ clearTimeout(slideTimer); cancelAnimationFrame(rafId); });
  sf.addEventListener('mouseleave', startProgress);
}
startProgress();

/* RESUME SKILL BARS */
var barObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.rp-bar-fill').forEach(function(bar) {
        bar.style.width = bar.getAttribute('data-w') + '%';
      });
      barObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
var rp = document.getElementById('resume-preview');
if (rp) barObs.observe(rp);

/* SCROLL REVEAL */
var revObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry, i) {
    if (entry.isIntersecting) {
      setTimeout(function(){ entry.target.classList.add('visible'); }, i * 85);
      revObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(function(el){ revObs.observe(el); });

/* ACTIVE NAV */
var navLinks = document.querySelectorAll('.nav-links a');
var navObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      navLinks.forEach(function(a){
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('section[id]').forEach(function(s){ navObs.observe(s); });

/* BACK TO TOP */
var backBtn = document.getElementById('backTop');
window.addEventListener('scroll', function(){ backBtn.classList.toggle('visible', window.scrollY > 500); });

function submitForm(e) {
  e.preventDefault();
  var btn = document.getElementById('form-btn');
  var msg = document.getElementById('form-msg');

  // grab values
  var fields = e.target.querySelectorAll('input, textarea');
  var name    = fields[0].value;
  var email   = fields[1].value;
  var subject = fields[2].value;
  var message = fields[3].value;

  btn.textContent = 'Sending…'; btn.style.opacity = '.6';

  fetch('https://script.google.com/macros/s/AKfycbzXySULBXvxQScuhViIZbD8NOWACI5KBEF2YrAME81vDEQONY-QbYxmeGU6zL9OcOMfVA/exec', {
    method: 'POST',
    mode: 'no-cors',                     // required for Apps Script
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, subject, message })
  })
  .then(function() {
    btn.textContent = 'Send Message →'; btn.style.opacity = '';
    msg.classList.add('show');
    e.target.reset();
    setTimeout(function(){ msg.classList.remove('show'); }, 4000);
  })
  .catch(function() {
    btn.textContent = 'Send Message →'; btn.style.opacity = '';
    msg.textContent = '✗ Failed — try emailing directly';
    msg.style.color = '#e07070';
    msg.classList.add('show');
  });
}