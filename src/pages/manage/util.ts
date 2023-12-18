import { Dnspod } from '$service/dnspod';

const commonSorterType = (
  a: Dnspod.RecordListItem,
  b: Dnspod.RecordListItem
) => {
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

const commonSorterRest = (
  a: Dnspod.RecordListItem,
  b: Dnspod.RecordListItem
) => {
  if (a.Weight < b.Weight) return -1;
  if (a.Weight > b.Weight) return 1;
  if (a.Value < b.Value) return -1;
  if (a.Value > b.Value) return 1;
  return 0;
};

export const recordListSorter = (
  a: Dnspod.RecordListItem,
  b: Dnspod.RecordListItem
) => {
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

const exceptedDomains: { [index: string]: boolean } = {
  _domainkey: true,
  ['_acme-challenge']: true,
  ['cufoon-newpod-mail-service']: true,
  ['cufoon-newpod-cert-application']: true
};

export const isExceptedSubDomain = (a: string): boolean => {
  if (a[0] === '_') {
    return true;
  }
  return exceptedDomains[a.toLocaleLowerCase()] === true;
};

export const notExceptedSubDomain = (a: string): boolean =>
  !isExceptedSubDomain(a);

export const isEmailRecord = (name: string, type: string, value: string) => {
  return (
    type.toLocaleLowerCase() === 'mx' ||
    name.indexOf('_domainkey') > -1 ||
    name.startsWith('feishu') ||
    value.startsWith('v=spf1')
  );
};

export class KeepOrderSet<T> {
  arr: T[];
  updateListener: ((...all: any[]) => any)[];

  constructor(listeners: ((...all: any[]) => any)[]) {
    this.arr = [];
    this.updateListener = [...listeners];
  }

  onUpdate() {
    this.updateListener.forEach((item) => {
      item();
    });
  }

  exist(v: T): boolean {
    if (this.arr.length === 0) {
      return false;
    }
    let start = 0;
    let end = this.arr.length - 1;
    let middle = Math.floor((start + end) / 2);
    while (start <= end) {
      if (v === (this.arr[middle] as T)) {
        return true;
      } else if (v > (this.arr[middle] as T)) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
      middle = Math.floor((start + end) / 2);
    }
    return false;
  }

  insert(v: T): void {
    if (this.arr.length === 0) {
      this.arr.push(v);
      this.onUpdate();
      console.log('insert', v, this.arr);
      return;
    }
    let start = 0;
    let end = this.arr.length - 1;
    let middle = Math.floor((start + end) / 2);
    while (start <= end) {
      if (v === (this.arr[middle] as T)) {
        return;
      } else if (v > (this.arr[middle] as T)) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
      middle = Math.floor((start + end) / 2);
    }
    this.arr.splice(start, 0, v);
    this.onUpdate();
    console.log('insert', v, this.arr);
  }

  delete(v: T) {
    if (this.arr.length === 0) {
      return;
    }
    let start = 0;
    let end = this.arr.length - 1;
    let middle = Math.floor((start + end) / 2);
    while (start <= middle) {
      if (v === (this.arr[middle] as T)) {
        this.arr.splice(middle, 1);
        this.onUpdate();
        console.log('delete', v, this.arr);
        return;
      } else if (v > (this.arr[middle] as T)) {
        start = middle + 1;
      } else {
        end = middle - 1;
      }
      middle = Math.floor((start + end) / 2);
    }
  }

  getArr() {
    return this.arr;
  }
}
