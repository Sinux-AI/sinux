# Sinux AI: Product Feature Guide (V1.0)

This is the definitive guide to Sinux's features, identity, and business logic. It provides the "Why" and "How" behind the technology.

---

## 🌎 Organization vs. Standalone User

Sinux supports a dual-tenant architecture:
- **Standalone User**: Direct credit wallet, private agents, private history.
- **Organization (Org)**: Shared credit wallet, shared knowledge documents, shared specialized agents, and shared integration credentials (e.g., a company Slack bot).

---

## 🎭 The Leading Four (Personalities)

These are the primary identities of Sinux. They influence tone, reasoning, and brand feel.
1.  **Atlas (The Researcher)**: High accuracy, blue/steel palette. Focus: Precise data retrieval and citations.
2.  **Nexus (The Analyst)**: Deep-dives, purple/indigo palette. Focus: Complex pattern recognition and data synthesis.
3.  **Sentinel (The Guardian)**: Security-first, green/emerald palette. Focus: Compliance, risk mitigation, and cautious responses.
4.  **Harper (The Creative)**: Energetic, pink/orange palette. Focus: High-vibe content creation and brainstorming.

---

## 🧩 Core Product Features

### 1. Unified Inference Gateway
- **Centralized Engine**: Users can toggle between `Llama` and `Gemini` models instantly.
- **Token Economy**: Users pay per-token, ensuring a "Pay-as-you-grow" model for startups and enterprise.

### 2. God-Mode: Dynamic Tools
- **The Magic**: Turn ANY API documentation into a tool for your agents. 
- **The Flow**: Parse Documentation -> Generate Schema -> Save as Tool -> Agent now "sees" and uses that tool during inference.

### 3. Micro-Agent Orchestration
- **The Manager-Specialist Loop**: A central Manager (e.g., Atlas) breaks down a prompt into sub-tasks and delegates to "Specialists" (e.g., GitHub Analyst, Email Assistant).
- **Sub-tasks**: Track exact progress (Queued -> Running -> Completed).
- **Cost Transparency**: See the exact ZAR cost of each specialist's reasoning.

### 4. Knowledge Base (RAG)
- **Document Store**: Upload PDFs, Markdown, or Text.
- **Automatic Indexing**: Background ingestion into vector embeddings.
- **Context Pinning**: Specific agents can be "pinned" to specific knowledge bases to ensure domain expertise.

### 5. Social Channel Integration
- **Platform Sync**: Deploy your Sinux agents directly to Discord or Slack.
- **Unified Logic**: The same agent profile used in the dashboard is the one responding in your social channels.

### 6. Agent Lifecycle Management
- **Custom Specialization**: Users can build a "Specialist" from scratch by defining a system prompt and selecting specific tool permissions.
- **Templating**: The **Duplicate** feature allows users to clone a base personality (e.g., Atlas) and customize it for a specific niche (e.g., "Atlas - Legal Researcher").

### 7. Execution Performance & Jobs
- **Transparency**: Every AI interaction is tracked as a **Job**.
- **Progressive Monitoring**: For orchestration, users see the breakdown of which agent is currently active and what they have accomplished.
- **Cost Metrics**: Real-time ZAR cost tracking per interaction ensures users are never surprised by their usage.

---

## 💳 Hybrid Billing Architecture

Integrated into the heart of the platform:
- **Subscriptions (Unlock)**: Fixed monthly fees (250-2500 ZAR) to UNLOCK premium tiers (Pro/Premium/Advanced) and elite tools.
- **Credits (Usage)**: ZAR wallet balance deducted per-token at tiered rates.
- **Tool Fees**: A fixed R0.10 fee per functional tool-call covers infrastructure overhead.
