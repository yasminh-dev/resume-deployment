(function () {
  'use strict';

  var track = document.getElementById('kaiju-track');
  if (!track) return;

  var mobileQuery = window.matchMedia('(max-width: 768px)');
  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mascot = document.querySelector('.kaiju-mascot');
  var dots = Array.prototype.slice.call(document.querySelectorAll('.scene-dots .dot'));
  var scenes = Array.prototype.slice.call(track.querySelectorAll('.scene'));

  function isEnhanced() {
    return !mobileQuery.matches && !reducedMotionQuery.matches && typeof IntersectionObserver === 'function';
  }

  // Wheel -> horizontal scroll translation (desktop, motion-enabled only).
  track.addEventListener('wheel', function (e) {
    if (!isEnhanced()) return;
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // let native horizontal gestures pass through untouched
    e.preventDefault();
    track.scrollLeft += e.deltaY;
  }, { passive: false });

  // Keyboard navigation between scenes.
  function currentSceneIndex() {
    var maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) return 0;
    var ratio = track.scrollLeft / maxScroll;
    return Math.round(ratio * (scenes.length - 1));
  }

  function scrollToScene(index) {
    var target = scenes[Math.max(0, Math.min(scenes.length - 1, index))];
    if (target) {
      target.scrollIntoView({ behavior: isEnhanced() ? 'smooth' : 'auto', inline: 'start', block: 'nearest' });
    }
  }

  document.addEventListener('keydown', function (e) {
    if (!isEnhanced()) return;
    var idx = currentSceneIndex();
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      scrollToScene(idx + 1);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      scrollToScene(idx - 1);
      e.preventDefault();
    } else if (e.key === 'Home') {
      scrollToScene(0);
      e.preventDefault();
    } else if (e.key === 'End') {
      scrollToScene(scenes.length - 1);
      e.preventDefault();
    }
  });

  // Dot pagination: click to jump, IntersectionObserver keeps the active dot in sync.
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function (e) {
      e.preventDefault();
      scrollToScene(i);
    });
  });

  if (typeof IntersectionObserver === 'function') {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          var idx = scenes.indexOf(entry.target);
          dots.forEach(function (dot, i) {
            if (i === idx) {
              dot.setAttribute('aria-current', 'true');
            } else {
              dot.removeAttribute('aria-current');
            }
          });
        }
      });
    }, { root: mobileQuery.matches ? null : track, threshold: [0.5] });
    scenes.forEach(function (scene) { observer.observe(scene); });
  }

  // rAF-driven scroll progress custom property, consumed by parallax layers in CSS,
  // plus the mascot's horizontal position across the whole journey.
  var ticking = false;
  function updateProgress() {
    ticking = false;
    if (!isEnhanced()) return;
    var maxScroll = track.scrollWidth - track.clientWidth;
    var progress = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
    document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
    if (mascot) {
      var maxX = window.innerWidth - mascot.offsetWidth;
      mascot.style.transform = 'translateX(' + (progress * maxX).toFixed(1) + 'px)';
    }
  }

  track.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    }
  }, { passive: true });

  updateProgress();
})();
