import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import ac from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import BehandlingsprosessPanel from './components/BehandlingsprosessPanel';
import { CommonBehandlingsprosessIndex } from './CommonBehandlingsprosessIndex';

describe('<CommonBehandlingsprosessIndex>', () => {
  const behandlingIdentifier = new BehandlingIdentifier(1, 1);

  it('skal bekrefte aksjonspunkter', async () => {
    const dummyFn = () => () => Promise.resolve();
    let apData = {};
    const resolveProsessAksjonspunkter = (bi, params, shouldUpdateInfo) => {
      apData = { behandlingIdentifier: bi, params, shouldUpdateInfo };
      return Promise.resolve();
    };

    const wrapper = shallowWithIntl(
      <CommonBehandlingsprosessIndex
        intl={intlMock}
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
        push={sinon.spy()}
        render={(previewCallback, submitAksjonspunkter, goToBehandlingWithDefaultPunktAndFakta, goToSearchPage) => (
          <div
            previewCallback={previewCallback}
            submitCallback={submitAksjonspunkter}
            goToSearchPage={goToSearchPage}
            goToBehandlingWithDefaultPunktAndFakta={goToBehandlingWithDefaultPunktAndFakta}
          >
            Somecomponent content
          </div>
        )}
      />,
    );
    expect(wrapper.find(BehandlingsprosessPanel))
      .to
      .have
      .length(1, 'Finner ikke BehandlingsprosessPanel');
    const panel = wrapper.find('div');
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
