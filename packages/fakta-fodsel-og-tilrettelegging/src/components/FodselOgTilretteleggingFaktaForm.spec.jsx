import React from 'react';
import { expect } from 'chai';
import AlertStripe from 'nav-frontend-alertstriper';

import { DatepickerField, TextAreaField } from '@fpsak-frontend/form';
import { FaktaSubmitButton } from '@fpsak-frontend/fp-felles';

import { FodselOgTilretteleggingFaktaForm, validateForm } from './FodselOgTilretteleggingFaktaForm';
import TilretteleggingArbeidsforholdSection from './tilrettelegging/TilretteleggingArbeidsforholdSection';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-fakta-fodsel-og-tilrettelegging';

const arbeidsforhold = [
  {
    internArbeidsforholdReferanse: '0f70f2f2-79f8-4cc0-8929-be25ef2be878',
    arbeidsgiverIdent: '910909088',
    arbeidsgiverNavn: 'BEDRIFT AS',
    begrunnelse: null,
    kopiertFraTidligereBehandling: false,
    opplysningerOmRisiko: null,
    opplysningerOmTilrettelegging: null,
    skalBrukes: true,
    tilretteleggingBehovFom: '2019-09-15',
    tilretteleggingDatoer: [],
    tilretteleggingId: 1000303,
  },
  {
    internArbeidsforholdReferanse: 'fb74d757-6bd3-4ed3-a1f4-c2424ebb64d5',
    arbeidsgiverIdent: '910909088',
    arbeidsgiverNavn: 'BEDRIFT AS',
    begrunnelse: null,
    kopiertFraTidligereBehandling: false,
    opplysningerOmRisiko: null,
    opplysningerOmTilrettelegging: null,
    skalBrukes: true,
    tilretteleggingBehovFom: '2019-09-15',
    tilretteleggingDatoer: [],
    tilretteleggingId: 1000304,
  },
];

const formProps = {
  error: 'SOME_ERROR',
};

