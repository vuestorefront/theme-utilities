import createFileMapping from '../../src/core/createFileMapping';

const config: any = {
  copy: {
    to: resolveToTemp('createFileMapping'),
    from: [
      { path: resolveToTemp('source_0'), ignore: [] },
      { path: resolveToTemp('source_1'), ignore: [] },
      { path: resolveToTemp('source_2'), ignore: [] }
    ]
  }
};

describe('createFileMapping', () => {
  afterEach(() => {
    deleteItem(config.copy.from[0].path);
    deleteItem(config.copy.from[1].path);
    deleteItem(config.copy.from[2].path);
  });

  it('properly maps files from multiple sources', () => {
    createDirectory(config.copy.from[0].path);
    createDirectory(config.copy.from[1].path);
    createDirectory(config.copy.from[2].path);

    createFile(`${config.copy.from[0].path}/exists_in_all.js`);
    createFile(`${config.copy.from[1].path}/exists_in_all.js`);
    createFile(`${config.copy.from[2].path}/exists_in_all.js`);

    createFile(`${config.copy.from[0].path}/exists_in_0_and_1.js`);
    createFile(`${config.copy.from[1].path}/exists_in_0_and_1.js`);

    createFile(`${config.copy.from[0].path}/exists_in_0.js`);    

    const expected = new Map([
      ['exists_in_all.js', resolveToTemp(config.copy.from[2].path)],
      ['exists_in_0_and_1.js', resolveToTemp(config.copy.from[1].path)],
      ['exists_in_0.js', resolveToTemp(config.copy.from[0].path)],
    ]);

    expect(createFileMapping({ config })).toEqual(expected);
  });

  it('doesn\'t fail if sources are empty', () => {
    createDirectory(config.copy.from[0].path);
    createDirectory(config.copy.from[1].path);
    createDirectory(config.copy.from[2].path);

    expect(createFileMapping({ config })).toEqual(new Map());
  });

  it('doesn\'t fail if one of the sources doesn\'t exists', () => {
    createDirectory(config.copy.from[0].path);
    createDirectory(config.copy.from[1].path);

    expect(createFileMapping({ config })).toEqual(new Map());
  });
});
