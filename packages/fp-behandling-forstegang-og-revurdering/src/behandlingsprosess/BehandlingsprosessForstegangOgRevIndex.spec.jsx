import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import { BehandlingsprosessForstegangOgRevIndex } from './BehandlingsprosessForstegangOgRevIndex';
import BehandlingspunktInfoPanel from './components/BehandlingspunktInfoPanel';

describe('BehandlingsprosessForstegangOgRevIndex', () => {
  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(<BehandlingsprosessForstegangOgRevIndex
      behandlingUuid="123"
      fagsakYtelseType={{ kode: fagsakYtelseType.FORELDREPENGER }}
      previewCallback={sinon.spy()}
      submitCallback={sinon.spy()}
      goToDefaultPage={sinon.spy()}
      goToSearchPage={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
      fetchFptilbakePreview={sinon.spy()}
      resolveProsessAksjonspunkterSuccess
    />);
    expect(wrapper.find(BehandlingspunktInfoPanel)).to.have.length(1);
  });
});
