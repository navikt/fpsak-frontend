
import { expect } from 'chai';

import {
  behandlingskoerReducer, setValgtSakslisteId,
} from './duck';

describe('Behandlingskøer-reducer', () => {
  it('skal returnere initial state', () => {
    expect(behandlingskoerReducer(undefined, { type: '' })).to.eql({
      valgtSakslisteId: undefined,
    });
  });

  it('skal sette saksliste-id', () => {
    const addAction = setValgtSakslisteId(1);
    expect(behandlingskoerReducer(undefined, addAction).valgtSakslisteId).to.eql(1);
  });
});
