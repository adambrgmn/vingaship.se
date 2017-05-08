import createStore from './createStore';
import navigation from './reducers/navigation';

const combineReducers = (reducers) => {
  const reducersKeys = Object.keys(reducers);

  return (state = {}, action) => (
    reducersKeys.reduce((acc, key) => Object.assign({}, acc, {
      [key]: reducers[key](state[key], action),
    }), state)
  );
};

const rootReducer = combineReducers({ navigation });
const store = createStore(rootReducer);
export default store;
