import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { AdvarselModal } from '@fpsak-frontend/shared-components';
import { BehandlingGrid } from '@fpsak-frontend/fp-behandling-felles';
import FpTilbakeBehandlingInfoSetter from './FpTilbakeBehandlingInfoSetter';
import { BehandlingTilbakekrevingIndex } from './BehandlingTilbakekrevingIndex';

describe('BehandlingTilbakekrevingIndex', () => {
  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(
      <BehandlingTilbakekrevingIndex
        setBehandlingInfoHolder={sinon.spy()}
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
        behandlingerVersjonMappedById={{}}
        appContextUpdater={{}}
        setBehandlingInfo={sinon.spy()}
        fpBehandlingUpdater={{}}
        behandlingUpdater={{}}
        showOpenRevurderingModal={false}
      />,
    );

    expect(wrapper.find(FpTilbakeBehandlingInfoSetter)).to.have.length(1);
    expect(wrapper.find(BehandlingGrid)).to.have.length(1);
    expect(wrapper.find(AdvarselModal)).to.have.length(0);
  });

  it('skal vise modal når det finnes åpen revurdering', () => {
    const wrapper = shallow(
      <BehandlingTilbakekrevingIndex
        setBehandlingInfoHolder={sinon.spy()}
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
        behandlingerVersjonMappedById={{}}
        appContextUpdater={{}}
        setBehandlingInfo={sinon.spy()}
        fpBehandlingUpdater={{}}
        behandlingUpdater={{}}
        showOpenRevurderingModal
      />,
    );
    expect(wrapper.find(AdvarselModal)).to.have.length(1);
  });
});
