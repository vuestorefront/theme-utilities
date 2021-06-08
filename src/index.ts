import { LogType, Configuration, SourcesMap } from './types';
import { log } from './core/helpers';
import loadConfiguration from './core/loadConfiguration';
import watchSources from './core/watchSources';
import clearOldBuild from './core/clearOldBuild';
import createFileMapping from './core/createFileMapping';
import transformTemplate from './core/transformTemplate';

export function generate(rawConfiguration: Configuration) {
  // Load configuration file
  const config: Configuration = loadConfiguration(rawConfiguration);

  // Create mapping between source and destination
  const sourcesMap: SourcesMap = createFileMapping({ config });

  // Clear previous build
  clearOldBuild({ config });

  // Make new build from sources
  sourcesMap.forEach((sourcePath, file) => transformTemplate({ file, sourcePath, config }));

  log(`Compiled and copied ${ sourcesMap.size } files to ${ config.copy.to }.`, LogType.Success);

  // Watch source folders for changes
  watchSources({ config, sourcesMap });
}
