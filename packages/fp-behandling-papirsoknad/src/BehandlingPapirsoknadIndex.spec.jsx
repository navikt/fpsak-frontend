import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingGrid } from '@fpsak-frontend/fp-behandling-felles';

import { BehandlingPapirsoknadIndex } from './BehandlingPapirsoknadIndex';

describe('BehandlingPapirsoknadIndex', () => {
  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(
      <BehandlingPapirsoknadIndex
        oppdaterBehandlingVersjon={sinon.spy()}
        behandlingId={1}
        hasShownBehandlingPaVent
        setHasShownBehandlingPaVent={sinon.spy()}
        updateOnHold={sinon.spy()}
        hasSubmittedPaVentForm
        hasManualPaVent
        isInSync
        fagsakInfo={{}}
        fetchBehandling={sinon.spy()}
        resetBehandling={sinon.spy()}
        setBehandlingInfo={sinon.spy()}
        fpBehandlingUpdater={{}}
        behandlingUpdater={{}}
      />,
    );
    expect(wrapper.find(BehandlingGrid)).to.have.length(1);
  });
});
