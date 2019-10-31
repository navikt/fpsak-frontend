import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import KlagevurderingProsessIndex from '@fpsak-frontend/prosess-klagevurdering';

import DataFetcherWithCacheTemp from '../../DataFetcherWithCacheTemp';
import { BehandlingspunktKlageInfoPanel } from './BehandlingspunktKlageInfoPanel';

describe('<BehandlingspunktKlageInfoPanel>', () => {
  it('skal rendre panelet for beregningsresultat', () => {
    const wrapper = shallow(<BehandlingspunktKlageInfoPanel
      selectedBehandlingspunkt="test"
      submitCallback={sinon.spy()}
      saveTempKlage={sinon.spy()}
      previewCallback={sinon.spy()}
      previewCallbackKlage={sinon.spy()}
      previewVedtakCallback={sinon.spy()}
      previewManueltBrevCallback={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
      openAksjonspunkt={false}
      readOnly={false}
      isApSolvable={false}
      apCodes={[aksjonspunktCodes.BEHANDLE_KLAGE_NFP]}
      readOnlySubmitButton={false}
      featureToggleFormkrav
      behandlingspunktAksjonspunkter={[]}
    />);

    const dataFetchers = wrapper.find(DataFetcherWithCacheTemp);
    expect(dataFetchers.at(1).prop('showComponent')).to.be.true;

    const tilbakekrevingPanel = dataFetchers.at(1).renderProp('render')({
      behandling: { id: 1, versjon: 1 },
      perioderForeldelse: {
        perioder: [],
      },
      vilkarvurderingsperioder: {
        perioder: [],
        rettsgebyr: 1000,
      },
      vilkarvurdering: {
        vilkarsVurdertePerioder: [],
      },
    }).find(KlagevurderingProsessIndex);
    expect(tilbakekrevingPanel).to.have.length(1);
  });
});
