import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { ChangeBehandlendeEnhetModalImpl } from './ChangeBehandlendeEnhetModal';

describe('<ChangeBehandlendeEnhetModal>', () => {
  const behandlendeEnheter = [{
    enhetId: '001',
    enhetNavn: 'NAV',
    status: 'Aktiv',
  }];

  it('skal rendre åpen modal', () => {
    const wrapper = shallowWithIntl(<ChangeBehandlendeEnhetModalImpl
      showModal
      handleSubmit={sinon.spy()}
      handleEnhetChange={sinon.spy()}
      cancelEvent={sinon.spy()}
      behandlendeEnheter={behandlendeEnheter}
      gjeldendeBehandlendeEnhetId="002"
      gjeldendeBehandlendeEnhetNavn="Oslo"
      nyEnhet="Test3"
      begrunnelse="Dette er en begrunnelse"
      intl={intlMock}
    />);

    const modal = wrapper.find('Modal');
    expect(modal).to.have.length(1);
    expect(modal.prop('isOpen')).is.true;
    expect(modal.prop('closeButton')).is.false;
    expect(modal.prop('contentLabel')).to.eql('Endre behandlende enhet');

    const button = wrapper.find('Hovedknapp');
    expect(button).to.have.length(1);
    expect(button.prop('disabled')).is.false;
  });

  it('skal rendre lukket modal', () => {
    const wrapper = shallowWithIntl(<ChangeBehandlendeEnhetModalImpl
      showModal={false}
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      handleEnhetChange={sinon.spy()}
      behandlendeEnheter={behandlendeEnheter}
      gjeldendeBehandlendeEnhetId="002"
      gjeldendeBehandlendeEnhetNavn="Oslo"
      nyEnhet="Test"
      begrunnelse="Dette er en begrunnelse"
      intl={intlMock}
    />);

    const modal = wrapper.find('Modal');
    expect(modal.prop('isOpen')).is.false;
  });

  it('skal vise nedtrekksliste med behandlende enheter', () => {
    const wrapper = shallowWithIntl(<ChangeBehandlendeEnhetModalImpl
      showModal
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      handleEnhetChange={sinon.spy()}
      behandlendeEnheter={behandlendeEnheter}
      gjeldendeBehandlendeEnhetId="002"
      gjeldendeBehandlendeEnhetNavn="Oslo"
      nyEnhet="Test"
      begrunnelse="Dette er en begrunnelse"
      intl={intlMock}
    />);

    const selectField = wrapper.find('SelectField');
    expect(selectField).to.have.length(1);
    expect(selectField.prop('placeholder')).is.eql('002 Oslo');
    const values = selectField.prop('selectValues');
    expect(values[0].props.value).is.eql('0');
  });

  it('skal disable knapp for lagring når ny behandlende enhet og begrunnnelse ikke er valgt', () => {
    const wrapper = shallowWithIntl(<ChangeBehandlendeEnhetModalImpl
      showModal
      handleSubmit={sinon.spy()}
      cancelEvent={sinon.spy()}
      handleEnhetChange={sinon.spy()}
      behandlendeEnheter={behandlendeEnheter}
      gjeldendeBehandlendeEnhetId="002"
      gjeldendeBehandlendeEnhetNavn="Oslo"
      intl={intlMock}
    />);

    const button = wrapper.find('Hovedknapp');
    expect(button.prop('disabled')).is.true;
  });

  it('skal bruke submit-callback når en trykker ok', () => {
    const submitEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(<ChangeBehandlendeEnhetModalImpl
      showModal
      handleSubmit={submitEventCallback}
      cancelEvent={sinon.spy()}
      handleEnhetChange={sinon.spy()}
      behandlendeEnheter={behandlendeEnheter}
      gjeldendeBehandlendeEnhetId="002"
      gjeldendeBehandlendeEnhetNavn="Oslo"
      nyEnhet="Test"
      begrunnelse="Dette er en begrunnelse"
      intl={intlMock}
    />);

    const form = wrapper.find('form');
    form.simulate('submit', { preventDefault() {} });
    expect(submitEventCallback.called).is.true;
  });

  it('skal avbryte redigering ved trykk på avbryt-knapp', () => {
    const cancelEventCallback = sinon.spy();
    const wrapper = shallowWithIntl(<ChangeBehandlendeEnhetModalImpl
      showModal
      handleSubmit={sinon.spy()}
      cancelEvent={cancelEventCallback}
      handleEnhetChange={sinon.spy()}
      behandlendeEnheter={behandlendeEnheter}
      gjeldendeBehandlendeEnhetId="002"
      gjeldendeBehandlendeEnhetNavn="Oslo"
      nyEnhet="Test"
      begrunnelse="Dette er en begrunnelse"
      intl={intlMock}
    />);

    const avbrytKnapp = wrapper.find('Knapp');
    expect(avbrytKnapp).to.have.length(1);
    expect(avbrytKnapp.prop('mini')).is.true;

    avbrytKnapp.simulate('click');
    expect(cancelEventCallback.called).is.true;
  });
});
