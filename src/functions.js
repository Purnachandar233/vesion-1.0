const ms = require("ms");
const empty_begining = "[";
const emptyend = "]";
const emptyframe = "<:MW_WhiteLine:1109733643510882334>";
const filled = "<:redline:1109758438503886898>";

module.exports.duration = duration;
module.exports.createBar = createBar;
module.exports.format = format;
module.exports.arrayMove = arrayMove;

function duration(ms) {
  const sec = Math.floor((ms / 1000) % 60).toString();
  const min = Math.floor((ms / (60 * 1000)) % 60).toString();
  const hrs = Math.floor((ms / (60 * 60 * 1000)) % 60).toString();
  const days = Math.floor((ms / (24 * 60 * 60 * 1000)) % 60).toString();
  return `${days}Days,${hrs}Hours,${min}Minutes,${sec}Seconds`;
}

function createBar(player) {
  try {
    // Validate player object
    if (!player || typeof player !== 'object') {
      console.error('[ERROR] Invalid player object provided to createBar');
      return `**${empty_begining}${filled}${emptyframe.repeat(14)}${emptyend}**\n**00:00:00 / 00:00:00**`;
    }

    const size = 15;
    const { getQueueArray } = require('./utils/queue.js');
    const tracks = getQueueArray(player);
    if (!tracks || !Array.isArray(tracks) || tracks.length === 0) {
      return `**${empty_begining}${filled}${emptyframe.repeat(size - 1)}${emptyend}**\n**00:00:00 / 00:00:00**`;
    }

    const currentTrack = tracks[0];
    if (!currentTrack || typeof currentTrack !== 'object') {
      console.error('[ERROR] Invalid track object');
      return `**${empty_begining}${filled}${emptyframe.repeat(14)}${emptyend}**\n**00:00:00 / 00:00:00**`;
    }

    const total = typeof currentTrack.duration === 'number' ? currentTrack.duration : 0;
    const current = typeof player.position === 'number' ? player.position : 0;

    if (!total || currentTrack.isStream) {
      const bar = `${empty_begining}${filled}${emptyframe.repeat(size - 1)}${emptyend}`;
      return `**${bar}**\n**◉ LIVE**`;
    }

    const ratio = Math.max(0, Math.min(1, current / total));
    const leftside = Math.round(size * ratio);
    const rightside = size - leftside;
    const bar = `${empty_begining}${filled.repeat(leftside)}${emptyframe.repeat(rightside)}${emptyend}`;
    
    // Fixed: Replace deprecated substr() with slice()
    const curStr = new Date(current).toISOString().slice(11, 19);
    const totStr = new Date(total).toISOString().slice(11, 19);
    return `**${bar}**\n**${curStr} / ${totStr}**`;
  } catch (e) {
    console.error('[createBar Error]', e.stack || e);
    return `**${empty_begining}${filled}${emptyframe.repeat(14)}${emptyend}**\n**00:00:00 / 00:00:00**`;
  }
}

function format(millis) {
  try {
    // Validate input
    if (typeof millis !== 'number' || millis < 0) {
      console.warn('[WARN] Invalid milliseconds value:', millis);
      return '00:00';
    }

    const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
    const h = Math.floor(millis / 3600000);
    const m = Math.floor((millis % 3600000) / 60000);
    const s = Math.floor((millis % 60000) / 1000);
    if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
    return `${pad(m)}:${pad(s)}`;
  } catch (e) {
    console.error('[Format Error]', e);
    return '00:00';
  }
}

function arrayMove(array, from, to) {
  try {
    // Validate array
    if (!Array.isArray(array)) {
      console.error('[ERROR] arrayMove: Input is not an array');
      return array;
    }

    // Create a copy to avoid mutation
    const newArray = [...array];
    const startIndex = from < 0 ? newArray.length + from : from;
    
    // Validate indices
    if (startIndex < 0 || startIndex >= newArray.length) {
      console.warn('[WARN] arrayMove: Invalid start index', startIndex);
      return newArray;
    }
    
    const endIndex = to < 0 ? newArray.length + to : to;
    if (endIndex < 0 || endIndex >= newArray.length) {
      console.warn('[WARN] arrayMove: Invalid end index', endIndex);
      return newArray;
    }

    const [item] = newArray.splice(startIndex, 1);
    newArray.splice(endIndex, 0, item);
    return newArray;
  } catch (e) {
    console.error('[Array Move Error]', e);
    return array;
  }
}