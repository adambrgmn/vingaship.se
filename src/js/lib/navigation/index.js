import store from '../store';
import { actions } from '../store/reducers/navigation';
import updateNavDecoration from './update-nav-decoration';
import addHoverListeners from './add-hover-listeners';
import addScrollListeners from './add-scroll-listeners';
import './enable-smooth-scroll';

store.subscribe(updateNavDecoration);

addHoverListeners();
addScrollListeners();
addResizeListeners(); // eslint-disable-line

function addResizeListeners() {
  const val = window.innerHeight * (1 / 3);
  store.dispatch(actions.updateSentinel(val));

  window.addEventListener('resize', () => {
    const newVal = window.innerHeight * (1 / 3);
    store.dispatch(actions.updateSentinel(newVal));
  });
}
