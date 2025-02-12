# Build stage for Frontend
FROM node:20-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Final stage
FROM node:20-slim
WORKDIR /app

# Install Python for Agent Engine
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# Copy Server
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server/ ./server/

# Copy Frontend Build
COPY --from=frontend-build /app/frontend/dist ./server/public

# Copy Agent Engine
COPY agent-engine/ ./agent-engine/
RUN pip3 install -r agent-engine/requirements.txt || true

EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "server/index.js"]
