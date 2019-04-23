export const range = length => [...Array(length).keys()];

export const haystack = (object, keys, defaultValue = null) => {
  const keysArray = Array.isArray(keys) ? keys : keys.replace(/(\[(\d+)\])/g, '.$2').split('.');
  const currentObject = object[keysArray[0]];
  if (currentObject && keysArray.length > 1) {
    return haystack(currentObject, keysArray.slice(1), defaultValue);
  }
  return currentObject === undefined ? defaultValue : currentObject;
};
