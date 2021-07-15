import watchSources from '../../src/core/watchSources';
import * as chokidar from 'chokidar';

jest.mock('chokidar', () => ({
  watch: jest.fn().mockImplementation(() => ({
    on: jest.fn()
  }))
}));

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
    const watchSpy = jest.spyOn(chokidar, 'watch');
    const anyConfig = expect.objectContaining({});

    watchSources({ config, sourcesMap: new Map() });

    expect(watchSpy).toHaveBeenNthCalledWith(1, `${config.copy.from[0].path}/**/*`, anyConfig);
    expect(watchSpy).toHaveBeenNthCalledWith(2, `${config.copy.from[1].path}/**/*`, anyConfig);
    expect(watchSpy).toHaveBeenNthCalledWith(3, `${config.copy.from[2].path}/**/*`, anyConfig);
  });
});