import React, { ReactElement, useMemo, useState } from 'react';

interface WithChildren {
  children: ReactElement<any, any> | null;
}

const useCheckBeforeRender: () => [
  (fn: () => Promise<boolean>) => Promise<void>,
  React.FunctionComponent<WithChildren>
] = () => {
  const [init, setInit] = useState<boolean>(false);

  const doCheck = async (fn: () => Promise<boolean>) => {
    if (await fn()) {
      setInit(true);
    }
  };

  const wrapper: React.FC<WithChildren> = useMemo(() => {
    console.log('wrapper changed', init);
    if (!init) {
      return function Hide() {
        console.log('hide-wrapper rendered');
        return null;
      };
    }
    return function Wrapper({ children }) {
      console.log('display-wrapper rendered');
      return children;
    };
  }, [init]);

  return [doCheck, wrapper];
};

export default useCheckBeforeRender;
