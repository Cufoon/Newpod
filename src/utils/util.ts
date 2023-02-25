const charList = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const getRandomStr = (len = 64) => {
  let result = '';
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(62 * Math.random());
    result += charList[randomIndex];
  }
  return result;
};

export const delay = (d = 100) => {
  if (d < 20) {
    d = 20;
  }
  return new Promise((resolve) => {
    setTimeout(resolve, d);
  });
};

export const getDottedRoot = (v: string) => {
  const split = v.split('.');
  if (split.length === 0) {
    return '';
  }
  return split[split.length - 1] || '';
};
