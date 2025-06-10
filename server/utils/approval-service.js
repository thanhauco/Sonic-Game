const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class ApprovalService {
  constructor(storagePath) {
    this.approvalPath = path.join(storagePath, 'approvals', 'pending.json');
    fs.ensureDirSync(path.dirname(this.approvalPath));
  }

  async requestApproval(data) {
    const approvals = await this._readApprovals();
    const id = uuidv4();
    const entry = {
      id,
      status: 'pending',
      request: data,
      createdAt: new Date().toISOString()
    };

    approvals[id] = entry;
    await this._saveApprovals(approvals);
    return id;
  }

  async getApproval(id) {
    const approvals = await this._readApprovals();
    return approvals[id];
  }

  async setStatus(id, status, feedback = '') {
    const approvals = await this._readApprovals();
    if (!approvals[id]) throw new Error('Approval request not found');
    
    approvals[id].status = status;
    approvals[id].feedback = feedback;
    approvals[id].updatedAt = new Date().toISOString();
    
    await this._saveApprovals(approvals);
    return approvals[id];
  }

  async listPending() {
    const approvals = await this._readApprovals();
    return Object.values(approvals).filter(a => a.status === 'pending');
  }

  async _readApprovals() {
    if (!await fs.pathExists(this.approvalPath)) {
      return {};
    }
    return fs.readJson(this.approvalPath);
  }

  async _saveApprovals(approvals) {
    await fs.writeJson(this.approvalPath, approvals, { spaces: 2 });
  }
}

module.exports = ApprovalService;
