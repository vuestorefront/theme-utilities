import { resolve } from 'path';
import { existsSync, unlinkSync } from 'fs';
import * as chokidar from 'chokidar';
import transformTemplate from './transformTemplate';
import { getFilesGlob, getFilePathFromSource, getPathPriority, getIgnoredPaths } from './helpers';
import { Source, WatchSourcesParams, WatchEventParams, WatchEventListenerParams } from '../types';

const eventMapping: Record<string, (params: WatchEventParams) => void> = {
  add: handleAdd,
  change: handleChange,
  unlink: handleDelete
};

export default function watchSources({ config, sourcesMap }: WatchSourcesParams): void {
  const sourcePaths = config.copy.from.filter(source => source.watch);

  if (!sourcePaths.length) {
    return;
  }

  sourcePaths.forEach((source: Source) => {
    const path = getFilesGlob(source.path);
    const options = {
      ignored: getIgnoredPaths(source),
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100,
      },
    };

    chokidar
      .watch(path, options)
      .on('all', (eventName, eventPath) => {
        eventListener({ config, sourcesMap, eventName, eventPath });
      });
  });
}

/**
 * Handle all types of events in one of the watched directories.
 */
function eventListener({ config, sourcesMap, eventName, eventPath }: WatchEventListenerParams) {
  const handler = eventMapping[eventName];
  
  if (!handler) {
    return;
  }

  const source = config.copy.from.find(source => eventPath.startsWith(source.path));
  const file = getFilePathFromSource(eventPath, source.path);

  handler({
    config,
    sourcesMap,
    eventPath,
    file,
    source,
  });
}

/**
 * Handle new file being created in one of the watched directories.
 */
function handleAdd({ config, sourcesMap, eventPath, file, source }: WatchEventParams): void {
  const currentPriority = sourcesMap.has(file)
    ? getPathPriority(config, sourcesMap.get(file))
    : -1;

  const newFilePriority = getPathPriority(config, eventPath);

  if (newFilePriority > currentPriority) {
    // Update map and template if new file has higher priority than current one.
    sourcesMap.set(file, source.path);
    transformTemplate({ file, sourcePath: source.path, config });
  }
}

/**
 * Handle file being updated in one of the watched directories.
 */
function handleChange({ config, sourcesMap, file, source }: WatchEventParams): void {
  if (source.path === sourcesMap.get(file)) {
    transformTemplate({ file, sourcePath: source.path, config });
  }
}

/**
 * Handle file being deleted in one of the watched directories.
 */
function handleDelete({ config, sourcesMap, file, source }: WatchEventParams): void {
  if (source.path !== sourcesMap.get(file)) {
    return;
  }

  const fileInOtherSources = config.copy.from
    .slice() // slice is used to create new copy of the array because "reverse" is mutating
    .reverse()
    .find(source => existsSync(resolve(source.path, file)));

  if (!fileInOtherSources) {
    // File with the same path doesn't exists in other sources.
    sourcesMap.delete(file);
    unlinkSync(resolve(config.copy.to, file));
    return;
  }

  // File with the same path exists in other source.
  sourcesMap.set(file, fileInOtherSources.path);
  transformTemplate({ file, sourcePath: fileInOtherSources.path, config });
}
