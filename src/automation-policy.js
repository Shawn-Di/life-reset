const AUTOMATION_NAME = 'Life-reset';
const AUTOMATION_KEY = 'life-reset-v1';
const INACTIVE_STATUSES = new Set(['disabled', 'inactive', 'paused']);

function isActive(automation = {}) {
  return !INACTIVE_STATUSES.has(String(automation.status || '').toLowerCase());
}

function isLifeResetAutomation(automation = {}) {
  return automation.name === AUTOMATION_NAME
    || automation.key === AUTOMATION_KEY
    || automation.metadata?.lifeResetKey === AUTOMATION_KEY;
}

function reconcileAutomations(automations = []) {
  const matches = (Array.isArray(automations) ? automations : [])
    .filter(isLifeResetAutomation)
    .filter(isActive)
    .map((automation, index) => ({ automation, index }));

  matches.sort((left, right) => {
    const leftCreatedAt = Number(left.automation.createdAt);
    const rightCreatedAt = Number(right.automation.createdAt);
    if (Number.isFinite(leftCreatedAt) && Number.isFinite(rightCreatedAt)) {
      return leftCreatedAt - rightCreatedAt;
    }
    return left.index - right.index;
  });

  if (matches.length === 0) {
    return {
      action: 'create',
      canonicalId: null,
      duplicateIds: [],
      name: AUTOMATION_NAME,
      key: AUTOMATION_KEY
    };
  }

  return {
    action: 'reuse',
    canonicalId: matches[0].automation.id || null,
    duplicateIds: matches.slice(1)
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
