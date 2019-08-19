import { expect } from 'chai';

import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import createEngangsstonadBpProps from './engangsstonadBpDefinition';

describe('Definisjon av behandlingspunkter - Engangsstønad', () => {
  const defaultBehandlingspunkter = [{
    apCodes: [],
    code: behandlingspunktCodes.BEREGNING,
    isVisible: true,
    status: vilkarUtfallType.IKKE_VURDERT,
    titleCode: 'Behandlingspunkt.Beregning',
    vilkarene: [],
  }, {
    apCodes: [],
    code: behandlingspunktCodes.SIMULERING,
    isVisible: true,
    status: vilkarUtfallType.IKKE_VURDERT,
    titleCode: 'Behandlingspunkt.Avregning',
    vilkarene: [],
  }, {
    apCodes: [],
    code: behandlingspunktCodes.VEDTAK,
    isVisible: true,
    status: vilkarUtfallType.IKKE_VURDERT,
    titleCode: 'Behandlingspunkt.Vedtak',
    vilkarene: [],
  }];

  const featureToggles = {
  };

  it('skal alltid vise behandlingspunktene for beregning og vedtak når det finnes minst ett annet behandlingspunkt', () => {
    const builderData = {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
      },
      vilkar: [],
      aksjonspunkter: [{
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_PERSONSTATUS,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
      }],
      behandlingsresultat: {},
      innsynResultatType: undefined,
      resultatstruktur: undefined,
      stonadskontoer: undefined,
      featureToggles,
    };

    const bpPropList = createEngangsstonadBpProps(builderData);

    expect(bpPropList).to.eql([{
      apCodes: [aksjonspunktCodes.AVKLAR_PERSONSTATUS],
      code: behandlingspunktCodes.SAKSOPPLYSNINGER,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.Saksopplysninger',
      vilkarene: [],
    }, ...defaultBehandlingspunkter]);
  });

  it('skal ikke vise beregningspunkter for beregning og vedtak når det ikke finnes andre behandlingspunkter', () => {
    const builderData = {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
      },
      vilkar: [],
      aksjonspunkter: [],
      behandlingsresultat: {},
      innsynResultatType: undefined,
      resultatstruktur: undefined,
      stonadskontoer: undefined,
      featureToggles,
    };

    const bpPropList = createEngangsstonadBpProps(builderData);

    expect(bpPropList).to.eql([]);
  });

  it('skal vise status oppfylt for behandlingspunktet beregning når det finnes en resultatstruktur', () => {
    const builderData = {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
      },
      vilkar: [],
      aksjonspunkter: [{
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_PERSONSTATUS,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
      }],
      behandlingsresultat: {},
      innsynResultatType: undefined,
      resultatstruktur: {
        perioder: [{ fomDato: '2018-10-10' }],
      },
      stonadskontoer: undefined,
      featureToggles,
    };

    const bpPropList = createEngangsstonadBpProps(builderData);

    expect(bpPropList).to.eql([{
      apCodes: [aksjonspunktCodes.AVKLAR_PERSONSTATUS],
      code: behandlingspunktCodes.SAKSOPPLYSNINGER,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.Saksopplysninger',
      vilkarene: [],
    }, {
      apCodes: [],
      code: behandlingspunktCodes.BEREGNING,
      isVisible: true,
      status: vilkarUtfallType.OPPFYLT,
      titleCode: 'Behandlingspunkt.Beregning',
      vilkarene: [],
    }, defaultBehandlingspunkter[1], defaultBehandlingspunkter[2]]);
  });
});
