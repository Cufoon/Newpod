import path from 'node:path';
// import { fileURLToPath } from 'node:url';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
