(function () {
  var sections = Array.from(document.querySelectorAll('.spa-section'));
  if (!sections.length) return;

  // Progressive enhancement only: the document remains a normal scrollable page.
  // This file owns lightweight section navigation instead of hijacking wheel/touch/keyboard input.
  var strip = document.getElementById('left-strip');
  var labels = {
    hero: 'Overview',
    features: 'Features',
    install: 'Install',
    activity: 'Activity',
    team: 'Team',
  };

  sections.forEach(function (section) {
    section.style.position = '';
    section.style.inset = '';
    section.style.display = '';
    section.style.flexDirection = '';
    section.style.alignItems = '';
    section.style.justifyContent = '';
    section.style.overflowX = '';
    section.style.overflowY = '';
    section.style.boxSizing = '';
    section.setAttribute('tabindex', '-1');
  });

  if (!strip) return;

  var nav = document.createElement('div');
  nav.className = 'spa-section-nav';
  nav.setAttribute('aria-label', 'Page sections');

  sections.forEach(function (section) {
    var button = document.createElement('a');
    button.className = 'spa-section-nav__item';
    button.href = '#' + section.id;
    button.textContent = labels[section.id.replace(/^spa-/, '')] || section.dataset.label || section.id;
    nav.appendChild(button);
  });

  strip.appendChild(document.createElement('div')).className = 'nav-divider';
  strip.appendChild(nav);

  var links = Array.from(nav.querySelectorAll('a'));
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var link = links.find(function (item) {
        return item.getAttribute('href') === '#' + entry.target.id;
      });
      if (link) link.classList.toggle('is-active', entry.isIntersecting);
    });
  }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });

  sections.forEach(function (section) { observer.observe(section); });
})();
