const path = require('node:path');

const { loadContent } = require('../src/content');

const contentPath = path.join(__dirname, '..', 'content', 'life-reset.json');

try {
  loadContent(contentPath);
  console.log('content valid');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
