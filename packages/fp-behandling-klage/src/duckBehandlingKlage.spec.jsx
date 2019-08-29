import { expect } from 'chai';

import { reducer } from './duckBehandlingKlage';

describe('Klage-behandling-reducer', () => {
  it('skal returnere initial state', () => {
    expect(reducer(undefined, {})).to.eql({
      behandlingId: undefined,
      fagsakSaksnummer: undefined,
      hasShownBehandlingPaVent: false,
      featureToggles: {},
      kodeverk: {},
      fagsak: {},
      fagsakBehandlingerInfo: [],
    });
  });
});
