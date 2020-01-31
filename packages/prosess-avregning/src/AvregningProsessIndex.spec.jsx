import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import AvregningPanel from './components/AvregningPanel';
import AvregningProsessIndex from './AvregningProsessIndex';

describe('<AvregningProsessIndex>', () => {
  const fagsak = {
    saksnummer: 123,
    ytelseType: {
      kode: fagsakYtelseType.FORELDREPENGER,
    },
  };

  const behandling = {
    id: 1,
    versjon: 1,
    sprakkode: {
      kode: 'NO',
    },
  };

  const aksjonspunkter = [{
    definisjon: {
      kode: aksjonspunktCodes.VURDER_FEILUTBETALING,
    },
    begrunnelse: 'test',
  }];

  it('skal rendre komponent korrekt', () => {
    const wrapper = shallow(<AvregningProsessIndex
      fagsak={fagsak}
      behandling={behandling}
      aksjonspunkter={aksjonspunkter}
      submitCallback={sinon.spy()}
      isReadOnly={false}
      readOnlySubmitButton={false}
      isAksjonspunktOpen
      previewFptilbakeCallback={sinon.spy()}
      featureToggles={{}}
    />);
    expect(wrapper.find(AvregningPanel)).has.length(1);
  });
});
