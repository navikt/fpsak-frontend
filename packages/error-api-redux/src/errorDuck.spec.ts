import { expect } from 'chai';

import {
  addErrorMessage, errorReducer, removeErrorMessage, showCrashMessage,
} from './errorDuck';

describe('Error-reducer', () => {
  it('skal returnere initial state', () => {
    expect(errorReducer(undefined, {})).to.eql({
      errorMessages: [],
      crashMessage: undefined,
    });
  });

  it('skal oppdatere state med feilmelding og så fjerne den', () => {
    const addAction = addErrorMessage('login error');
    expect(errorReducer(undefined, addAction).errorMessages).to.eql(['login error']);

    const removeAction = removeErrorMessage();
    expect(errorReducer(undefined, removeAction).errorMessages).to.eql([]);
  });

  it('skal oppdatere state med feilmelding fra response', () => {
    const action = addErrorMessage('test error');
    expect(errorReducer(undefined, action).errorMessages).to.eql(['test error']);
  });

  it('skal oppdatere med crash-melding og så fjerne den', () => {
    const addAction = showCrashMessage('app error');
    expect(errorReducer(undefined, addAction).crashMessage).to.eql('app error');

    const removeAction = removeErrorMessage();
    expect(errorReducer(undefined, removeAction).crashMessage).is.undefined;
  });
});
