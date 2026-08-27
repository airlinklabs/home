(function () {
  var path = window.location.pathname.replace(/\/$/, '');
  document.querySelectorAll('nav a[href]').forEach(function (link) {
    try {
      var target = new URL(link.href, window.location.href).pathname.replace(/\/$/, '');
      if (target === path) {
        link.setAttribute('aria-current', 'page');
        link.classList.add('nav-current');
      }
    } catch (_) {}
  });
})();
