export const parseQueryString = (queryString = '') => (
  queryString
    .replace(/^\?/, '') // Remove leading question mark
    .replace(/\+/g, '%20') // Replace plus signs with URL-encoded spaces
    .split(/&/) // Split on delimiter '&'
    .map((query) => query.split(/=/))
    .map(([key, value]) => ({ [key]: decodeURIComponent(value) })) // URL-decode value
    .reduce((a, b) => ({ ...a, ...b }), {})
);

export const formatQueryString = (queryParams = {}) => (
  `?${( // Add leading question mark
    Object.entries(queryParams)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([key, value]) => (value !== undefined && value !== null && value !== '')) // Filter out empty/null/undef values
      .map(([key, value]) => ([key, encodeURIComponent(value as string)])) // URL-encode value
      .map(([key, encodedValue]) => `${key}=${encodedValue}`)
      .join('&') // Join with delimiter '&'
      .replace('%20', '+') // Replace URL-encoded spaces with plus
  )}`
);

const paramSegmentPattern = /^:(\w+)(\(.+\))?(\?)?$/;

const resolveParam = (params) => (segment) => {
  if (!paramSegmentPattern.test(segment)) {
    return segment;
  }
  const [paramName, paramPattern, optional] = paramSegmentPattern.exec(segment).slice(1, 4);
  const paramMatch = new RegExp(paramPattern || '(.+)').exec(params[paramName]);
  const paramValue = paramMatch ? paramMatch[1].replace(/^undefined$/, '') : '';
  return paramValue || (optional ? '' : segment);
};

export const buildPath = (path, params = {}) => (
  path
    .replace(/^\//, ' /') // Add whitespace before leading slash to keep it from being consumed by split
    .replace(/\/$/, '/ ') // Add whitespace after trailing slash to keep it from being consumed by split
    .split('/') // Split on delimiter '/'
    .map(resolveParam(params))
    .filter((segment) => segment !== '')
    .join('/')
    .trim()
);

export const formatArray = (array) => array.join(',');

export const parseArray = (formattedArray) => formattedArray.split(',');
