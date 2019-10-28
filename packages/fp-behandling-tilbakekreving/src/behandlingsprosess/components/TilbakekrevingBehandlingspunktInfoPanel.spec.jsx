import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';

import { TilbakekrevingBehandlingspunktInfoPanel } from './TilbakekrevingBehandlingspunktInfoPanel';
import ForeldelseForm from './foreldelse/ForeldelseForm';
import TilbakekrevingForm from './tilbakekreving/TilbakekrevingForm';

describe('<TilbakekrevingBehandlingspunktInfoPanel>', () => {
  it('skal vise foreldelsepanel', () => {
    const wrapper = shallow(<TilbakekrevingBehandlingspunktInfoPanel
      openAksjonspunkt
      readOnly={false}
      isApSolvable
      submitCallback={() => undefined}
      selectedBehandlingspunkt={behandlingspunktCodes.FORELDELSE}
      apCodes={[aksjonspunktCodesTilbakekreving.VURDER_FORELDELSE]}
      readOnlySubmitButton={false}
      isBehandlingHenlagt={false}
      alleKodeverk={{}}
      fetchPreviewVedtaksbrev={() => undefined}
    />);

    expect(wrapper.find(ForeldelseForm)).to.have.length(1);
    expect(wrapper.find(TilbakekrevingForm)).to.have.length(0);
  });

  it('skal vise tilbakekrevingspanel', () => {
    const wrapper = shallow(<TilbakekrevingBehandlingspunktInfoPanel
      openAksjonspunkt
      readOnly={false}
      isApSolvable
      submitCallback={() => undefined}
      selectedBehandlingspunkt={behandlingspunktCodes.TILBAKEKREVING}
      apCodes={[aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING]}
      readOnlySubmitButton={false}
      isBehandlingHenlagt={false}
      alleKodeverk={{}}
      fetchPreviewVedtaksbrev={() => undefined}
    />);

    expect(wrapper.find(ForeldelseForm)).to.have.length(0);
    expect(wrapper.find(TilbakekrevingForm)).to.have.length(1);
  });
});
