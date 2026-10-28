/* 墨家网站 · 交互脚本（全站）
   单文件原生 JS，无框架、无依赖。 */
(function () {
  /* —— 阅读进度线（朱砂细线，随滚动生长） —— */
  var bar = document.createElement('div');
  bar.className = 'progress';
  document.body.appendChild(bar);

  function updateProgress() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var ratio = max > 0 ? (window.pageYOffset || doc.scrollTop) / max : 0;
    if (ratio < 0) ratio = 0;
    if (ratio > 1) ratio = 1;
    bar.style.transform = 'scaleX(' + ratio + ')';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  /* —— 学派源流：横向时间轴（仅当该页存在时） —— */
  var timeline = document.getElementById('timeline');
  if (!timeline) return;

  var isDown = false;
  var startX = 0;
  var startScroll = 0;

  timeline.addEventListener('mousedown', function (e) {
    isDown = true;
    startX = e.pageX;
    startScroll = timeline.scrollLeft;
    timeline.classList.add('dragging');
  });

  window.addEventListener('mousemove', function (e) {
    if (!isDown) return;
    var dx = e.pageX - startX;
    timeline.scrollLeft = startScroll - dx;
  });

  window.addEventListener('mouseup', function () {
    isDown = false;
    timeline.classList.remove('dragging');
  });

  timeline.addEventListener('dragstart', function (e) {
    e.preventDefault();
  });

  var nodes = timeline.querySelectorAll('.tl-node');

  if (!('IntersectionObserver' in window)) {
    timeline.classList.add('in');
    nodes.forEach(function (n) { n.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var idx = Array.prototype.indexOf.call(nodes, entry.target);
      entry.target.style.transitionDelay = (idx * 90) + 'ms';
      entry.target.classList.add('in');
      timeline.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

  nodes.forEach(function (n) { io.observe(n); });
})();
