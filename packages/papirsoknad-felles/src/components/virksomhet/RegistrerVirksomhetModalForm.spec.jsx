import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import Modal from 'nav-frontend-modal';

import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import { RegistrerVirksomhetModalForm } from './RegistrerVirksomhetModalForm';

describe('<RegistrerVirksomhetModalForm>', () => {
  it('skal rendre form for å registrere virksomhet i modalvisning', () => {
    const wrapper = shallowWithIntl(<RegistrerVirksomhetModalForm
      intl={intlMock}
      handleSubmit={sinon.spy()}
      closeEvent={sinon.spy()}
      showModal
      alleKodeverk={{}}
    />);

    const modal = wrapper.find(Modal);
    expect(modal.prop('isOpen')).is.true;

    expect(wrapper.find('form')).to.have.length(1);
    expect(wrapper.find('Connect(VirksomhetIdentifikasjonPanel)')).to.have.length(1);
    expect(wrapper.find('Connect(VirksomhetIdentifikasjonPanel)')).to.have.length(1);
    expect(wrapper.find('Connect(VirksomhetTypeNaringPanel)')).to.have.length(1);
    expect(wrapper.find('Connect(VirksomhetStartetEndretPanel)')).to.have.length(1);
    expect(wrapper.find('VirksomhetRelasjonPanel')).to.have.length(1);

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(1);

    const knapp = wrapper.find('Knapp');
    expect(knapp).to.have.length(1);
  });

  it('skal rendre lukket modal', () => {
    const wrapper = shallowWithIntl(<RegistrerVirksomhetModalForm
      intl={intlMock}
      handleSubmit={sinon.spy()}
      closeEvent={sinon.spy()}
      showModal={false}
      alleKodeverk={{}}
    />);

    const modal = wrapper.find(Modal);
    expect(modal.prop('isOpen')).is.false;
  });

  it('skal kalle submit ved trykk på hovedknapp', () => {
    const handleSubmit = sinon.spy();
    const wrapper = shallowWithIntl(<RegistrerVirksomhetModalForm
      intl={intlMock}
      handleSubmit={handleSubmit}
      closeEvent={sinon.spy()}
      showModal={false}
      alleKodeverk={{}}
    />);

    const hovedknapp = wrapper.find('Hovedknapp');
    hovedknapp.simulate('click');
    expect(handleSubmit.called).is.true;
  });

  it('skal kalle close ved trykk på knapp', () => {
    const closeEvent = sinon.spy();
    const wrapper = shallowWithIntl(<RegistrerVirksomhetModalForm
      intl={intlMock}
      handleSubmit={sinon.spy()}
      closeEvent={closeEvent}
      showModal={false}
      alleKodeverk={{}}
    />);

    const knapp = wrapper.find('Knapp');
    knapp.simulate('click');
    expect(closeEvent.called).is.true;
  });
});
