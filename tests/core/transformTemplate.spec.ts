import transformTemplate from '../../src/core/transformTemplate';

const config: any = {
  copy: {
    to: resolveToTemp('transformTemplate'),
    from: [
      { path: resolveToTemp('source_0') }
    ]
  }
};

const directory = config.copy.from[0].path;
const staticFileContent = `<%= "SHOULD NOT BE COMPILED" %>`;
const templateFileContent = `<%= "SHOULD BE COMPILED" %>`;
const compiledContent = 'SHOULD BE COMPILED';

describe('transformTemplate', () => {
  beforeAll(() => {
    createDirectory(directory);
    createFile(`${directory}/README.md`, staticFileContent);
    createFile(`${directory}/TESTING.md`, templateFileContent);
    createFile(`${directory}/component.vue`, templateFileContent);
    createFile(`${directory}/script.js`, templateFileContent);
    createFile(`${directory}/script.ts`, templateFileContent);
    createFile(`${directory}/config.json`, templateFileContent);
  });

  afterAll(() => {
    deleteItem(config.copy.from[0].path);
  });

  it('copies non-template files to destination', async () => {
    const filename = 'README.md';
    const destination = `${config.copy.to}/${filename}`;

    await transformTemplate({
      config,
      file: filename,
      sourcePath: directory
    });

    expect(itemExists(destination)).toBeTruthy();
    expect(itemContent(destination)).toBe(staticFileContent);
  });

  it('compiles and copies Vue templates to destination', async () => {
    const filename = 'component.vue';
    const destination = `${config.copy.to}/${filename}`;

    await transformTemplate({
      config,
      file: filename,
      sourcePath: directory
    });

    expect(itemExists(destination)).toBeTruthy();
    expect(itemContent(destination)).toBe(compiledContent);
  });

  it('compiles and copies JavaScript templates to destination', async () => {
    const filename = 'script.js';
    const destination = `${config.copy.to}/${filename}`;

    await transformTemplate({
      config,
      file: filename,
      sourcePath: directory
    });

    expect(itemExists(destination)).toBeTruthy();
    expect(itemContent(destination)).toBe(compiledContent);
  });

  it('compiles and copies TypeScript templates to destination', async () => {
    const filename = 'script.ts';
    const destination = `${config.copy.to}/${filename}`;

    await transformTemplate({
      config,
      file: filename,
      sourcePath: directory
    });

    expect(itemExists(destination)).toBeTruthy();
    expect(itemContent(destination)).toBe(compiledContent);
  });

  it('compiles and copies JSON templates to destination', async () => {
    const filename = 'config.json';
    const destination = `${config.copy.to}/${filename}`;

    await transformTemplate({
      config,
      file: filename,
      sourcePath: directory
    });

    expect(itemExists(destination)).toBeTruthy();
    expect(itemContent(destination)).toBe(compiledContent);
  });

  it('compiles each file to destination if compileEachFile is true', async () => {
    const filename = 'TESTING.md';
    const destination = `${config.copy.to}/${filename}`;

    await transformTemplate({
      config: {
        ...config,
        compileEachFile: true
      },
      file: filename,
      sourcePath: directory
    });

    expect(itemExists(destination)).toBeTruthy();
    expect(itemContent(destination)).toBe(compiledContent);
  });
});
