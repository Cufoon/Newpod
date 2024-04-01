import { ReactNode } from 'react';
import type { ColumnItem } from './util';
import styles from './column.module.scss';

interface Props<T> {
  width: string;
  listData: ColumnItem<T>[];
  render: (item: T, index: number) => ReactNode;
}

type ColumnComponent = <T = any>(props: Props<T>) => JSX.Element;

const Column: ColumnComponent = ({ listData, render, width }) => {
  return (
    <div className={styles.column} style={{ width: width }}>
      {listData.map((item) => {
        return render(item.item, item.index);
      })}
    </div>
  );
};

export default Column;
