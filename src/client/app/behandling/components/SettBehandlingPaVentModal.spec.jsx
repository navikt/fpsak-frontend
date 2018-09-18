import React from 'react';
import { intlMock, shallowWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import sinon from 'sinon';
import { expect } from 'chai';
import moment from 'moment';

import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { DatepickerField, SelectField } from 'form/Fields';
import { SettBehandlingPaVentModal } from './SettBehandlingPaVentModal';

describe('<SettBehandlingPaVentModal>', () => {
  it('skal rendre åpen modal', () => {
    const cancelEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      showModal
      gyldigDato={sinon.spy()}
      onChangeEvent={sinon.spy()}
      handleSubmit={sinon.spy()}
      cancelEvent={cancelEventCallback}
      frist="2017-10-10"
      ventearsaker={[]}
      intl={intlMock}
      venteArsakHasChanged
      fristHasChanged
      hasManualPaVent
    />);

    const modal = wrapper.find('Modal');
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('closeButton')).is.false;
    expect(modal.prop('contentLabel')).to.eql('Behandlingen settes på vent med frist');
    expect(modal.prop('onRequestClose')).to.eql(cancelEventCallback);
  });

  it('skal rendre lukket modal', () => {
    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      showModal={false}
      gyldigDato={sinon.spy()}
      onChangeEvent={sinon.spy()}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist="2017-10-10"
      ventearsaker={[]}
      intl={intlMock}
      venteArsakHasChanged
      fristHasChanged
      hasManualPaVent
    />);

    const modal = wrapper.find('Modal');
    expect(modal.prop('isOpen')).is.false;
  });

  it('skal lukke modal ved klikk på avbryt-knapp', () => {
    const cancelEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      showModal
      onChangeEvent={sinon.spy()}
      handleSubmit={sinon.spy()}
      cancelEvent={cancelEventCallback}
      frist="2017-10-10"
      ventearsaker={[]}
      intl={intlMock}
      venteArsakHasChanged
      fristHasChanged
      hasManualPaVent
    />);

    wrapper.find('Knapp').simulate('click');
    expect(cancelEventCallback).to.have.property('callCount', 1);
  });

  it('skal ikke disable knapp for lagring når frist er en gyldig fremtidig dato', () => {
    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      showModal
      onChangeEvent={sinon.spy()}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist="2099-10-10"
      ventearsaker={[]}
      intl={intlMock}
      venteArsakHasChanged
      fristHasChanged
      hasManualPaVent
    />);


    const button = wrapper.find(Hovedknapp);
    expect(button.prop('disabled')).is.false;
  });

  it('skal vise lukk-knapp når oppdater sett på vent', () => {
    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      showModal
      onChangeEvent={sinon.spy()}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist="2099-10-10"
      isUpdateOnHold
      ventearsaker={[]}
      kodeverkReceived
      intl={intlMock}
      venteArsakHasChanged
      fristHasChanged
      hasManualPaVent
    />);

    const avbrytKnapp = wrapper.find('Knapp');
    expect(avbrytKnapp).to.have.length(1);
  });

  it('skal være obligatorisk å velge årsak', () => {
    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      showModal
      onChangeEvent={sinon.spy()}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist="2099-10-10"
      ventearsaker={[]}
      intl={intlMock}
      venteArsakHasChanged
      fristHasChanged
      hasManualPaVent
    />);

    const select = wrapper.find('SelectField');
    expect(select.prop('validate')).to.have.length(1);
  });

  it('skal disable knapp for lagring når frist er en ugyldig dato', () => {
    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      showModal
      onChangeEvent={sinon.spy()}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist="20-10-10"
      ventearsaker={[]}
      intl={intlMock}
      venteArsakHasChanged
      fristHasChanged
      hasManualPaVent
    />);

    const button = wrapper.find(Hovedknapp);
    expect(button.prop('disabled')).is.true;
  });

  it('skal ikke disable knapp for lagring når frist er en gyldig dato tilbake i tid når oppdatering av sett på vent', () => {
    const date = moment().toDate();
    date.setDate(date.getDate() + 1);
    const tomorrow = date.toISOString().substr(0, 10);

    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      showModal
      onChangeEvent={sinon.spy()}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist={tomorrow}
      ventearsaker={[]}
      kodeverkReceived
      isUpdateOnHold
      intl={intlMock}
      venteArsakHasChanged
      fristHasChanged
      hasManualPaVent
    />);

    const button = wrapper.find(Hovedknapp);
    expect(button.prop('disabled')).is.false;
  });

  it('skal disable knapp for lagring når frist er en historisk dato', () => {
    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      showModal
      onChangeEvent={sinon.spy()}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist="2015-10-10"
      ventearsaker={[]}
      intl={intlMock}
      venteArsakHasChanged
      fristHasChanged
      hasManualPaVent
    />);

    const button = wrapper.find(Hovedknapp);
    expect(button.prop('disabled')).is.true;
  });

  it('skal kalle cancel event når avbrytknapp ikke vises', () => {
    const cancelEvent = sinon.spy();

    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      showModal
      onChangeEvent={sinon.spy()}
      handleSubmit={sinon.spy()}
      cancelEvent={cancelEvent}
      frist="2015-10-10"
      ventearsaker={[]}
      showAvbryt={false}
      intl={intlMock}
      venteArsakHasChanged
      fristHasChanged
      hasManualPaVent
    />);

    wrapper.find(Hovedknapp).simulate('click');
    expect(cancelEvent).to.have.property('callCount', 1);
  });

  it('skal ikke vise frist-input når behandling automatisk er satt på vent uten frist', () => {
    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      showModal
      onChangeEvent={sinon.spy()}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      ventearsaker={[]}
      intl={intlMock}
      venteArsakHasChanged
      fristHasChanged
      hasManualPaVent={false}
    />);

    expect(wrapper.find(DatepickerField)).to.have.length(0);
  });

  it('skal vise frist-input når behandling automatisk er satt på vent med frist', () => {
    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      showModal
      onChangeEvent={sinon.spy()}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist="2015-10-10"
      ventearsaker={[]}
      intl={intlMock}
      venteArsakHasChanged
      fristHasChanged
      hasManualPaVent={false}
    />);

    expect(wrapper.find(DatepickerField)).to.have.length(1);
  });

  it('skal vise årsak-input som readonly når behandling automatisk er satt på vent', () => {
    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      showModal
      onChangeEvent={sinon.spy()}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist="2015-10-10"
      ventearsaker={[]}
      intl={intlMock}
      venteArsakHasChanged
      fristHasChanged
      hasManualPaVent={false}
    />);

    expect(wrapper.find(SelectField).prop('readOnly')).is.true;
  });

  it('skal alltid vise lukk-knapp når behandling automatisk er satt på vent', () => {
    const wrapper = shallowWithIntl(<SettBehandlingPaVentModal
      showModal
      onChangeEvent={sinon.spy()}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      frist="2015-10-10"
      ventearsaker={[]}
      intl={intlMock}
      venteArsakHasChanged
      fristHasChanged
      hasManualPaVent={false}
    />);

    const button = wrapper.find(Knapp);
    expect(button).to.have.length(1);
    expect(button.childAt(0).text()).to.eql('Lukk');
  });
});
