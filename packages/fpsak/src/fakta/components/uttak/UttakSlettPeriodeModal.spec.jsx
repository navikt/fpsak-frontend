import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import { TextAreaField } from 'form/Fields';
import { Modal } from 'sharedComponents/Modal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { UttakSlettPeriodeModalImpl } from './UttakSlettPeriodeModal';

const periode = {
  arbeidstidsprosent: null,
  begrunnelse: null,
  bekreftet: true,
  dokumentertePerioder: [],
  fom: '2018-03-01',
  id: '2018-03-01|2018-04-28',
  openForm: false,
  resultat: null,
  tom: '2018-04-28',
  updated: false,
  utsettelseÅrsak: {
    kode: '-',
    navn: 'Ikke satt eller valgt kode',
    kodeverk: 'AARSAK_TYPE',
  },
  uttakPeriodeType: {
    kode: 'FORELDREPENGER',
    navn: 'Foreldrepenger',
    kodeverk: 'UTTAK_PERIODE_TYPE',
  },
};

const closeEvent = sinon.spy();
const cancelEvent = sinon.spy();

describe('<UttakSlettPeriodeModal>', () => {
  it('skal vise åpen modal', () => {
    const wrapper = shallowWithIntl(<UttakSlettPeriodeModalImpl
      formProps={reduxFormPropsMock}
      showModal
      intl={intlMock}
      closeEvent={closeEvent}
      cancelEvent={cancelEvent}
      periode={periode}
    />);
    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('closeButton')).is.false;
    expect(modal.prop('contentLabel')).to.eql('Perioden slettes');

    const textField = wrapper.find(TextAreaField);
    expect(textField).to.have.length(1);

    const okKnapp = wrapper.find(Hovedknapp);
    expect(okKnapp).to.have.length(1);
    expect(okKnapp.prop('mini')).is.true;
    expect(okKnapp.childAt(0).text()).is.eql('OK');

    const avbrytKnapp = wrapper.find(Knapp);
    expect(avbrytKnapp).to.have.length(1);
    expect(avbrytKnapp.prop('mini')).is.true;
    expect(avbrytKnapp.childAt(0).text()).is.eql('Avbryt');
  });
  it('skal rendre lukket modal', () => {
    const wrapper = shallowWithIntl(<UttakSlettPeriodeModalImpl
      formProps={reduxFormPropsMock}
      showModal={false}
      intl={intlMock}
      closeEvent={closeEvent}
      cancelEvent={cancelEvent}
      periode={periode}
    />);
    const modal = wrapper.find(Modal);
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.false;
  });
});
