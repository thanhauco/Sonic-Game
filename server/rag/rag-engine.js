class RAGEngine {
  constructor(llmProvider, embedderProvider, vectorDBProvider) {
    this.llm = llmProvider;
    this.embedder = embedderProvider;
    this.vectorDB = vectorDBProvider;
  }

  async query(workspaceId, question, options = {}) {
    // 1. Generate embedding for the question
    const queryVector = await this.embedder.embed(question);

    // 2. Search for relevant context in the vector DB
    const results = await this.vectorDB.search(workspaceId, queryVector, options.limit || 5);
    
    // 3. Construct prompt with context
    const context = results.map(r => r.content).join('\n\n');
    const systemPrompt = `You are a helpful assistant. Use the following context to answer the user's question. 
    If you don't know the answer, say you don't know. Do not make up information.
    
    Context:
    ${context}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question }
    ];

    // 4. Get completion from LLM
    const response = await this.llm.chat(messages, options);

    return {
      answer: response,
      sources: results.map(r => ({ name: r.name, score: r.score }))
    };
  }
}

module.exports = RAGEngine;
