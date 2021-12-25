import * as path from 'path';
import { resultPath } from '../network/fileUpload';
import * as child_process from 'child_process';
import * as util from 'util';
const exec = util.promisify(child_process.exec);

export type CwebpFile = {
  filename: string;
  filePath: string;
};

export type ConvertResult = {
  status: number;
  statusText: string;
  convertFilePath: string;
};

export type CWebpError = {
  stdout: string;
  stderr: string;
};

export const executeCwebp = async (
  quality: number,
  srcFile: CwebpFile,
): Promise<ConvertResult> => {
  const outputFileExtension = 'webp';
  const filenameWithoutExt = srcFile.filename.split('.')[0];
  const filename = `${filenameWithoutExt}.${outputFileExtension}`;
  const convertFilePath = path.join(resultPath, filename);

  try {
    await exec(
      `cwebp -q ${quality} ${srcFile.filePath} -o  ${convertFilePath}`,
    );

    console.log(`[SUCCESS][cwebp] ${srcFile.filename} → ${filename}`);

    return {
      status: 200,
      statusText: '',
      convertFilePath: convertFilePath,
    };
  } catch (err) {
    const error = err as CWebpError;
    console.error(`[ERROR][cwebp] stderr: ${error.stderr}`);
    console.error(`[ERROR][cwebp] ${srcFile.filename} → ${filename}`);
    return {
      status: 400,
      statusText: error.stderr,
      convertFilePath: '',
    };
  }
};
