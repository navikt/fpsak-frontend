import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import UttakFaktaIndex from './UttakFaktaIndex';
import UttakInfoPanel from './components/UttakInfoPanel';

describe('<UttakFaktaIndex>', () => {
  const behandling = {
    id: 1,
    versjon: 1,
    sprakkode: {
      kode: 'NO',
    },
    type: {
      kode: '1',
      kodeverk: '1',
    },
    behandlingsresultat: {
      skjaeringstidspunktForeldrepenger: '2019-01-01',
    },
    status: {
      kode: '1',
      kodeverk: '1',
    },
    behandlingArsaker: [],
  };

  const aksjonspunkter = [{
    definisjon: {
      kode: aksjonspunktCodes.VURDER_FEILUTBETALING,
    },
    status: {
      kode: '1',
      kodeverk: '1',
    },
    kanLoses: true,
    erAktivt: true,
  }];

  it('skal rendre komponent korrekt', () => {
    const wrapper = shallow(<UttakFaktaIndex
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      submitCallback={sinon.spy()}
      readOnly={false}
      uttakKontrollerFaktaPerioder={{
        perioder: [],
      }}
      shouldOpenDefaultInfoPanels
      kanOverstyre={false}
      faktaArbeidsforhold={[]}
      personopplysninger={{}}
      familiehendelse={{}}
      alleKodeverk={{}}
      ytelsefordeling={{}}
      submittable
    />);
    expect(wrapper.find(UttakInfoPanel)).has.length(1);
  });
});
