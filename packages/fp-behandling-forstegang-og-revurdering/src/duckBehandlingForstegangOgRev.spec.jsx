import { expect } from 'chai';

import { reducer } from './duckBehandlingForstegangOgRev';

describe('Førstegang-og-revurdering-behandling-reducer', () => {
  it('skal returnere initial state', () => {
    expect(reducer(undefined, {})).to.eql({
      behandlingId: undefined,
      fagsakSaksnummer: undefined,
      hasShownBehandlingPaVent: false,
      featureToggles: {},
      kodeverk: {},
      fagsak: {},
      shouldUpdateFagsak: true,
    });
  });
});
