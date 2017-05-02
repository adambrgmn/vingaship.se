import createStore from '../store';
import reducer from './reducer';
import setDimensions from './setDimensions';

const store = createStore(reducer);
store.subscribe(setDimensions);

const UPDATE_DIMENSIONS = 'UPDATE_DIMENSIONS';
const updateDimensionsAction = ({ offset, width }) => ({ type: UPDATE_DIMENSIONS, offset, width });

const navItems = document.querySelectorAll('.js-navItem');
const activeItem = document.querySelector('.js-navItem-active') || navItems[0];
let waitingFn;

navItems.forEach((navItem) => {
  navItem.addEventListener('mouseenter', ({ target }) => {
    const { left: offset, width } = target.getBoundingClientRect();
    store.dispatch(updateDimensionsAction({ width, offset }));
    if (waitingFn) {
      window.clearTimeout(waitingFn);
      waitingFn = undefined;
    }
  });

  navItem.addEventListener('mouseleave', () => {
    let dimensions = { width: 0, offset: 0 };

    if (activeItem) {
      const { left: offset, width } = activeItem.getBoundingClientRect();
      dimensions = { width, offset };
    }

    waitingFn = window.setTimeout(() => {
      store.dispatch(updateDimensionsAction(dimensions));
    }, 300);
  });
});
