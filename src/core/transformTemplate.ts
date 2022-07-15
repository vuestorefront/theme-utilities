import * as ejs from 'ejs';
import { resolve, dirname, extname } from 'path';
import { copyFileSync, writeFileSync, mkdirSync } from 'fs';
import { log } from '../core/helpers';
import { LogType, TransformTemplateParams } from '../types';
import { templateFilesExtensions } from '../settings';

/**
 * Transforms template files and copy them to their destinations
 */
export default async function transformTemplate({ config, file, sourcePath }: TransformTemplateParams): Promise<void> {
  const source = config.copy.from.find(source => source.path === sourcePath);
  const filePath = resolve(sourcePath, file);
  const destinationPath = resolve(config.copy.to, file);

  mkdirSync(dirname(destinationPath), { recursive: true });

  /**
   * If file is a template, parse it and write it to the destination.
   */
  async function parseAndWriteFile() {
    return writeFileSync(
      destinationPath,
      await parseTemplate({ config, file: filePath, sourcePath })
    );
  }

  /**
   * If file is not a template, copy it to the destination.
   */
  function copyFile() {
    return copyFileSync(filePath, destinationPath);
  }

  if (source.ignoreParse?.includes(filePath)) {
    return copyFile();
  }

  if (config.copy.parseAllExtensions) {
    return parseAndWriteFile();
  }

  return templateFilesExtensions.includes(extname(file))
    ? parseAndWriteFile()
    : copyFile();
}

/**
 * Parses template file and returns its content.
 */
async function parseTemplate({ config, file, sourcePath }: TransformTemplateParams): Promise<string> {
  const source = config.copy.from.find(source => source.path === sourcePath);

  try {
    return await ejs.renderFile(file, source.variables, { async: false });
  } catch (error) {
    log(`Failed to compile template '${file}'.`, LogType.Error);
    log(error, LogType.Raw);
  }
}
