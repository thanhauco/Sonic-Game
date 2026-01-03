const fs = require('fs-extra');
const path = require('path');

class DocumentProcessor {
  constructor() {
    this.supportedExtensions = ['.txt', '.md', '.pdf', '.docx', '.json'];
  }

  async process(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (!this.supportedExtensions.includes(ext)) {
      throw new Error(`Unsupported file type: ${ext}`);
    }

    const stats = await fs.stat(filePath);
    const content = await this._readContent(filePath, ext);
    
    return {
      name: path.basename(filePath),
      extension: ext,
      size: stats.size,
      content,
      chunks: this._chunkContent(content)
    };
  }

  async _readContent(filePath, ext) {
    // Simplified reading logic
    if (ext === '.json') {
      const data = await fs.readJson(filePath);
      return JSON.stringify(data);
    }
    return fs.readFile(filePath, 'utf-8');
  }

  _chunkContent(content, chunkSize = 1000, chunkOverlap = 200) {
    const chunks = [];
    let start = 0;
    
    while (start < content.length) {
      const end = start + chunkSize;
      chunks.push(content.substring(start, end));
      start += (chunkSize - chunkOverlap);
    }
    
    return chunks;
  }
}

module.exports = DocumentProcessor;
