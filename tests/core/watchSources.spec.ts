import watchSources from '../../src/core/watchSources';
import * as chokidar from 'chokidar';

jest.mock('chokidar');

const config: any = {
  copy: {
    to: resolveToTemp('watchSources'),
    from: [
      { path: resolveToTemp('source_0'), watch: true },
      { path: resolveToTemp('source_1'), watch: true },
      { path: resolveToTemp('source_2'), watch: true },
    ]
  }
};

describe('watchSources', () => {
  it('calls watch library with proper paths', () => {

    jest.spyOn(chokidar, 'watch').mockImplementationOnce((paths, options) => {
      expect(paths).toEqual([
        `${config.copy.from[0].path}/**/*`,
        `${config.copy.from[1].path}/**/*`,
        `${config.copy.from[2].path}/**/*`
      ]);

      return { on: () => {} } as any;
    });

    watchSources({ config, sourcesMap: new Map() });
  });
});