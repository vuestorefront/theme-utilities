declare function resolveToTemp(...paths: string[]): string;
declare function createFile(path: string, content?: string): void;
declare function createDirectory(path: string): void;
declare function itemExists(path: string): boolean;
declare function itemContent(path: string): string;
declare function deleteItem(path: string): void;
