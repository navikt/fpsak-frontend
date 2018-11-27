import { expect } from 'chai';

import {
  errorHandlingReducer, addErrorMessage, removeErrorMessage, showCrashMessage,
} from './duck';

describe('ErrorHandling-reducer', () => {
  it('skal returnere initial state', () => {
    expect(errorHandlingReducer(undefined, {})).to.eql({ errorMessages: [], crashMessage: '', errorMessageCodeWithParams: undefined });
  });

  it('skal oppdatere state med feilmelding og så fjerne den', () => {
    const addAction = addErrorMessage('login error');
    expect(errorHandlingReducer(undefined, addAction).errorMessages).to.eql(['login error']);

    const removeAction = removeErrorMessage();
    expect(errorHandlingReducer(undefined, removeAction).errorMessages).to.eql([]);
  });

  it('skal oppdatere state med feilmelding fra response', () => {
    const action = addErrorMessage({
      feilmelding: 'test error',
    });
    expect(errorHandlingReducer(undefined, action).errorMessages).to.eql(['test error']);
  });

  it('skal oppdatere med crash-melding og så fjerne den', () => {
    const addAction = showCrashMessage('app error');
    expect(errorHandlingReducer(undefined, addAction).crashMessage).to.eql('app error');

    const removeAction = removeErrorMessage();
    expect(errorHandlingReducer(undefined, removeAction).crashMessage).to.eql('');
  });
});
