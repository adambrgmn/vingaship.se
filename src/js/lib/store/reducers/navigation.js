const initialState = {
  offset: 0,
  width: 0,
  activeItem: null,
  sentinel: 0,
};

export const types = {
  UPDATE_DIMENSIONS: 'UPDATE_DIMENSIONS',
  UPDATE_ACTIVE_ITEM: 'UPDATE_ACTIVE_ITEM',
  UPDATE_SENTINEL: 'UPDATE_SENTINEL',
};

export const actions = {
  updateDimensions: ({ width, offset }) => ({ type: types.UPDATE_DIMENSIONS, width, offset }),
  updateActiveItem: activeItem => ({ type: types.UPDATE_ACTIVE_ITEM, activeItem }),
  updateSentinel: val => ({ type: types.UPDATE_SENTINEL, val }),
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_DIMENSIONS:
      return Object.assign({}, state, {
        width: action.width,
        offset: action.offset,
      });

    case types.UPDATE_ACTIVE_ITEM:
      return Object.assign({}, state, {
        activeItem: action.activeItem,
      });

    case types.UPDATE_SENTINEL:
      return Object.assign({}, state, {
        sentinel: action.val,
      });
    default: return state;
  }
}
