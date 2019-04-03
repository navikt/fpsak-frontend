import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { RadioOption } from '@fpsak-frontend/form';
import ArbeidsforholdRadioknapper from './ArbeidsforholdRadioknapper';

const arbeidsforhold = {
  id: '1',
  arbeidsforholdId: '1231-2345',
  navn: 'Svendsen Eksos',
  arbeidsgiverIdentifikator: '1234567',
  arbeidsgiverIdentifiktorGUI: '1234567',
  fomDato: '2012-01-01',
  tomDato: '2025-01-01',
  kilde: {
    kode: 'INNTEKT',
    navn: 'aa-registeret',
  },
  mottattDatoInntektsmelding: undefined,
  brukArbeidsforholdet: true,
  erNyttArbeidsforhold: undefined,
  erstatterArbeidsforholdId: undefined,
  tilVurdering: true,
  skjaeringstidspunkt: '2019-01-01',
};

describe('<ArbeidsforholdRadioknapper>', () => {
  it('Skal ikke vise radioknapper for aktivt arbeidsforhold når mottatt IM', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding
      arbeidsforhold={arbeidsforhold}
      skalKunneLeggeTilNyeArbeidsforhold={false}
      aktivtArbeidsforholdTillatUtenIM={false}
      skalBrukeUendretForhold
    />);
    expect(wrapper.find('[name=\'brukUendretArbeidsforhold\']')).has.length(1);
    expect(wrapper.find('[name=\'aktivtArbeidsforholdHandlingField\']')).has.length(0);
  });
  it('skal vise radioknapper når uendret arbeidsforhold, uten IM, fom før stp, tom etter stp', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding={false}
      arbeidsforhold={arbeidsforhold}
      skalKunneLeggeTilNyeArbeidsforhold={false}
      aktivtArbeidsforholdTillatUtenIM={false}
      skalBrukeUendretForhold
    />);
    expect(wrapper.find('[name=\'brukUendretArbeidsforhold\']')).has.length(1);
    expect(wrapper.find('[name=\'aktivtArbeidsforholdHandlingField\']')).has.length(1);
    const radioOptions = wrapper.find(RadioOption);
    expect(radioOptions).has.length(5);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforhoildErAktivt');
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.AvslaYtelseManglendeOpplysninger');
    expect(radioOptions.get(2).props.label.id).to.eql('PersonArbeidsforholdDetailForm.InntektIkkeMedIBeregningsgrunnlaget');
    expect(radioOptions.get(3).props.label.id).to.eql('PersonArbeidsforholdDetailForm.FortsettBehandling');
    expect(radioOptions.get(4).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdetErIkkeAktivt');
  });
  it('skal vise radioknapper når uendret arbeidsforhold, uten IM, fom før stp, tom samtidig som stp', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding={false}
      arbeidsforhold={{
        ...arbeidsforhold,
        tomDato: '2019-01-01',
      }}
      skalKunneLeggeTilNyeArbeidsforhold={false}
      aktivtArbeidsforholdTillatUtenIM={false}
      skalBrukeUendretForhold
    />);
    const radiogroup = wrapper.find('[name=\'aktivtArbeidsforholdHandlingField\']');
    expect(radiogroup).has.length(1);
    const radioOptions = wrapper.find(RadioOption);
    expect(radioOptions).has.length(4);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforhoildErAktivt');
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.AvslaYtelseManglendeOpplysninger');
    expect(radioOptions.get(2).props.label.id).to.eql('PersonArbeidsforholdDetailForm.FortsettBehandling');
    expect(radioOptions.get(3).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdetErIkkeAktivt');
  });
  it('skal vise radioknapper når uendret arbeidsforhold, uten IM, fom før stp, tom undefined', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding={false}
      arbeidsforhold={{
        ...arbeidsforhold,
        tomDato: undefined,
      }}
      skalKunneLeggeTilNyeArbeidsforhold={false}
      aktivtArbeidsforholdTillatUtenIM={false}
      skalBrukeUendretForhold
    />);
    const radiogroup = wrapper.find('[name=\'aktivtArbeidsforholdHandlingField\']');
    expect(radiogroup).has.length(1);
    const radioOptions = wrapper.find(RadioOption);
    expect(radioOptions).has.length(5);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforhoildErAktivt');
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.AvslaYtelseManglendeOpplysninger');
    expect(radioOptions.get(2).props.label.id).to.eql('PersonArbeidsforholdDetailForm.InntektIkkeMedIBeregningsgrunnlaget');
    expect(radioOptions.get(3).props.label.id).to.eql('PersonArbeidsforholdDetailForm.FortsettBehandling');
    expect(radioOptions.get(4).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdetErIkkeAktivt');
  });
  it('skal vise radioknapper når uendret arbeidsforhold, uten IM, fom etter stp, tom undefined', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding={false}
      arbeidsforhold={{
        ...arbeidsforhold,
        fomDato: '2019-08-01',
        tomDato: undefined,
      }}
      skalKunneLeggeTilNyeArbeidsforhold={false}
      aktivtArbeidsforholdTillatUtenIM={false}
      skalBrukeUendretForhold
    />);
    const radiogroup = wrapper.find('[name=\'aktivtArbeidsforholdHandlingField\']');
    expect(radiogroup).has.length(1);
    const radioOptions = wrapper.find(RadioOption);
    expect(radioOptions).has.length(4);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforhoildErAktivt');
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.AvslaYtelseManglendeOpplysninger');
    expect(radioOptions.get(2).props.label.id).to.eql('PersonArbeidsforholdDetailForm.FortsettBehandling');
    expect(radioOptions.get(3).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdetErIkkeAktivt');
  });
  it('Skal vise enablet overstyrtTom picker, uten IM, tomDato lik stp, med brukJustertePerioder', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding={false}
      arbeidsforhold={{
        ...arbeidsforhold,
        tomDato: '2019-01-01',
        brukMedJustertPeriode: true,
      }}
      skalKunneLeggeTilNyeArbeidsforhold={false}
      aktivtArbeidsforholdTillatUtenIM
      skalBrukeUendretForhold={false}
    />);
    const overstyrtTom = wrapper.find('[name=\'overstyrtTom\']');
    expect(overstyrtTom).has.length(1);
    const radioOptions = wrapper.find('RadioOption');
    expect(radioOptions).has.length(2);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforhoildErAktivt');
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdetErIkkeAktivt');
    expect(radioOptions.get(1).props.disabled).to.eql(false);
  });
  it('Skal vise disablet overstyrtTom picker, uten IM, tomDato lik stp, ikke med brukJustertPerioder', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding={false}
      arbeidsforhold={{
        ...arbeidsforhold,
        tomDato: '2019-01-01',
        brukMedJustertPeriode: false,
      }}
      skalKunneLeggeTilNyeArbeidsforhold={false}
      aktivtArbeidsforholdTillatUtenIM
      skalBrukeUendretForhold={false}
    />);
    const overstyrtTom = wrapper.find('[name=\'overstyrtTom\']');
    expect(overstyrtTom).has.length(1);
    const radioOptions = wrapper.find('RadioOption');
    expect(radioOptions).has.length(2);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforhoildErAktivt');
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdetErIkkeAktivt');
    expect(radioOptions.get(1).props.disabled).to.eql(true);
  });
  it('Skal vise RadioOption for fjerning av arbeidsforhold når arbeidsforhold ikke fra AA-reg', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding={false}
      arbeidsforhold={{
        ...arbeidsforhold,
        kilde: {
          kode: 'INNTEKT',
          navn: 'noen-annet',
        },
      }}
      skalKunneLeggeTilNyeArbeidsforhold={false}
      aktivtArbeidsforholdTillatUtenIM
      skalBrukeUendretForhold={false}
    />);
    const radioOptions = wrapper.find('RadioOption');
    expect(radioOptions).has.length(2);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforhoildErAktivt');
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdIkkeRelevant');
    expect(wrapper.find('[name=\'overstyrtTom\']')).has.length(0);
  });
});
