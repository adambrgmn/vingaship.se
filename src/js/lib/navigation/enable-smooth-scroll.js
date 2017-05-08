import raf from '../utils/raf';

const ease = t => (t < 0.5 ?
  16 * t * t * t * t * t :
  1 + (16 * (--t) * t * t * t * t));

function scrollTo(element, to, duration) {
  const ticks = 100;
  const timeout = duration / ticks;

  const startingPos = element.scrollTop;
  const diff = to - startingPos;

  const scroll = (tick = 0) => {
    if (tick >= ticks) return;
    const ticksPerc = tick / ticks;
    const easeVal = ease(ticksPerc);

    element.scrollTop = startingPos + (diff * easeVal);
    setTimeout(() => scroll(tick + 1), timeout);
  };

  raf(() => scroll());
}

const navItems = document.querySelectorAll('.js-navItem a');
navItems.forEach((item) => {
  const id = item
    .getAttribute('href')
    .replace('#', '');

  const section = document.getElementById(id);

  item.addEventListener('click', (e) => {
    e.preventDefault();
    scrollTo(document.documentElement, section.offsetTop, 600);
  });
});
