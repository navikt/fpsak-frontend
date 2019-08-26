import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import { BehandlingsprosessForstegangOgRevIndex } from './BehandlingsprosessForstegangOgRevIndex';
import BehandlingspunktInfoPanel from './components/BehandlingspunktInfoPanel';

describe('BehandlingsprosessForstegangOgRevIndex', () => {
  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(<BehandlingsprosessForstegangOgRevIndex
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      previewCallback={sinon.spy()}
      submitCallback={sinon.spy()}
      goToDefaultPage={sinon.spy()}
      goToSearchPage={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
      fetchFptilbakePreview={sinon.spy()}
      fetchVedtaksbrevPreview={sinon.spy()}
      resolveProsessAksjonspunkterSuccess
    />);
    expect(wrapper.find(BehandlingspunktInfoPanel)).to.have.length(1);
  });
});
