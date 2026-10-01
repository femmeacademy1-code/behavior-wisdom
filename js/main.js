/* חכמת ההתנהגות — scroll-reveal animations. The page is fully readable without this file. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !Element.prototype.animate || !('IntersectionObserver' in window)) return;

  var sel = '[data-screen-label] h1, [data-screen-label] h2, [data-screen-label] > div > span:first-child, [data-screen-label] .card, [data-screen-label] figure, [data-screen-label] video, [data-screen-label] blockquote, [data-screen-label] tbody tr, [data-screen-label] p, [data-screen-label] .tag, [data-screen-label] iframe';
  var seen = [];
  var els = Array.prototype.filter.call(document.querySelectorAll(sel), function (el) {
    for (var i = 0; i < seen.length; i++) if (seen[i].contains(el)) return false;
    seen.push(el);
    return true;
  });
  var anims = new Map();

  els.forEach(function (el) {
    var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return els.indexOf(c) !== -1; });
    var i = Math.min(sibs.indexOf(el), 6);
    var fromSide = el.matches('figure, video, iframe');
    var a = el.animate([
      { opacity: 0, transform: fromSide ? 'translateX(-40px) scale(0.96)' : 'translateY(36px)' },
      { opacity: 1, transform: 'none' }
    ], { duration: 900, delay: i * 90, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'both' });
    a.pause();
    anims.set(el, a);
  });

  // Pencil doodles between sections: wipe in from the side.
  document.querySelectorAll('[data-doodle] img').forEach(function (el) {
    var base = el.style.transform;
    var a = el.animate([
      { opacity: 0, transform: base + ' scale(0.6)', clipPath: 'inset(0 100% 0 0)' },
      { opacity: 0.9, transform: base, clipPath: 'inset(0 0 0 0)' }
    ], { duration: 1100, easing: 'cubic-bezier(.3,.8,.2,1)', fill: 'both' });
    a.pause();
    anims.set(el, a);
    els.push(el);
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        var a = anims.get(en.target);
        if (a) a.play();
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

/* Podcast: swap the thumbnail for the YouTube player (privacy-enhanced mode) on click. */
document.querySelectorAll('.yt-embed').forEach(function (box) {
  var btn = box.querySelector('.yt-facade');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + box.getAttribute('data-yt') + '?autoplay=1&rel=0';
    f.title = 'הפודקאסט של חכמת ההתנהגות';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    f.allowFullscreen = true;
    btn.replaceWith(f);
  });
});

/* Mobile menu: toggle open/closed, close after choosing a link or pressing Escape. */
(function () {
  var nav = document.querySelector('.site-nav');
  var btn = nav && nav.querySelector('.nav-toggle');
  if (!btn) return;
  var set = function (open) {
    nav.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');
  };
  btn.addEventListener('click', function () { set(!nav.classList.contains('is-open')); });
  nav.querySelectorAll('.nav-menu a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  document.addEventListener('click', function (e) { if (!nav.contains(e.target)) set(false); });
})();
