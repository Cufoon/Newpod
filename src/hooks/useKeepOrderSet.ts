import { useRef, useState } from 'react';

const useKeepOrderSet = <T>(): [
  T[],
  boolean,
  {
    exist: (v: T) => boolean;
    insert: (v: T) => void;
    delete: (v: T) => void;
    clear: () => void;
  }
] => {
  const [isMultiMode, setIsMultiMode] = useState(false);
  const arrRef = useRef<T[]>([]);

  const clear = () => {
    arrRef.current = [];
    setIsMultiMode(false);
  };

  const exist = (v: T): boolean => {
    if (arrRef.current.length === 0) {
      return false;
    }
    let start = 0;
    let end = arrRef.current.length - 1;
    let middle = Math.floor((start + end) / 2);
    while (start <= end) {
      if (v === (arrRef.current[middle] as T)) {
        return true;
      } else if (v > (arrRef.current[middle] as T)) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
      middle = Math.floor((start + end) / 2);
    }
    return false;
  };

  const insert = (v: T): void => {
    if (arrRef.current.length === 0) {
      arrRef.current.push(v);
      setIsMultiMode(arrRef.current.length > 0);
      console.log('insert', v, arrRef.current);
      return;
    }
    let start = 0;
    let end = arrRef.current.length - 1;
    let middle = Math.floor((start + end) / 2);
    while (start <= end) {
      if (v === (arrRef.current[middle] as T)) {
        return;
      } else if (v > (arrRef.current[middle] as T)) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
      middle = Math.floor((start + end) / 2);
    }
    arrRef.current.splice(start, 0, v);
    setIsMultiMode(arrRef.current.length > 0);
    console.log('insert', v, arrRef.current);
  };

  const deleteOne = (v: T) => {
    if (arrRef.current.length === 0) {
      return;
    }
    let start = 0;
    let end = arrRef.current.length - 1;
    let middle = Math.floor((start + end) / 2);
    while (start <= middle) {
      if (v === (arrRef.current[middle] as T)) {
        arrRef.current.splice(middle, 1);
        setIsMultiMode(arrRef.current.length > 0);
        console.log('delete', v, arrRef.current);
        return;
      } else if (v > (arrRef.current[middle] as T)) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
      middle = Math.floor((start + end) / 2);
    }
  };

  return [
    arrRef.current,
    isMultiMode,
    { exist, insert, delete: deleteOne, clear }
  ];
};

export default useKeepOrderSet;
