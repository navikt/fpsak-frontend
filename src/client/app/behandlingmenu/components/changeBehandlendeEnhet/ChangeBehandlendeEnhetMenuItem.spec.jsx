import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import ChangeBehandlendeEnhetMenuItem from './ChangeBehandlendeEnhetMenuItem';

describe('<ChangeBehandlendeEnhetMenuItem>', () => {
  const behandlendeEnheter = [{
    enhetId: '001',
    enhetNavn: 'NAV',
    status: 'Aktiv',
  }];
  const behandlingIdentifier = new BehandlingIdentifier(123, 1);

  it('skal ikke vise modal ved rendring', () => {
    const wrapper = shallow(<ChangeBehandlendeEnhetMenuItem
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={2}
      toggleBehandlingsmeny={sinon.spy()}
      behandlendeEnheter={behandlendeEnheter}
      nyBehandlendeEnhet={sinon.spy()}
      byttBehandlendeEnhetEnabled
    />);

    expect(wrapper.find('Connect(ReduxForm)')).has.length(0);
  });

  it('skal vise modal ved trykk på meny-lenke', () => {
    const toggleBehandlingsmenyCallback = sinon.spy();
    const wrapper = shallow(<ChangeBehandlendeEnhetMenuItem
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={2}
      toggleBehandlingsmeny={toggleBehandlingsmenyCallback}
      behandlendeEnheter={behandlendeEnheter}
      nyBehandlendeEnhet={sinon.spy()}
      byttBehandlendeEnhetEnabled
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
    const wrapper = shallow(<ChangeBehandlendeEnhetMenuItem
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={2}
      toggleBehandlingsmeny={sinon.spy()}
      behandlendeEnheter={behandlendeEnheter}
      nyBehandlendeEnhet={sinon.spy()}
      byttBehandlendeEnhetEnabled
    />);

    wrapper.setState({ showModal: true });
    const modal = wrapper.find('Connect(InjectIntl(ReduxForm))');
    expect(modal).has.length(1);

    modal.prop('cancelEvent')();
    wrapper.update();

    expect(wrapper.state('showModal')).is.false;
    expect(wrapper.find('Connect(InjectIntl(ReduxForm))')).has.length(0);
  });

  it('skal sende data til server ved trykk på ok-knapp', () => {
    const nyEnhet = {
      enhetId: '002',
      enhetNavn: 'NAV Oslo',
    };
    const nyBehandlendeEnhetCallback = sinon.spy();
    const wrapper = shallow(<ChangeBehandlendeEnhetMenuItem
      behandlingIdentifier={behandlingIdentifier}
      behandlingVersjon={2}
      toggleBehandlingsmeny={sinon.spy()}
      behandlendeEnheter={behandlendeEnheter}
      nyBehandlendeEnhet={nyBehandlendeEnhetCallback}
      byttBehandlendeEnhetEnabled
    />);

    wrapper.setState({ nyEnhet });
    wrapper.setState({ showModal: true });
    expect(wrapper.find('InjectIntl(EndreBehandlendeEnhetModal)')).has.length(0);
    const modal = wrapper.find('Connect(InjectIntl(ReduxForm))');
    expect(modal).has.length(1);

    modal.prop('onSubmit')({
      begrunnelse: 'Dette er en begrunnelse',
    });
    wrapper.update();

    expect(nyBehandlendeEnhetCallback.called).is.true;
    expect(nyBehandlendeEnhetCallback.getCalls()[0].args).has.length(2);
    expect(nyBehandlendeEnhetCallback.getCalls()[0].args[0]).is.eql({
      behandlingId: 1,
      behandlingVersjon: 2,
      enhetNavn: 'NAV Oslo',
      enhetId: '002',
      begrunnelse: 'Dette er en begrunnelse',
    });

    expect(wrapper.state('showModal')).is.false;
    expect(wrapper.find('Connect(InjectIntl(ReduxForm))')).has.length(0);
  });
});
