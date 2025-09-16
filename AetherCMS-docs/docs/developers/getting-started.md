---
id: developers-getting-started
title: Getting Started
sidebar_position: 1
---

# Getting Started for Developers

## Requirements
- Node.js >= 18.19
- Python >= 3.11
- PostgreSQL >= 14
- Redis >= 7
- Docker

## Setup

```bash
git clone https://github.com/rzymianin11/AetherCMS.git
cd AetherCMS
```

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn core.main:app --reload
```

GraphQL: http://localhost:8000/graphql

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Admin: http://localhost:3000/admin

