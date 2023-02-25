export interface ColumnItem<T> {
  index: number;
  item: T;
}

interface ColumnInfo<T> {
  key: string;
  width: string;
  data: ColumnItem<T>[];
}

export const calculateColumns = <T>(data: T[], column: number): ColumnInfo<T>[] => {
  const widthRate = `${(100 / column).toFixed(3)}%`;
  const total = data.length;
  const result = new Array<ColumnInfo<T>>(column);
  const more = Math.floor(total / column);
  const rare = total % column;
  for (let i = 0; i < column; i++) {
    const itemNum = i < rare ? more + 1 : more;
    const oneColumn = new Array<ColumnItem<T>>(itemNum);
    for (let j = i, k = 0; j < total; j += column, k++) {
      oneColumn[k] = {
        index: j,
        item: data[j] as T
      };
    }
    result[i] = { key: `column-${i}`, data: oneColumn, width: widthRate };
  }
  return result;
};
