const fs = require('fs-extra');
const path = require('path');

class TokenTracker {
  constructor(storagePath) {
    this.statsPath = path.join(storagePath, 'stats', 'token-usage.json');
    fs.ensureDirSync(path.dirname(this.statsPath));
    this.prices = {
      'gpt-4o': { prompt: 5.00, completion: 15.00 }, // per 1M tokens
      'gpt-3.5-turbo': { prompt: 0.50, completion: 1.50 },
      'claude-3-5-sonnet-20240620': { prompt: 3.00, completion: 15.00 },
      'gemini-1.5-pro': { prompt: 3.50, completion: 10.50 },
    };
  }

  async track(data) {
    const { model, promptTokens, completionTokens, workspaceId, agentId } = data;
    const stats = await this._readStats();
    
    const cost = this._calculateCost(model, promptTokens, completionTokens);
    const timestamp = new Date().toISOString();

    const entry = {
      timestamp,
      model,
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
      cost,
      workspaceId,
      agentId
    };

    stats.history.push(entry);
    stats.totals.tokens += entry.totalTokens;
    stats.totals.cost += cost;

    if (!stats.byWorkspace[workspaceId]) stats.byWorkspace[workspaceId] = { tokens: 0, cost: 0 };
    stats.byWorkspace[workspaceId].tokens += entry.totalTokens;
    stats.byWorkspace[workspaceId].cost += cost;

    await fs.writeJson(this.statsPath, stats, { spaces: 2 });
    return entry;
  }

  async _readStats() {
    if (!await fs.pathExists(this.statsPath)) {
      return { 
        totals: { tokens: 0, cost: 0 },
        byWorkspace: {},
        history: [] 
      };
    }
    return fs.readJson(this.statsPath);
  }

  _calculateCost(model, prompt, completion) {
    const pricing = this.prices[model] || { prompt: 0, completion: 0 };
    return (prompt * pricing.prompt + completion * pricing.completion) / 1000000;
  }
}

module.exports = TokenTracker;
