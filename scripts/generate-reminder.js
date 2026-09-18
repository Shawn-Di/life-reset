const path = require('node:path');

const { findContent, findContentForTime, loadContent } = require('../src/content');
const { buildReminder } = require('../src/reminder');

function parseArgs(args) {
  const options = { contentId: 'life-reset-day-one', name: '', time: null };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--id') {
      options.contentId = args[index + 1];
      if (!options.contentId) {
        throw new Error('Missing value for --id');
      }
      index += 1;
    } else if (arg === '--time') {
      options.time = args[index + 1];
      if (!options.time) {
        throw new Error('Missing value for --time');
      }
      index += 1;
    } else if (arg === '--name') {
      options.name = args[index + 1];
      if (!options.name) {
        throw new Error('Missing value for --name');
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
  const pack = loadContent(contentPath);
  const item = options.time
    ? findContentForTime(pack, options.time)
    : findContent(pack, options.contentId);
  console.log(buildReminder(item, options.name));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
