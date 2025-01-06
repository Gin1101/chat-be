import appRootPath from 'app-root-path';
import sharp from "sharp";
import fs from 'fs';
import path from 'path';

class FormatFile {
  fileName;

  constructor(fileName) {
    this.fileName = fileName;
    const isFileExist = this._isFileExist(fileName);
    if (!isFileExist) throw new Error("Không tìm thấy file");
  }

  async resizeFile(width, height, format = 'png') {
    const fileNameFormat = this._formatNameFile({ width, height, format });
    if (this._isFileExist(fileNameFormat)) {
      return this._rootPathFile(fileNameFormat);
    }

    const fileHandled = await this._createFileStreamHandle({ width, height, format });
    fs.writeFileSync(this._rootPathFile(fileNameFormat), fileHandled);
    return this._rootPathFile(fileNameFormat);
  }

  _isFileExist(file) {
    return fs.existsSync(this._rootPathFile(file));
  }

  _rootPathFile(file) {
    const cndDir = `${appRootPath.resolve('/cdn')}/${file}`;
    return cndDir;
  }

  _createFileStreamHandle({ width, height, format }) {
    const readStream = fs.readFileSync(this._rootPathFile(this.fileName));
    return sharp(readStream)
    .resize(width, height)
    .toFormat(format)
    .toBuffer();
  }

  _formatNameFile({ width, height, format }) {
    const fileNameIgnoreExtension = this.fileName.replace(path.extname(this.fileName), '');
    if (void 0 !== width && void 0 !== height) {
      return `${fileNameIgnoreExtension}_${width}x${height}.${format}`;
    }
    return `${fileNameIgnoreExtension}_x${width || height}.${format}`;
  }
}

export default FormatFile;