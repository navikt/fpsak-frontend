import { expect } from 'chai';

import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import as from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';

import { getBehandlingspunkterProps } from './behandlingsprosessKlageSelectors';

describe('behandlingsprosessKlageSelectors', () => {
  it('skal opprette behandlingspunkter for klage når en har aksjonspunkt vurdere klage og det er en engangsstønad', () => {
    const fagsakYtelseType = {
      kode: FagsakYtelseType.ENGANGSSTONAD,
    };
    const behandlingType = {
      kode: BehandlingType.KLAGE,
    };
    const aksjonspunkter = [{
      definisjon: {
        kode: ac.VURDERING_AV_FORMKRAV_KLAGE_NFP,
      },
      status: {
        kode: as.OPPRETTET,
      },
    }];
    const behandlingsresultat = {};
    const vilkar = [];

    const bpProps = getBehandlingspunkterProps.resultFunc(fagsakYtelseType, behandlingType, vilkar, aksjonspunkter, behandlingsresultat);

    expect(bpProps).is.eql([{
      apCodes: [ac.VURDERING_AV_FORMKRAV_KLAGE_NFP],
      code: bpc.FORMKRAV_KLAGE_NAV_FAMILIE_OG_PENSJON,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.FormkravKlageNFP',
      vilkarene: [],
    }, {
      apCodes: [],
      code: bpc.KLAGE_RESULTAT,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.ResultatKlage',
      vilkarene: [],
    }]);
  });

  it('skal opprette behandlingspunkter for klage når en har aksjonspunkt vurdere innsyn og det er en foreldrepengersøknad', () => {
    const fagsakYtelseType = {
      kode: FagsakYtelseType.FORELDREPENGER,
    };
    const behandlingType = {
      kode: BehandlingType.KLAGE,
    };
    const aksjonspunkter = [{
      definisjon: {
        kode: ac.VURDERING_AV_FORMKRAV_KLAGE_KA,
      },
      status: {
        kode: as.OPPRETTET,
      },
    }];
    const behandlingsresultat = {};
    const vilkar = [];

    const bpProps = getBehandlingspunkterProps.resultFunc(fagsakYtelseType, behandlingType, vilkar, aksjonspunkter, behandlingsresultat);

    expect(bpProps).is.eql([{
      apCodes: [ac.VURDERING_AV_FORMKRAV_KLAGE_KA],
      code: bpc.FORMKRAV_KLAGE_NAV_KLAGEINSTANS,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.FormkravKlageKA',
      vilkarene: [],
    }, {
      apCodes: [],
      code: bpc.KLAGE_RESULTAT,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.ResultatKlage',
      vilkarene: [],
    }]);
  });
});
