import { resolve, dirname, isAbsolute, join } from 'path';
import { existsSync } from 'fs';
import { log, getConfigurationPath, getWorkingDirectory, getArguments, getCustomOutputPath } from './helpers';
import { configFlag, defaultConfigFilename } from '../settings';
import { Configuration, LogType } from '../types';

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
  const destinationPath = getCustomOutputPath() || config.copy.to
  config.copy.to = resolve(dirname(getConfigurationPath()), destinationPath);
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

    if(isAbsolute(source.path)) {
      return source;
    }

    try {
      path = resolve(configPath, source.path);
      if(!existsSync(path)) {
        throw new Error();
      }
    } catch (error) {
      try {
        const [ one, two, ...rest ] = source.path.split('/');
        path = one.startsWith('@') ? `${one}/${two}` : one;
        path = require.resolve(path, { paths: [ configPath ] });
        path = dirname(path);
        path = resolve(path, join(...rest));
      } catch (e) {
        log(`Failed to resolve path '${ source.path }'.`, LogType.Error);
        process.exit(1);
      }
    }

    return { ...source, path };
  });

  return config;
}
