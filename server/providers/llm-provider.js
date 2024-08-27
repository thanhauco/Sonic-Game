const axios = require("axios");

class LLMProvider {
  constructor(config) {
    this.config = config;
  }

  async chat(messages, options = {}) {
    throw new Error("Method not implemented");
  }

  async complete(prompt, options = {}) {
    throw new Error("Method not implemented");
  }
}

class OpenAIProvider extends LLMProvider {
  async chat(messages, options = {}) {
    // Basic implementation for OpenAI chat completion
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: this.config.model || "gpt-4",
        messages,
        ...options,
      },
      {
        headers: {
          Authorization: `Bearer ${this.config.apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
}

class AnthropicProvider extends LLMProvider {
  async chat(messages, options = {}) {
    // Basic implementation for Anthropic
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: this.config.model || "claude-3-opus-20240229",
        messages,
        ...options,
      },
      {
        headers: {
          "x-api-key": this.config.apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
}

module.exports = {
  LLMProvider,
  OpenAIProvider,
  AnthropicProvider,
  getProvider: (name, config) => {
    switch (name.toLowerCase()) {
      case "openai":
        return new OpenAIProvider(config);
      case "anthropic":
        return new AnthropicProvider(config);
      default:
        throw new Error(`Provider ${name} not supported`);
    }
  },
};
