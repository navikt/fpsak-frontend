import { expect } from 'chai';

import { buildPath, parseQueryString } from './urlUtils';

describe('Url-utils', () => {
  it('skal parse url parameter', () => {
    const queryString = '?errormessage=Det+finnes+ingen+sak+med+denne+referansen%3A+266';
    expect(parseQueryString(queryString)).to.eql({ errormessage: 'Det finnes ingen sak med denne referansen: 266' });
  });

  it('skal parse to url parametere', () => {
    const queryString = '?errormessage=Det+finnes+ingen+sak+med+denne+referansen%3A+266&message=Dette+er+en+test';
    expect(parseQueryString(queryString)).to.eql({ errormessage: 'Det finnes ingen sak med denne referansen: 266', message: 'Dette er en test' });
  });

  it('skal bygge path fra route', () => {
    const route = '/test/:param/bar/:bar(\\d+)/:optionalParam?/:requiredParam/:baz([a-z]{2})/:qux([a-z]{2})?';
    const params = {
      param: 'foo', // valid
      bar: '1', // valid
      baz: '1', // invalid, does not match regex - required, parameter definition should be included instead
      qux: '1', // invalid, does not match regex - optional, should be omitted
    };

    const path = buildPath(route, params);

    expect(path).to.eql('/test/foo/bar/1/:requiredParam/:baz([a-z]{2})');

    const relativeRoute = 'hei/paa/:hvem';

    const relativePath = buildPath(relativeRoute, { hvem: 'deg' });

    expect(relativePath).to.eql('hei/paa/deg');
  });
});
