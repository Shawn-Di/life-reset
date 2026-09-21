const fs = require('node:fs');

const REQUIRED_MODULE_FIELDS = [
  'id',
  'title',
  'summary',
  'slots'
];

const OPTIONAL_MODULE_FIELDS = [
  'author',
  'sourceUrl',
  'sourcePublishedAt',
  'copyrightNote'
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

  if (!Array.isArray(pack.modules) || pack.modules.length === 0) {
    throw new Error('Invalid field: modules');
  }
  if (typeof pack.defaultModuleId !== 'string' || pack.defaultModuleId.trim() === '') {
    throw new Error('Invalid field: defaultModuleId');
  }

  const ids = new Set();
  pack.modules.forEach((module, index) => {
    const prefix = `modules[${index}]`;
    if (!module || typeof module !== 'object' || Array.isArray(module)) {
      throw new Error(`Invalid field: ${prefix}`);
    }

    for (const field of REQUIRED_MODULE_FIELDS) {
      if (field === 'slots') {
        if (!Array.isArray(module[field]) || module[field].length === 0) {
          throw new Error(`Invalid field: ${prefix}.${field}`);
        }
      } else if (typeof module[field] !== 'string' || module[field].trim() === '') {
        throw new Error(`Invalid field: ${prefix}.${field}`);
      }
    }

    for (const field of OPTIONAL_MODULE_FIELDS) {
      if (module[field] !== undefined &&
          (typeof module[field] !== 'string' || module[field].trim() === '')) {
        throw new Error(`Invalid field: ${prefix}.${field}`);
      }
    }

    validateSlots(module.slots, prefix);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(module.id)) {
      throw new Error(`Invalid field: ${prefix}.id`);
    }
    if (ids.has(module.id)) {
      throw new Error(`Duplicate module id: ${module.id}`);
    }
    ids.add(module.id);

    if (module.sourceUrl && !/^https:\/\/\S+$/.test(module.sourceUrl)) {
      throw new Error(`Invalid field: ${prefix}.sourceUrl`);
    }
    if (module.sourcePublishedAt && !/^\d{4}-\d{2}-\d{2}$/.test(module.sourcePublishedAt)) {
      throw new Error(`Invalid field: ${prefix}.sourcePublishedAt`);
    }
  });

  if (!ids.has(pack.defaultModuleId)) {
    throw new Error(`Unknown default module: ${pack.defaultModuleId}`);
  }
}

function validateSlots(slots, prefix) {
  const times = new Set();
  slots.forEach((slot, index) => {
    const slotPrefix = `${prefix}.slots[${index}]`;
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

function findModule(pack, id) {
  const module = pack.modules.find((candidate) => candidate.id === id);
  if (!module) {
    throw new Error(`Unknown module id: ${id}`);
  }
  return module;
}

function resolveSlot(module, time) {
  const slot = module.slots.find((candidate) => candidate.time === time)
    || module.slots.find((candidate) => (
      candidate.time.endsWith(':00')
      && candidate.time.slice(0, 2) === time.slice(0, 2)
    ));
  if (!slot) {
    throw new Error(`Unknown reminder time: ${time}`);
  }
  return { ...module, ...slot };
}

function findContent(pack, moduleId = pack.defaultModuleId, time) {
  const module = findModule(pack, moduleId);
  return resolveSlot(module, time || module.slots[0].time);
}

function findContentForTime(pack, time, moduleId = pack.defaultModuleId) {
  return resolveSlot(findModule(pack, moduleId), time);
}

function listModules(pack) {
  return pack.modules.map(({ id, title, summary }) => ({ id, title, summary }));
}

module.exports = {
  findContent,
  findContentForTime,
  findModule,
  listModules,
  loadContent
};
