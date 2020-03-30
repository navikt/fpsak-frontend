import { expect } from 'chai';
import { isValidFodselsnummer } from './fodselsnummerUtils';

const validFodselsnummer = '07078518434';

describe('Fødselsnummer-utils', () => {
  it('skal godkjenne gyldig fødselsnummer', () => {
    expect(isValidFodselsnummer(validFodselsnummer)).to.be.true;
  });

  it('skal underkjenne ugyldig fødselsnummer', () => {
    let invalidFodselsnummer = '31048518434';
    expect(isValidFodselsnummer(invalidFodselsnummer)).to.be.false;
    invalidFodselsnummer = '9999999999';
    expect(isValidFodselsnummer(invalidFodselsnummer)).to.be.false;
    invalidFodselsnummer = `${validFodselsnummer}1`;
    expect(isValidFodselsnummer(invalidFodselsnummer)).to.be.false;
  });
});
