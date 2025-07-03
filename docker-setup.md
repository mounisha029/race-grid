
# Docker Setup for F1 Insights

This project includes Docker configuration for both development and production environments.

## Quick Start

### Development Mode
```bash
# Make scripts executable
chmod +x scripts/docker-dev.sh scripts/docker-prod.sh scripts/docker-cleanup.sh

# Start development environment
./scripts/docker-dev.sh
```

### Production Mode
```bash
# Start production environment
./scripts/docker-prod.sh
```

### Cleanup
```bash
# Clean up Docker resources
./scripts/docker-cleanup.sh
```

## Manual Docker Commands

### Development
```bash
# Build and run development container
docker-compose up --build

# Run in background
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Production
```bash
# Build and run production container
docker-compose -f docker-compose.prod.yml up --build -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop containers
docker-compose -f docker-compose.prod.yml down
```

## Environment Configuration

### Development
- Hot reload enabled
- Runs on port 8080
- Source code mounted as volume for live updates

### Production
- Optimized build with nginx
- Runs on port 80
- Gzip compression enabled
- Security headers configured
- Health checks included

## Adding Docker Scripts to package.json

You can manually add these scripts to your package.json:

```json
{
  "scripts": {
    "docker:dev": "./scripts/docker-dev.sh",
    "docker:prod": "./scripts/docker-prod.sh",
    "docker:cleanup": "./scripts/docker-cleanup.sh"
  }
}
```

## Environment Variables

Create `.env.local` for development or `.env.production` for production with your Supabase configuration.

## Health Checks

Both containers include health checks:
- Development: http://localhost:8080/
- Production: http://localhost/health

## Troubleshooting

1. **Port conflicts**: Change ports in docker-compose files if needed
2. **Permission issues**: Make sure scripts are executable with `chmod +x`
3. **Docker not running**: Start Docker Desktop or Docker daemon
4. **Build failures**: Check Dockerfile syntax and available resources
