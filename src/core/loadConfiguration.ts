import { existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { configFlag } from '../settings';
import { Configuration, LogType } from '../types';
import { log, getConfigurationPath } from './helpers';

export default function loadConfiguration(): Configuration {
  const path = getConfigurationPath();

  try {
    let config = require(path);
    config = resolveDestinationPath(config);
    config = resolveSourcePaths(config);
    return config;
  } catch (error) {
    log(error, LogType.Raw);
    log(`Failed to load the configuration file '${ path }'.`, LogType.Error);
    log(`You can provide custom config path using '${ configFlag }' flag.`, LogType.Message);
    process.exit(1);
  }
}

/**
 * This methods ensures that "to" is an absolute path.
 */
function resolveDestinationPath(config: Configuration): Configuration {
  config.copy.to = resolve(dirname(getConfigurationPath()), config.copy.to);
  return config;
}

/**
 * "path" string in source might be relative or absolute path, name of the node dependency
 * or directory inside of node dependency. This method takes current working directory and
 * paths to all "node_modules" directories and checks if any of them exists.
 */
function resolveSourcePaths(config: Configuration): Configuration {
  config.copy.from = config.copy.from.map(source => {
    const configPath = dirname(getConfigurationPath());
    let path = '';

    try {
      path = require.resolve(source.path, { paths: [ configPath ] })
      path = dirname(path);
    } catch (error) {
      path = resolve(configPath, source.path);
    }

    if (!existsSync(path)) {
      log(`Failed to resolve path '${ source.path }'.`, LogType.Error);
      process.exit(1);
    }

    return { ...source, path };
  });

  return config;
}
