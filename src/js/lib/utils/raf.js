const fallback = fn => window.setTimeout(fn, 0);

export default window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  fallback;
