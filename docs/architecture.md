# Architecture & Analytics

## System Architecture

```mermaid
graph TD
    User((User))
    UI[Frontend: React/Vite]
    API[Backend: Express API]
    WM[Workspace Manager]
    DP[Document Processor]
    RE[RAG Engine]
    AE[Agent Engine: Python]
    VDB[(Vector Database: LanceDB)]
    LLM[LLM Provider: OpenAI/Gemini/etc]

    User --> UI
    UI --> API
    API --> WM
    API --> RE
    WM --> DP
    DP --> VDB
    RE --> VDB
    RE --> LLM
    API --> AE
    AE --> LLM
```

## Agent Lifecycle

```mermaid
sequenceDiagram
    participant User
    participant Parser as NL Parser
    participant Builder as Agent Builder
    participant Runtime as Execution Runtime

    User->>Parser: "Create a researcher agent"
    Parser->>Builder: Define Agent Specs
    Builder->>Builder: Save to JSON Storage
    User->>Runtime: Run task: "Analyze latest trends"
    Runtime->>Builder: Fetch Agent Config
    Runtime->>LLM: Execute with context
    LLM-->>Runtime: Task Output
    Runtime-->>User: Final Result
```

## Analytics Data Flow

1. **Input Metrics**: Token usage per agent, document processing time.
2. **Execution Stats**: Task success rate, average latency.
3. **Workspace Insights**: Document count, storage usage, search frequency.
