import { expect } from 'chai';

import decodeHtmlEntity from './decodeHtmlEntity';

describe('decode-Html-Entity', () => {
  it('skal sjekke at html entity med navn og kode er decodert', () => {
    expect(decodeHtmlEntity('&amp; og &#34;')).is.eql('& og "');
  });
  it('skal sjekke at html entity less than og greater than er ikke decodert', () => {
    expect(decodeHtmlEntity('&lt; og &gt; og &#60; og &#62;')).is.eql('&lt; og &gt; og &#60; og &#62;');
  });
});
