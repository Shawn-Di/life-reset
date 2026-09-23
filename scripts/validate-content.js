const { loadContent } = require('../src/content');

const packIndex = process.argv.indexOf('--pack');
const customPack = packIndex === -1 ? null : process.argv[packIndex + 1];

if (packIndex !== -1 && !customPack) {
  console.error('Missing value for --pack');
  process.exitCode = 1;
} else {
  try {
    loadContent(customPack || undefined);
    console.log('content valid');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
