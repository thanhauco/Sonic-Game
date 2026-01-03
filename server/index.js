const express = require('express');
const cors = require('cors');
const WorkspaceManager = require('./workspaces/workspace-manager');
const DocumentProcessor = require('./workspaces/document-processor');
const { getProvider } = require('./providers/llm-provider');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const workspaceManager = new WorkspaceManager('./storage');
const documentProcessor = new DocumentProcessor();

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

// Chat / RAG
app.post('/api/chat', async (req, res) => {
  const { workspaceId, message } = req.body;
  // Implementation of RAG logic here
  res.json({ answer: `Responding to ${message} in ${workspaceId}` });
});

app.listen(port, () => {
  console.log(`Jordan Agents Server running on port ${port}`);
});
