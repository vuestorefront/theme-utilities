import * as ejs from 'ejs';
import { resolve, dirname, extname } from 'path';
import { copyFileSync, writeFileSync, mkdirSync } from 'fs';
import { log } from '../core/helpers';
import { LogType, TransformTemplateParams } from '../types';
import { templateFilesExtensions } from '../settings';

export default async function transformTemplate({ config, file, sourcePath }: TransformTemplateParams): Promise<void> {
  const source = resolve(sourcePath, file);
  const destination = resolve(config.copy.to, file);

  mkdirSync(dirname(destination), { recursive: true });

  return templateFilesExtensions.includes(extname(file))
    ? writeFileSync(destination, await parseTemplate({ config, file: source, sourcePath }))
    : copyFileSync(source, destination);
}

async function parseTemplate({ config, file, sourcePath }: TransformTemplateParams): Promise<string> {
  const source = config.copy.from.find(source => source.path === sourcePath);

  try {
    return await ejs.renderFile(file, source.variables, { async: false });
  } catch (error) {
    log(`Failed to compile template '${file}'.`, LogType.Error);
    log(error, LogType.Raw);
  }
}
