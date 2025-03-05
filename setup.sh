#!/bin/bash

# Jordan Agents Setup Script

echo "🚀 Setting up Jordan Agents..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup Server
echo "🖥️ Setting up Server..."
cd server && npm install && cd ..

# Setup Frontend
echo "🎨 Setting up Frontend..."
cd frontend && npm install && cd ..

# Setup Agent Engine (Python)
echo "🐍 Setting up Agent Engine..."
if command -v python3 &>/dev/null; then
    python3 -m venv venv
    source venv/bin/activate
    pip install -r agent-engine/requirements.txt || echo "⚠️ requirements.txt not found, skipping pip install"
else
    echo "❌ Python3 not found. Please install Python3 to run the Agent Engine."
fi

# Create .env from template if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Creating .env from template..."
    cp .env.template .env
    echo "⚠️ Please edit .env with your API keys."
fi

echo "✅ Setup complete! Run 'npm run dev' to start the application."
