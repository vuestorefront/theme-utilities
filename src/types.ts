export interface Source {
  path: string;
  ignore: string[];
  variables: Record<string, any>;
  watch: boolean;
}

export interface Configuration {
  copy: {
    to: string;
    from: Source[];
  }
}

export interface ProjectSettings {
  configFlag: string;
  defaultConfigFilename: string;
  ignoredSourceDirectories: string[];
}

export type SourcesMap = Map<string, string>;

export interface ClearOldBuildParams {
  config: Configuration;
}

export interface CreateFileMappingParams {
  config: Configuration;
}

export interface TransformTemplateParams {
  config: Configuration;
  file: string;
  sourcePath: string;
}

export interface WatchSourcesParams {
  config: Configuration;
  sourcesMap: SourcesMap;
}

export interface WatchEventParams {
  config: Configuration;
  sourcesMap: SourcesMap;
  eventPath: string;
  file: string,
  source: Source;
}

export const enum LogType {
  Success,
  Error,
  Warning,
  Message,
  Raw
}
