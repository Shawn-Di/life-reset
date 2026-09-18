const assert = require('node:assert/strict');
const test = require('node:test');

const {
  AUTOMATION_KEY,
  AUTOMATION_NAME,
  reconcileAutomations
} = require('../src/automation-policy');

test('creates one canonical automation when none exists', () => {
  assert.deepEqual(reconcileAutomations([]), {
    action: 'create',
    canonicalId: null,
    duplicateIds: [],
    name: AUTOMATION_NAME,
    key: AUTOMATION_KEY
  });
});

test('reuses the oldest active automation and identifies duplicates', () => {
  assert.deepEqual(reconcileAutomations([
    { id: 'new', name: 'Life-reset', createdAt: 2 },
    { id: 'old', key: 'life-reset-v1', createdAt: 1 },
    { id: 'paused', name: 'Life-reset', status: 'PAUSED', createdAt: 0 }
  ]), {
    action: 'reuse',
    canonicalId: 'old',
    duplicateIds: ['new'],
    name: AUTOMATION_NAME,
    key: AUTOMATION_KEY
  });
});
