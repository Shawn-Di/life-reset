const path = require('node:path');

const { findContent, loadContent } = require('../src/content');
const { buildReminder, buildSessionInstruction } = require('../src/reminder');

function parseArgs(args) {
  const options = { contentId: 'life-reset-day-one', includeSessionInstruction: false };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--include-session-instruction') {
      options.includeSessionInstruction = true;
    } else if (arg === '--id') {
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
  const output = options.includeSessionInstruction
    ? `${buildSessionInstruction()}\n\n${buildReminder(item)}`
    : buildReminder(item);

  console.log(output);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
