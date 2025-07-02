
#!/bin/bash

echo "🏁 Running F1 App Test Suite"

echo "📱 Running Unit Tests..."
npm test -- --coverage

echo "🔗 Running Integration Tests..."
npm run test:integration

echo "🌐 Running E2E Tests..."
npm run test:e2e

echo "⚡ Running Performance Tests..."
npm run test:performance

echo "📱 Running Mobile Tests..."
npm run test:mobile

echo "🚀 Running Load Tests..."
npm run test:load

echo "✅ All tests completed!"
