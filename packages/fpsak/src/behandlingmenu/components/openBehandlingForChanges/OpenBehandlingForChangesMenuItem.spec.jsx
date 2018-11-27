import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import OkAvbrytModal from 'sharedComponents/OkAvbrytModal';
import OpenBehandlingForChangesMenuItem from './OpenBehandlingForChangesMenuItem';
import MenuButton from '../MenuButton';

describe('<OpenBehandlingForChangesMenuItem>', () => {
  const behandlingIdentifier = new BehandlingIdentifier(123, 1);

  it('skal ikke vise modal når behandling-id er undefined', () => {
    const wrapper = shallow(<OpenBehandlingForChangesMenuItem
      behandlingIdentifier={undefined}
      behandlingVersjon={2}
      openBehandlingForChanges={sinon.spy()}
      toggleBehandlingsmeny={sinon.spy()}
    />);

    expect(wrapper.find(OkAvbrytModal)).has.length(0);
  });

  it('skal vise modal ved trykk på meny-lenke', () => {
    const toggleBehandlingsmenyCallback = sinon.spy();
    const wrapper = shallow(<OpenBehandlingForChangesMenuItem
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={2}
      openBehandlingForChanges={sinon.spy()}
      toggleBehandlingsmeny={toggleBehandlingsmenyCallback}
    />);

    const button = wrapper.find(MenuButton);
    expect(button).has.length(1);
    expect(button.prop('onClick')).is.not.null;
    expect(wrapper.state('showModal')).is.false;

    button.simulate('click');

    expect(toggleBehandlingsmenyCallback.called).is.true;
    expect(wrapper.state('showModal')).is.true;
    const modal = wrapper.find(OkAvbrytModal);
    expect(modal).has.length(1);
    expect(modal.prop('showModal')).is.true;
  });

  it('skal skjule modal ved trykk på avbryt', () => {
    const wrapper = shallow(<OpenBehandlingForChangesMenuItem
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={2}
      openBehandlingForChanges={sinon.spy()}
      toggleBehandlingsmeny={sinon.spy()}
    />);

    wrapper.setState({ showModal: true });
    const modal = wrapper.find(OkAvbrytModal);
    expect(modal).has.length(1);

    modal.prop('cancel')();
    wrapper.update();

    expect(wrapper.state('showModal')).is.false;
    expect(wrapper.find(OkAvbrytModal)).has.length(0);
  });

  it('skal sende data til server ved trykk på ok-knapp', () => {
    const openBehandlingForChangesCallback = sinon.spy();
    const wrapper = shallow(<OpenBehandlingForChangesMenuItem
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={2}
      openBehandlingForChanges={openBehandlingForChangesCallback}
      toggleBehandlingsmeny={sinon.spy()}
    />);

    wrapper.setState({ showModal: true });
    const modal = wrapper.find(OkAvbrytModal);
    expect(modal).has.length(1);

    modal.prop('submit')();
    wrapper.update();

    expect(openBehandlingForChangesCallback.called).is.true;
    expect(openBehandlingForChangesCallback.getCalls()[0].args).has.length(2);
    expect(openBehandlingForChangesCallback.getCalls()[0].args[0]).is.eql({
      behandlingId: 1,
      behandlingVersjon: 2,
    });
    expect(openBehandlingForChangesCallback.getCalls()[0].args[1]).is.eql(behandlingIdentifier);

    expect(wrapper.state('showModal')).is.false;
    expect(wrapper.find(OkAvbrytModal)).has.length(0);
  });
});
