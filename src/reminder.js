function buildReminder(item) {
  return `【致命拷问】 ${item.prompt}
【即刻行动】 ${item.action}`;
}

module.exports = { buildReminder };
