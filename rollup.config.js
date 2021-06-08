import pkg from './package.json';
import hashbang from 'rollup-plugin-hashbang';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true
      }
    ],
    external: [
      ...Object.keys(pkg.dependencies)
    ],
    plugins: [
      resolve(),
      typescript()
    ]
  },
  {
    input: 'src/cli.ts',
    output: {
      file: pkg.cli,
      format: 'cjs',
      sourcemap: true
    },
    external: [
      ...Object.keys(pkg.dependencies)
    ],
    plugins: [
      resolve(),
      hashbang(),
      typescript()
    ]
  }
];
