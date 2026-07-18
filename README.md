# Signban API

Backend service for Signban, a collaborative kanban application with realtime board and notification updates.

## Stack

- Node.js 22
- Express 5
- Socket.IO
- PostgreSQL
- Sequelize
- Google authentication and Gemini
- Cloudinary
- Nodemailer

## Requirements

- Node.js 22
- PostgreSQL 14 or newer
- npm

## Local setup

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

3. Configure the development database variables in `.env`.

4. Run database migrations:

   ```bash
   npm run migrate
   ```

5. Start the API:

   ```bash
   npm run dev
   ```

The server listens on `http://localhost:3000` by default.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | Yes | `development`, `test`, or `production` |
| `PORT` | No | HTTP and Socket.IO port; defaults to `3000` |
| `CLIENT_URL` | Yes | Frontend origin used by CORS and password-reset links |
| `DB_USERNAME` | Development/test | PostgreSQL username |
| `DB_PASSWORD` | Development/test | PostgreSQL password |
| `DB_DATABASE` | Development/test | PostgreSQL database name |
| `DB_HOST` | Development/test | PostgreSQL host |
| `DB_PORT` | No | PostgreSQL port; defaults to `5432` |
| `DB_DIALECT` | No | Defaults to `postgres` |
| `DATABASE_URL` | Production | Full PostgreSQL connection URL |
| `DB_SSL` | No | Set to `true` only when the PostgreSQL provider requires SSL |
| `JWT_SECRET_KEY` | Yes | Secret used to sign access tokens |
| `GOOGLE_CLIENT_ID` | Google login | Google OAuth client ID |
| `GEMINI_API_KEY` | AI features | Google Gemini API key |
| `MAIL_USER` | Email features | Gmail account used by Nodemailer |
| `MAIL_PASSWORD` | Email features | Gmail app password |
| `CLOUDINARY_CLOUD_NAME` | Image uploads | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Image uploads | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Image uploads | Cloudinary API secret |

Generate a suitable JWT secret with:

```bash
openssl rand -hex 64
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Start the production server |
| `npm run dev` | Start with Nodemon |
| `npm run migrate` | Apply pending migrations without requiring development dependencies |
| `npm run seed` | Run Sequelize seeders in a development environment |
| `npm run undo` | Undo all migrations through Sequelize CLI |
| `npm test` | Run the Jest test suite |

## Health checks

- `GET /health` checks whether the HTTP process is running.
- `GET /health/db` checks whether PostgreSQL is reachable.
- `GET /` returns the legacy API root response.

Use `/health` for container liveness. Use `/health/db` as an explicit database readiness check.

## Docker

Build the production image:

```bash
docker build -t signban-api .
```

Run it with an environment file:

```bash
docker run --rm \
  --env-file .env \
  -p 3000:3000 \
  signban-api
```

The image installs runtime dependencies only and runs as the non-root `node` user.

Run migrations as a separate deployment step:

```bash
docker run --rm --env-file .env signban-api npm run migrate
```

## Coolify deployment

Recommended application settings:

- Build pack: `Dockerfile`
- Exposed port: `3000`
- Health-check path: `/health`
- Post-deployment command: `npm run migrate`
- Replica count: `1`

For a PostgreSQL resource inside the same Coolify network, use its internal connection URL and set:

```env
NODE_ENV=production
DB_SSL=false
DATABASE_URL=postgresql://USER:PASSWORD:HOST:5432/DATABASE
```

Set `DB_SSL=true` only for an external database provider that explicitly requires TLS.

Keep the API at one replica until Socket.IO is configured with a shared adapter such as Redis. Multiple independent replicas can otherwise deliver inconsistent realtime events.

## Security

- Never commit `.env` files or production secrets.
- Use a Gmail app password instead of the account password.
- Keep PostgreSQL private unless external access is explicitly required.
- Rotate secrets immediately if they are exposed in logs, commits, or screenshots.
