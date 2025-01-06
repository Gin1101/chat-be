import express from "express";
import appRootPath from 'app-root-path';
import fs from 'fs';
import path from "path";
import shortid from "shortid";
import FormatFile from "#src/helpers/FormatFile.js";
import { verifyMiddleware } from "#src/middleware/auth.js";

const router = express.Router();

router.post('/upload', verifyMiddleware('*'), function(req, res) {
  
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: "Không tìm thấy file." });
  }

  const chatFile = req.files.chatFile;
  const cndDir = appRootPath.resolve('/cdn');

  if (fs.existsSync(cndDir) === false) {
    fs.mkdirSync(cndDir);
  }

  const MB5 = 1024 * 1024 * 5;

  if (chatFile.size >= MB5) {
    return res.status(400).json({ error: "File quá lớn" });
  }

  const nameRandom = shortid.generate() + path.extname(chatFile.name);

  const uploadPath = cndDir + '/' + nameRandom;

  if (!chatFile.mimetype.match(/^image/)) {
    return res.status(400).json({ error: "Lỗi upload" });
  }

  chatFile.mv(uploadPath, function(err) {
    if (err) {
      return res.status(500).json({ error: "Lỗi upload" });
    }
    res.json({ data: nameRandom});
  });
});

router.get('/file/:name', async (req, res) => {
  const widthString = req.query.width
  const heightString = req.query.height
  const format = req.query.format
  const fileName = req.params.name

  // Parse to integer if possible
  let width, height
  if (widthString) {
    width = parseInt(widthString)
  }
  if (heightString) {
    height = parseInt(heightString)
  }

  try {
    const formatFile = new FormatFile(fileName);
    const fileHandled = await formatFile.resizeFile(width, height, format);
    res.type(`image/${format || 'png'}`)
    return res.sendFile(fileHandled);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
})

export default router;
