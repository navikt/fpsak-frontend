export const range = (length) => [...Array(length).keys()];

export const zip = (a, b) => {
  if (a.length !== b.length) {
    throw Error('Arrays given to zip must be of equal length');
  }
  return range(a.length).map((i) => [a[i], b[i]]);
};

export const isArrayEmpty = (array) => !array || array.length === 0;

export const flatten = (array) => array.reduce((a, b) => [...a, ...b], []);

export const without = (...excluded) => (array) => array.filter((v) => !excluded.includes(v));

export const haystack = (object, keys, defaultValue = null) => {
  const keysArray = Array.isArray(keys) ? keys : keys.replace(/(\[(\d+)\])/g, '.$2').split('.');
  const currentObject = object[keysArray[0]];
  if (currentObject && keysArray.length > 1) {
    return haystack(currentObject, keysArray.slice(1), defaultValue);
  }
  return currentObject === undefined ? defaultValue : currentObject;
};
