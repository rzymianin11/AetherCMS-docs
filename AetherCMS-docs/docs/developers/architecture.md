---
id: developers-architecture
title: Architecture
sidebar_position: 2
---

# Architecture

```mermaid
flowchart LR
Frontend --> GraphQLAPI --> DB[(PostgreSQL)]
GraphQLAPI --> Redis[(Redis)]
```

🟢 Backend + frontend integration complete.  
🟡 Advanced monitoring in progress.  
🔵 SaaS infra planned.

