import { Dnspod } from '$service/dnspod';

const commonSorterType = (a: Dnspod.RecordListItem, b: Dnspod.RecordListItem) => {
  if (a.Type === 'NS') {
    if (b.Type === 'NS') return commonSorterRest(a, b);
    return -1;
  }
  if (b.Type === 'NS') return 1;
  if (a.Type === 'A') {
    if (b.Type === 'A') return commonSorterRest(a, b);
    return -1;
  }
  if (b.Type === 'A') return 1;
  if (a.Type === 'AAAA') {
    if (b.Type === 'AAAA') return commonSorterRest(a, b);
    return -1;
  }
  if (b.Type === 'AAAA') return 1;
  if (a.Type === 'HTTPS') {
    if (b.Type === 'HTTPS') return commonSorterRest(a, b);
    return -1;
  }
  if (b.Type === 'HTTPS') return 1;
  if (a.Type < b.Type) return -1;
  if (a.Type > b.Type) return 1;
  return commonSorterRest(a, b);
};

const commonSorterRest = (a: Dnspod.RecordListItem, b: Dnspod.RecordListItem) => {
  if (a.Weight < b.Weight) return -1;
  if (a.Weight > b.Weight) return 1;
  if (a.Value < b.Value) return -1;
  if (a.Value > b.Value) return 1;
  return 0;
};

export const recordListSorter = (a: Dnspod.RecordListItem, b: Dnspod.RecordListItem) => {
  if (a.Status === 'DISABLE') {
    if (b.Status === 'DISABLE') return commonSorterType(a, b);
    return 1;
  }
  if (b.Status === 'DISABLE') return -1;
  if (a.Name === '@') {
    if (b.Name === '@') return commonSorterType(a, b);
    return -1;
  }
  if (b.Name === '@') return 1;
  if (a.Name === 'www') {
    if (b.Name === 'www') return commonSorterType(a, b);
    return -1;
  }
  if (b.Name === 'www') return 1;
  if (a.Name < b.Name) return -1;
  if (a.Name > b.Name) return 1;
  return commonSorterType(a, b);
};
