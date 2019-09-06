import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { CommonBehandlingsprosessIndex } from '@fpsak-frontend/fp-behandling-felles';

import { BehandlingsprosessForstegangOgRevIndex } from './BehandlingsprosessForstegangOgRevIndex';
import BehandlingspunktInfoPanel from './components/BehandlingspunktInfoPanel';

describe('BehandlingsprosessForstegangOgRevIndex', () => {
  const defaultProps = {
    behandlingUuid: '1',
    behandlingIdentifier: new BehandlingIdentifier(1, 1),
    fetchPreviewBrev: sinon.spy(),
    fagsakYtelseType: { kode: '' },
    behandlingVersjon: 1,
    behandlingType: { kode: '' },
    behandlingStatus: { kode: '' },
    aksjonspunkter: [],
    resolveProsessAksjonspunkterSuccess: true,
    location: {},
    isSelectedBehandlingHenlagt: true,
    dispatchSubmitFailed: sinon.spy(),
    fetchFptilbakePreview: sinon.spy(),
    fetchVedtaksbrevPreview: sinon.spy(),
  };
  const previewCallbackDef = sinon.spy();
  const submitCallbackDef = sinon.spy();
  const goToDefaultPageDef = sinon.spy();
  const goToSearchPageDef = sinon.spy();

  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(<BehandlingsprosessForstegangOgRevIndex
      {...defaultProps}
    />).find(CommonBehandlingsprosessIndex)
      .renderProp('render')(previewCallbackDef, submitCallbackDef, goToDefaultPageDef, goToSearchPageDef);
    expect(wrapper.find(BehandlingspunktInfoPanel)).to.have.length(1);
  });
});
