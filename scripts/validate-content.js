const path = require('node:path');

const { loadContent } = require('../src/content');

const packIndex = process.argv.indexOf('--pack');
const customPack = packIndex === -1 ? null : process.argv[packIndex + 1];

if (packIndex !== -1 && !customPack) {
  console.error('Missing value for --pack');
  process.exitCode = 1;
} else {
  const contentPath = customPack || path.join(__dirname, '..', 'content', 'life-reset.json');

  try {
    loadContent(contentPath);
    console.log('content valid');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
