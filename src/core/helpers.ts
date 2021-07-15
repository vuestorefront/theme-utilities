import chalk from 'chalk';
import { resolve, relative } from 'path';
import { LogType, Source } from '../types';
import { configFlag, defaultConfigFilename, defaultIgnoredSources } from '../settings';

export function log(message: string, type: LogType = LogType.Raw) {
  const map = new Map([
    [ LogType.Success, chalk.bold.green ],
    [ LogType.Error, chalk.bold.red ],
    [ LogType.Warning, chalk.bold.yellow ],
    [ LogType.Message, chalk.bold.blue ],
    [ LogType.Raw, message => message ],
  ]);

  const handler = map.has(type)
    ? map.get(type)
    : map.get(LogType.Raw);

  console.log(handler(message));
}

export function getFilesGlob(path: string): string {
  return `${ path }/**/*`;
}

export function getFilePathFromSource(path: string, sourcePath: string): string {
  return relative(sourcePath, path);
}

export function getPathPriority(config, path): number {
  return config.copy.from.findIndex((source) => path.startsWith(source.path));
}

export function getWorkingDirectory(): string {
  return process.cwd();
}

export function getConfigurationPath(): string {
  const args = getArguments();
  const index = args.findIndex(argument => argument === configFlag);
  const filePath = index > 0 && args[index + 1] || defaultConfigFilename;

  return resolve(getWorkingDirectory(), filePath);
}

export function getArguments(): string[] {
  return process.argv;
}

export function getIgnoredPaths(source: Source): string[] {
  return defaultIgnoredSources
    .concat(source.ignore)
    .map(ignore => `${source.path}/${ignore}`);
}
