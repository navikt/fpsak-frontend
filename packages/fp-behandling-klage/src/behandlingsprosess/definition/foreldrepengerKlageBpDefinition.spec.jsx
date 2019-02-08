import { expect } from 'chai';

import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import createForeldrepengerBpProps from './foreldrepengerKlageBpDefinition';

describe('Definisjon av behandlingspunkter - Foreldrepenger', () => {
  const defaultBehandlingspunkter = [{
    apCodes: [],
    code: behandlingspunktCodes.KLAGE_RESULTAT,
    isVisible: true,
    status: vilkarUtfallType.OPPFYLT,
    titleCode: 'Behandlingspunkt.ResultatKlage',
    vilkarene: [],
  }];

  it('skal alltid vise behandlingspunkt for resultat når det finnes minst ett annet behandlingspunkt', () => {
    const builderData = {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
      },
      vilkar: [],
      aksjonspunkter: [{
        definisjon: {
          kode: aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP,
        },
        status: {
          kode: aksjonspunktStatus.UTFORT,
        },
      }],
      behandlingsresultat: {
        type: 'test',
      },
    };

    const bpPropList = createForeldrepengerBpProps(builderData);

    expect(bpPropList).to.eql([{
      apCodes: [aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP],
      code: behandlingspunktCodes.FORMKRAV_KLAGE_NAV_FAMILIE_OG_PENSJON,
      isVisible: true,
      status: vilkarUtfallType.OPPFYLT,
      titleCode: 'Behandlingspunkt.FormkravKlageNFP',
      vilkarene: [],
    }, ...defaultBehandlingspunkter]);
  });
});
