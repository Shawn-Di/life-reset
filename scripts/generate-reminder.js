const path = require('node:path');

const { findContent, findContentForTime, loadContent } = require('../src/content');
const { buildReminder } = require('../src/reminder');

function parseArgs(args) {
  const options = { moduleId: null, name: '', packPath: null, time: null };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--module') {
      options.moduleId = args[index + 1];
      if (!options.moduleId) {
        throw new Error('Missing value for --module');
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
    } else if (arg === '--pack') {
      options.packPath = args[index + 1];
      if (!options.packPath) {
        throw new Error('Missing value for --pack');
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
  const contentPath = options.packPath || path.join(__dirname, '..', 'content', 'life-reset.json');
  const pack = loadContent(contentPath);
  const moduleId = options.moduleId || pack.defaultModuleId;
  const item = options.time
    ? findContentForTime(pack, options.time, moduleId)
    : findContent(pack, moduleId);
  console.log(buildReminder(item, options.name));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
