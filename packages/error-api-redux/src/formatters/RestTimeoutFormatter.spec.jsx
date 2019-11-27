import { expect } from 'chai';

import RestTimeoutFormatter from './RestTimeoutFormatter';
import ErrorMessage from './ErrorMessage';
import ErrorEventType from './errorEventType';

describe('RestTimeoutFormatter', () => {
  it('skal håndtere feil når feildata er av korrekt type', () => {
    expect(new RestTimeoutFormatter().isOfType(ErrorEventType.POLLING_TIMEOUT)).is.true;
  });

  it('skal ikke håndtere feil når feildata er av annen type', () => {
    expect(new RestTimeoutFormatter().isOfType(ErrorEventType.POLLING_HALTED_OR_DELAYED)).is.false;
  });

  it('skal formatere feil når en har fått timeout', () => {
    const errorData = {
      type: ErrorEventType.POLLING_TIMEOUT,
      message: 'timeout',
      location: 'url',
    };
    expect(new RestTimeoutFormatter().format(errorData))
      .to.eql(ErrorMessage.withMessageCode('Rest.ErrorMessage.PollingTimeout', errorData));
  });
});
