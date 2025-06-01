const fs = require('fs-extra');
const path = require('path');

class DocumentProcessor {
  constructor() {
    this.supportedExtensions = ['.txt', '.md', '.pdf', '.docx', '.json', '.png', '.jpg', '.jpeg', '.mp3', '.wav', '.mp4'];
    this.multimodalExtensions = ['.png', '.jpg', '.jpeg', '.mp3', '.wav', '.mp4'];
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
    if (this.multimodalExtensions.includes(ext)) {
      if (['.mp3', '.wav', '.mp4'].includes(ext)) {
        return `[Transcribing audio/video ${path.basename(filePath)}...] This is a synthetic transcription placeholder for a multimodal agentic RAG system.`;
      }
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        return `[Analyzing image ${path.basename(filePath)}...] Visual description placeholder: A digital flowchart showing system architecture with nodes for UI, API, and Agent Engine.`;
      }
    }

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
