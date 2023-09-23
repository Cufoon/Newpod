import path from 'node:path';

const createPath = (p: string) => (child?: string) => {
  if (child) {
    return path.resolve(p, child);
  }
  return p;
};

enum MODE {
  DEV = 'development',
  PROD = 'production'
}

let mode = MODE.PROD;

const setMode = (m: MODE) => (mode = m);
const isDev = () => mode === MODE.DEV;
const isPROD = () => mode === MODE.PROD;

export default {
  PROJECT_DIR: createPath(path.resolve(__dirname, '..')),
  SOURCE_DIR: createPath(path.resolve(__dirname, '../src')),
  PUBLIC_DIR: createPath(path.resolve(__dirname, '../public')),
  BUILD_DIR: createPath(path.resolve(__dirname, '../build')),
  MODE,
  setMode,
  isDev,
  isPROD
};
