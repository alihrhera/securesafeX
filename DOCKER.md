# Docker Setup for SecureSafeX Landing Page

This project is containerized with Docker for easy deployment. The setup includes:

- **API Server** (Node.js): Handles waitlist signups at `http://localhost/api/waitlist`
- **Web Server** (Nginx): Serves the landing page and static assets at `http://localhost`

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and start containers
docker-compose up -d

# The landing page is now available at: http://localhost
# API health check: http://localhost/healthz
```

### Using Makefile

```bash
# Build the image
make build

# Start the service
make up

# View logs
make logs

# Open a shell in the API container
make shell

# Run tests
make test

# Stop and remove containers + volumes
make clean
```

## Environment Variables

The API server respects the following environment variables (configurable in `docker-compose.yml`):

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8787` | API server port (internal) |
| `HOST` | `0.0.0.0` | API server bind address |
| `DATA_DIR` | `/app/data` | Directory to store waitlist submissions |
| `ALLOWED_ORIGINS` | `http://localhost,http://127.0.0.1` | CORS allowed origins |
| `RATE_LIMIT_MAX` | `10` | Max requests per window |
| `RATE_LIMIT_WINDOW_MS` | `600000` | Rate limit window in milliseconds (10 min) |
| `MAX_RECORDS` | `50000` | Maximum number of stored records |
| `TRUST_PROXY` | `1` | Number of proxies to trust for X-Forwarded-For |

### Customizing Environment

Edit `docker-compose.yml` and modify the `environment` section under `securex-api`, then restart:

```bash
docker-compose restart securex-api
```

## File Structure

```
.
├── Dockerfile              # Multi-stage build for API server
├── docker-compose.yml      # Docker Compose configuration
├── nginx.conf              # Nginx reverse proxy & static server
├── .dockerignore           # Files to exclude from image
├── Makefile                # Convenient commands
├── DOCKER.md               # This file
├── index.html              # Landing page (served by Nginx)
├── assets/                 # Images, stylesheets, etc.
├── 3d/assets/              # 3D assets
├── server/                 # API server source
│   ├── src/
│   │   ├── server.js       # Main server
│   │   ├── store.js        # Data persistence
│   │   └── validate.js     # Input validation
│   └── package.json
└── ...
```

## Architecture

```
┌─────────────────────┐
│  Client (Browser)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Nginx (Port 80)    │  ◄── Public-facing web server
│  ├─ Serve HTML/CSS  │
│  ├─ Serve assets    │
│  └─ Proxy /api/*    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Node.js API        │
│  (Port 8787)        │  ◄── Internal API server
│  /api/waitlist      │
│  /healthz           │
└─────────────────────┘
           │
           ▼
┌─────────────────────┐
│  /app/data/         │  ◄── Persistent volume
│  (Waitlist records) │      Docker named volume
└─────────────────────┘
```

## Common Tasks

### View logs in real-time
```bash
docker-compose logs -f securex-api
docker-compose logs -f securex-web
```

### Run tests in the container
```bash
docker-compose exec securex-api npm test
```

### Access the container shell
```bash
docker-compose exec securex-api sh
```

### Manually test the API
```bash
curl -X POST http://localhost/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "stage": "signup",
    "email": "test@example.com",
    "name": "Test User"
  }'
```

### Check API health
```bash
curl http://localhost/healthz
```

### View stored waitlist data
```bash
docker-compose exec securex-api ls -la /app/data/
```

## Building for Production

### Using docker build directly
```bash
docker build -t securex:latest .
```

### Running a production container
```bash
docker run -d \
  --name securex \
  -p 8787:8787 \
  -e ALLOWED_ORIGINS="https://yourdomain.com" \
  -e TRUST_PROXY=1 \
  -v securex-data:/app/data \
  securex:latest
```

### Using a reverse proxy (Caddy, Traefik, etc.)
If deploying behind a reverse proxy:
1. Set `TRUST_PROXY=1` to trust X-Forwarded-For headers
2. Update `ALLOWED_ORIGINS` to include your domain
3. Use your reverse proxy to handle HTTPS and domain routing

## Persistent Data

Waitlist submissions are stored in the `securex-data` Docker volume. This volume persists across container restarts.

### Backup data
```bash
docker run --rm -v securex-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/securex-data-backup.tar.gz -C /data .
```

### Restore data
```bash
docker run --rm -v securex-data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/securex-data-backup.tar.gz -C /data
```

### Delete all data (careful!)
```bash
docker-compose down -v
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs securex-api

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### API returning 403 Forbidden (CORS error)
Make sure `ALLOWED_ORIGINS` in `docker-compose.yml` includes your domain.

### Can't connect to API
1. Verify Nginx is running: `docker-compose ps`
2. Check if containers are healthy: `docker-compose ps`
3. Test API directly: `docker-compose exec securex-api curl http://localhost:8787/healthz`

### Port already in use
If port 80 is in use:
```bash
# Change port in docker-compose.yml
# Change: ports: ["80:80"]
# To:     ports: ["3000:80"]
```

## Next Steps

- Update `ALLOWED_ORIGINS` for your production domain
- Configure a reverse proxy for HTTPS (Nginx, Caddy, Traefik, etc.)
- Set up monitoring and logging
- Implement backup strategy for the `securex-data` volume
- Consider multi-stage deployment with staging/production environments
