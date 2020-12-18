import { resolve } from 'path';
import { sync } from 'rimraf';
import { ClearOldBuildParams } from '../types';

export default function clearOldBuild({ config }: ClearOldBuildParams): void {
  sync(resolve(config.copy.to));
}