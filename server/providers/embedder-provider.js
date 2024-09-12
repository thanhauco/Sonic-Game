const axios = require('axios');

class EmbedderProvider {
  constructor(config) {
    this.config = config;
  }

  async embed(text) {
    throw new Error('Method not implemented');
  }

  async embedBatch(texts) {
    return Promise.all(texts.map(t => this.embed(t)));
  }
}

class OpenAIEmbedder extends EmbedderProvider {
  async embed(text) {
    const response = await axios.post('https://api.openai.com/v1/embeddings', {
      model: this.config.model || 'text-embedding-3-small',
      input: text
    }, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.data[0].embedding;
  }
}

class LocalEmbedder extends EmbedderProvider {
  async embed(text) {
    const response = await axios.post(`${this.config.baseUrl}/embeddings`, {
      model: this.config.model,
      input: text
    });
    return response.data.embedding;
  }
}

module.exports = {
  EmbedderProvider,
  OpenAIEmbedder,
  LocalEmbedder,
  getEmbedder: (name, config) => {
    switch (name.toLowerCase()) {
      case 'openai': return new OpenAIEmbedder(config);
      case 'local': return new LocalEmbedder(config);
      default: throw new Error(`Embedder ${name} not supported`);
    }
  }
};