describe('<FodselOgTilretteleggingFaktaForm>', () => {
  it('skal vise faktaform med begrunnelsefelt og fodseldato', () => {
    const wrapper = shallowWithIntl(<FodselOgTilretteleggingFaktaForm
      behandlingId={1}
      behandlingVersjon={1}
      hasOpenAksjonspunkter={false}
      readOnly
      fødselsdato=""
      submittable
      arbeidsforhold={arbeidsforhold}
    />);

    const tilretteleggingArbeidsforholdSection = wrapper.find(TilretteleggingArbeidsforholdSection);
    expect(tilretteleggingArbeidsforholdSection).has.length(2);
    const datepicker = wrapper.find(DatepickerField);
    expect(datepicker).has.length(1);
    const begrunnelsefelt = wrapper.find(TextAreaField);
    expect(begrunnelsefelt).has.length(1);
    const submitButton = wrapper.find(FaktaSubmitButton);
    expect(submitButton).has.length(1);
    const alertStripe = wrapper.find(AlertStripe);
    expect(alertStripe).has.length(0);
  });

  it('skal vise faktaform med fødelsedato', () => {
    const wrapper = shallowWithIntl(<FodselOgTilretteleggingFaktaForm
      behandlingId={1}
      behandlingVersjon={1}
      hasOpenAksjonspunkter={false}
      readOnly
      fødselsdato="20.10.2019"
      submittable
      arbeidsforhold={arbeidsforhold}
    />);

    const tilretteleggingArbeidsforholdSection = wrapper.find(TilretteleggingArbeidsforholdSection);
    expect(tilretteleggingArbeidsforholdSection).has.length(2);
    const datepicker = wrapper.find(DatepickerField);
    expect(datepicker).has.length(2);
    const begrunnelsefelt = wrapper.find(TextAreaField);
    expect(begrunnelsefelt).has.length(1);
    const submitButton = wrapper.find(FaktaSubmitButton);
    expect(submitButton).has.length(1);
    const alertStripe = wrapper.find(AlertStripe);
    expect(alertStripe).has.length(0);
  });

  it('skal vise AlertStripe når formprops.error er satt', () => {
    const wrapper = shallowWithIntl(<FodselOgTilretteleggingFaktaForm
      behandlingId={1}
      behandlingVersjon={1}
      hasOpenAksjonspunkter={false}
      readOnly
      fødselsdato="20.10.2019"
      submittable
      arbeidsforhold={arbeidsforhold}
      {...formProps}
    />);

    const tilretteleggingArbeidsforholdSection = wrapper.find(TilretteleggingArbeidsforholdSection);
    expect(tilretteleggingArbeidsforholdSection).has.length(2);
    const datepicker = wrapper.find(DatepickerField);
    expect(datepicker).has.length(2);
    const begrunnelsefelt = wrapper.find(TextAreaField);
    expect(begrunnelsefelt).has.length(1);
    const submitButton = wrapper.find(FaktaSubmitButton);
    expect(submitButton).has.length(1);
    const alertStripe = wrapper.find(AlertStripe);
    expect(alertStripe).has.length(1);
  });

  it('skal validere OK', () => {
    const values = {
      termindato: '2020-01-01',
      'BEDRIFT AS9109090880f70f2f2-79f8-4cc0-8929-be25ef2be878': {
        skalBrukes: true,
        tilretteleggingBehovFom: '2019-01-01',
        tilretteleggingDatoer: [{
          fom: '2019-01-01',
        }],
      },
      'BEDRIFT AS910909088fb74d757-6bd3-4ed3-a1f4-c2424ebb64d5': {
        skalBrukes: true,
        tilretteleggingBehovFom: '2019-01-01',
        tilretteleggingDatoer: [{
          fom: '2019-01-01',
        }],
      },
    };
    const errors = validateForm(values, arbeidsforhold);

    expect(errors).is.eql({});
  });

  it('skal vise feilmelding når ingen arbeidsforhold skal brukes', () => {
    const values = {
      termindato: '2020-01-01',
      'BEDRIFT AS9109090880f70f2f2-79f8-4cc0-8929-be25ef2be878': {
        skalBrukes: false,
        tilretteleggingBehovFom: '2019-01-01',
        tilretteleggingDatoer: [{
          fom: '2019-01-01',
        }],
      },
      'BEDRIFT AS910909088fb74d757-6bd3-4ed3-a1f4-c2424ebb64d5': {
        skalBrukes: false,
        tilretteleggingDatoer: [{
          fom: '2019-01-02',
        }],
      },
    };
    const errors = validateForm(values, arbeidsforhold);

    // eslint-disable-next-line no-underscore-dangle
    expect(errors._error).is.eql('FodselOgTilretteleggingFaktaForm.MinstEnTilretteleggingMåBrukes');
  });

  it('skal finne duplikate datoer innenfor et arbeidsforhold', () => {
    const values = {
      termindato: '2020-01-01',
      'BEDRIFT AS9109090880f70f2f2-79f8-4cc0-8929-be25ef2be878': {
        skalBrukes: true,
        tilretteleggingBehovFom: '2019-01-01',
        tilretteleggingDatoer: [{
          fom: '2019-01-01',
        }, {
          fom: '2019-01-01',
        }],
      },
      'BEDRIFT AS910909088fb74d757-6bd3-4ed3-a1f4-c2424ebb64d5': {
        skalBrukes: true,
        tilretteleggingBehovFom: '2019-01-01',
        tilretteleggingDatoer: [{
          fom: '2019-01-01',
        }, {
          fom: '2019-01-04',
        }],
      },
    };
    const errors = validateForm(values, arbeidsforhold);

    expect(errors).is.eql({
      'BEDRIFT AS9109090880f70f2f2-79f8-4cc0-8929-be25ef2be878': {
        tilretteleggingDatoer: [{
          fom: [{
            id: 'FodselOgTilretteleggingFaktaForm.DuplikateDatoer',
          }],
        }, {
          fom: [{
            id: 'FodselOgTilretteleggingFaktaForm.DuplikateDatoer',
          }],
        }],
      },
    });
  });

  it('skal ikke kunne godkjenne arbeidsforhold som har tilretteleggingBehovFom etter termindato', () => {
    const values = {
      termindato: '2018-01-01',
      'BEDRIFT AS9109090880f70f2f2-79f8-4cc0-8929-be25ef2be878': {
        skalBrukes: true,
        tilretteleggingBehovFom: '2019-01-01',
        tilretteleggingDatoer: [{
          fom: '2019-01-01',
        }],
      },
    };
    const errors = validateForm(values, arbeidsforhold);

    expect(errors).is.eql({
      termindato: [{
        id: 'FodselOgTilretteleggingFaktaForm.TermindatoForDato',
      }],
      'BEDRIFT AS9109090880f70f2f2-79f8-4cc0-8929-be25ef2be878': {
        tilretteleggingBehovFom: [{
          id: 'FodselOgTilretteleggingFaktaForm.TermindatoForDato',
        }],
      },
    });
  });

  it('skal ikke kunne godkjenne arbeidsforhold som har tilretteleggingBehovFom lik termindato', () => {
    const values = {
      termindato: '2019-01-01',
      'BEDRIFT AS9109090880f70f2f2-79f8-4cc0-8929-be25ef2be878': {
        skalBrukes: true,
        tilretteleggingBehovFom: '2019-01-01',
        tilretteleggingDatoer: [{
          fom: '2019-01-01',
        }],
      },
    };
    const errors = validateForm(values, arbeidsforhold);

    expect(errors).is.eql({
      termindato: [{
        id: 'FodselOgTilretteleggingFaktaForm.TermindatoForDato',
      }],
      'BEDRIFT AS9109090880f70f2f2-79f8-4cc0-8929-be25ef2be878': {
        tilretteleggingBehovFom: [{
          id: 'FodselOgTilretteleggingFaktaForm.TermindatoForDato',
        }],
      },
    });
  });

  it('skal kunne godkjenne arbeidsforhold som har tilretteleggingBehovFom før termindato', () => {
    const values = {
      termindato: '2020-01-01',
      'BEDRIFT AS9109090880f70f2f2-79f8-4cc0-8929-be25ef2be878': {
        skalBrukes: true,
        tilretteleggingBehovFom: '2019-01-01',
        tilretteleggingDatoer: [{
          fom: '2019-01-01',
        }],
      },
    };
    const errors = validateForm(values, arbeidsforhold);

    expect(errors).is.eql({});
  });
});
