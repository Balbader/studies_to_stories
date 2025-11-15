#!/bin/bash

# Debug script for n8n route testing
# Usage: ./test-n8n-debug.sh

API_URL="http://localhost:3000/api/n8n"

echo "🔍 Debugging n8n route test..."
echo "=================================================="
echo ""

# Check if server is running
echo "1. Checking if Next.js server is running..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Server is running on port 3000"
else
    echo "   ❌ Server is NOT running on port 3000"
    echo "   Please start your server with: npm run dev"
    exit 1
fi
echo ""

# Check if jq is installed
echo "2. Checking if jq is installed..."
if command -v jq &> /dev/null; then
    echo "   ✅ jq is installed"
    USE_JQ=true
else
    echo "   ⚠️  jq is not installed (optional, for pretty JSON output)"
    USE_JQ=false
fi
echo ""

# Test the endpoint with a simple request
echo "3. Testing endpoint connectivity..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"scripts":[]}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "   HTTP Status: $HTTP_CODE"
if [ "$HTTP_CODE" != "200" ]; then
    echo "   ⚠️  Non-200 status code received"
fi
echo ""

# Show the response
echo "4. Response from endpoint:"
if [ "$USE_JQ" = true ]; then
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo "$BODY"
fi
echo ""

# Test with actual data
echo "5. Testing with sample script data..."
SAMPLE_SCRIPTS=$(cat <<'EOF'
{
  "scripts": [
    {
      "conceptName": "Test Concept",
      "script": "This is a test script for debugging.",
      "wordCount": 10,
      "estimatedDuration": "8 seconds",
      "visualCues": ["Test visual cue"]
    }
  ]
}
EOF
)

echo "   Sending request..."
FULL_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "$SAMPLE_SCRIPTS")

FULL_HTTP_CODE=$(echo "$FULL_RESPONSE" | tail -n1)
FULL_BODY=$(echo "$FULL_RESPONSE" | sed '$d')

echo "   HTTP Status: $FULL_HTTP_CODE"
echo "   Response:"
if [ "$USE_JQ" = true ]; then
    echo "$FULL_BODY" | jq '.' 2>/dev/null || echo "$FULL_BODY"
else
    echo "$FULL_BODY"
fi
echo ""

# Check server logs suggestion
echo "6. Next steps:"
echo "   - Check your Next.js server console for detailed logs"
echo "   - Verify N8N_WEBHOOK_URL is set correctly in .env.local"
echo "   - Make sure your n8n workflow is active"
echo ""

echo "=================================================="
echo "Debug complete!"
