export const displayHash = (hash, name) => {
  let displayHash = hash;
  if (hash.length > 17 && hash.substring(0, 2) === '0x') {
    displayHash = hash.substring(0, 8) + '...' + hash.slice(-6);
  }
  if (name) {
    displayHash = name + ' (' + displayHash + ')';
  }

  return displayHash;
}