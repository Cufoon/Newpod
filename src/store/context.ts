import { createContext } from 'react';
import { initialState } from './action';
import type { GlobalState, DispatchType } from './interface';

const notRealized = (action: any) => {
  console.log('your action is', action);
  console.log('dispatch is not set!');
  console.log('state is not changed!');
};

export const GlobalStateContext = createContext<GlobalState>(initialState);
export const GlobalDispatchContext = createContext<DispatchType>(notRealized);
