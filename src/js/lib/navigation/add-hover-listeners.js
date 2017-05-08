import store from '../store';
import { actions } from '../store/reducers/navigation';
import raf from '../utils/raf';

const getDimensions = (target) => {
  const { width, left: offset } = target.getBoundingClientRect();
  return { width, offset };
};

export default () => {
  let delay;
  const navItems = [...document.querySelectorAll('.js-navItem')];

  navItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      if (delay) {
        clearTimeout(delay);
        delay = undefined;
      }

      raf(() => store.dispatch(actions.updateHoverItem(item.dataset.anchor)));
    });

    item.addEventListener('mouseleave', () => {
      delay = setTimeout(() => {
        raf(() => store.dispatch(actions.updateHoverItem(null)));
      }, 200);
    });
  });
};
