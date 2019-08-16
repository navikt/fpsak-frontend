import { expect } from 'chai';

import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import as from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';

import { getBehandlingspunkterProps } from './behandlingsprosessAnkeSelectors';

describe('behandlingsprosessAnkeSelectors', () => {
  it('skal opprette behandlingspunkter for ankebehandling og ankemerknader når en har aksjonspunkt for vurdering av anke', () => {
    const fagsakYtelseType = {
      kode: FagsakYtelseType.FORELDREPENGER,
    };
    const behandlingType = {
      kode: BehandlingType.ANKE,
    };
    const aksjonspunkter = [{
      definisjon: {
        kode: ac.MANUELL_VURDERING_AV_ANKE,
      },
      status: {
        kode: as.OPPRETTET,
      },
    }];
    const behandlingsresultat = {};
    const vilkar = [];

    const bpProps = getBehandlingspunkterProps.resultFunc(fagsakYtelseType, behandlingType, aksjonspunkter, behandlingsresultat, vilkar);

    expect(bpProps).is.eql([{
      apCodes: [ac.MANUELL_VURDERING_AV_ANKE],
      code: bpc.ANKEBEHANDLING,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.Ankebehandling',
      vilkarene: [],
    }, {
      apCodes: [],
      code: bpc.ANKE_MERKNADER,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.AnkeMerknader',
      vilkarene: [],
    }]);
  });

  it('skal opprette behandlingspunkter for ankeresultat og ankemerknader når en har aksjonspunkt for foreslå vedtak', () => {
    const fagsakYtelseType = FagsakYtelseType.FORELDREPENGER;
    const behandlingType = BehandlingType.ANKE;
    const aksjonspunkter = [{
      definisjon: {
        kode: ac.FORESLA_VEDTAK,
      },
      status: {
        kode: as.OPPRETTET,
      },
    }];
    const behandlingsresultat = {};
    const vilkar = [];

    const bpProps = getBehandlingspunkterProps.resultFunc(fagsakYtelseType, behandlingType, aksjonspunkter, behandlingsresultat, vilkar);

    expect(bpProps).is.eql([{
      apCodes: [ac.FORESLA_VEDTAK],
      code: bpc.ANKE_RESULTAT,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.AnkeResultat',
      vilkarene: [],
    }, {
      apCodes: [],
      code: bpc.ANKE_MERKNADER,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.AnkeMerknader',
      vilkarene: [],
    }]);
  });
});
