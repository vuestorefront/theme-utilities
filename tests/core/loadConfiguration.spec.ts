import { resolve } from 'path';
import loadConfiguration from '../../src/core/loadConfiguration';
import { configFlag, defaultConfigFilename, outputFlag } from '../../src/settings';

const getConfig = (to) => ({
  copy: {
    to: resolve(to),
    from: []
  }
});

const getConfigContent = (config) => `module.exports = ${ JSON.stringify(config) };`

const mockArgvPath = 'argument.config.js';
const mockArgvOutputPath = '/output'
const mockArgvConfig = getConfig('/argument/to');
const mockDefaultConfig = getConfig('/default/to');
const mockArgvOutputPathConfig = getConfig(mockArgvOutputPath)

jest.spyOn(process, 'cwd').mockImplementation(resolveToTemp);

describe('loadConfiguration', () => {
  beforeAll(() => {
    createFile(mockArgvPath, getConfigContent(mockArgvConfig));
    createFile(defaultConfigFilename, getConfigContent(mockDefaultConfig));
  });

  afterAll(() => {
    deleteItem(mockArgvPath);
    deleteItem(defaultConfigFilename);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads configuration file from argument', () => {
    const oldArguments = process.argv;
    process.argv = [
      ...oldArguments,
      configFlag,
      resolveToTemp(mockArgvPath)
    ];

    expect(loadConfiguration()).toEqual(mockArgvConfig);

    process.argv = oldArguments;
  });

  it('loads default configuration file is no argument was provided', () => {
    expect(loadConfiguration()).toEqual(mockDefaultConfig);
  });

  it('loads new project\'s directory from --outputDir argument', () => {
    const oldArguments = process.argv;
    process.argv = [
      ...oldArguments,
      configFlag,
      resolveToTemp(mockArgvPath),
      outputFlag,
      resolveToTemp(mockArgvOutputPath)
    ];

    const configuration = loadConfiguration();
    expect(configuration).toEqual(mockArgvOutputPathConfig);

    configuration.copy.to = mockArgvConfig.copy.to;
    process.argv = oldArguments;
  });

  it('loads the default new project\'s directory if no --outputDir argument was provided', () => {
    const oldArguments = process.argv;
    process.argv = [
      ...oldArguments,
      configFlag,
      resolveToTemp(mockArgvPath)
    ];

    expect(loadConfiguration()).toEqual(mockArgvConfig);
    process.argv = oldArguments;
  });
});
