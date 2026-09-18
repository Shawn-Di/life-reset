const { buildAutomationSetupPrompt } = require('../src/platform-adapters');

function parsePlatform(args) {
  const index = args.indexOf('--platform');
  const platform = index >= 0 ? args[index + 1] : null;
  if (!platform) {
    throw new Error('Usage: npm run adapter-setup -- --platform <codex|cc|workbuddy|autogravity|kimi|doubao|grok>');
  }
  return platform;
}

try {
  console.log(buildAutomationSetupPrompt(parsePlatform(process.argv.slice(2))));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
