FROM node:20-alpine

WORKDIR /app

# Copy package files for both server and 3d
COPY server/package*.json ./server/
COPY 3d/package*.json ./3d/

# Install server dependencies
WORKDIR /app/server
RUN npm ci

# Copy server source
COPY server/src ./src
COPY server/test ./test

# Copy static assets to root
WORKDIR /app
COPY assets ./assets
COPY 3d/assets ./3d/assets
COPY index.html .

# Create data directory for waitlist signups
RUN mkdir -p /app/data

# Expose API port
EXPOSE 8787

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8787/healthz || exit 1

# Environment variables with sensible defaults
ENV PORT=8787 \
    HOST=0.0.0.0 \
    DATA_DIR=/app/data \
    ALLOWED_ORIGINS=http://localhost:8787,http://127.0.0.1:8787

WORKDIR /app/server

# Run the API server
CMD ["npm", "start"]
