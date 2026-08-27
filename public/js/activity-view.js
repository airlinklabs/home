(function () {
  function timeLabel(value) {
    var time = Date.parse(value || '');
    if (!Number.isFinite(time)) return '';
    var seconds = Math.max(0, Math.floor((Date.now() - time) / 1000));
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    return Math.floor(seconds / 86400) + 'd ago';
  }

  function enhance() {
    document.querySelectorAll('.commit-row').forEach(function (row) {
      if (row.dataset.activityEnhanced) return;
      try {
        var data = JSON.parse(row.dataset.commit || '{}');
        var meta = document.createElement('span');
        meta.className = 'activity-meta';
        meta.textContent = (data.repo === 'panel' ? 'Panel' : 'Daemon') + ' · ' + timeLabel(data.date);
        meta.title = data.date || '';
        row.appendChild(meta);
        row.dataset.activityEnhanced = '1';
      } catch (_) {}
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', enhance, { once: true });
  else enhance();
})();
