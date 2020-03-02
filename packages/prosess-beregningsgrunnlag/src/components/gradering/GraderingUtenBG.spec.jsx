import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { RadioOption, TextAreaField } from '@fpsak-frontend/form';
import { Element } from 'nav-frontend-typografi';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-felles';
import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import { buildInitialValues, GraderingUtenBG2 as UnwrappedForm } from './GraderingUtenBG';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-prosess-beregningsgrunnlag';

const mockAksjonspunktMedKodeOgStatus = (apKode, status) => ({
  definisjon: {
    kode: apKode,
  },
  status: {
    kode: status,
  },
  begrunnelse: 'begrunnelse',

});

const atAndelEn = {
  aktivitetStatus: {
    kode: aktivitetStatus.ARBEIDSTAKER,
  },
  arbeidsforhold: {
    arbeidsgiverNavn: 'arbeidsgiver',
    arbeidsgiverId: '123',
  },
  andelsnr: 1,
};

const atAndelTo = {
  aktivitetStatus: {
    kode: aktivitetStatus.ARBEIDSTAKER,
  },
  arbeidsforhold: {
    arbeidsgiverNavn: 'arbeidsgiver',
    arbeidsgiverId: '456',
  },
  andelsnr: 2,
};

const snAndel = {
  aktivitetStatus: {
    kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
  },
  andelsnr: 3,
};

const flAndel = {
  aktivitetStatus: {
    kode: aktivitetStatus.FRILANSER,
  },
  andelsnr: 4,
};

const getKodeverknavn = (kodeverk) => {
  if (kodeverk.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE) {
    return 'Selvstendig næringsdrivende';
  }
  if (kodeverk.kode === aktivitetStatus.FRILANSER) {
    return 'Frilanser';
  }
  if (kodeverk.kode === aktivitetStatus.ARBEIDSTAKER) {
    return 'Arbeidstaker';
  }

  return '';
};

describe('<GraderingUtenBG>', () => {
  it('skal teste at komponent vises riktig gitt en liste arbeidsforhold', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      readOnly={false}
      andelerMedGraderingUtenBG={[atAndelEn, atAndelTo]}
      aksjonspunkter={[mockAksjonspunktMedKodeOgStatus('5050', 'OPPR')]}
      getKodeverknavn={getKodeverknavn}
      submitCallback={sinon.spy()}
      behandlingId={1}
      behandlingVersjon={1}
      {...reduxFormPropsMock}
    />);
    const radioOption = wrapper.find(RadioOption);
    expect(radioOption).to.have.length(2);
    const textfield = wrapper.find(TextAreaField);
    expect(textfield).to.have.length(1);
    const button = wrapper.find(BehandlingspunktSubmitButton);
    expect(button).to.have.length(1);
    const hjelpetekst = wrapper.find('FormattedHTMLMessage');
    const formattedMessages = wrapper.find('FormattedMessage');
    expect(formattedMessages.prop('id')).to.eql('Beregningsgrunnlag.Gradering.Tittel');
    expect(hjelpetekst.prop('values')).to.eql({ arbeidsforholdTekst: 'arbeidsgiver (123) og arbeidsgiver (456)' });
    const element = wrapper.find(Element);
    expect(element).to.have.length(1);
  });

  it('skal teste at komponent vises riktig gitt en liste arbeidsforhold der et eller flere er sn / fl', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      readOnly={false}
      andelerMedGraderingUtenBG={[atAndelEn, snAndel, flAndel]}
      submitCallback={sinon.spy()}
      aksjonspunkter={[mockAksjonspunktMedKodeOgStatus('5050', 'OPPR')]}
      getKodeverknavn={getKodeverknavn}
      behandlingId={1}
      behandlingVersjon={1}
      {...reduxFormPropsMock}
    />);
    const radioOption = wrapper.find(RadioOption);
    expect(radioOption).to.have.length(2);
    const textfield = wrapper.find(TextAreaField);
    expect(textfield).to.have.length(1);
    const button = wrapper.find(BehandlingspunktSubmitButton);
    expect(button).to.have.length(1);
    const hjelpetekst = wrapper.find('FormattedHTMLMessage');
    const formattedMessages = wrapper.find('FormattedMessage');
    expect(formattedMessages.prop('id')).to.eql('Beregningsgrunnlag.Gradering.Tittel');
    expect(hjelpetekst.prop('values')).to.eql({ arbeidsforholdTekst: 'arbeidsgiver (123), selvstendig næringsdrivende og frilanser' });
    const element = wrapper.find(Element);
    expect(element).to.have.length(1);
  });


  it('skal teste at komponent bygger korrekte initial values dersom aksjonspunktet ikke finnes', () => {
    const expectedInitialValues = undefined;

    const actualInitialValues = buildInitialValues.resultFunc(undefined, []);
    expect(actualInitialValues).is.deep.equal(expectedInitialValues);
  });

  it('skal teste at komponent bygger korrekte initial values dersom aksjonspunktet ikke før er løst finnes', () => {
    const expectedInitialValues = undefined;
    const actualInitialValues = buildInitialValues.resultFunc(undefined, []);

    expect(actualInitialValues).is.deep.equal(expectedInitialValues);
  });

  it('skal teste at komponent bygger korrekte initial values dersom behandling er på vent', () => {
    const expectedInitialValues = {
      graderingUtenBGSettPaaVent: true,
      begrunnelse: 'begrunnelse',
    };
    const aksjonspunkter = [mockAksjonspunktMedKodeOgStatus('5050', 'UTFO'), mockAksjonspunktMedKodeOgStatus('7019', 'OPPR')];

    const actualInitialValues = buildInitialValues.resultFunc(venteArsakType.VENT_GRADERING_UTEN_BEREGNINGSGRUNNLAG, aksjonspunkter);
    expect(actualInitialValues).is.deep.equal(expectedInitialValues);
  });

  it('skal teste at komponent bygger korrekte initial values dersom behandling ikke er på vent', () => {
    const expectedInitialValues = {
      graderingUtenBGSettPaaVent: false,
      begrunnelse: 'begrunnelse',
    };

    const actualInitialValues = buildInitialValues.resultFunc(undefined, [mockAksjonspunktMedKodeOgStatus('5050', 'UTFO')]);
    expect(actualInitialValues).is.deep.equal(expectedInitialValues);
  });

  it('skal teste at komponent bygger korrekte initial values dersom behandling er på vent mrd ventekode', () => {
    const expectedInitialValues = {
      graderingUtenBGSettPaaVent: true,
      begrunnelse: 'begrunnelse',
    };
    const aksjonspunkter = [mockAksjonspunktMedKodeOgStatus('5050', 'UTFO'), mockAksjonspunktMedKodeOgStatus('7019', 'OPPR')];

    const actualInitialValues = buildInitialValues.resultFunc(venteArsakType.VENT_GRADERING_UTEN_BEREGNINGSGRUNNLAG, aksjonspunkter);
    expect(actualInitialValues).is.deep.equal(expectedInitialValues);
  });
});
