export default function reducer(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_DIMENSIONS':
      return Object.assign({}, state, {
        width: action.width,
        offset: action.offset,
      });
    default: return state;
  }
}
