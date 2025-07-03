
#!/bin/bash

echo "🚀 Starting F1 Insights in production mode with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start production container
docker-compose -f docker-compose.prod.yml up --build -d

echo "✅ F1 Insights production environment is running at http://localhost"
echo "📊 Check logs with: docker-compose -f docker-compose.prod.yml logs -f"
echo "🛑 Stop with: docker-compose -f docker-compose.prod.yml down"
