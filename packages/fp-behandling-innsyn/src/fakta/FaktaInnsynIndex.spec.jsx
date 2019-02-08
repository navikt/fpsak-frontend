import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import FaktaInnsynPanel from 'behandlingInnsyn/src/fakta/components/FaktaInnsynPanel';
import { FaktaInnsynIndex } from './FaktaInnsynIndex';

describe('<FaktaInnsynIndex>', () => {
  const behandlingIdentifier = new BehandlingIdentifier(1, 1);

  it('skal vise fakta-paneler', () => {
    const wrapper = shallow(<FaktaInnsynIndex
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

    expect(wrapper.find(FaktaInnsynPanel)).to.have.length(1);
  });
});
