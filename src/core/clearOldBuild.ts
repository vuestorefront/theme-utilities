import { sync } from 'rimraf';
import { ClearOldBuildParams } from '../types';

export default function clearOldBuild({ config }: ClearOldBuildParams): void {
  sync(config.copy.to);
}