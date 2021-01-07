import clearOldBuild from '../../src/core/clearOldBuild';

const config: any = {
  copy: {
    to: resolveToTemp('clearOldBuild')
  }
};

describe('clearOldBuild', () => {
  it('removes directory with it\'s content', () => {
    createDirectory(config.copy.to);
    createFile(`${config.copy.to}/some_file.js`);

    clearOldBuild({ config });
    expect(itemExists(config.copy.to)).toBeFalsy();
  });

  it('removes directory if it\'s empty', () => {
    createDirectory(config.copy.to);

    clearOldBuild({ config });
    expect(itemExists(config.copy.to)).toBeFalsy();
  });

  it('doesn\'t fail if directory doesn\'t exists', () => {
    expect(() => clearOldBuild({ config })).not.toThrowError();
  });
});
