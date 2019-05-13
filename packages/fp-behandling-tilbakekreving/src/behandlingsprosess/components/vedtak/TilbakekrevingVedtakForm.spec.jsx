import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { BehandlingspunktBegrunnelseTextField, BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import { TilbakekrevingVedtakFormImpl as TilbakekrevingVedtakForm } from './TilbakekrevingVedtakForm';

describe('<TilbakekrevingVedtakForm>', () => {
  it('skal vise tekstfelt for begrunnelse og godkjenningsknapp', () => {
    const wrapper = shallow(<TilbakekrevingVedtakForm
      submitCallback={sinon.spy()}
      readOnly={false}
      readOnlySubmitButton={false}
    />);

    expect(wrapper.find(BehandlingspunktBegrunnelseTextField)).to.have.length(1);
    expect(wrapper.find(BehandlingspunktSubmitButton)).to.have.length(1);
  });
});
