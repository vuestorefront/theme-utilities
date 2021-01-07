import { sync } from 'rimraf';
import { resolve } from 'path';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';

const resolveToTemp = (...paths: string[]) => resolve(__dirname, '__temp', ...paths);
const createTempDirectory = () => mkdirSync(resolveToTemp())
const deleteTempDirectory = () => sync(resolveToTemp());

// @ts-ignore
global.resolveToTemp = resolveToTemp;

// @ts-ignore
global.createFile = (path: string, content = '') => writeFileSync(resolveToTemp(path), content);

// @ts-ignore
global.createDirectory = (path: string) => mkdirSync(resolveToTemp(path));

// @ts-ignore
global.itemExists = (path: string) => existsSync(resolveToTemp(path));

// @ts-ignore
global.itemContent = (path: string) => readFileSync(resolveToTemp(path), 'utf-8');

// @ts-ignore
global.deleteItem = (path: string) => sync(resolveToTemp(path));

export {
  resolveToTemp,
  createTempDirectory,
  deleteTempDirectory
};
