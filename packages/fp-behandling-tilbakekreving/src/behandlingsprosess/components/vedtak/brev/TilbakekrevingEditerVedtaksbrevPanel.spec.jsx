import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';

import TilbakekrevingEditerVedtaksbrevPanel from './TilbakekrevingEditerVedtaksbrevPanel';

describe('<TilbakekrevingEditerVedtaksbrevPanel>', () => {
  it('skal vise tekstfelt for begrunnelse og godkjenningsknapp', () => {
    const wrapper = shallow(<TilbakekrevingEditerVedtaksbrevPanel
      vedtaksbrevData={{}}
      formName="testForm"
      readOnly={false}
    />);

    expect(wrapper.find(TilbakekrevingEditerVedtaksbrevPanel)).to.have.length(1);
    expect(wrapper.find(BehandlingspunktSubmitButton)).to.have.length(1);
  });
});
