import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import NavBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';

import { TilbakekrevingBehandlingspunktInfoPanel } from './TilbakekrevingBehandlingspunktInfoPanel';
import TilbakekrevingForm from './tilbakekreving/TilbakekrevingForm';

describe('<TilbakekrevingBehandlingspunktInfoPanel>', () => {
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
      navBrukerKjonn={NavBrukerKjonn.KVINNE}
      alleMerknaderFraBeslutter={{}}
      beregnBelop={() => undefined}
    />);

    expect(wrapper.find(TilbakekrevingForm)).to.have.length(1);
  });
});
