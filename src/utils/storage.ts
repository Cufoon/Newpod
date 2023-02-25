import localforage from 'localforage';

enum KEY {
  ACCOUNT = 'DnspodAccount'
}

type AnyRecord = Record<KEY, any>;

interface Storage extends AnyRecord {
  [KEY.ACCOUNT]: string;
}

type AsyncGet<T extends KEY> = Promise<Storage[T] | null>;

async function getItem(key: `${KEY.ACCOUNT}`): AsyncGet<KEY.ACCOUNT>;
async function getItem(key: `${KEY}`): AsyncGet<KEY> {
  try {
    return await localforage.getItem<Storage[typeof key]>(key);
  } catch (error) {
    console.log(error);
  }
  return null;
}

async function setItem(key: `${KEY.ACCOUNT}`, value: Storage[KEY.ACCOUNT]): Promise<boolean>;
async function setItem(key: `${KEY}`, value: Storage[KEY]): Promise<boolean> {
  try {
    await localforage.setItem(key, value);
    return true;
  } catch (error) {
    console.log(error);
  }
  return false;
}

async function removeItem(key: `${KEY}`) {
  try {
    await localforage.removeItem(key);
    return true;
  } catch (error) {
    console.log(error);
  }
  return false;
}

const getAccount = () => getItem(KEY.ACCOUNT);
const setAccount = (value: Storage[KEY.ACCOUNT]) => setItem(KEY.ACCOUNT, value);
const removeAccount = () => removeItem(KEY.ACCOUNT);

const clear = async () => {
  try {
    await localforage.clear();
    return true;
  } catch (error) {
    console.log(error);
  }
  return false;
};

export default {
  getAccount,
  setAccount,
  removeAccount,
  clear
};
