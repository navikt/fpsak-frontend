import { expect } from 'chai';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import klageBehandlingSelectors from './klageBehandlingSelectors';

describe('klageBehandlingSelectors', () => {
  it('skal ha klagebehandling KA når dette aksjonspunktet finnes', () => {
    const openAksjonspunkter = [{
      definisjon: {
        kode: aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA,
      },
    }];
    const isInKa = klageBehandlingSelectors.isKlageBehandlingInKA.resultFunc(openAksjonspunkter);

    expect(isInKa).is.true;
  });

  it('skal ikke ha klagebehandling KA når aksjonspunktet ikke finnes', () => {
    const openAksjonspunkter = [];
    const isInKa = klageBehandlingSelectors.isKlageBehandlingInKA.resultFunc(openAksjonspunkter);

    expect(isInKa).is.false;
  });
});
