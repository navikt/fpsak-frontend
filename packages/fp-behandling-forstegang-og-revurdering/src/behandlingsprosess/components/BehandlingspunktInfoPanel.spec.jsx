import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow } from 'enzyme';

import BeregningsresultatProsessIndex from '@fpsak-frontend/prosess-beregningsresultat';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import { BehandlingspunktInfoPanel } from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/BehandlingspunktInfoPanel';
import DataFetcherWithCache from '../../DataFetcherWithCache';
import VurderSoknadsfristForeldrepengerForm from './soknadsfrist/VurderSoknadsfristForeldrepengerForm';

describe('<BehandlingspunktInfoPanel>', () => {
  it('skal rendre panelet for beregningsresultat', () => {
    const wrapper = shallow(<BehandlingspunktInfoPanel
      selectedBehandlingspunkt={behandlingspunktCodes.BEREGNING}
      submitCallback={sinon.spy()}
      previewCallback={sinon.spy()}
      previewFptilbakeCallback={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
      openAksjonspunkt={false}
      readOnly={false}
      isApSolvable={false}
      apCodes={[]}
      readOnlySubmitButton={false}
      fagsakInfo={{}}
      featureToggles={{}}
      overrideReadOnly={false}
      kanOverstyreAccess={{ isEnabled: false }}
      behandlingspunktAksjonspunkter={[]}
      toggleOverstyring={sinon.spy()}
      alleKodeverk={{}}
    />);

    const dataFetchers = wrapper.find(DataFetcherWithCache);
    expect(dataFetchers).to.have.length(1);

    const beregningPanel = dataFetchers.renderProp('render')({
      behandling: { id: 1, versjon: 1 },
      beregningresultatEngangsstonad: {},
    }).find(BeregningsresultatProsessIndex);
    expect(beregningPanel).to.have.length(1);
  });

  it('skal rendre panelet for søknadsfrist ved aksjonspunkt', () => {
    const wrapper = shallow(<BehandlingspunktInfoPanel
      selectedBehandlingspunkt={behandlingspunktCodes.SOEKNADSFRIST}
      submitCallback={sinon.spy()}
      previewCallback={sinon.spy()}
      previewFptilbakeCallback={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
      openAksjonspunkt={false}
      readOnly={false}
      isApSolvable={false}
      apCodes={[aksjonspunktCodes.VURDER_SOKNADSFRIST_FORELDREPENGER]}
      readOnlySubmitButton={false}
      fagsakInfo={{}}
      featureToggles={{}}
      overrideReadOnly={false}
      kanOverstyreAccess={{ isEnabled: false }}
      behandlingspunktAksjonspunkter={[]}
      toggleOverstyring={sinon.spy()}
      alleKodeverk={{}}
    />);
    expect(wrapper.find(VurderSoknadsfristForeldrepengerForm)).to.have.length(1);
  });
});
