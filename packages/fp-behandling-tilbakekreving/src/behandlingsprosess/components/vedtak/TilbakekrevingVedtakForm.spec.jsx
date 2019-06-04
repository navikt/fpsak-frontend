import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';

import TilbakekrevingEditerVedtaksbrevPanel from './brev/TilbakekrevingEditerVedtaksbrevPanel';
import { TilbakekrevingVedtakFormImpl as TilbakekrevingVedtakForm } from './TilbakekrevingVedtakForm';

describe('<TilbakekrevingVedtakForm>', () => {
  it('skal vise tekstfelt for begrunnelse og godkjenningsknapp', () => {
    const wrapper = shallow(<TilbakekrevingVedtakForm
      submitCallback={sinon.spy()}
      readOnly={false}
      readOnlySubmitButton={false}
      fetchPreviewVedtaksbrev={sinon.spy()}
      behandlingIdentifier={new BehandlingIdentifier(1, 2)}
      vedtaksbrevData={{}}
    />);

    expect(wrapper.find(TilbakekrevingEditerVedtaksbrevPanel)).to.have.length(1);
    expect(wrapper.find(BehandlingspunktSubmitButton)).to.have.length(1);
  });
});
