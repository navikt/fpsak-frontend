import { expect } from 'chai';

import {
  appReducer, setAvdelingEnhet, resetAvdelingEnhet,
} from './duck';

describe('App-reducer', () => {
  it('skal returnere initial state', () => {
    expect(appReducer(undefined, { type: '' })).to.eql({
      valgtAvdelingEnhet: undefined,
    });
  });

  it('skal sette avdelingsEnhet og så fjerne den', () => {
    const addAction = setAvdelingEnhet('1');
    expect(appReducer(undefined, addAction).valgtAvdelingEnhet).to.eql('1');

    const removeAction = resetAvdelingEnhet();
    expect(appReducer(undefined, removeAction).valgtAvdelingEnhet).is.undefined;
  });
});
