.PHONY: help build up down logs shell test clean restart status

help:
	@echo "SecureSafeX Landing Page - Docker Commands"
	@echo ""
	@echo "Getting Started:"
	@echo "  make up          Start containers (builds automatically)"
	@echo "  make down        Stop containers"
	@echo "  make restart     Restart containers"
	@echo ""
	@echo "Development:"
	@echo "  make logs        View container logs (follow mode)"
	@echo "  make shell       Open shell in API container"
	@echo "  make test        Run API tests"
	@echo "  make status      Show container status"
	@echo ""
	@echo "Maintenance:"
	@echo "  make build       Build Docker images"
	@echo "  make clean       Remove containers and volumes"
	@echo ""
	@echo "Once running:"
	@echo "  Landing page: http://localhost"
	@echo "  Health check: http://localhost/healthz"
	@echo "  API: http://localhost/api/waitlist"

build:
	docker-compose build

up:
	docker-compose up -d
	@echo ""
	@echo "✓ Services started!"
	@echo "  Landing page: http://localhost"
	@echo "  API health:   http://localhost/healthz"
	@echo ""
	@echo "View logs: make logs"

down:
	docker-compose down

restart:
	docker-compose restart
	@echo "✓ Services restarted"

logs:
	docker-compose logs -f

status:
	docker-compose ps

shell:
	docker-compose exec securex-api sh

test:
	docker-compose exec securex-api npm test

clean:
	docker-compose down -v
	@echo "✓ Containers and volumes removed"
