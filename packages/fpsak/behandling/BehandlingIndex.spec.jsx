import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import BehandlingErPaVentModal from './components/BehandlingErPaVentModal';
import BehandlingGrid from './components/BehandlingGrid';
import { BehandlingIndex } from './BehandlingIndex';

describe('BehandlingIndex', () => {
  const timestamp = moment.now();
  let sandbox;
  let clock;

  before(() => {
    sandbox = sinon.createSandbox();
    clock = sinon.useFakeTimers(timestamp);
  });

  after(() => {
    sandbox.restore();
    clock.restore();
  });

  it('skal vise paneler for behandlingsprosess og fakta', () => {
    const wrapper = shallow(<BehandlingIndex
      behandlingId={1}
      behandlingsprosessEnabled
      faktaEnabled
      papirsoknadEnabled={false}
      hasShownBehandlingPaVent={false}
      closeBehandlingOnHoldModal={sinon.spy()}
      handleOnHoldSubmit={sinon.spy()}
      destroyReduxForms={sinon.spy()}
      hasSubmittedPaVentForm
      hasManualPaVent={false}
    />);

    const grid = wrapper.find(BehandlingGrid);
    expect(grid.prop('behandlingsprosessContent').type.displayName).to.contain('BehandlingsprosessIndex');
    expect(grid.prop('faktaContent').type.displayName).to.contain('FaktaIndex');
    expect(grid.prop('papirsoknadContent')).is.false;

    expect(grid.find(BehandlingErPaVentModal)).to.have.length(0);
  });

  it('skal vise panel for papirsøknad', () => {
    const wrapper = shallow(<BehandlingIndex
      behandlingId={1}
      behandlingsprosessEnabled={false}
      faktaEnabled={false}
      papirsoknadEnabled
      hasShownBehandlingPaVent={false}
      closeBehandlingOnHoldModal={sinon.spy()}
      handleOnHoldSubmit={sinon.spy()}
      destroyReduxForms={sinon.spy()}
      hasSubmittedPaVentForm
      hasManualPaVent={false}
    />);

    const grid = wrapper.find(BehandlingGrid);
    expect(grid.prop('behandlingsprosessContent')).is.false;
    expect(grid.prop('faktaContent')).is.false;
    expect(grid.prop('papirsoknadContent').type.displayName).to.contain('PapirsoknadIndex');

    expect(grid.find(BehandlingErPaVentModal)).to.have.length(0);
  });

  it('skal kunne vise modal så lenge en ikke allerede har satt på vent', () => {
    const wrapper = shallow(<BehandlingIndex
      behandlingId={1}
      behandlingsprosessEnabled
      faktaEnabled
      papirsoknadEnabled={false}
      hasShownBehandlingPaVent={false}
      closeBehandlingOnHoldModal={sinon.spy()}
      handleOnHoldSubmit={sinon.spy()}
      destroyReduxForms={sinon.spy()}
      hasSubmittedPaVentForm={false}
      hasManualPaVent={false}
      behandlingPaaVent
    />);

    const modal = wrapper.find(BehandlingErPaVentModal);
    expect(modal).to.have.length(1);
    expect(modal.prop('showModal')).is.true;
  });

  it('skal renske opp former når en behandlingsversjonen er endret', () => {
    const destroyForms = sinon.spy();

    const wrapper = shallow(<BehandlingIndex
      behandlingId={1}
      behandlingVersjon={2}
      behandlingsprosessEnabled
      faktaEnabled
      papirsoknadEnabled={false}
      hasShownBehandlingPaVent={false}
      closeBehandlingOnHoldModal={sinon.spy()}
      handleOnHoldSubmit={sinon.spy()}
      destroyReduxForms={destroyForms}
      hasSubmittedPaVentForm={false}
      hasManualPaVent={false}
      behandlingPaaVent
    />);

    wrapper.setProps({ behandlingVersjon: 3 });

    clock.tick(1100);

    expect(destroyForms.getCalls()).has.length(1);
    const { args } = destroyForms.getCalls()[0];
    expect(args).has.length(1);
    expect(args[0]).is.eql('behandling_1_v2');
  });

  it('skal ikke renske opp former når behandlingsversjonen ikke er endret', () => {
    const destroyForms = sinon.spy();

    const wrapper = shallow(<BehandlingIndex
      behandlingId={1}
      behandlingVersjon={2}
      behandlingsprosessEnabled
      faktaEnabled
      papirsoknadEnabled={false}
      hasShownBehandlingPaVent={false}
      closeBehandlingOnHoldModal={sinon.spy()}
      handleOnHoldSubmit={sinon.spy()}
      destroyReduxForms={destroyForms}
      hasSubmittedPaVentForm={false}
      hasManualPaVent={false}
      behandlingPaaVent
    />);

    wrapper.setProps({ behandlingsprosessEnabled: false });

    clock.tick(1100);

    expect(destroyForms.getCalls()).has.length(0);
  });

  it('skal renske opp former når komponent blir unmounta', () => {
    const destroyForms = sinon.spy();

    const wrapper = shallow(<BehandlingIndex
      behandlingId={1}
      behandlingVersjon={2}
      behandlingsprosessEnabled
      faktaEnabled
      papirsoknadEnabled={false}
      hasShownBehandlingPaVent={false}
      closeBehandlingOnHoldModal={sinon.spy()}
      handleOnHoldSubmit={sinon.spy()}
      destroyReduxForms={destroyForms}
      hasSubmittedPaVentForm={false}
      hasManualPaVent={false}
      behandlingPaaVent
    />);

    wrapper.unmount();

    clock.tick(1100);

    expect(destroyForms.getCalls()).has.length(1);
    const { args } = destroyForms.getCalls()[0];
    expect(args).has.length(1);
    expect(args[0]).is.eql('behandling_1_v2');
  });
});
