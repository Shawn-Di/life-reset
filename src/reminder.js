function buildReminder(item, name = '') {
  const greeting = name ? `Hi ${name}，` : 'Hi，';
  return `${greeting}${item.prompt}\n${item.action}`;
}

module.exports = { buildReminder };
