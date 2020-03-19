import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import { DatepickerField, SelectField } from '@fpsak-frontend/form';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import { BehandlingPaVentModal } from './BehandlingPaVentModal';

describe('<BehandlingPaVentModal>', () => {
  it('skal rendre åpen modal', () => {
    const cancelEventCallback = sinon.spy();

    const wrapper = shallowWithIntl(<BehandlingPaVentModal
      intl={intlMock}
      handleSubmit={sinon.spy()}
      cancelEvent={cancelEventCallback}
      frist="frist"
      originalFrist="frist"
      ventearsak="ventearsak"
      originalVentearsak="ventearsak"
      hasManualPaVent
      ventearsaker={[]}
    />);

    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('closeButton')).is.false;
    expect(modal.prop('contentLabel')).to.eql('Behandlingen settes på vent med frist');
    expect(modal.prop('onRequestClose')).to.eql(cancelEventCallback);
  });

  it('skal ikke disable knapp for lagring når frist er en gyldig fremtidig dato', () => {
    const wrapper = shallowWithIntl(<BehandlingPaVentModal
      intl={intlMock}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist="2099-10-10"
      originalFrist="frist"
      ventearsak="ventearsak"
      originalVentearsak="ventearsak"
      hasManualPaVent
      ventearsaker={[]}
    />);

    const button = wrapper.find(Hovedknapp);
    expect(button.prop('disabled')).is.false;
  });

  it('skal disable knapp for lagring når frist er en ugyldig dato', () => {
    const wrapper = shallowWithIntl(<BehandlingPaVentModal
      intl={intlMock}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist="20-10-10"
      originalFrist="frist"
      ventearsak="ventearsak"
      originalVentearsak="ventearsak"
      hasManualPaVent
      ventearsaker={[]}
    />);

    const button = wrapper.find(Hovedknapp);
    expect(button.prop('disabled')).is.true;
  });

  it('skal disable knapp for lagring når frist er en historisk dato', () => {
    const wrapper = shallowWithIntl(<BehandlingPaVentModal
      intl={intlMock}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist="2015-10-10"
      originalFrist="frist"
      ventearsak="ventearsak"
      originalVentearsak="ventearsak"
      hasManualPaVent
      ventearsaker={[]}
    />);

    const button = wrapper.find(Hovedknapp);
    expect(button.prop('disabled')).is.true;
  });

  it('skal være obligatorisk å velge årsak', () => {
    const wrapper = shallowWithIntl(<BehandlingPaVentModal
      intl={intlMock}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist="2099-10-10"
      originalFrist="frist"
      ventearsak="ventearsak"
      originalVentearsak="ventearsak"
      hasManualPaVent
      ventearsaker={[]}
    />);
    const select = wrapper.find(SelectField);
    expect(select.prop('validate')).to.have.length(1);
  });

  it('skal ikke vise frist-input når behandling automatisk er satt på vent uten frist', () => {
    const wrapper = shallowWithIntl(<BehandlingPaVentModal
      intl={intlMock}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      ventearsak="ventearsak"
      originalVentearsak="ventearsak"
      hasManualPaVent={false}
      ventearsaker={[]}
    />);

    expect(wrapper.find(DatepickerField)).to.have.length(0);
  });

  it('skal vise frist-input når behandling automatisk er satt på vent med frist', () => {
    const wrapper = shallowWithIntl(<BehandlingPaVentModal
      intl={intlMock}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist="2015-10-10"
      ventearsaker={[]}
      hasManualPaVent={false}
    />);

    expect(wrapper.find(DatepickerField)).to.have.length(1);
  });

  it('skal vise årsak-input som readonly når behandling automatisk er satt på vent', () => {
    const wrapper = shallowWithIntl(<BehandlingPaVentModal
      intl={intlMock}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist="2015-10-10"
      ventearsaker={[]}
      hasManualPaVent={false}
    />);

    expect(wrapper.find(SelectField).prop('readOnly')).is.true;
  });

  it('skal alltid vise lukk-knapp når behandling automatisk er satt på vent', () => {
    const wrapper = shallowWithIntl(<BehandlingPaVentModal
      intl={intlMock}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist="2015-10-10"
      ventearsaker={[]}
      hasManualPaVent={false}
    />);

    const button = wrapper.find(Knapp);
    expect(button).to.have.length(1);
    expect(button.childAt(0).text()).to.eql('Lukk');
  });
});
