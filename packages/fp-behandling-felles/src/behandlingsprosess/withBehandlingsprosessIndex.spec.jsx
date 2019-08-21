import React from 'react';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import { expect } from 'chai';
import { BrowserRouter as Router } from 'react-router-dom';

import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import BehandlingsprosessPanel from './components/BehandlingsprosessPanel';
import withBehandlingsprosessIndex from './withBehandlingsprosessIndex';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const BehandlingspunktPanel = () => (
  <div className="component" />
);

const BehandlingspunktComp = withBehandlingsprosessIndex(sinon.spy(), sinon.spy())(BehandlingspunktPanel);

describe('<HOC: withBehandlingsprosessIndex>', () => {
  const behandlingIdentifier = new BehandlingIdentifier(1, 1);

  it('skal bekrefte aksjonspunkter', async () => {
    const dummyFn = () => () => Promise.resolve();
    let apData = {};
    const resolveProsessAksjonspunkter = (bi, params, shouldUpdateInfo) => () => {
      apData = { behandlingIdentifier: bi, params, shouldUpdateInfo };
      return Promise.resolve();
    };

    const wrapper = shallow(
      <Router>
        <BehandlingspunktComp
          store={mockStore({ router: { location: { path: 'test' } } })}
          behandlingIdentifier={behandlingIdentifier}
          behandlingVersjon={1}
          resolveProsessAksjonspunkter={resolveProsessAksjonspunkter}
          behandlingspunkter={[]}
          resetBehandlingspunkter={dummyFn}
          isSelectedBehandlingHenlagt
          location={{}}
          fetchPreview={dummyFn}
          fagsakYtelseType={{ kode: fagsakYtelseType.FORELDREPENGER }}
          behandlingStatus={{ kode: behandlingStatus.OPPRETTET }}
          resolveProsessAksjonspunkterSuccess
          behandlingsresultat={{}}
          getBehandlingspunkterStatus={sinon.spy()}
          getBehandlingspunkterTitleCodes={sinon.spy()}
          getAksjonspunkterOpenStatus={sinon.spy()}
          behandlingType={{
            kode: behandlingType.FORSTEGANGSSOKNAD,
          }}
          aksjonspunkter={[]}
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

    expect(wrapper.find(BehandlingsprosessPanel)).to.have.length(1);
    const panel = wrapper.find(BehandlingspunktPanel);
    expect(panel).to.have.length(1);

    const aksjonspunktModels = [{
      kode: ac.VURDER_INNSYN,
    }];
    const afterSubmitCallback = sinon.spy();
    const shouldUpdateInfo = true;

    await panel.prop('submitCallback')(aksjonspunktModels, afterSubmitCallback, shouldUpdateInfo);

    expect(apData).is.eql({
      behandlingIdentifier: {
        $$behandlingId: 1,
        $$saksnummer: 1,
      },
      shouldUpdateInfo: true,
      params: {
        behandlingId: 1,
        behandlingVersjon: 1,
        bekreftedeAksjonspunktDtoer: [{
          '@type': ac.VURDER_INNSYN,
          kode: ac.VURDER_INNSYN,
        }],
        saksnummer: '1',
      },
    });

    expect(afterSubmitCallback.called).is.true;
  });
});
