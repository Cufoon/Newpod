import { useContext } from 'react';
import { GlobalDispatchContext, GlobalStateContext } from './context';
import type { GlobalState } from './interface';

export { Action } from './action';

export const useDispatch = () => {
  return useContext(GlobalDispatchContext);
};

export interface SelectorType<T> {
  (store: GlobalState): T;
}

export const useSelector = <T = any>(selector: SelectorType<T>) => {
  const store = useContext(GlobalStateContext);
  return selector(store);
};
