import store from '../store';

export default () => {
  const { navigation } = store.getState();
  const { hash } = navigation;
  window.location.hash = hash || '';
};
