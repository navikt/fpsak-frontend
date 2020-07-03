import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import Modal from 'nav-frontend-modal';
import { Knapp, Hovedknapp } from 'nav-frontend-knapper';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { SelectField } from '@fpsak-frontend/form';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import { SettBehandlingPaVentModal } from './SettBehandlingPaVentModal';

describe('<SettBehandlingPaVentModal>', () => {
  it('skal rendre åpen modal', () => {
    const cancelEventCallback = sinon.spy();

    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      {...reduxFormPropsMock}
      intl={intlMock}
      handleSubmit={sinon.spy()}
      cancelEvent={cancelEventCallback}
      showModal
      frist="frist"
      originalFrist="frist"
      ventearsak="ventearsak"
      originalVentearsak="ventearsak"
      ventearsaker={[]}
    />);

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('closeButton')).is.false;
    expect(modal.prop('contentLabel')).to.eql('Behandlingen settes på vent med frist');
    expect(modal.prop('onRequestClose')).to.eql(cancelEventCallback);
  });

  it('skal rendre lukket modal', () => {
    const cancelEventCallback = sinon.spy();

    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      {...reduxFormPropsMock}
      intl={intlMock}
      handleSubmit={sinon.spy()}
      cancelEvent={cancelEventCallback}
      showModal={false}
      frist="frist"
      originalFrist="frist"
      ventearsak="ventearsak"
      originalVentearsak="ventearsak"
      ventearsaker={[]}
    />);

    const modal = wrapper.find(Modal);
    expect(modal.prop('isOpen')).is.false;
  });

  it('skal lukke modal ved klikk på avbryt-knapp', () => {
    const cancelEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      {...reduxFormPropsMock}
      intl={intlMock}
      handleSubmit={sinon.spy()}
      cancelEvent={cancelEventCallback}
      showModal={false}
      frist="frist"
      originalFrist="frist"
      ventearsak="ventearsak"
      originalVentearsak="ventearsak"
      ventearsaker={[]}
    />);

    wrapper.find(Knapp).simulate('click');
    expect(cancelEventCallback).to.have.property('callCount', 1);
  });

  it('skal ikke disable knapp for lagring når frist er en gyldig fremtidig dato', () => {
    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      {...reduxFormPropsMock}
      intl={intlMock}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      showModal
      frist="2099-10-10"
      originalFrist="frist"
      ventearsak="ventearsak"
      originalVentearsak="ventearsak"
      ventearsaker={[]}
    />);

    const button = wrapper.find(Hovedknapp);
    expect(button.prop('disabled')).is.false;
  });

  it('skal disable knapp for lagring når frist er en ugyldig dato', () => {
    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      {...reduxFormPropsMock}
      intl={intlMock}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      showModal
      frist="20-10-10"
      originalFrist="frist"
      ventearsak="ventearsak"
      originalVentearsak="ventearsak"
      ventearsaker={[]}
    />);

    const button = wrapper.find(Hovedknapp);
    expect(button.prop('disabled')).is.true;
  });

  it('skal disable knapp for lagring når frist er en historisk dato', () => {
    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      {...reduxFormPropsMock}
      intl={intlMock}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      showModal
      frist="2015-10-10"
      originalFrist="frist"
      ventearsak="ventearsak"
      originalVentearsak="ventearsak"
      ventearsaker={[]}
    />);

    const button = wrapper.find(Hovedknapp);
    expect(button.prop('disabled')).is.true;
  });

  it('skal være obligatorisk å velge årsak', () => {
    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      {...reduxFormPropsMock}
      intl={intlMock}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      showModal
      frist="2099-10-10"
      originalFrist="frist"
      ventearsak="ventearsak"
      originalVentearsak="ventearsak"
      ventearsaker={[]}
    />);
    const select = wrapper.find(SelectField);
    expect(select.prop('validate')).to.have.length(1);
  });
});
