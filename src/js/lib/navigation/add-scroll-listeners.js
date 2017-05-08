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

  let lastScrollPos = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (Math.abs(lastScrollPos - window.scrollY) < 10) return;
    lastScrollPos = window.scrollY;

    if (!ticking) {
      raf(() => {
        ticking = false;

        const closestToSentinel = anchors
          .map(a => ({
            distance: a.getBoundingClientRect().top - store.getState().navigation.sentinel,
            id: a.id,
          }))
          .sort((a, b) => {
            if (a.distance < 0 && b.distance >= 0) return -1;
            if (a.distance >= 0 && b.distance < 0) return 1;
            return (Math.abs(0 - a.distance) - Math.abs(0 - b.distance));
          })[0];

        const correspondingNavItem = navItems.find(item => (
          item.anchor === closestToSentinel.id
        ));

        if (!correspondingNavItem) {
          store.dispatch(actions.updateDimensions({ width: 0, offset: 0 }));
          store.dispatch(actions.updateActiveItem(null));
          return;
        }

        store.dispatch(actions.updateDimensions(correspondingNavItem));
        store.dispatch(actions.updateActiveItem(correspondingNavItem.anchor));
      });
    }

    ticking = true;
  });
};
