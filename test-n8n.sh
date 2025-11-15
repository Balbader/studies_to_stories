#!/bin/bash

# Test script for the n8n route directly
# Usage: ./test-n8n.sh

API_URL="http://localhost:3000/api/n8n"

# Sample script data matching the format from mainConceptScriptGeneratorAgent
# Using heredoc to avoid quote escaping issues
SAMPLE_SCRIPTS=$(cat <<'EOF'
{
  "scripts": [
    {
      "conceptName": "Photosynthesis Basics",
      "script": "Plants are nature's solar panels! They capture sunlight and turn it into energy through photosynthesis. Watch how it works!",
      "wordCount": 22,
      "estimatedDuration": "8 seconds",
      "visualCues": ["Green leaves capturing sunlight", "Chloroplasts glowing", "Oxygen bubbles rising"]
    },
    {
      "conceptName": "Carbon Dioxide Absorption",
      "script": "Plants breathe in carbon dioxide from the air. It's their food source! See how they transform CO2 into life.",
      "wordCount": 20,
      "estimatedDuration": "8 seconds",
      "visualCues": ["CO2 molecules entering leaves", "Stomata opening and closing", "Chemical transformation"]
    }
  ]
}
EOF
)

echo "Testing n8n route directly..."
echo "=================================================="
echo ""
echo "Sending sample scripts to: $API_URL"
echo ""

# Make the GET request with scripts as query parameter
# URL encode the JSON data
ENCODED_SCRIPTS=$(echo "$SAMPLE_SCRIPTS" | jq -c . | jq -sRr @uri)

curl -X GET "$API_URL?scripts=$ENCODED_SCRIPTS" \
  | jq '.'

echo ""
echo "Test complete!"
