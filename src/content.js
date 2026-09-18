const fs = require('node:fs');

const REQUIRED_FIELDS = [
  'id',
  'title',
  'author',
  'sourceUrl',
  'sourcePublishedAt',
  'summary',
  'copyrightNote',
  'timeSlots'
];

const SLOT_FIELDS = ['time', 'prompt', 'action'];

function loadContent(filePath) {
  let pack;

  try {
    pack = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Unable to read content pack: ${error.message}`);
  }

  validatePack(pack);
  return pack;
}

function validatePack(pack) {
  if (!pack || typeof pack !== 'object' || Array.isArray(pack)) {
    throw new Error('Invalid field: root');
  }

  if (!Number.isInteger(pack.version) || pack.version < 1) {
    throw new Error('Invalid field: version');
  }

  if (!Array.isArray(pack.items) || pack.items.length === 0) {
    throw new Error('Invalid field: items');
  }

  const ids = new Set();
  pack.items.forEach((item, index) => {
    const prefix = `items[${index}]`;
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error(`Invalid field: ${prefix}`);
    }

    for (const field of REQUIRED_FIELDS) {
      if (field === 'timeSlots') {
        if (!Array.isArray(item[field]) || item[field].length === 0) {
          throw new Error(`Invalid field: ${prefix}.${field}`);
        }
        continue;
      }
      if (typeof item[field] !== 'string' || item[field].trim() === '') {
        throw new Error(`Invalid field: ${prefix}.${field}`);
      }
    }

    validateTimeSlots(item.timeSlots, prefix);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id)) {
      throw new Error(`Invalid field: ${prefix}.id`);
    }
    if (ids.has(item.id)) {
      throw new Error(`Duplicate content id: ${item.id}`);
    }
    ids.add(item.id);

    if (!/^https:\/\/\S+$/.test(item.sourceUrl)) {
      throw new Error(`Invalid field: ${prefix}.sourceUrl`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.sourcePublishedAt)) {
      throw new Error(`Invalid field: ${prefix}.sourcePublishedAt`);
    }
  });
}

function validateTimeSlots(slots, prefix) {
  const times = new Set();
  slots.forEach((slot, index) => {
    const slotPrefix = `${prefix}.timeSlots[${index}]`;
    if (!slot || typeof slot !== 'object' || Array.isArray(slot)) {
      throw new Error(`Invalid field: ${slotPrefix}`);
    }

    for (const field of SLOT_FIELDS) {
      if (typeof slot[field] !== 'string' || slot[field].trim() === '') {
        throw new Error(`Invalid field: ${slotPrefix}.${field}`);
      }
    }

    const [hours, minutes] = slot.time.split(':').map(Number);
    if (!/^\d{2}:\d{2}$/.test(slot.time) || hours > 23 || minutes > 59) {
      throw new Error(`Invalid field: ${slotPrefix}.time`);
    }
    if (times.has(slot.time)) {
      throw new Error(`Duplicate reminder time: ${slot.time}`);
    }
    times.add(slot.time);
  });
}

function findItem(pack, id) {
  const item = pack.items.find((candidate) => candidate.id === id);
  if (!item) {
    throw new Error(`Unknown content id: ${id}`);
  }
  return item;
}

function resolveSlot(item, time) {
  const slot = item.timeSlots.find((candidate) => candidate.time === time);
  if (!slot) {
    throw new Error(`Unknown reminder time: ${time}`);
  }
  return { ...item, ...slot };
}

function findContent(pack, id, time = pack.items[0]?.timeSlots[0]?.time) {
  return resolveSlot(findItem(pack, id), time);
}

function findContentForTime(pack, time) {
  const item = pack.items.find((candidate) =>
    candidate.timeSlots.some((slot) => slot.time === time));
  if (!item) {
    throw new Error(`Unknown reminder time: ${time}`);
  }
  return resolveSlot(item, time);
}

module.exports = { findContent, findContentForTime, loadContent };
