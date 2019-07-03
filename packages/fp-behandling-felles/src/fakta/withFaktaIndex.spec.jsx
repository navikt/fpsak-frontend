import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import { expect } from 'chai';
import { BrowserRouter as Router } from 'react-router-dom';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import FaktaIndexProps from './FaktaIndexProps';
import withFaktaIndex from './withFaktaIndex';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const FaktaPanel = () => (
  <div className="component" />
);

const FaktaComp = withFaktaIndex(sinon.spy(), sinon.spy())(FaktaPanel);

describe('<HOC: withFaktaIndex>', () => {
  const behandlingIdentifier = new BehandlingIdentifier(1, 1);

  it('skal godkjenne aksjonspunkt', () => {
    const openInfoPanels = ['fakta1', 'fakta2'];
    let apParameters = {};
    const resolveAp = (params, bId) => () => {
      apParameters = { params, bId };
      return Promise.resolve();
    };
    const resolveOverrideAp = sinon.spy();
    const faktaIndexProps = new FaktaIndexProps(
      behandlingIdentifier, 1, openInfoPanels, sinon.spy(), resolveAp, resolveOverrideAp,
    );

    const wrapper = shallow(
      <Router>
        <FaktaComp
          store={mockStore({ router: { location: { path: 'test' } } })}
          faktaIndexProps={faktaIndexProps}
          push={sinon.spy()}
        />
      </Router>,
    ).dive() // TODO (TOR) Bør unngå deep dive
    .dive()
    .dive()
    .dive()
    .dive()
    .dive()
    .dive()
    .dive();

    const panel = wrapper.find(FaktaPanel);
    expect(panel).to.have.length(1);

    const aksjonspunkter = [{
      kode: '1234',
    }];
    panel.prop('submitCallback')(aksjonspunkter);

    expect(apParameters.params).to.eql({
      behandlingId: 1,
      behandlingVersjon: 1,
      bekreftedeAksjonspunktDtoer: [{
        '@type': '1234',
        kode: '1234',
      }],
      saksnummer: '1',
    });

    expect(resolveOverrideAp.called).is.false;
  });

  it('skal godkjenne overstyringsaksjonspunkt', () => {
    const openInfoPanels = ['fakta1', 'fakta2'];
    const resolveAp = sinon.spy();
    let apParameters = {};
    const resolveOverrideAp = (params, bId) => () => {
      apParameters = { params, bId };
      return Promise.resolve();
    };
    const faktaIndexProps = new FaktaIndexProps(
      behandlingIdentifier, 1, openInfoPanels, sinon.spy(), resolveAp, resolveOverrideAp,
    );

    const wrapper = shallow(
      <Router>
        <FaktaComp
          store={mockStore({ router: { location: { path: 'test' } } })}
          faktaIndexProps={faktaIndexProps}
          push={sinon.spy()}
          overstyringApCodes={['1234']}
        />
      </Router>,
    ).dive() // TODO (TOR) Bør unngå deep dive
    .dive()
    .dive()
    .dive()
    .dive()
    .dive()
    .dive()
    .dive();

    const panel = wrapper.find(FaktaPanel);
    expect(panel).to.have.length(1);

    const aksjonspunkter = [{
      kode: '1234',
    }];
    panel.prop('submitCallback')(aksjonspunkter);

    expect(apParameters.params).to.eql({
      behandlingId: 1,
      behandlingVersjon: 1,
      overstyrteAksjonspunktDtoer: [{
        '@type': '1234',
        kode: '1234',
      }],
      saksnummer: '1',
    });

    expect(resolveAp.called).is.false;
  });
});
