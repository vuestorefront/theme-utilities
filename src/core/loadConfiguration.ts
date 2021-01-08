import * as chalk from 'chalk';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { getWorkingDirectory, getArguments } from './helpers';
import { configFlag, defaultConfigFilename } from '../settings';
import { Configuration } from '../types';

export default function loadConfiguration(): Configuration {
  const args = getArguments();
  const index = args.findIndex(argument => argument === configFlag);
  const filePath = index > 0 && args[index + 1] || defaultConfigFilename;
  const path = resolve(getWorkingDirectory(), filePath);

  try {
    let config = require(path);
    config = resolveDestinationPath(config);
    config = resolveSourcePaths(config);
    return config;
  } catch (error) {
    console.log(error);
    console.log(chalk.bold.red(`Failed to load the configuration file '${ path }'.`));
    console.log(chalk.blue.bold(`You can provide custom config path using '${ configFlag }' flag.`));
    process.exit(1);
  }
}

/**
 * This methods ensures that "to" is an absolute path.
 */
function resolveDestinationPath(config: Configuration): Configuration {
  config.copy.to = resolve(getWorkingDirectory(), config.copy.to);
  return config;
}

/**
 * "path" string in source might be relative or absolute path, name of the node dependency
 * or directory inside of node dependency. This method takes current working directory and
 * paths to all "node_modules" directories and checks if any of them exists.
 */
function resolveSourcePaths(config: Configuration): Configuration {
  config.copy.from = config.copy.from.map(source => {
    const lookupPaths = [
      getWorkingDirectory(),
      ...require.resolve.paths(source.path),
    ];

    const path = lookupPaths
      .map(path => resolve(path, source.path))
      .find(path => existsSync(path));

    if (!path) {
      console.log(chalk.bold.red(`Failed to resolve path '${ source.path }'.`));
      process.exit(1);
    }

    return { ...source, path };
  });

  return config;
}
