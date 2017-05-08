import store from '../store';

const navItems = [...document.querySelectorAll('.js-navItem')].map((item) => {
  const anchor = item.dataset.anchor;
  const { width, left: offset } = item.getBoundingClientRect();
  return { anchor, width, offset };
});

export default () => {
  const { navigation } = store.getState();
  const { activeItem, hoverItem } = navigation;

  let dimensions = { width: 0, offset: 0 };

  if (hoverItem) {
    dimensions = navItems.find(i => i.anchor === hoverItem);
  } else if (activeItem) {
    dimensions = navItems.find(i => i.anchor === activeItem);
  }

  document.documentElement.style.setProperty(
    '--js-navigation-decoration-offset',
    `${dimensions.offset}px`,
  );

  document.documentElement.style.setProperty(
    '--js-navigation-decoration-width',
    `${dimensions.width}px`,
  );
};
