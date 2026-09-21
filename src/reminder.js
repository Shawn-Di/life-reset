function buildReminder(item, name = '') {
  const normalizedName = typeof name === 'string' ? name.trim() : '';
  const prefix = normalizedName ? `${normalizedName}，` : '';
  return `${prefix}${item.prompt} ${item.action}`;
}

module.exports = { buildReminder };
