import React from 'react';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { expect } from 'chai';
import kanIkkeOppgiAnnenForelderArsaker from 'kodeverk/kanIkkeOppgiAnnenForelderArsak';

import AnnenForelderPanel, { AnnenForelderPanelImpl, KanIkkeOppgiBegrunnelsePanel } from './AnnenForelderPanel';

describe('<AnnenForelderPanel>', () => {
  describe('validate', () => {
    describe('hvis kan oppgi annen forelder', () => {
      const sokersPersonnummer = '12345678910';
      const validate = values => AnnenForelderPanel.validate(sokersPersonnummer, { kanIkkeOppgiAnnenForelder: false, ...values });
      it('skal validere fornavn', () => {
        const errorsWithoutFornavn = validate({});
        const errorsWithFornavn = validate({ fornavn: 'Ola' });

        expect(errorsWithoutFornavn.fornavn).to.be.an('array');
        expect(errorsWithFornavn.fornavn).to.not.exist;
      });

      it('skal validere etternavn', () => {
        const errorsWithoutEtternavn = validate({});
        const errorsWithEtternavn = validate({ etternavn: 'Ola' });

        expect(errorsWithoutEtternavn.etternavn).to.be.an('array');
        expect(errorsWithEtternavn.etternavn).to.not.exist;
      });

      /**
       * NB: Validerer kun formatkrav 11 siffer. Validerer ikke at fødselsnummeret faktisk er gyldig.
       */
      it('skal validere fødselsnummer', () => {
        const errorsWithNoFoedselsnummer = validate({});
        const errorsWithInvalidFoedselsnummer = validate({ foedselsnummer: 'Ola' });
        const errorsWithValidFoedselsnummer = validate({ foedselsnummer: '08057949997' });

        expect(errorsWithNoFoedselsnummer.foedselsnummer).to.be.an('array');
        expect(errorsWithInvalidFoedselsnummer.foedselsnummer).to.be.an('array');
        expect(errorsWithValidFoedselsnummer.foedselsnummer).to.not.exist;
      });
    });

    describe('hvis ikke kan oppgi annen forelder', () => {
      const sokersPersonnummer = '12345678910';
      const validateBegrunnelse = kanIkkeOppgiBegrunnelse => AnnenForelderPanel.validate(sokersPersonnummer,
        { kanIkkeOppgiAnnenForelder: true, kanIkkeOppgiBegrunnelse });
      it('skal validere årsak', () => {
        const errorsWithNoArsak = validateBegrunnelse({});
        const errorsWithArsak = validateBegrunnelse({ arsak: 'En årsak' });

        expect(errorsWithNoArsak.kanIkkeOppgiBegrunnelse.arsak).to.be.an('array');
        expect(errorsWithArsak.kanIkkeOppgiBegrunnelse.arsak).to.not.exist;
      });
    });
  });

  const countryCodes = [
    {
      kode: 'NOR',
      navn: 'Norge',
    },
    {
      kode: 'SWE',
      navn: 'Sverige',
    },
  ];

  it('skal kun vise angi begrunnelse hvis kanIkkeOppgiAnnenForelder er valgt', () => {
    const wrapper = shallowWithIntl(<AnnenForelderPanelImpl
      intl={intlMock}
      countryCodes={countryCodes}
      form="test"
    />);

    let begrunnelse = wrapper.find({ name: 'kanIkkeOppgiBegrunnelse' });
    expect(begrunnelse).to.have.length(0);

    wrapper.setProps({ kanIkkeOppgiAnnenForelder: true });
    wrapper.update();

    begrunnelse = wrapper.find({ name: 'kanIkkeOppgiBegrunnelse' });
    expect(begrunnelse).to.have.length(1);
  });

  it('skal for foreldrepenger-søknad vise radioknapper for om annen foreldre er kjent med perioder det er søkt om', () => {
    const wrapper = shallowWithIntl(<AnnenForelderPanelImpl
      intl={intlMock}
      countryCodes={countryCodes}
      form="test"
      isForeldrepenger
    />);

    expect(wrapper.find({ name: 'annenForelderInformert' })).to.have.length(1);
  });

  it('skal for engangsstønad-søknad ikke vise radioknapper for om annen foreldre er kjent med perioder det er søkt om', () => {
    const wrapper = shallowWithIntl(<AnnenForelderPanelImpl
      intl={intlMock}
      countryCodes={countryCodes}
      form="test"
      isForeldrepenger={false}
    />);

    expect(wrapper.find({ name: 'annenForelderInformert' })).to.have.length(0);
  });

  describe('<KanIkkeOppgiBegrunnelseForm>', () => {
    it('skal kun vise land dropdown og utenlandskFodelsnummer felt hvis arsak er IKKE_NORSK_FNR', () => {
      const wrapper = shallowWithIntl(<KanIkkeOppgiBegrunnelsePanel
        readOnly={false}
        formatMessage={() => ''}
        countryCodes={countryCodes}
        kanIkkeOppgiBegrunnelse={{}}
      />);

      let land = wrapper.find({ name: 'land' });
      let utenlandskFoedselsnummer = wrapper.find({ name: 'utenlandskFoedselsnummer' });
      expect(land).to.have.length(0);
      expect(utenlandskFoedselsnummer).to.have.length(0);

      wrapper.setProps({ kanIkkeOppgiBegrunnelse: { arsak: kanIkkeOppgiAnnenForelderArsaker.IKKE_NORSK_FNR } });
      wrapper.update();
      land = wrapper.find({ name: 'land' });
      utenlandskFoedselsnummer = wrapper.find({ name: 'utenlandskFoedselsnummer' });

      expect(land).to.have.length(1);
      expect(utenlandskFoedselsnummer).to.have.length(1);
    });
  });
});
