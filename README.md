<p align="center">
  <img src="docs/logo.png" alt="AetherCMS logo" width="240" />
</p>

# AetherCMS – AI‑first Headless CMS

A modern, AI‑assisted headless CMS with a FastAPI + Strawberry GraphQL backend, a Next.js (App Router) frontend with TipTap editor, PostgreSQL, Redis, Dockerized infra, plugins/hooks, themes, and an admin UI.

### Tech at a glance

![Python 3.11](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![FastAPI 0.115.0](https://img.shields.io/badge/FastAPI-0.115.0-009688?logo=fastapi&logoColor=white)
![Strawberry 0.246.1](https://img.shields.io/badge/Strawberry-0.246.1-FF3E57?logo=graphql&logoColor=white)
![SQLAlchemy 2.0.35](https://img.shields.io/badge/SQLAlchemy-2.0.35-D71F00)
![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Redis 7](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)
![Next.js 14.2.13](https://img.shields.io/badge/Next.js-14.2.13-000000?logo=nextdotjs&logoColor=white)
![React 18.3.1](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)
![TipTap 2.6.6](https://img.shields.io/badge/TipTap-2.6.6-5A67D8)
![Sass ~1.77](https://img.shields.io/badge/Sass-~1.77-CC6699?logo=sass&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![slowapi 0.1.9](https://img.shields.io/badge/slowapi-0.1.9-4B5563)

## Tech Stack

- Backend: FastAPI, Strawberry GraphQL, Pydantic v2, SQLAlchemy, Pluggy (plugins/hooks)
- AI: Optional HuggingFace pipelines (text generation, NER)
- Frontend: Next.js 14 (App Router), React 18, TipTap, Sass
- Database: PostgreSQL (psycopg2 + SQLAlchemy), Redis
- Infra: Docker, Docker Compose, pgAdmin, health checks
- Security: JWT auth, rate limiting (slowapi), CORS, validation
- CI: GitHub Actions (backend tests, frontend build)

## Project Structure

```
/core
  /users           # User model, auth (JWT), GraphQL
  /content         # Content model, service, GraphQL
  /media           # Media service (upload/download)
  /settings        # Plugin & app settings models/services/GraphQL
  /themes          # Theme services + GraphQL
  hooks.py         # Pluggy hookspecs + plugin manager
/services
  ai_service.py    # AI suggest + NER (HF pipelines), hooks integration
/plugins
  /example         # Example plugin logging hooks
/themes
  /default         # Default theme (theme.json)
/frontend
  /app             # Next.js App Router pages (admin, users, content)
  /components      # TipTapEditor, AuthBar, MediaManager
/infrastructure
  docker-compose.yml
  backend.Dockerfile
  frontend.Dockerfile
/media              # persisted uploads (mounted)
/tmp
/tests              # unit & integration tests
  /security         # security tests
  /e2e              # plugin/hooks integration tests
/docs
```

## Quickstart (Docker)

1) Create .env (already included by scaffolding; adjust as needed):

```
BACKEND_PORT=8000
FRONTEND_PORT=3000
CORS_ALLOW_ORIGINS=*
JWT_SECRET=dev_secret_change_me
POSTGRES_USER=aether
POSTGRES_PASSWORD=aether_password
POSTGRES_DB=aether_db
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
DATABASE_URL=postgresql+psycopg2://aether:aether_password@postgres:5432/aether_db
REDIS_URL=redis://redis:6379/0
PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin1234
```

2) Run the stack:

```
docker compose -f infrastructure/docker-compose.yml up --build
```

Services:
- Backend API: http://localhost:8000
- GraphQL (UI/endpoint): http://localhost:8000/graphql
- Frontend: http://localhost:3000
- pgAdmin: http://localhost:5050 (login with `.env` creds)

## Local Development

Backend (without Docker):
```
python -m pip install -r requirements.txt
uvicorn main:app --reload
```

Frontend (without Docker):
```
cd frontend
npm install
npm run dev
```

Postgres/Redis via Docker Compose recommended for dev.

## Authentication (JWT)

- Register/Login via GraphQL mutations.
- Use the returned `accessToken` as `Authorization: Bearer <token>` for protected endpoints (e.g., AI, media).

Example GraphQL (register):
```
mutation { register(email:"user@example.com", password:"Password1") { accessToken refreshToken } }
```

Me:
```
query { me { id email role } }
```

## Content

GraphQL (examples):
```
# Create content (requires Authorization header)
mutation {
  createContent(title:"My Title", body:{text:"Hello"}) { id title }
}

# List
query { listContent(limit:20) { id title authorId createdAt } }
```

### Content Workflow & Publishing

- Post model with statuses: DRAFT, REVIEW, PUBLISHED, SCHEDULED
- Revisions saved on each update; can be listed and restored
- Scheduled publishing via APScheduler (background job checks due items every 30s)

GraphQL:
```
# Posts
mutation { createPost(title:"Hello", content:{text:"Hi"}, status:"DRAFT") { id title status slug } }
query { listPosts(status:"DRAFT", limit:20) { id title status updatedAt } }
query { getPost(id:"<uuid>") { id title content status scheduledPublishAt } }
mutation { updatePost(id:"<uuid>", status:"PUBLISHED") { id status } }
mutation { schedulePublish(id:"<uuid>", datetimeIso:"2025-01-01T10:00:00Z") { id status scheduledPublishAt } }
query { listPostRevisions(postId:"<uuid>") { id createdAt } }
mutation { revertToRevision(postId:"<uuid>", revisionId:"<uuid>") { id title status } }
```

Frontend (Materio-like admin):
- `/admin/content` DataGrid listing with colored status chips, actions (edit, revisions)
- `/admin/content/editor` TipTap editor, status dropdown, schedule datetime picker, AI assistant buttons (title/summarize/best time)
- `/admin/content/revisions` expandable diffs and “AI Best” pick (revert to best SEO revision)

## SEO & Public Pages

- SEO fields on posts: `meta_title`, `meta_description`, `meta_keywords`, `canonical_url`
- Public page: `/post/[slug]` renders server-side meta tags (title, description, canonical)
- `GET /sitemap.xml` – generated from published posts; uses `SITE_URL`
- `GET /robots.txt` – includes pointer to sitemap

Environment:
- `SITE_URL` (default `http://localhost:3000`) used in sitemap/robots

GraphQL:
```
query { getPostBySlug(slug: "my-post") { id title metaTitle metaDescription canonicalUrl } }
```

### Themes Runtime

- Theme configs in `/themes/<name>/theme.json` with colors
- Active theme exposed via GraphQL and applied on the frontend by `ThemeLoader` as CSS variables (`--aether-*`)

## Themes

- Theme configs discovered under `/themes/<name>/theme.json` (or `theme.config.json`).
- Active theme stored in DB (`app_settings.activeTheme`).

GraphQL:
```
query { listThemes { name config } activeTheme }
mutation { switchTheme(name: "default") }
```

## Plugins & Hooks

- Pluggy-based hooks in `core/hooks.py`.
- Example plugin at `plugins/example` logs actions.
- Enabled plugins stored in DB (`plugin_settings`).

GraphQL (settings):
```
query { enabledPlugins }
mutation { setPluginEnabled(name:"example", enabled:true) }
```

Hook events (selection):
- before/after_user_register, before/after_user_login
- before/after_content_save, before/after_content_publish, before/after_content_delete
- before/after_media_upload
- before/after_plugin_activate, before/after_theme_switch
- before/after_ai_content_suggest

## Media

- Upload endpoint: `POST /media/upload` (Authorization required)
  - Valid extensions: `.png .jpg .jpeg .gif .txt`
  - Size limit: ≤ 5MB
- Download endpoint: `GET /media/{filename}`
- Files are persisted under `media/` (mounted into the backend container)

## AI

Endpoints (Authorization required):
- `POST /ai/suggest` with `{ "prompt": "..." }` → `{ "suggestion": "..." }`
- `POST /ai/tag` with `{ "text": "..." }` → `{ "tags": [[word,label], ...] }`

Notes:
- Uses HuggingFace pipelines if available. Falls back to stubs otherwise.
- Hooks fire before/after suggestion.

## Frontend

- TipTap editor with “AI Suggestion” button (inserts suggestion into the editor)
- Auth pages: `/users/login`, `/users/register`, `/users/me`
- Admin panel: `/admin` with sections
  - Themes: list/activate
  - Plugins: enable/disable
  - Media: upload files (client checks extension/size)
- Dashboard widgets: Analytics (line chart + top pages), AI SEO suggestions
- Apollo client with global 401/403 handler → auto logout and redirect to `/users/login`

## Security

- JWT in `Authorization: Bearer <token>` (no cookies)
- Rate limiting via `slowapi` (e.g., `/ai/*` and `/media/upload`)
- CORS origins via `CORS_ALLOW_ORIGINS` (comma-separated) in `.env`
- Input validation: Pydantic models for AI payloads, media size/type checks

## Testing

Run tests in Docker:
```
docker compose -f infrastructure/docker-compose.yml up --build tests
```

Coverage includes:
- Auth/crypto (unit)
- Content & hooks (unit/integration)
- AI service (mocked) + endpoints (integration)
- Security (rate-limit behaviors, upload validation)

## CI

GitHub Actions workflow: `.github/workflows/ci.yml`
- Backend tests with Postgres service
- Frontend install/build

## Environment Reference

Key variables (see `.env`):
- `BACKEND_PORT`, `FRONTEND_PORT`
- `JWT_SECRET` (required, set a strong value in production)
- `DATABASE_URL`, `POSTGRES_*`
- `REDIS_URL`
- `CORS_ALLOW_ORIGINS` (e.g., `http://localhost:3000` or `*` for dev)
- `PGADMIN_EMAIL`, `PGADMIN_PASSWORD`

## Roadmap

- Richer theme runtime integration in frontend
- Role-based access controls
- More AI models and controls
- Plugin discovery & marketplace interface

---

MIT © AetherCMS

## Hooks – Detailed Documentation

The hooks system is built on Pluggy and exposed via `core/hooks.py`. It provides a stable event bus for plugins and internal extensions.

Hookspec markers: `hookspec`, `hookimpl` with project name `aethercms`.

Available hooks and parameters:
- Users
  - `before_user_register(email: str, role: str)`
  - `after_user_register(user_id: int, email: str, role: str)`
  - `before_user_login(email: str)`
  - `after_user_login(user_id: int, email: str)`
- Content
  - `before_content_save(title: str, body: JSON, author_id: int)` (firstresult=True; may modify data upstream through service pre-processing)
  - `after_content_save(content_id: int)`
  - `before_content_publish(content_id: int)` / `after_content_publish(content_id: int)`
  - `before_content_delete(content_id: int)` / `after_content_delete(content_id: int)`
- Media
  - `before_media_upload(filename: str, size_bytes: int)`
  - `after_media_upload(filename: str, size_bytes: int, media_id: int)`
- Plugins & Themes
  - `before_plugin_activate(name: str)` / `after_plugin_activate(name: str)`
  - `before_theme_switch(name: str)` / `after_theme_switch(name: str)`
- AI
  - `before_ai_content_suggest(prompt: str)`
  - `after_ai_content_suggest(prompt: str, suggestion: str)`

Writing a plugin (example):
```
# plugins/example/plugin.py
from core.hooks import hookimpl

class ExamplePlugin:
    @hookimpl
    def after_user_register(self, user_id: int, email: str, role: str) -> None:
        print(f"registered {email}")

plugin = ExamplePlugin()
```

Enabling a plugin:
```
mutation { setPluginEnabled(name:"example", enabled:true) }
query { enabledPlugins }
```

Auto-loading: On startup, the backend reads enabled plugins from DB (`plugin_settings`) and imports `plugins.<name>.plugin`.

Notes:
- Hooks run synchronously; keep heavy work off the request path or delegate to background tasks.
- `before_content_save` may be composed with service-level preprocessing. Treat its return as advisory if used directly in services.

## API Extensibility

- GraphQL schema registry: Plugins can register additional types and Query/Mutation extensions using `core/api/schema_registry.py` (`register_type`, `register_query_extension`). Example plugin: `plugins/example_api` adds `helloPlugin`.
- REST proxy: Optional REST endpoints under `/api/rest/*` that map to GraphQL (e.g., `GET /api/rest/content/{id}`, `POST /api/rest/content`). Toggle via `ENABLE_REST_PROXY` (default true).
- Webhooks: Manage webhooks via GraphQL (`listWebhooks`, `createWebhook`, `toggleWebhook`, `deleteWebhook`). Events: `content.published`, `order.created`, `media.uploaded`, `user.registered`.
- CLI: `cms-cli` (Typer) for exporting/importing content and managing plugins. Examples:
  - `CMS_TOKEN=... GRAPHQL_URL=http://localhost:8000/graphql python -m cli.cms_cli export-content --output=content.json`
  - `python -m cli.cms_cli import-content --file=content.json`
  - `python -m cli.cms_cli list-plugins`
  - `python -m cli.cms_cli enable-plugin ecommerce`

## Technology Details

Core libraries and roles:
- FastAPI: web framework (endpoints, middleware)
- Strawberry GraphQL: GraphQL schema and resolvers
- SQLAlchemy: ORM and metadata for models
- Pydantic v2: request/response validation and settings
- Pluggy: plugin/hook registration and dispatch
- Uvicorn: ASGI server
- slowapi + limits: request rate limiting
- HuggingFace transformers (optional): AI text gen/NER via pipelines
- Next.js (App Router) + React: frontend runtime
- TipTap: rich text editor for content
- Apollo Client: GraphQL client with auth/error links
- Sass: styling
- Docker/Compose: local orchestration; pgAdmin for DB admin

## Changelog

Unreleased
- Add richer theme runtime integration in frontend
- Role-based access controls (RBAC)
- Additional AI providers and configurable models

0.5.0 (Media Core)
- Core Media Manager in `core/media` with responsive sizes and WebP generation
  - Models, migrations, services (upload/delete/rename/move), storage utils
  - GraphQL CRUD (list/get/upload/delete/updateAlt/rename/move)
  - Cache invalidation hooks for media mutations
  - Dynamic thumbnail sizes (registry + DB persistence + GraphQL resolvers)
  - CLI: regenerate custom thumbnail sizes for existing media (`core/media/cli_regenerate.py`)
- Frontend Media Library (admin)
  - Grid/list view, preview dialog, actions (rename/move/delete), drag&drop move
  - Folder breadcrumbs and navigation, keyboard navigation, upload progress & toasts
- Performance & caching
  - Redis-backed cache and GraphQL cache middleware with decorators
  - Advanced: user-scoped cache, stampede protection, stale-while-revalidate
  - Performance admin plugin (basic and advanced settings)
- Plugin & themes
  - Frontend dynamic plugin loader; fixed REST fetch base using `NEXT_PUBLIC_BACKEND_URL`
  - Docker compose updated to route GraphQL to backend service from frontend
- Testing
  - Backend pytest for media/caching; frontend Vitest for media UI and plugin loader
  - Playwright E2E setup with Media Manager flows

0.4.0
- Collaboration plugin:
  - Models/migrations for sessions, comments, presence (collab_*)
  - WebSocket endpoint `/ws/collaboration/{postId}` for real-time editing
  - Frontend `CollabEditor`, comments panel, presence avatars (pluginized)
  - AI summary of collaboration session (heuristic fallback)

0.3.0
- API extensibility:
  - GraphQL schema registry for plugin-provided types/resolvers
  - REST proxy `/api/rest/*` (toggle via `ENABLE_REST_PROXY`)
  - Webhooks system with events and GraphQL management
  - CLI `cms-cli` for export/import and plugin enable/disable

0.2.0
- Pluginized frontend: ecommerce UI moved to `plugins/ecommerce/frontend` with exported `index.ts`
- Backend plugin registry: `plugins/<name>/plugin.json` + `/api/plugins/active`
- Frontend dynamic plugin loader: builds menu and routes from active plugins
- Tests: plugin loader unit tests and ecommerce component tests

0.1.0 (Initial)
- Backend: users/content/media/settings/themes; GraphQL resolvers; hooks + plugins; AI endpoints; rate limiting; validation; CORS
- Frontend: TipTap editor with AI Suggestion; admin panel (themes/plugins/media/content with workflow & revisions); auth pages; Apollo with auto-logout on 401/403; Materio-like shell (MUI) with dark/light & i18n
- Infra: Docker Compose (backend, frontend, postgres, redis, pgAdmin), health checks
- Tests: unit + integration (AI mocked, hooks e2e, security)
