import { defaultIgnoredSources } from '../settings';

export function getFilesGlob(path: string): string {
  return `${ path }/**/*`;
}

export function getFilePathFromSource(path: string, sourcePath: string): string {
  return path
    .replace(sourcePath, '')
    .replace(/^\//, '');
}

export function getPathPriority(config, path): number {
  return config.copy.from.findIndex((source) => path.startsWith(source.path));
}

export function getWorkingDirectory(): string {
  return process.cwd();
}

export function getArguments(): string[] {
  return process.argv;
}

export function getIgnoredPaths(config): string[] {
  return config.copy.from.reduce((carry, source) => {
    const ignoredPaths = defaultIgnoredSources
      .concat(source.ignore)
      .map(ignore => `${source.path}/${ignore}`);

    return carry.concat(ignoredPaths);
  }, []);
}
