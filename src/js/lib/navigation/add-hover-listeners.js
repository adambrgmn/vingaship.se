import store from '../store';
import { actions } from '../store/reducers/navigation';
import raf from '../utils/raf';

const getDimensions = (target) => {
  const { width, left: offset } = target.getBoundingClientRect();
  return { width, offset };
};

export default () => {
  let delay;
  const navItems = document.querySelectorAll('.js-navItem');

  navItems.forEach((navItem) => {
    navItem.addEventListener('mouseenter', ({ target }) => {
      const dimensions = getDimensions(target);
      raf(() => store.dispatch(actions.updateDimensions(dimensions)));

      if (delay) {
        window.clearTimeout(delay);
        delay = undefined;
      }
    });

    navItem.addEventListener('mouseleave', () => {
      let dimensions = { width: 0, offset: 0 };
      const activeItem = store.getState().navigation.activeItem;

      if (activeItem) {
        const active = document.querySelector(`[data-anchor=${activeItem}]`);
        const { width, left: offset } = active.getBoundingClientRect();
        dimensions = { width, offset };
      }

      delay = window.setTimeout(() => {
        raf(() => store.dispatch(actions.updateDimensions(dimensions)));
      }, 200);
    });
  });
};
