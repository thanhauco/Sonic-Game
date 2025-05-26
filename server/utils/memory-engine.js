const fs = require('fs-extra');
const path = require('path');

/**
 * Persistent Memory Engine
 * Uses a graph-based structure to store relationships and entities.
 * Simplified implementation using a local JSON-based adjacency list for demonstration.
 */
class MemoryEngine {
  constructor(storagePath) {
    this.memoryPath = path.join(storagePath, 'memory', 'graph.json');
    fs.ensureDirSync(path.dirname(this.memoryPath));
  }

  async addEntity(id, type, properties = {}) {
    const graph = await this._readGraph();
    if (!graph.nodes[id]) {
      graph.nodes[id] = { id, type, properties, createdAt: new Date().toISOString() };
      await this._saveGraph(graph);
    }
    return graph.nodes[id];
  }

  async addRelationship(sourceId, targetId, relation, properties = {}) {
    const graph = await this._readGraph();
    if (!graph.nodes[sourceId] || !graph.nodes[targetId]) {
      throw new Error('Source or target node not found');
    }

    const edgeId = `${sourceId}-${relation}-${targetId}`;
    graph.edges[edgeId] = {
      id: edgeId,
      source: sourceId,
      target: targetId,
      relation,
      properties,
      createdAt: new Date().toISOString()
    };

    await this._saveGraph(graph);
    return graph.edges[edgeId];
  }

  async queryMemory(entityId) {
    const graph = await this._readGraph();
    const node = graph.nodes[entityId];
    if (!node) return null;

    const relationships = Object.values(graph.edges).filter(
      e => e.source === entityId || e.target === entityId
    );

    return { node, relationships };
  }

  async _readGraph() {
    if (!await fs.pathExists(this.memoryPath)) {
      return { nodes: {}, edges: {} };
    }
    return fs.readJson(this.memoryPath);
  }

  async _saveGraph(graph) {
    await fs.writeJson(this.memoryPath, graph, { spaces: 2 });
  }
}

module.exports = MemoryEngine;
