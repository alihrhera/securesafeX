# Deployment Guide

This guide covers deploying the SecureSafeX landing page using Docker.

## Quick Deploy

### Local Development

```bash
# Start services
make up

# Check status
make status

# View logs
make logs

# Access the app
open http://localhost
```

### Stop Services

```bash
make down
```

## Docker Hub Deployment

### Push to Registry

```bash
# Build with a tag
docker build -t myregistry/securex:latest .

# Push to registry
docker push myregistry/securex:latest
```

### Run from Registry

```bash
docker run -d \
  --name securex \
  -p 80:80 \
  -e ALLOWED_ORIGINS="https://yourdomain.com" \
  -v securex-data:/app/data \
  myregistry/securex:latest
```

## Cloud Deployments

### AWS ECS / Fargate

```yaml
# ecs-task-definition.json
{
  "family": "securex-landing",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "securex-api",
      "image": "myregistry/securex:latest",
      "portMappings": [
        {
          "containerPort": 8787,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ALLOWED_ORIGINS",
          "value": "https://yourdomain.com"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/securex",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set buildpack
heroku buildpacks:set heroku/docker

# Deploy
git push heroku main

# Set environment variables
heroku config:set ALLOWED_ORIGINS=https://your-app-name.herokuapp.com
```

### Railway.app

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

### Render.com

1. Push code to GitHub
2. Create new Web Service on Render
3. Select GitHub repository
4. Set environment:
   - `ALLOWED_ORIGINS`: your domain
   - `TRUST_PROXY`: 1
5. Deploy

### DigitalOcean App Platform

```yaml
# app.yaml
name: securex-landing
services:
  - name: api
    github:
      repo: your-username/your-repo
      branch: main
    build_command: echo "Using Dockerfile"
    environment_slug: node-js
    envs:
      - key: ALLOWED_ORIGINS
        value: https://yourdomain.com
      - key: TRUST_PROXY
        value: "1"
    http_port: 8787
```

### Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml securex

# Check status
docker stack services securex
```

### Kubernetes

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: securex-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: securex
  template:
    metadata:
      labels:
        app: securex
    spec:
      containers:
      - name: api
        image: myregistry/securex:latest
        ports:
        - containerPort: 8787
        env:
        - name: ALLOWED_ORIGINS
          value: "https://yourdomain.com"
        - name: TRUST_PROXY
          value: "1"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /healthz
            port: 8787
          initialDelaySeconds: 10
          periodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  name: securex-api
spec:
  selector:
    app: securex
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8787
  type: LoadBalancer
```

```bash
# Deploy to Kubernetes
kubectl apply -f k8s-deployment.yaml

# Check status
kubectl get deployments
kubectl get services
```

## HTTPS & Reverse Proxy Setup

### Nginx (Self-hosted)

```nginx
upstream securex {
    server localhost:8787;
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://securex;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Caddy (Automatic HTTPS)

```caddy
yourdomain.com {
    reverse_proxy localhost:8787
}
```

### Traefik (Docker Swarm)

```yaml
# docker-compose.yml with Traefik
version: '3.8'
services:
  traefik:
    image: traefik:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./traefik.yml:/traefik.yml
    
  securex-api:
    build: .
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.securex.rule=Host(`yourdomain.com`)"
      - "traefik.http.routers.securex.entrypoints=web,websecure"
      - "traefik.http.routers.securex.tls.certresolver=letsencrypt"
      - "traefik.http.services.securex.loadbalancer.server.port=8787"
```

## Environment Configuration

Update these for production:

```env
# docker-compose.yml or .env file
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
TRUST_PROXY=1
RATE_LIMIT_MAX=10
RATE_LIMIT_WINDOW_MS=600000
MAX_RECORDS=50000
```

## Monitoring & Logging

### Check container health

```bash
docker ps
docker logs -f container-id
```

### View stored data

```bash
docker exec -it container-id ls -la /app/data/
```

### Backup data

```bash
docker run --rm -v securex-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/backup-$(date +%Y%m%d).tar.gz -C /data .
```

## Troubleshooting

### API returning 403

```
Error: origin_not_allowed
Fix: Update ALLOWED_ORIGINS in docker-compose.yml
```

### High memory usage

- Reduce `MAX_RECORDS` in environment
- Monitor with `docker stats`

### Slow API responses

- Check rate limiting settings
- Monitor with `docker logs`
- Ensure sufficient container resources

## Production Checklist

- [ ] Set `ALLOWED_ORIGINS` to your domain
- [ ] Enable HTTPS with a reverse proxy
- [ ] Set `TRUST_PROXY=1` if behind a reverse proxy
- [ ] Configure automatic backups for data volume
- [ ] Set up monitoring and alerts
- [ ] Enable logging (CloudWatch, Datadog, etc.)
- [ ] Test the API endpoints
- [ ] Implement rate limiting appropriate for your scale
- [ ] Regular security updates for base image
- [ ] Documentation for your team
