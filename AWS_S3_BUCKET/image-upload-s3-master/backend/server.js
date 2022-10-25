const express = require("express");

const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { uploadFile, getFileStream } = require("./s3");

const app = express();

app.get("/images/:key", (req, res) => {
  console.log("req.params===", req.params);
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

app.post("/images", upload.single("image"), async (req, res) => {
  const fileExtension = req.file.originalname.split(".").slice(-1)[0];
  console.log("fileExtension===>", fileExtension);

  const file = {
    ...req.file,
    filename: `${req.file.filename}.${fileExtension}`,
  };
  console.log("file===>", file);

  // apply filter
  // resize

  const result = await uploadFile(file);
  await unlinkFile(file.path);
  console.log("result====", result);
  const description = req.body.description;
  res.send({ imagePath: `/images/${result.Key}` });
});

app.listen(8080, () => console.log("listening on port 8080"));
