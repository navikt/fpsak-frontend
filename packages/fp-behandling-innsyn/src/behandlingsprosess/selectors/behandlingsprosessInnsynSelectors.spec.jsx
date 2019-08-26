import { expect } from 'chai';

import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import as from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { behandlingspunktCodes as bpc } from '@fpsak-frontend/fp-felles';

import { getBehandlingspunkterProps } from './behandlingsprosessInnsynSelectors';

describe('behandlingsprosessInnsynSelectors', () => {
  it('skal opprette behandlingspunkter for innsyn når en har aksjonspunkt vurdere innsyn og det er en engangsstønad', () => {
    const fagsakYtelseType = {
      kode: FagsakYtelseType.ENGANGSSTONAD,
    };
    const behandlingType = {
      kode: BehandlingType.DOKUMENTINNSYN,
    };
    const aksjonspunkter = [{
      definisjon: {
        kode: ac.VURDER_INNSYN,
      },
      status: {
        kode: as.OPPRETTET,
      },
    }];
    const innsynResultatType = {};
    const vilkar = [];

    const bpProps = getBehandlingspunkterProps.resultFunc(fagsakYtelseType, behandlingType, aksjonspunkter, innsynResultatType, vilkar);

    expect(bpProps).is.eql([{
      apCodes: [ac.VURDER_INNSYN],
      code: bpc.BEHANDLE_INNSYN,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.Innsyn',
      vilkarene: [],
    }, {
      apCodes: [],
      code: bpc.VEDTAK,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.Vedtak',
      vilkarene: [],
    }]);
  });

  it('skal opprette behandlingspunkter for innsyn når en har aksjonspunkt vurdere innsyn og det er en foreldrepengersøknad', () => {
    const fagsakYtelseType = {
      kode: FagsakYtelseType.FORELDREPENGER,
    };
    const behandlingType = {
      kode: BehandlingType.DOKUMENTINNSYN,
    };
    const aksjonspunkter = [{
      definisjon: {
        kode: ac.VURDER_INNSYN,
      },
      status: {
        kode: as.OPPRETTET,
      },
    }];
    const innsynResultatType = {};
    const vilkar = [];

    const bpProps = getBehandlingspunkterProps.resultFunc(fagsakYtelseType, behandlingType, aksjonspunkter, innsynResultatType, vilkar);

    expect(bpProps).is.eql([{
      apCodes: [ac.VURDER_INNSYN],
      code: bpc.BEHANDLE_INNSYN,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.Innsyn',
      vilkarene: [],
    }, {
      apCodes: [],
      code: bpc.VEDTAK,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.Vedtak',
      vilkarene: [],
    }]);
  });
});
