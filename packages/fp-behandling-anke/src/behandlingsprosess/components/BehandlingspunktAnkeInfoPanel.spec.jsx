import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';

import { BehandlingspunktAnkeInfoPanel } from './BehandlingspunktAnkeInfoPanel';
import BehandleAnkeForm from './ankebehandling/BehandleAnkeForm';
import BehandleMerknaderForm from './merknader/BehandleMerknaderForm';
import BehandleResultatForm from './resultat/BehandleResultatForm';

describe('<BehandlingspunktAnkeInfoPanel>', () => {
  it('skal vise panel for ankebehandling', () => {
    const wrapper = shallow(<BehandlingspunktAnkeInfoPanel
      openAksjonspunkt
      readOnly={false}
      isApSolvable
      submitCallback={() => undefined}
      selectedBehandlingspunkt={behandlingspunktCodes.ANKEBEHANDLING}
      readOnlySubmitButton={false}
      saveTempAnke={sinon.spy()}
      previewCallback={sinon.spy()}
      previewCallbackAnke={sinon.spy()}
    />);

    expect(wrapper.find(BehandleAnkeForm)).to.have.length(1);
    expect(wrapper.find(BehandleMerknaderForm)).to.have.length(0);
    expect(wrapper.find(BehandleResultatForm)).to.have.length(0);
  });

  it('skal vise panel for ankemerknader', () => {
    const wrapper = shallow(<BehandlingspunktAnkeInfoPanel
      openAksjonspunkt
      readOnly={false}
      isApSolvable
      submitCallback={() => undefined}
      selectedBehandlingspunkt={behandlingspunktCodes.ANKE_MERKNADER}
      readOnlySubmitButton={false}
      saveTempAnke={sinon.spy()}
      previewCallback={sinon.spy()}
      previewCallbackAnke={sinon.spy()}
    />);

    expect(wrapper.find(BehandleAnkeForm)).to.have.length(0);
    expect(wrapper.find(BehandleMerknaderForm)).to.have.length(1);
    expect(wrapper.find(BehandleResultatForm)).to.have.length(0);
  });

  it('skal vise panel for ankeresultat', () => {
    const wrapper = shallow(<BehandlingspunktAnkeInfoPanel
      openAksjonspunkt
      readOnly={false}
      isApSolvable
      submitCallback={() => undefined}
      selectedBehandlingspunkt={behandlingspunktCodes.ANKE_RESULTAT}
      readOnlySubmitButton={false}
      saveTempAnke={sinon.spy()}
      previewCallback={sinon.spy()}
      previewCallbackAnke={sinon.spy()}
    />);

    expect(wrapper.find(BehandleAnkeForm)).to.have.length(0);
    expect(wrapper.find(BehandleMerknaderForm)).to.have.length(0);
    expect(wrapper.find(BehandleResultatForm)).to.have.length(1);
  });
});
