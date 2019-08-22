import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';

import { TilbakekrevingBehandlingspunktInfoPanel } from './TilbakekrevingBehandlingspunktInfoPanel';
import ForeldelsePanel from './foreldelse/ForeldelsePanel';
import TilbakekrevingForm from './tilbakekreving/TilbakekrevingForm';
import tilbakekrevingAksjonspunktCodes from '../../kodeverk/tilbakekrevingAksjonspunktCodes';

describe('<TilbakekrevingBehandlingspunktInfoPanel>', () => {
  it('skal vise foreldelsepanel', () => {
    const wrapper = shallow(<TilbakekrevingBehandlingspunktInfoPanel
      openAksjonspunkt
      readOnly={false}
      isApSolvable
      submitCallback={() => undefined}
      selectedBehandlingspunkt={behandlingspunktCodes.FORELDELSE}
      apCodes={[tilbakekrevingAksjonspunktCodes.VURDER_FORELDELSE]}
      readOnlySubmitButton={false}
      isBehandlingHenlagt={false}
    />);

    expect(wrapper.find(ForeldelsePanel)).to.have.length(1);
    expect(wrapper.find(TilbakekrevingForm)).to.have.length(0);
  });

  it('skal vise tilbakekrevingspanel', () => {
    const wrapper = shallow(<TilbakekrevingBehandlingspunktInfoPanel
      openAksjonspunkt
      readOnly={false}
      isApSolvable
      submitCallback={() => undefined}
      selectedBehandlingspunkt={behandlingspunktCodes.TILBAKEKREVING}
      apCodes={[tilbakekrevingAksjonspunktCodes.VURDER_TILBAKEKREVING]}
      readOnlySubmitButton={false}
      isBehandlingHenlagt={false}
    />);

    expect(wrapper.find(ForeldelsePanel)).to.have.length(0);
    expect(wrapper.find(TilbakekrevingForm)).to.have.length(1);
  });
});
