import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import { OkAvbrytModal } from '@fpsak-frontend/shared-components';

import OpenBehandlingForChangesMenuItem from './OpenBehandlingForChangesMenuItem';
import MenuButton from '../MenuButton';

describe('<OpenBehandlingForChangesMenuItem>', () => {
  it('skal ikke vise modal når behandling-id er undefined', () => {
    const wrapper = shallow(<OpenBehandlingForChangesMenuItem
      behandlingId={undefined}
      behandlingVersjon={2}
      openBehandlingForChanges={sinon.spy()}
      toggleBehandlingsmeny={sinon.spy()}
    />);

    expect(wrapper.find(OkAvbrytModal)).has.length(0);
  });

  it('skal vise modal ved trykk på meny-lenke', () => {
    const toggleBehandlingsmenyCallback = sinon.spy();
    const wrapper = shallow(<OpenBehandlingForChangesMenuItem
      behandlingId={1}
      behandlingVersjon={2}
      openBehandlingForChanges={sinon.spy()}
      toggleBehandlingsmeny={toggleBehandlingsmenyCallback}
    />);

    const button = wrapper.find(MenuButton);
    expect(button).has.length(1);
    expect(button.prop('onMouseDown')).is.not.null;
    expect(wrapper.state('showModal')).is.false;

    button.simulate('mousedown');

    expect(toggleBehandlingsmenyCallback.called).is.true;
    expect(wrapper.state('showModal')).is.true;
    const modal = wrapper.find(OkAvbrytModal);
    expect(modal).has.length(1);
    expect(modal.prop('showModal')).is.true;
  });

  it('skal skjule modal ved trykk på avbryt', () => {
    const wrapper = shallow(<OpenBehandlingForChangesMenuItem
      behandlingId={1}
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
      behandlingId={1}
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
    expect(openBehandlingForChangesCallback.getCalls()[0].args[1]).is.eql(1);

    expect(wrapper.state('showModal')).is.false;
    expect(wrapper.find(OkAvbrytModal)).has.length(0);
  });
});
