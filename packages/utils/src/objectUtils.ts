const throwError = (message) => {
  throw new Error(message);
};

export const notNull = (value) => (value === undefined || value === null ? throwError(`Value is ${value}`) : value);

export const isObjectEmpty = (object) => Object.keys(object).length === 0;

export const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

export const isObject = (variable) => variable !== undefined && variable !== null && variable.constructor === Object;

export const isEqualToOneOf = (value, acceptedValues) => (!acceptedValues.includes(value) ? throwError(`${value} is not one of ${(acceptedValues)}`) : value);

export const omit = (object, ...keysToOmit) => Object.keys(object)
  .filter((key) => !keysToOmit.includes(key))
  .map((key) => ({ [key]: object[key] }))
  .reduce((a, b) => Object.assign(a, b), {});

const isNullOrUndefined = (obj) => obj === null || typeof obj === 'undefined';
const isNotNullAndObject = (obj) => obj !== null && typeof obj === 'object' && obj.constructor;

const redefineIfUndefined = (obj, otherObjOfType) => {
  if (isNullOrUndefined(obj) && isNotNullAndObject(otherObjOfType)) {
    try {
      return new otherObjOfType.constructor();
    } catch (e) {
      return null;
    }
  }
  return obj;
};

export const diff = (a, b) => {
  const thing1 = redefineIfUndefined(a, b);
  const thing2 = redefineIfUndefined(b, a);
  if (typeof thing1 !== typeof thing2) {
    return true;
  }
  if (thing1 === null && thing2 === null) {
    return false;
  }

  const diffObj = () => {
    if (thing1 instanceof Array) {
      if (thing2 instanceof Array) {
        const length = Math.max(thing1.length, thing2.length);
        return [...Array(length).keys()].map((i) => diff(thing1[i], thing2[i]));
      }
      return true;
    }
    return [...new Set([...Object.keys(thing1), ...Object.keys(thing2)])]
      .reduce((diffs, key) => ({ ...diffs, [key]: diff(thing1[key], thing2[key]) }), {});
  };

  switch (typeof thing1) {
    case 'object':
      return diffObj();
    case 'undefined':
    case 'function':
    case 'string':
    case 'number':
    case 'boolean':
    default:
      return thing1 !== thing2;
  }
};


export const arrayToObject = (array, keyFunction, valueFunction) => array.reduce((acc, data) => ({
  ...acc,
  ...{ [keyFunction(data)]: valueFunction(data) },
}), {});
