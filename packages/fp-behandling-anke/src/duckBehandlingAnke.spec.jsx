import { expect } from 'chai';

import { reducer } from './duckBehandlingAnke';

describe('Anke-behandling-reducer', () => {
  it('skal returnere initial state', () => {
    expect(reducer(undefined, {})).to.eql({
      behandlingId: undefined,
      fagsakSaksnummer: undefined,
      hasShownBehandlingPaVent: false,
      featureToggles: {},
      kodeverk: {},
      fagsak: {},
    });
  });
});
