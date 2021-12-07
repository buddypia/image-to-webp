import express from "express";
import * as path from "path";

const app = express();

import child_process from "child_process";
const { exec } = child_process;

import multer from "multer";

import { URL } from "url";

import Logger from "./logger.js";
import * as utils from "./utils.js";
Logger.init();

const __dirname = new URL(".", import.meta.url).pathname;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      const errorMessage = `Only images are allowed. yourFile: ${file.originalname}`;
      return callback(
        new ConvertImageError("INVALID_IMAGE_FILE", errorMessage)
      );
    }

    callback(null, true);
  },
  limits: {
    fileSize: 3 * 1024 * 1024, // for 3MB
  },
}).single("image_file");

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("OK");
});

app.post("/", function (req, res) {
  upload(req, res, function (err) {
    Logger.systemInfo("[START] image to webp");

    if (err) {
      // multer.MulterErrorエラー
      if (err.code == "LIMIT_FILE_SIZE") {
        res.status(413).send(err.message);
      } else if (err.code == "INVALID_IMAGE_FILE") {
        res.status(400).send(err.message);
      }
      Logger.systemError(`[ERROR] code: ${err.code}, message: ${err.message}`);
      return;
    }

    if (!req.file) {
      const error = new ConvertImageError(
        "EMPTY_IMAGE_FILE",
        "Empty image file!!"
      );
      Logger.systemError(
        `[ERROR] code: ${error.code}, message: ${error.message}`
      );
      res.status(400).send(error.message);
      return;
    }

    const quality = utils.findQuality(req.body.q);
    const filenameWithoutExt = req.file.filename.split(".")[0];

    exec(
      `cwebp -q ${quality} ${req.file.path} -o tmp/result/${filenameWithoutExt}.webp`,
      (err, stdout, stderr) => {
        if (err) {
          res.sendStatus(400);
          Logger.systemError(`[ERROR] cwebp error: ${stderr}`);
          return;
        }

        res.sendFile(`tmp/result/${filenameWithoutExt}.webp`, {
          root: __dirname,
        });

        Logger.systemInfo(
          `[SUCESS] ${req.file.filename} → ${filenameWithoutExt}.webp`
        );

        Logger.systemInfo("[END] image to webp");
      }
    );
  });
});

app.use(function (req, res) {
  res.status(404).send("not found!!");
});

app.listen(port, () => {
  Logger.systemInfo(`app listening on ${port}`);
});

class ConvertImageError extends Error {
  constructor(code, message) {
    super();
    this.code = code;
    this.message = message;
  }
}
