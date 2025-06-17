const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'bulkPayload', 'payload3.json');

// Read and parse the JSON file
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Remove the 'tags' field from each object
const updated = data.map(obj => {
  const { tags, ...rest } = obj; // remove 'tags'
  return { ...rest, state: 'published' }; // also keep setting state if needed
});

// Write the updated data back to the file
fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
console.log('All objects updated and "tags" field removed.');

