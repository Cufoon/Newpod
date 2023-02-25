import { useReducer } from 'react';
import { actionsGet, actionsSet, initialState } from './action';
import type { ReducerType, PureStateUpdater } from './interface';

const pureStateUpdater: PureStateUpdater = (state, type, payload?) => {
  const setHandler = actionsSet[type];
  if (setHandler) {
    return setHandler(state, payload as never);
  }
  console.log('[error] set function for this action type is not found, state is not changed!');
  return state;
};

const reducer: ReducerType = (state, action) => {
  if (typeof action.process === 'function') {
    const getHandler = actionsGet[action.type];
    if (getHandler) {
      let preState;
      if ('payload' in action) {
        preState = action.payload;
      } else {
        preState = getHandler(state);
      }
      const payload = action.process(preState, ...(action.param || []));
      return pureStateUpdater(state, action.type, payload);
    }
    console.log('[error] get function for this action type is not found, state is not changed!');
    return state;
  }
  return pureStateUpdater(state, action.type, action.payload);
};

export const useStore = () => {
  return useReducer(reducer, initialState);
};
