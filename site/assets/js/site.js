(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) root.classList.add('reduce');

  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Header shadow once the page scrolls
  var top = document.querySelector('.top');
  var onScroll = function () { if (top) top.classList.toggle('scrolled', window.scrollY > 10); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Track call and text taps (GA4 + Google Ads via gtag, GTM via dataLayer)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="tel:"], a[href^="sms:"], a[href^="mailto:"]');
    if (!a) return;
    var h = a.getAttribute('href');
    var kind = h.indexOf('tel:') === 0 ? 'phone_call_click' : (h.indexOf('sms:') === 0 ? 'text_message_click' : 'email_click');
    var where = a.getAttribute('data-where') || 'page';
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: kind, link_location: where, page_path: location.pathname });
    if (typeof window.gtag === 'function') window.gtag('event', kind, { link_location: where });
  });

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('video[data-src]').forEach(function (v) { v.src = v.dataset.src; v.controls = true; });
    document.querySelectorAll('.map-wrap').forEach(function (m) { m.classList.add('in'); });
    return;
  }

  // Scroll reveal
  if (!reduce) {
    var sel = '.sec-head, .svc, .steps li, .split > *, .about > *, .sign, .faq, .value, .hauls li, .zips li, .badges, .reels .reel, .states li, .related li, .posts > *, .band .wrap > *';
    var els = document.querySelectorAll(sel);
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el, i) {
      if (el.closest('.hero')) return;
      el.classList.add('rv');
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(sib, 5) * 70 + 'ms';
      ro.observe(el);
    });
  }

  // Map routes draw in when visible
  var mo = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); mo.unobserve(en.target); } });
  }, { threshold: 0.3 });
  document.querySelectorAll('.map-wrap').forEach(function (m) { reduce ? m.classList.add('in') : mo.observe(m); });

  // Count-up numbers
  var co = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target, end = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length;
      co.unobserve(el);
      if (reduce) return;
      var t0 = null;
      var step = function (t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / 1100), v = end * (1 - Math.pow(1 - p, 3));
        el.textContent = v.toFixed(dec);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) { co.observe(el); });

  // Play the short job clips only while on screen
  var vids = document.querySelectorAll('video[data-autoplay]');
  var vo = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var v = en.target;
      if (en.isIntersecting) {
        if (!v.src && v.dataset.src) v.src = v.dataset.src;
        if (reduce) { v.controls = true; return; }
        var p = v.play(); if (p && p.catch) p.catch(function () {});
      } else { v.pause(); }
    });
  }, { threshold: 0.35 });
  vids.forEach(function (v) { vo.observe(v); });
})();
