const path = require('node:path');

const { findContent, loadContent } = require('../src/content');
const { buildReminder } = require('../src/reminder');

function parseArgs(args) {
  const options = { contentId: 'life-reset-day-one' };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--id') {
      options.contentId = args[index + 1];
      if (!options.contentId) {
        throw new Error('Missing value for --id');
      }
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

try {
  const options = parseArgs(process.argv.slice(2));
  const contentPath = path.join(__dirname, '..', 'content', 'life-reset.json');
  const item = findContent(loadContent(contentPath), options.contentId);
  console.log(buildReminder(item));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
