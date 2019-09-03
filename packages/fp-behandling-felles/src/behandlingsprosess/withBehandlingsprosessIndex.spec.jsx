import React from 'react';
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

import { mountWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { Provider } from 'react-redux';
import BehandlingsprosessPanel from './components/BehandlingsprosessPanel';
import withBehandlingsprosessIndex from './withBehandlingsprosessIndex';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const BehandlingspunktPanel = () => (
  <>
    <div className="component">Somecomponent content</div>
  </>
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

    const wrapper = mountWithIntl(
      <Provider store={mockStore({ router: { location: { path: 'test' } } })}>
        <Router>
          <BehandlingspunktComp
            aksjonspunkter={[]}
            aksjonspunkterOpenStatus={{}}
            behandlingIdentifier={behandlingIdentifier}
            behandlingspunkter={[]}
            behandlingspunkterStatus={{}}
            behandlingspunkterTitleCodes={{}}
            behandlingsresultat={undefined}
            behandlingStatus={{ kode: behandlingStatus.OPPRETTET }}
            behandlingType={{ kode: behandlingType.FORSTEGANGSSOKNAD }}
            behandlingVersjon={1}
            fagsakYtelseType={{ kode: fagsakYtelseType.FORELDREPENGER }}
            fetchPreview={dummyFn}
            isSelectedBehandlingHenlagt
            location={{}}
            resetBehandlingspunkter={dummyFn}
            resolveProsessAksjonspunkter={resolveProsessAksjonspunkter}
            resolveProsessAksjonspunkterSuccess
            selectedBehandlingspunkt="test"
          />
        </Router>
      </Provider>,
    );
    expect(wrapper.find(BehandlingsprosessPanel))
      .to
      .have
      .length(1, 'Finner ikke BehandlingsprosessPanel');
    const panel = wrapper.find(BehandlingspunktPanel);
    expect(panel)
      .to
      .have
      .length(1, 'Finner ikke BehandlingspunktPanel');
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
