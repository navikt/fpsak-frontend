import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-behandling-felles';
import FaktaPanel from 'behandlingKlage/src/fakta/components/FaktaPanel';
import { FaktaIndex } from './FaktaIndex';

describe('<FaktaIndex>', () => {
  const behandlingIdentifier = new BehandlingIdentifier(1, 1);

  it('skal vise fakta-paneler', () => {
    const wrapper = shallow(<FaktaIndex
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={1}
      resetFakta={sinon.spy()}
      openInfoPanels={['fakta1', 'fakta2']}
      location={{}}
      push={sinon.spy()}
      resolveFaktaAksjonspunkter={sinon.spy()}
      resolveFaktaOverstyrAksjonspunkter={sinon.spy()}
      shouldOpenDefaultInfoPanels
      behandlingType={{
        kode: BehandlingType.FORSTEGANGSSOKNAD,
        name: 'FORSTEGANGSSOKNAD',
      }}
    />);

    expect(wrapper.find(FaktaPanel)).to.have.length(1);
  });
});
