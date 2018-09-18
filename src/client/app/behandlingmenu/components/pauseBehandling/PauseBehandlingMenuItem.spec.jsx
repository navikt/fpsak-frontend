import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';
import moment from 'moment';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import { PauseBehandlingMenuItem } from './PauseBehandlingMenuItem';

describe('<PauseBehandlingMenuItem>', () => {
  const behandlingIdentifier = new BehandlingIdentifier(123, 1);

  it('skal ikke vise modal ved rendring', () => {
    const wrapper = shallow(<PauseBehandlingMenuItem
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={2}
      toggleBehandlingsmeny={sinon.spy()}
      setBehandlingOnHold={sinon.spy()}
      settBehandlingPaVentEnabled
    />);

    expect(wrapper.find('Connect(ReduxForm)')).has.length(0);
  });

  it('skal vise modal ved trykk på meny-lenke', () => {
    const toggleBehandlingsmenyCallback = sinon.spy();
    const wrapper = shallow(<PauseBehandlingMenuItem
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={2}
      toggleBehandlingsmeny={toggleBehandlingsmenyCallback}
      setBehandlingOnHold={sinon.spy()}
      settBehandlingPaVentEnabled
    />);

    const button = wrapper.find('MenuButton');
    expect(button).has.length(1);
    expect(button.prop('onClick')).is.not.null;
    expect(wrapper.state('showModal')).is.false;

    button.simulate('click');

    expect(toggleBehandlingsmenyCallback.called).is.true;
    expect(wrapper.state('showModal')).is.true;
    const modal = wrapper.find('Connect(ReduxForm)');
    expect(modal).has.length(1);
    expect(modal.prop('showModal')).is.true;
  });

  it('skal skjule modal ved trykk på avbryt', () => {
    const wrapper = shallow(<PauseBehandlingMenuItem
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={2}
      toggleBehandlingsmeny={sinon.spy()}
      setBehandlingOnHold={sinon.spy()}
      settBehandlingPaVentEnabled
    />);

    wrapper.setState({ showModal: true });
    const modal = wrapper.find('Connect(ReduxForm)');
    expect(modal).has.length(1);

    modal.prop('cancelEvent')();
    wrapper.update();

    expect(wrapper.state('showModal')).is.false;
    expect(wrapper.find('Connect(ReduxForm)')).has.length(0);
  });

  it('skal sende data til server ved trykk på ok-knapp', () => {
    const behandlingOnHoldCallback = sinon.spy();
    const wrapper = shallow(<PauseBehandlingMenuItem
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={2}
      toggleBehandlingsmeny={sinon.spy()}
      setBehandlingOnHold={behandlingOnHoldCallback}
      settBehandlingPaVentEnabled
    />);

    wrapper.setState({ showModal: true });
    const modal = wrapper.find('Connect(ReduxForm)');
    expect(modal).has.length(1);

    const frist = moment().toDate();
    modal.prop('onSubmit')({ frist });
    wrapper.update();

    expect(behandlingOnHoldCallback.called).is.true;
    expect(behandlingOnHoldCallback.getCalls()[0].args).has.length(2);
    expect(behandlingOnHoldCallback.getCalls()[0].args[0]).is.eql({
      behandlingId: 1,
      behandlingVersjon: 2,
      frist,
      ventearsak: undefined,
    });
    expect(behandlingOnHoldCallback.getCalls()[0].args[1]).is.eql(behandlingIdentifier);

    expect(wrapper.state('showModal')).is.false;
    expect(wrapper.find('Connect(ReduxForm)')).has.length(0);
  });
});
