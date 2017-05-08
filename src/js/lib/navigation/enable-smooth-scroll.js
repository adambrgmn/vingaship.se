import raf from '../utils/raf';

const DURATION = 500 / 60;

const scrollToTarget = (target) => {
  const { top: targetY } = target.getBoundingClientRect();
  const windowY = window.scrollY || document.documentElement.scrollTop;
  const distance = targetY - windowY;
  const steps = distance / DURATION;

  const scrollLoop = (distanceTraveled = 0, count = 0) => {
    if (distanceTraveled >= Math.abs(distance)) return;

    window.scrollTo(0, windowY + (steps * count));
    setTimeout(() => {
      scrollLoop(distanceTraveled + steps, count + 1);
    }, 20);
  };

  raf(() => scrollLoop());
};

window.scrollToTarget = scrollToTarget;
