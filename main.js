/* Word-level text reveal + portrait fallback. No dependencies. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── split [data-reveal] text into word spans ───────────── */
  // ponytail: assumes plain text inside. Wrap markup in a child element if
  // you ever need a link in one of these, or it gets flattened.

  function split(el, cls) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    return words.map(function (w, i) {
      var span = document.createElement('span');
      span.className = 'word ' + cls;
      span.textContent = w;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      return span;
    });
  }

  var onLoad = [];   // hero: staggered fade-in
  var onScroll = []; // prose: brightens as it crosses the viewport

  Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]'), function (el) {
    if (el.dataset.reveal === 'load') {
      onLoad.push(split(el, 'word--in'));
    } else {
      onScroll.push({ el: el, words: split(el, 'word--dim') });
    }
  });

  /* ── hero ───────────────────────────────────────────────── */

  onLoad.forEach(function (words) {
    words.forEach(function (w, i) {
      if (reduced) { w.classList.add('is-on'); return; }
      setTimeout(function () { w.classList.add('is-on'); }, 120 + i * 45);
    });
  });

  /* ── scroll-driven brightening ──────────────────────────── */

  if (onScroll.length) {
    if (reduced) {
      onScroll.forEach(function (b) {
        b.words.forEach(function (w) { w.classList.add('is-on'); });
      });
    } else {
      var queued = false;

      var update = function () {
        var vh = window.innerHeight;
        var start = vh * 0.85;   // first word lights up here
        var end = vh * 0.35;     // last word lights up here
        // the closing block sits at the page bottom, so scrolling can never
        // lift it to `end` — finish every block once there's nowhere left to go
        var atBottom =
          window.scrollY >= document.documentElement.scrollHeight - vh - 2;
        onScroll.forEach(function (b) {
          var top = b.el.getBoundingClientRect().top;
          var p = atBottom ? 1 : (start - top) / (start - end);
          var lit = Math.round(Math.min(Math.max(p, 0), 1) * b.words.length);
          b.words.forEach(function (w, i) {
            w.classList.toggle('is-on', i < lit);
          });
        });
      };

      var schedule = function () {
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () { queued = false; update(); });
      };

      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      update();
    }
  }

  /* ── portrait: show a hint until the photo is dropped in ── */

  var img = document.querySelector('[data-portrait-img]');
  if (img) {
    var markEmpty = function () {
      var frame = img.closest('[data-portrait]');
      if (frame) frame.classList.add('is-empty');
    };
    img.addEventListener('error', markEmpty);
    // the error may already have fired before this script ran
    if (img.complete && img.naturalWidth === 0) markEmpty();
  }
})();
