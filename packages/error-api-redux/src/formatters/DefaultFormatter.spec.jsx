import { expect } from 'chai';

import DefaultFormatter from './DefaultFormatter';
import ErrorMessage from './ErrorMessage';

describe('DefaultFormatter', () => {
  it('skal formatere feil der en har feilmelding i et objekt', () => {
    const errorData = {
      feilmelding: 'Dette er feil',
    };
    expect(new DefaultFormatter().format(errorData)).to.eql(ErrorMessage.withMessage(errorData.feilmelding));
  });

  it('skal formatere feil der en har message i et objekt', () => {
    const errorData = {
      message: 'Dette er feil',
    };
    expect(new DefaultFormatter().format(errorData)).to.eql(ErrorMessage.withMessage(errorData.message));
  });

  it('skal formatere feil der data er en streng', () => {
    const errorData = 'Dette er feil';
    expect(new DefaultFormatter().format(errorData)).to.eql(ErrorMessage.withMessage(errorData));
  });
});
