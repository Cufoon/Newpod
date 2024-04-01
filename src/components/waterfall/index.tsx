import { JSXElementConstructor, ReactElement } from 'react';
import styles from './index.module.scss';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { calculateColumns } from './util';
import Column from './column';

interface Props<T> {
  dataSource: T[];
  render: (item: T, index: number) => ReactNode;
}

function WaterFall<T>({
  dataSource,
  render
}: Props<T>): ReactElement<
  unknown,
  string | JSXElementConstructor<unknown>
> | null {
  const [screenWidth, setScreenWidth] = useState(0);
  const resizeDebounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const column = useMemo(() => {
    if (screenWidth < 678) {
      return 1;
    }
    if (screenWidth < 950) {
      return 2;
    }
    if (screenWidth < 1300) {
      return 3;
    }
    if (screenWidth < 1780) {
      return 4;
    }
    if (screenWidth < 2780) {
      return 5;
    }
    if (screenWidth < 3500) {
      return 6;
    }
    return 7;
  }, [screenWidth]);

  const onScreenResize = (e: UIEvent) => {
    if (e.target !== null) {
      resizeDebounceRef.current && clearTimeout(resizeDebounceRef.current);
      const target = e.target as Window;
      const w = target.innerWidth;
      resizeDebounceRef.current = setTimeout(() => {
        setScreenWidth(w);
      }, 200);
    }
  };

  useEffect(() => {
    const w = window.innerWidth;
    setScreenWidth(w);
    window.addEventListener<'resize'>('resize', onScreenResize);
  }, []);

  const dataFormatted = useMemo(() => {
    return calculateColumns(dataSource, column);
  }, [dataSource, column]);

  return (
    <div className={styles.container}>
      {dataFormatted.map((item) => {
        return (
          <Column
            key={item.key}
            width={item.width}
            listData={item.data}
            render={render}
          />
        );
      })}
    </div>
  );
}

export default WaterFall;
