import { expect } from 'chai';

import { replaceNorwegianCharacters } from './languageUtils';

describe('Language-utils', () => {
  it('skal erstatte norske tegn i string', () => {
    const testString = 'Fødselsvilkåret æ';
    expect(replaceNorwegianCharacters(testString)).to.eql('Foedselsvilkaaret ae');
  });
});
