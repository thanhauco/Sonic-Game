const axios = require('axios');
const TokenTracker = require('../utils/token-tracker');

class LLMProvider {
  constructor(config) {
    this.config = config;
    this.tracker = new TokenTracker(config.storagePath || './storage');
  }

  async chat(messages, options = {}) {
    throw new Error('Method not implemented');
  }

  async complete(prompt, options = {}) {
    throw new Error('Method not implemented');
  }

  async _trackUsage(usage, model, workspaceId, agentId) {
    if (!usage) return;
    await this.tracker.track({
      model,
      promptTokens: usage.prompt_tokens,
      completionTokens: usage.completion_tokens,
      workspaceId: workspaceId || 'default',
      agentId: agentId || 'default'
    });
  }
}

class OpenAIProvider extends LLMProvider {
  async chat(messages, options = {}) {
    const model = this.config.model || 'gpt-4o';
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model,
      messages,
      ...options
    }, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.usage) {
      await this._trackUsage(response.data.usage, model, options.workspaceId, options.agentId);
    }

    return response.data;
  }
}

class AnthropicProvider extends LLMProvider {
  async chat(messages, options = {}) {
    const model = this.config.model || 'claude-3-5-sonnet-20240620';
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model,
      max_tokens: options.max_tokens || 1024,
      messages: messages.filter(m => m.role !== 'system'),
      system: messages.find(m => m.role === 'system')?.content,
      ...options
    }, {
      headers: {
        'x-api-key': this.config.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      }
    });

    if (response.data.usage) {
      await this._trackUsage({
        prompt_tokens: response.data.usage.input_tokens,
        completion_tokens: response.data.usage.output_tokens
      }, model, options.workspaceId, options.agentId);
    }

    return response.data;
  }
}

class GeminiProvider extends LLMProvider {
  async chat(messages, options = {}) {
    const model = this.config.model || 'gemini-1.5-pro';
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.config.apiKey}`, {
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      ...options
    });
    return response.data;
  }
}

class GroqProvider extends LLMProvider {
  async chat(messages, options = {}) {
    const model = this.config.model || 'llama3-70b-8192';
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model,
      messages,
      ...options
    }, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.usage) {
      await this._trackUsage(response.data.usage, model, options.workspaceId, options.agentId);
    }

    return response.data;
  }
}

module.exports = {
  LLMProvider,
  OpenAIProvider,
  AnthropicProvider,
  GeminiProvider,
  GroqProvider,
  getProvider: (name, config) => {
    switch (name.toLowerCase()) {
      case 'openai': return new OpenAIProvider(config);
      case 'anthropic': return new AnthropicProvider(config);
      case 'gemini': return new GeminiProvider(config);
      case 'groq': return new GroqProvider(config);
      default: throw new Error(`Provider ${name} not supported`);
    }
  }
};
