import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import { BehandlingspunktInfoPanel } from 'behandlingFpsak/behandlingsprosess/components/BehandlingspunktInfoPanel';
import BeregningsresultatEngangsstonadForm from 'behandlingFpsak/behandlingsprosess/components/beregningsresultat/BeregningsresultatEngangsstonadForm';
import behandlingspunktCodes from 'behandlingFelles/behandlingsprosess/behandlingspunktCodes';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import VurderSoknadsfristForeldrepengerForm from './soknadsfrist/VurderSoknadsfristForeldrepengerForm';

describe('<BehandlingspunktInfoPanel>', () => {
  it('skal rendre panelet for beregningsresultat', () => {
    const wrapper = shallow(<BehandlingspunktInfoPanel
      selectedBehandlingspunkt={behandlingspunktCodes.BEREGNING}
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
      apCodes={[]}
      readOnlySubmitButton={false}
      featureToggleFormkrav
    />);

    expect(wrapper.find(BeregningsresultatEngangsstonadForm)).to.have.length(1);
  });

  it('skal rendre panelet for søknadsfrist ved aksjonspunkt', () => {
    const wrapper = shallow(<BehandlingspunktInfoPanel
      selectedBehandlingspunkt={behandlingspunktCodes.SOEKNADSFRIST}
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
      apCodes={[aksjonspunktCodes.VURDER_SOKNADSFRIST_FORELDREPENGER]}
      readOnlySubmitButton={false}
      featureToggleFormkrav
    />);
    expect(wrapper.find(VurderSoknadsfristForeldrepengerForm)).to.have.length(1);
  });
});
