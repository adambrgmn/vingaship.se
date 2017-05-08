import store from '../store';

export default () => {
  const { navigation } = store.getState();
  const { offset, width } = navigation;

  document.documentElement.style.setProperty(
    '--js-navigation-decoration-offset',
    `${offset}px`,
  );

  document.documentElement.style.setProperty(
    '--js-navigation-decoration-width',
    `${width}px`,
  );
};
