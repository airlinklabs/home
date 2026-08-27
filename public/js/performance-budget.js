(function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var connection = navigator.connection;
  var constrained = connection && (connection.saveData || /(^|-)2g$/.test(connection.effectiveType || ''));

  if (reducedMotion || constrained) {
    document.documentElement.setAttribute('data-low-motion', 'true');
  }

  // Decorative canvases should not keep consuming frames when they leave the viewport.
  document.querySelectorAll('canvas[data-decorative]').forEach(function (canvas) {
    if (reducedMotion || constrained) canvas.setAttribute('data-paused', 'true');
  });
})();
