import React, { type PropsWithChildren } from 'react';
import { useStore } from './store';
import { GlobalStateContext, GlobalDispatchContext } from './context';
import type { DispatchType } from './interface';

const GlobalStateComponent: React.FC<PropsWithChildren> = ({ children }) => {
  const [store, dispatch] = useStore();
  console.log('react loaded');

  return (
    <GlobalDispatchContext.Provider value={dispatch as DispatchType}>
      <GlobalStateContext.Provider value={store}>
        {children}
      </GlobalStateContext.Provider>
    </GlobalDispatchContext.Provider>
  );
};

export default GlobalStateComponent;
