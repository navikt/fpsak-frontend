import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import ShelveBehandlingMenuItem from './ShelveBehandlingMenuItem';

describe('<ShelveBehandlingMenuItem>', () => {
  it('skal ikke vise modal ved rendring', () => {
    const wrapper = shallow(<ShelveBehandlingMenuItem.WrappedComponent
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      behandlingVersjon={2}
      previewHenleggBehandling={sinon.spy()}
      toggleBehandlingsmeny={sinon.spy()}
      shelveBehandling={sinon.spy()}
      fetchHenleggArsaker={sinon.spy()}
      henleggArsaker={[]}
      henleggArsakerResultReceived
      push={sinon.spy()}
      henleggBehandlingEnabled
    />);

    expect(wrapper.find('Connect(InjectIntl(ReduxForm))')).has.length(0);
  });

  it('skal vise modal ved trykk på meny-lenke', () => {
    const toggleBehandlingsmenyCallback = sinon.spy();
    const wrapper = shallow(<ShelveBehandlingMenuItem.WrappedComponent
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      behandlingVersjon={2}
      previewHenleggBehandling={sinon.spy()}
      toggleBehandlingsmeny={toggleBehandlingsmenyCallback}
      shelveBehandling={sinon.spy()}
      fetchHenleggArsaker={sinon.spy()}
      henleggArsaker={[]}
      henleggArsakerResultReceived
      push={sinon.spy()}
      henleggBehandlingEnabled
    />);

    const button = wrapper.find('MenuButton');
    expect(button).has.length(1);
    expect(button.prop('onClick')).is.not.null;
    expect(wrapper.state('showModal')).is.false;

    button.simulate('click');

    expect(toggleBehandlingsmenyCallback.called).is.true;
    expect(wrapper.state('showModal')).is.true;

    const modal = wrapper.find('Connect(InjectIntl(ReduxForm))');
    expect(modal).has.length(1);
    expect(modal.prop('showModal')).is.true;
  });

  it('skal skjule modal ved trykk på avbryt', () => {
    const wrapper = shallow(<ShelveBehandlingMenuItem.WrappedComponent
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      behandlingVersjon={2}
      previewHenleggBehandling={sinon.spy()}
      toggleBehandlingsmeny={sinon.spy()}
      shelveBehandling={sinon.spy()}
      fetchHenleggArsaker={sinon.spy()}
      henleggArsaker={[]}
      henleggArsakerResultReceived
      push={sinon.spy()}
      henleggBehandlingEnabled
    />);

    wrapper.setState({ showModal: true });
    const modal = wrapper.find('Connect(InjectIntl(ReduxForm))');
    expect(modal).has.length(1);

    modal.prop('cancelEvent')();
    wrapper.update();

    expect(wrapper.state('showModal')).is.false;
    expect(wrapper.find('Connect(InjectIntl(ReduxForm))')).has.length(0);
  });

  it('skal sende data til server og vise "behandling er henlagt"-modal ved trykk på ok-knapp', () => {
    const shelveBehandlingCallback = sinon.stub();
    const wrapper = shallow(<ShelveBehandlingMenuItem.WrappedComponent
      behandlingIdentifier={new BehandlingIdentifier(1, 1)}
      behandlingVersjon={2}
      previewHenleggBehandling={sinon.spy()}
      toggleBehandlingsmeny={sinon.spy()}
      shelveBehandling={shelveBehandlingCallback}
      fetchHenleggArsaker={sinon.spy()}
      henleggArsaker={[]}
      henleggArsakerResultReceived
      push={sinon.spy()}
      henleggBehandlingEnabled
    />);
    shelveBehandlingCallback.returns({ then: () => { wrapper.setState({ showBehandlingErHenlagtModal: true }); } });

    wrapper.setState({ showBehandlingErHenlagtModal: false });
    wrapper.setState({ showModal: true });
    expect(wrapper.find('InjectIntl(BehandlingenShelvedModal)')).has.length(0);
    const modal = wrapper.find('Connect(InjectIntl(ReduxForm))');
    expect(modal).has.length(1);

    modal.prop('onSubmit')({
      årsakKode: 'KODE',
      begrunnelse: 'Dette er en begrunnelse',
    });
    wrapper.update();

    expect(shelveBehandlingCallback.called).is.true;
    expect(shelveBehandlingCallback.getCalls()[0].args).has.length(1);
    expect(shelveBehandlingCallback.getCalls()[0].args[0]).is.eql({
      behandlingId: 1,
      behandlingVersjon: 2,
      årsakKode: 'KODE',
      begrunnelse: 'Dette er en begrunnelse',
    });

    expect(wrapper.state('showModal')).is.false;
    expect(wrapper.find('Connect(InjectIntl(ReduxForm))')).has.length(0);

    expect(wrapper.state('showBehandlingErHenlagtModal')).is.true;
    expect(wrapper.find('InjectIntl(BehandlingenShelvedModal)')).has.length(1);
  });
});
