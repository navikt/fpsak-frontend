import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import { CommonFaktaIndex } from './CommonFaktaIndex';

describe('<CommonFaktaIndex>', () => {
  const behandlingIdentifier = new BehandlingIdentifier(1, 1);

  it('skal godkjenne aksjonspunkt', () => {
    const openInfoPanels = ['fakta1', 'fakta2'];
    let apParameters = {};
    const resolveAp = (params, bId) => {
      apParameters = { params, bId };
      return Promise.resolve();
    };

    const wrapper = shallow(<CommonFaktaIndex
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={1}
      openInfoPanels={openInfoPanels}
      resolveFaktaAksjonspunkter={resolveAp}
      resolveFaktaOverstyrAksjonspunkter={sinon.spy()}
      resetFakta={sinon.spy()}
      push={sinon.spy()}
      location={{}}
      shouldOpenDefaultInfoPanels
      render={(submitFakta, toggleInfoPanel, shouldOpenDefaultInfoPanels) => (
        <div submitFakta={submitFakta} toggleInfoPanel={toggleInfoPanel} shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels} />
      )}
    />);

    const panel = wrapper.find('div');
    expect(panel).to.have.length(1);

    const aksjonspunkter = [{
      kode: '1234',
    }];
    panel.prop('submitFakta')(aksjonspunkter);

    expect(apParameters.params).to.eql({
      behandlingId: 1,
      behandlingVersjon: 1,
      bekreftedeAksjonspunktDtoer: [{
        '@type': '1234',
        kode: '1234',
      }],
      saksnummer: '1',
    });
  });

  it('skal godkjenne overstyringsaksjonspunkt', () => {
    const openInfoPanels = ['fakta1', 'fakta2'];
    let apParameters = {};
    const resolveOverrideAp = (params, bId) => {
      apParameters = { params, bId };
      return Promise.resolve();
    };

    const wrapper = shallow(<CommonFaktaIndex
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={1}
      openInfoPanels={openInfoPanels}
      resolveFaktaAksjonspunkter={sinon.spy()}
      resolveFaktaOverstyrAksjonspunkter={resolveOverrideAp}
      resetFakta={sinon.spy()}
      push={sinon.spy()}
      overstyringApCodes={['1234']}
      location={{}}
      shouldOpenDefaultInfoPanels
      render={(submitFakta, toggleInfoPanel, shouldOpenDefaultInfoPanels) => (
        <div submitFakta={submitFakta} toggleInfoPanel={toggleInfoPanel} shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels} />
      )}
    />);

    const panel = wrapper.find('div');
    expect(panel).to.have.length(1);

    const aksjonspunkter = [{
      kode: '1234',
    }];
    panel.prop('submitFakta')(aksjonspunkter);

    expect(apParameters.params).to.eql({
      behandlingId: 1,
      behandlingVersjon: 1,
      overstyrteAksjonspunktDtoer: [{
        '@type': '1234',
        kode: '1234',
      }],
      saksnummer: '1',
    });
  });
});
