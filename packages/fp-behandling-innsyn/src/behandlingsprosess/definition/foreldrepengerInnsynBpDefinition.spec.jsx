import { expect } from 'chai';

import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import createForeldrepengerBpProps from './foreldrepengerInnsynBpDefinition';

describe('Definisjon av behandlingspunkter - Foreldrepenger', () => {
  const defaultBehandlingspunkter = [{
    apCodes: [],
    code: behandlingspunktCodes.VEDTAK,
    isVisible: true,
    status: vilkarUtfallType.IKKE_VURDERT,
    titleCode: 'Behandlingspunkt.Vedtak',
    vilkarene: [],
  }];

  it('skal ikke vise beregningspunkt for vedtak når det ikke finnes andre behandlingspunkter', () => {
    const builderData = {
      behandlingType: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
      },
      vilkar: [],
      aksjonspunkter: [],
      innsynResultatType: undefined,
    };

    const bpPropList = createForeldrepengerBpProps(builderData);

    expect(bpPropList).to.eql([]);
  });

  it('skal vise behandlingspunkt for innsyn som oppfylt når aksjonspunkt er utført', () => {
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
          kode: aksjonspunktStatus.UTFORT,
        },
      }],
      innsynResultatType: undefined,
    };

    const bpPropList = createForeldrepengerBpProps(builderData);

    expect(bpPropList).to.eql([{
      apCodes: [aksjonspunktCodes.VURDER_INNSYN],
      code: behandlingspunktCodes.BEHANDLE_INNSYN,
      isVisible: true,
      status: vilkarUtfallType.OPPFYLT,
      titleCode: 'Behandlingspunkt.Innsyn',
      vilkarene: [],
    }, ...defaultBehandlingspunkter]);
  });
});
