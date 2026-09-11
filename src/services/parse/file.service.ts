import type { File as ParseFile } from "parse";

import Parse from "./client";

export async function uploadFile(
  file: File,
  fallbackName = "arquivo.bin",
): Promise<ParseFile> {
  const parseFile = new Parse.File(file.name || fallbackName, file);
  await parseFile.save();
  return parseFile;
}
