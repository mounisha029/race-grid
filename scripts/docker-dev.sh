
#!/bin/bash

echo "🚀 Starting F1 Insights in development mode with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start development container
docker-compose -f docker-compose.yml up --build

echo "✅ F1 Insights development environment is running at http://localhost:8080"
