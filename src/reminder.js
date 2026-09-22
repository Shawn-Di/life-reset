function buildReminder(item, name = '') {
  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const prefix = normalizedName ? `${normalizedName}，` : '';
  return `${prefix}${item.prompt}`;
}

function buildFollowUp(item) {
  return item.action;
}

module.exports = { buildFollowUp, buildReminder };
