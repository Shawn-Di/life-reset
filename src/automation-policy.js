const AUTOMATION_NAME = 'Life-reset';
const AUTOMATION_KEY = 'life-reset-v1';
const INACTIVE_STATUSES = new Set(['disabled', 'inactive', 'paused']);

const isActive = ({ status } = {}) =>
  !INACTIVE_STATUSES.has(String(status || '').toLowerCase());

function isLifeResetAutomation({ name, key, metadata, prompt } = {}) {
  return name === AUTOMATION_NAME
    || key === AUTOMATION_KEY
    || metadata?.lifeResetKey === AUTOMATION_KEY
    || prompt?.includes(AUTOMATION_KEY);
}

function createdAt(automation, index) {
  const value = Number(automation.createdAt);
  return Number.isFinite(value) ? value : Number.MAX_SAFE_INTEGER + index;
}

function reconcileAutomations(automations = []) {
  const matches = (Array.isArray(automations) ? automations : [])
    .filter(isLifeResetAutomation)
    .filter(isActive)
    .map((automation, index) => ({ automation, index }));

  matches.sort((left, right) =>
    createdAt(left.automation, left.index) - createdAt(right.automation, right.index));

  if (matches.length === 0) {
    return {
      action: 'create',
      canonicalId: null,
      duplicateIds: [],
      name: AUTOMATION_NAME,
      key: AUTOMATION_KEY
    };
  }

  const [canonical, ...duplicates] = matches;
  return {
    action: 'reuse',
    canonicalId: canonical.automation.id || null,
    duplicateIds: duplicates
      .map(({ automation }) => automation.id)
      .filter(Boolean),
    name: AUTOMATION_NAME,
    key: AUTOMATION_KEY
  };
}

module.exports = {
  AUTOMATION_KEY,
  AUTOMATION_NAME,
  isLifeResetAutomation,
  reconcileAutomations
};
