import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { DatepickerField, TextAreaField } from '@fpsak-frontend/form';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';

import AlertStripe from 'nav-frontend-alertstriper';
import { FodselOgTilretteleggingFaktaForm } from './FodselOgTilretteleggingFaktaForm';
import TilretteleggingArbeidsforholdSection from './tilrettelegging/TilretteleggingArbeidsforholdSection';

const arbeidsforhold = [
  {
    arbeidsforholdReferanse: '0f70f2f2-79f8-4cc0-8929-be25ef2be878',
    arbeidsgiverIdent: '910909088',
    arbeidsgiverNavn: 'BEDRIFT AS',
    begrunnelse: null,
    kopiertFraTidligereBehandling: false,
    mottattTidspunkt: '2019-10-09T12:52:10.596311',
    opplysningerOmRisiko: null,
    opplysningerOmTilrettelegging: null,
    skalBrukes: true,
    tilretteleggingBehovFom: '2019-09-15',
    tilretteleggingDatoer: [],
    tilretteleggingId: 1000303,
  },
  {
    arbeidsforholdReferanse: 'fb74d757-6bd3-4ed3-a1f4-c2424ebb64d5',
    arbeidsgiverIdent: '910909088',
    arbeidsgiverNavn: 'BEDRIFT AS',
    begrunnelse: null,
    kopiertFraTidligereBehandling: false,
    mottattTidspunkt: '2019-10-09T12:52:10.596311',
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
});
