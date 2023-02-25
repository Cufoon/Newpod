import storage from '$src/utils/storage';

interface Account {
  id: string;
  key: string;
  mark: string;
  localId: string;
}

interface AccountStored {
  currentId: string;
  accountList: Account[];
}

let accountList: Account[] = [];
let currentAccount: Account | null = null;

const getData = async (): Promise<[Account[], Account | null]> => {
  const storedAccountsData = await storage.getAccount();
  if (storedAccountsData) {
    const accountStored: AccountStored = JSON.parse(storedAccountsData);
    accountList = accountStored.accountList || [];
    for (const item of accountList) {
      if (item.localId === accountStored.currentId) {
        currentAccount = { ...item };
        return [accountList, currentAccount];
      }
    }
    return [accountList, null];
  }
  accountList = [];
  currentAccount = null;
  return [accountList, currentAccount];
};

export const getCurrentAccount = async (): Promise<Account | null> => {
  if (currentAccount) return currentAccount;
  const result = await getData();
  return result[1];
};

export const getCurrentAccountList = async (): Promise<Account[]> => {
  if (accountList) return accountList;
  const result = await getData();
  return result[0];
};

export const setCurrentAccount = async (v: string): Promise<boolean> => {
  for (const item of accountList) {
    if (item.localId === v) {
      const isStored = await storage.setAccount(JSON.stringify({ currentId: v, accountList }));
      if (isStored) {
        currentAccount = { ...item };
        return true;
      }
    }
  }
  return false;
};

export const setCurrentAccountWithoutStore = (v: Account) => {
  currentAccount = v;
};

export const addAccount = async (v: Account) => {
  const nextAccountList = [v, ...accountList];
  const isStored = await storage.setAccount(
    JSON.stringify({ currentId: currentAccount?.localId, accountList: nextAccountList })
  );
  if (isStored) {
    accountList = nextAccountList;
    return true;
  }
  return false;
};

export const deleteAccount = async (v: string): Promise<boolean> => {
  const len = accountList.length;
  for (let i = 0; i < len; ++i) {
    if (accountList[i]?.localId === v) {
      const nextAccountList = accountList.slice(0, i).concat(accountList.slice(i + 1));
      const isStored = await storage.setAccount(JSON.stringify({ currentId: v, nextAccountList }));
      if (isStored) {
        if (currentAccount?.localId === v) {
          currentAccount = nextAccountList[0] || null;
        }
        return true;
      }
    }
  }
  return false;
};

export const clearAccounts = async (): Promise<boolean> => {
  const isStored = await storage.setAccount('{}');
  if (isStored) {
    currentAccount = null;
    accountList = [];
    return true;
  }
  return false;
};
