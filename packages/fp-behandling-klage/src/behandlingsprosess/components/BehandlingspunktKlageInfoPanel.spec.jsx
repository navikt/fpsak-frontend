import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { BehandlingspunktKlageInfoPanel } from 'behandlingKlage/src/behandlingsprosess/components/BehandlingspunktKlageInfoPanel';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BehandleKlageFormNfp from './klage/Klagevurdering/Nfp/BehandleKlageFormNfp';

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
    />);

    expect(wrapper.find(BehandleKlageFormNfp)).to.have.length(1);
  });
});
