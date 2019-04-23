// noinspection JSUnresolvedVariable
import { expect } from 'chai';

import isObject from './objectUtils';

describe('Object-utils', () => {
  it('skal returnere true når verdi er et object', () => {
    const object = { test: 'test' };
    expect(isObject(object)).is.true;
  });

  it('skal returnere false når verdi ikke er et object', () => {
    const string = 'test';
    expect(isObject(string)).is.false;
  });
});
