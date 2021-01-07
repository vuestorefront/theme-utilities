import loadConfiguration from '../../src/core/loadConfiguration';
import { configFlag, defaultConfigFilename } from '../../src/settings';

const getConfig = (to) => ({
  copy: {
    to,
    from: []
  }
});

const getConfigContent = (config) => `module.exports = ${ JSON.stringify(config) };`

const mockArgvPath = 'argument.config.js';
const mockArgvConfig = getConfig('/argument/to');
const mockDefaultConfig = getConfig('/default/to');

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
});
