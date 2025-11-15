#!/bin/bash

# Test script for the concept scripts generation and n8n integration
# Usage: ./test-scripts.sh

API_URL="http://localhost:3000/api/test-scripts"

# Sample lesson content for testing
LESSON_CONTENT='Photosynthesis is the process by which plants convert light energy into chemical energy. During this process, plants take in carbon dioxide from the air and water from their roots. Using sunlight, they produce glucose and release oxygen as a byproduct. This process occurs in the chloroplasts of plant cells, specifically in structures called thylakoids. The process can be divided into two main stages: the light-dependent reactions and the light-independent reactions (Calvin cycle).'

echo "Testing concept scripts generation and n8n integration..."
echo "=================================================="
echo ""

# Make the POST request
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{\"lessonContent\": \"$LESSON_CONTENT\"}" \
  | jq '.'

echo ""
echo "Test complete!"
