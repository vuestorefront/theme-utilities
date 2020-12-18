#!/usr/bin/env node
import loadConfig from './core/loadConfig';
import watchSources from './core/watchSources';
import clearOldBuild from './core/clearOldBuild';
import createFileMapping from './core/createFileMapping';
import transformTemplate from './core/transformTemplate';
import { SourcesMap } from './types';

// Load configuration file
const config = loadConfig();

// Create mapping between source and destination
const sourcesMap: SourcesMap = createFileMapping({ config });

// Clear previous build
clearOldBuild({ config });

// Make new build from sources
sourcesMap.forEach((sourcePath, file) => transformTemplate({ file, sourcePath, config }));

// Watch source folders for changes
watchSources({ config, sourcesMap });
