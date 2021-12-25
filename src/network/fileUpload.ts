import multer, { FileFilterCallback } from 'multer';
import * as path from 'path';

export const uploadsPath = path.resolve(
  __dirname,
  '..',
  '..',
  'tmp',
  'uploads',
);
export const resultPath = path.resolve(__dirname, '..', '..', 'tmp', 'result');

const storage = multer.diskStorage({
  destination: (
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void,
  ) => callback(null, uploadsPath),
  filename: (
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, uniqueSuffix + '-' + file.originalname);
  },
});

export const imageUpload = multer({
  storage: storage,
  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => {
    file.originalname = encodeURIComponent(file.originalname);
    // 一番最初にファイル名をURLエンコードして文字化けの対応
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      const errorMessage = `Only images are allowed. yourFile: ${file.originalname}`;
      return callback(new Error(errorMessage));
    }

    callback(null, true);
  },
  limits: {
    fileSize: 3 * 1024 * 1024, // for 3MB
  },
}).single('file');
