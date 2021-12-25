import express from 'express';
import { ConvertResult, executeCwebp } from './libs/executor';
import { imageUpload } from './network/fileUpload';
import { MulterRequest } from './network/multerRequest';
import { findQuality } from './utils';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

import { resolve } from 'path';
import { config } from 'dotenv';

config({ path: resolve(__dirname, '..', '.env') });

const app = express();

app.post('/', async (req: MulterRequest, res: express.Response) => {
  imageUpload(req, res, async (err) => {
    console.log('[START]');

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const uploadFile = req.file!;

    if (err) {
      console.error(`[API][ERROR] code: ${err.code}, message: ${err.message}`);

      if (err.code == 'LIMIT_FILE_SIZE')
        return res.status(413).send(err.message);
      else return res.status(400).send(err.message);
    }

    const quality = findQuality(req.body.q);

    const convertResult: ConvertResult = await executeCwebp(quality, {
      filename: uploadFile.fieldname,
      filePath: uploadFile.path,
    });

    if (convertResult.status != 200) {
      console.error(
        `[ERROR] status: ${convertResult.status}, statusText: ${convertResult.statusText}`,
      );
      console.log(`[END]`);

      return res.status(convertResult.status).send(convertResult.statusText);
    }

    console.log('[END]');

    return res.download(convertResult.convertFilePath);
  });
});

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('OK');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req: express.Request, res: express.Response) => {
  res.status(404).send('not found!!');
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`app listening on ${port}`);
});
