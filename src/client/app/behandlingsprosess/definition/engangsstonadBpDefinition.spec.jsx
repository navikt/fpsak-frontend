import { expect } from 'chai';

import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import aksjonspunktStatus from 'kodeverk/aksjonspunktStatus';
import behandlingType from 'kodeverk/behandlingType';
import vilkarUtfallType from 'kodeverk/vilkarUtfallType';
import behandlingspunktCodes from 'behandlingsprosess/behandlingspunktCodes';
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
    code: behandlingspunktCodes.VEDTAK,
    isVisible: true,
    status: vilkarUtfallType.IKKE_VURDERT,
    titleCode: 'Behandlingspunkt.Vedtak',
    vilkarene: [],
  }];

  it('skal alltid vise behandlingspunktene for beregning og vedtak når det finnes minst ett annet behandlingspunkt', () => {
    const builderData = {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
      },
      vilkar: [],
      aksjonspunkter: [{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_INNSYN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
      }],
      behandlingsresultat: {},
      innsynResultatType: undefined,
      resultatstruktur: undefined,
      stonadskontoer: undefined,
    };

    const bpPropList = createEngangsstonadBpProps(builderData);

    expect(bpPropList).to.eql([{
      apCodes: [aksjonspunktCodes.VURDER_INNSYN],
      code: behandlingspunktCodes.BEHANDLE_INNSYN,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.Innsyn',
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
          kode: aksjonspunktCodes.VURDER_INNSYN,
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
    };

    const bpPropList = createEngangsstonadBpProps(builderData);

    expect(bpPropList).to.eql([{
      apCodes: [aksjonspunktCodes.VURDER_INNSYN],
      code: behandlingspunktCodes.BEHANDLE_INNSYN,
      isVisible: true,
      status: vilkarUtfallType.IKKE_VURDERT,
      titleCode: 'Behandlingspunkt.Innsyn',
      vilkarene: [],
    }, {
      apCodes: [],
      code: behandlingspunktCodes.BEREGNING,
      isVisible: true,
      status: vilkarUtfallType.OPPFYLT,
      titleCode: 'Behandlingspunkt.Beregning',
      vilkarene: [],
    }, defaultBehandlingspunkter[1]]);
  });
});
