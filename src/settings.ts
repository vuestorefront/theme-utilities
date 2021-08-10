  // Command line argument used to provide custom config filename
export const configFlag = '--config';

// Config filename used if one is not provided as an argument
export const defaultConfigFilename = 'theme-utils.config.js';

// Command line argument used to provide custom path for a new project
export const outputFlag = '--outputDir';

// List of glob paths ignored in source directories
export const defaultIgnoredSources = [
  '.nuxt/**',
  'node_modules/**'
];

// List of extensions that can contain template strings and should be parsed
export const templateFilesExtensions = [
  '.vue',
  '.ts',
  '.js',
  '.json'
];
