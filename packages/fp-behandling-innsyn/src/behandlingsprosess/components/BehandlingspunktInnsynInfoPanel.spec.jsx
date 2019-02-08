import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { BehandlingspunktInnsynInfoPanel } from 'behandlingInnsyn/src/behandlingsprosess/components/BehandlingspunktInnsynInfoPanel';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import InnsynForm from './innsyn/InnsynForm';

describe('<BehandlingspunktInnsynInfoPanel>', () => {
  it('skal rendre panelet for søknadsfrist ved aksjonspunkt', () => {
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
    />);
    expect(wrapper.find(InnsynForm)).to.have.length(1);
  });
});
