import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { BehandlingGrid } from '@fpsak-frontend/fp-behandling-felles';
import FpInnsynBehandlingInfoSetter from './FpInnsynBehandlingInfoSetter';
import { BehandlingInnsynIndex } from './BehandlingInnsynIndex';

describe('BehandlingInnsynIndex', () => {
  it('skal rendre komponent uten feil', () => {
    const wrapper = shallow(
      <BehandlingInnsynIndex
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
      />,
    );
    expect(wrapper.find(FpInnsynBehandlingInfoSetter)).to.have.length(1);
    expect(wrapper.find(BehandlingGrid)).to.have.length(1);
  });
});
