const createStore = (reducer, initialState = {}) => {
  let currentState = initialState;
  let currentListeners = [];
  let nextListeners = currentListeners;
  let isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  function getState() { return currentState; }

  function subscribe(listener) {
    let isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return () => {
      if (!isSubscribed) return;

      isSubscribed = false;
      ensureCanMutateNextListeners();
      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  function dispatch(action) {
    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');
    }

    if (isDispatching) throw new Error('Reducers may not dispatch actions.');

    try {
      isDispatching = true;
      currentState = reducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    const listeners = nextListeners;
    currentListeners = nextListeners;

    listeners.forEach(listener => listener(currentState));

    return action;
  }

  dispatch({ type: '@@INIT' });

  return {
    dispatch,
    subscribe,
    getState,
  };
};

export default createStore;
