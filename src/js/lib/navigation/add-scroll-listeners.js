import store from '../store';
import { actions } from '../store/reducers/navigation';
import raf from '../utils/raf';

export default () => {
  const anchors = [...document.querySelectorAll('.js-scrollAnchor')];
  const navItems = [...document.querySelectorAll('.js-navItem')].map((item) => {
    const anchor = item.dataset.anchor;
    const { width, left: offset } = item.getBoundingClientRect();
    return { anchor, width, offset };
  });

  const ioOpts = {
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0.1,
  };

  const ioCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > ioOpts.threshold) {
        const anchor = entry.target.id;
        const correspondingNavItem = navItems.find(i => i.anchor === anchor);

        raf(() => store.dispatch(actions.updateActiveItem(correspondingNavItem.anchor)));
      } else if (
        (entry.target.id === 'om-oss' || entry.target.id === 'about-us') &&
        entry.rootBounds.top < entry.boundingClientRect.top
      ) {
        raf(() => store.dispatch(actions.updateActiveItem(null)));
      }
    });
  };

  const io = new window.IntersectionObserver(ioCallback, ioOpts);

  anchors.forEach(anchor => io.observe(anchor));
};
