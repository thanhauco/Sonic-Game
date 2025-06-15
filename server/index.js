const express = require('express');
const cors = require('cors');
const WorkspaceManager = require('./workspaces/workspace-manager');
const DocumentProcessor = require('./workspaces/document-processor');
const MemoryEngine = require('./utils/memory-engine');
const ApprovalService = require('./utils/approval-service');
const { getProvider } = require('./providers/llm-provider');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const storagePath = './storage';
const workspaceManager = new WorkspaceManager(storagePath);
const documentProcessor = new DocumentProcessor();
const memoryEngine = new MemoryEngine(storagePath);
const approvalService = new ApprovalService(storagePath);

// Workspaces
app.get('/api/workspaces', async (req, res) => {
  const workspaces = await workspaceManager.listWorkspaces();
  res.json(workspaces);
});

app.post('/api/workspaces', async (req, res) => {
  const { name } = req.body;
  const workspace = await workspaceManager.createWorkspace(name);
  res.json(workspace);
});

// Memory / Knowledge Graph
app.get('/api/memory/:id', async (req, res) => {
  const memory = await memoryEngine.queryMemory(req.params.id);
  res.json(memory);
});

app.post('/api/memory/entities', async (req, res) => {
  const { id, type, properties } = req.body;
  const entity = await memoryEngine.addEntity(id, type, properties);
  res.json(entity);
});

app.post('/api/memory/relationships', async (req, res) => {
  const { source, target, relation, properties } = req.body;
  const edge = await memoryEngine.addRelationship(source, target, relation, properties);
  res.json(edge);
});

// Approvals (HITL)
app.get('/api/approvals/pending', async (req, res) => {
  const pending = await approvalService.listPending();
  res.json(pending);
});

app.post('/api/approvals/:id/status', async (req, res) => {
  const { status, feedback } = req.body;
  const result = await approvalService.setStatus(req.params.id, status, feedback);
  res.json(result);
});

// Chat / RAG
app.post('/api/chat', async (req, res) => {
  const { workspaceId, message } = req.body;
  // Implementation of RAG logic here
  res.json({ answer: `Responding to ${message} in ${workspaceId}` });
});

app.listen(port, () => {
  console.log(`Jordan Agents Server running on port ${port}`);
});
