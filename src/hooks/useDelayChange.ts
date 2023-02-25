import { useCallback, useEffect, useRef, useState } from 'react';

interface Params<T> {
  data?: T[] | [T];
  default?: number;
  delay?: number;
}

const delayChange = <T = boolean>(
  params?: Params<T>
): [T, (value?: number | boolean) => void, (value?: number | boolean) => void] => {
  const [dataList] = useState<T[]>(params?.data ?? ([false, true] as unknown as T[]));
  const [defaultIndex] = useState<number>(params?.default ?? 0);
  const [delay] = useState<number>(params?.delay ?? 200);
  const [value, setValue] = useState<T>(dataList[defaultIndex] as T);
  const timer = useRef<any>();

  const delaySet = (value: T) => {
    timer.current && clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setValue(value);
    }, delay);
  };

  const setDelay = useCallback(
    (index?: number | boolean) => {
      if (index === undefined || index === null) {
        index = 1;
      } else if (index === false) {
        index = 0;
      } else if (index === true) {
        index = 1;
      }
      if (index >= 0) {
        delaySet(dataList[index] as T);
      }
    },
    [dataList]
  );

  const set = useCallback(
    (index?: number | boolean) => {
      if (index === undefined || index === null) {
        index = 0;
      } else if (index === false) {
        index = 0;
      } else if (index === true) {
        index = 1;
      }
      if (index >= 0) {
        timer.current && clearTimeout(timer.current);
        setValue(dataList[index] as T);
      }
    },
    [dataList]
  );

  useEffect(() => {
    return () => {
      timer.current && clearTimeout(timer.current);
    };
  }, []);

  return [value, setDelay, set];
};

export default delayChange;
