const fs = require('fs-extra');
const path = require('path');
const { getVectorDB } = require('../providers/vector-db-provider');

class WorkspaceManager {
  constructor(storagePath) {
    this.storagePath = storagePath;
    this.workspacesDir = path.join(storagePath, 'workspaces');
    fs.ensureDirSync(this.workspacesDir);
  }

  async createWorkspace(name, config = {}) {
    const workspaceId = name.toLowerCase().replace(/\s+/g, '-');
    const workspacePath = path.join(this.workspacesDir, workspaceId);
    
    if (await fs.pathExists(workspacePath)) {
      throw new Error('Workspace already exists');
    }

    await fs.ensureDir(workspacePath);
    await fs.writeJson(path.join(workspacePath, 'config.json'), {
      name,
      createdAt: new Date().toISOString(),
      ...config
    });

    return { id: workspaceId, name };
  }

  async listWorkspaces() {
    const dirs = await fs.readdir(this.workspacesDir);
    const workspaces = [];
    
    for (const id of dirs) {
      const configPath = path.join(this.workspacesDir, id, 'config.json');
      if (await fs.pathExists(configPath)) {
        const config = await fs.readJson(configPath);
        workspaces.push({ id, ...config });
      }
    }
    
    return workspaces;
  }

  async deleteWorkspace(id) {
    const workspacePath = path.join(this.workspacesDir, id);
    await fs.remove(workspacePath);
    return true;
  }
}

module.exports = WorkspaceManager;
