import { expect } from 'chai';

import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

import createEngangsstonadBpProps from './engangsstonadInnsynBpDefinition';

describe('Definisjon av behandlingspunkter - Engangsstønad', () => {
  const defaultBehandlingspunkter = [{
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
      innsynResultatType: undefined,
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
      innsynResultatType: undefined,
    };

    const bpPropList = createEngangsstonadBpProps(builderData);

    expect(bpPropList).to.eql([]);
  });
});
