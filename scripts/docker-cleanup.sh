
#!/bin/bash

echo "🧹 Cleaning up Docker containers and images..."

# Stop and remove containers
docker-compose -f docker-compose.yml down --remove-orphans
docker-compose -f docker-compose.prod.yml down --remove-orphans

# Remove dangling images
docker image prune -f

# Remove unused volumes
docker volume prune -f

echo "✅ Docker cleanup completed!"
