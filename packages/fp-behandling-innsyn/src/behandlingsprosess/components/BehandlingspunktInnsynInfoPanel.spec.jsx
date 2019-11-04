import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import InnsynProsessIndex from '@fpsak-frontend/prosess-innsyn';

import { BehandlingspunktInnsynInfoPanel } from './BehandlingspunktInnsynInfoPanel';
import DataFetcherWithCacheTemp from '../../DataFetcherWithCacheTemp';

describe('<BehandlingspunktInnsynInfoPanel>', () => {
  it('skal rendre panelet for beregningsresultat', () => {
    const wrapper = shallow(<BehandlingspunktInnsynInfoPanel
      selectedBehandlingspunkt={behandlingspunktCodes.BEHANDLE_INNSYN}
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
      apCodes={[aksjonspunktCodes.VURDER_INNSYN]}
      readOnlySubmitButton={false}
      featureToggleFormkrav
      behandlingspunktAksjonspunkter={[]}
      alleKodeverk={{}}
      alleDokumenter={[]}
      aksjonspunkter={[]}
      saksnummer={1}
    />);

    const dataFetchers = wrapper.find(DataFetcherWithCacheTemp);
    expect(dataFetchers.at(1).prop('showComponent')).to.be.true;

    const innsynPanel = dataFetchers.at(1).renderProp('render')({
      behandling: { id: 1, versjon: 1, behandlingPaaVent: false },
      innsyn: { dokumenter: [], vedtaksdokumentasjon: [] },
    }).find(InnsynProsessIndex);
    expect(innsynPanel).to.have.length(1);
  });
});
