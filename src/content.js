const fs = require('node:fs');

const REQUIRED_FIELDS = [
  'id',
  'title',
  'author',
  'sourceUrl',
  'sourcePublishedAt',
  'summary',
  'prompt',
  'action',
  'copyrightNote'
];

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
      if (typeof item[field] !== 'string' || item[field].trim() === '') {
        throw new Error(`Invalid field: ${prefix}.${field}`);
      }
    }

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

function findContent(pack, id) {
  const item = pack.items.find((candidate) => candidate.id === id);
  if (!item) {
    throw new Error(`Unknown content id: ${id}`);
  }
  return item;
}

module.exports = { findContent, loadContent };
