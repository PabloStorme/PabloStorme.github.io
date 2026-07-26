/* Pipeline sequencer + portrait fallback. No dependencies. */

(function () {
  'use strict';

  /* ── the hero pipeline ─────────────────────────────────── */

  var pipe = document.getElementById('pipe');
  if (pipe) {
    var stages = Array.prototype.slice.call(pipe.querySelectorAll('[data-stage]'));
    var wires  = Array.prototype.slice.call(pipe.querySelectorAll('[data-wire]'));
    var out    = pipe.querySelector('[data-out]');
    var btn    = pipe.querySelector('[data-run]');
    var label  = pipe.querySelector('[data-run-label]');

    var DWELL = 420;   // time a stage holds "processing"
    var TRAVEL = 540;  // must match the .wire transition in styles.css
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var running = false;

    function wait(ms) {
      return new Promise(function (resolve) { setTimeout(resolve, ms); });
    }

    function reset() {
      stages.forEach(function (s) { s.classList.remove('is-active', 'is-done'); });
      wires.forEach(function (w) { w.classList.remove('is-live'); });
      out.classList.remove('is-shown');
    }

    function finish() {
      stages.forEach(function (s) { s.classList.add('is-done'); });
      wires.forEach(function (w) { w.classList.add('is-live'); });
      out.classList.add('is-shown');
    }

    async function run() {
      if (running) return;
      running = true;
      btn.disabled = true;
      label.textContent = 'running';
      reset();

      if (reduced) {
        finish();
      } else {
        await wait(140);
        for (var i = 0; i < stages.length; i++) {
          stages[i].classList.add('is-active');
          await wait(DWELL);
          stages[i].classList.remove('is-active');
          stages[i].classList.add('is-done');
          if (wires[i]) {
            wires[i].classList.add('is-live');
            await wait(TRAVEL);
          }
        }
        out.classList.add('is-shown');
      }

      label.textContent = 'run again';
      btn.disabled = false;
      running = false;
    }

    btn.addEventListener('click', run);
    setTimeout(run, 500);
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
