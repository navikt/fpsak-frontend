import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { RadioOption } from '@fpsak-frontend/form';
import arbeidsforholdHandling from '@fpsak-frontend/kodeverk/src/arbeidsforholdHandling';
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
  lagtTilAvSaksbehandler: false,
  permisjoner: undefined,
};

describe('<ArbeidsforholdRadioknapper>', () => {
  it('Skal ikke vise radioknapper for aktivt arbeidsforhold når mottatt IM', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding
      arbeidsforhold={arbeidsforhold}
      aktivtArbeidsforholdTillatUtenIM={false}
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
    />);
    expect(wrapper.find('[name=\'arbeidsforholdHandlingField\']')).has.length(1);
    expect(wrapper.find('[name=\'aktivtArbeidsforholdHandlingField\']')).has.length(0);
  });
  it('skal vise radioknapper når aktivt arbeidsforhold, uten IM, fom før stp, tom etter stp', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding={false}
      arbeidsforhold={arbeidsforhold}
      aktivtArbeidsforholdTillatUtenIM={false}
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
    />);
    expect(wrapper.find('[name=\'arbeidsforholdHandlingField\']')).has.length(1);
    expect(wrapper.find('[name=\'aktivtArbeidsforholdHandlingField\']')).has.length(1);
    const radioOptions = wrapper.find(RadioOption);
    expect(radioOptions).has.length(5);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivt');
    expect(radioOptions.get(0).props.disabled).to.eql(false);
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.AvslaYtelseManglendeOpplysninger');
    expect(radioOptions.get(1).props.disabled).to.eql(false);
    expect(radioOptions.get(2).props.label.id).to.eql('PersonArbeidsforholdDetailForm.InntektIkkeMedIBeregningsgrunnlaget');
    expect(radioOptions.get(2).props.disabled).to.eql(false);
    expect(radioOptions.get(3).props.label.id).to.eql('PersonArbeidsforholdDetailForm.BenyttAInntektIBeregningsgrunnlag');
    expect(radioOptions.get(3).props.disabled).to.eql(true);
    expect(radioOptions.get(4).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdetErIkkeAktivt');
    expect(radioOptions.get(4).props.disabled).to.eql(true);
  });
  it('skal vise radioknapper når aktivt arbeidsforhold, uten IM, fom før stp, tom samtidig som stp', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding={false}
      arbeidsforhold={{
        ...arbeidsforhold,
        tomDato: '2019-01-01',
      }}
      aktivtArbeidsforholdTillatUtenIM={false}
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
    />);
    const radiogroup = wrapper.find('[name=\'aktivtArbeidsforholdHandlingField\']');
    expect(radiogroup).has.length(1);
    const radioOptions = wrapper.find(RadioOption);
    expect(radioOptions).has.length(4);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivt');
    expect(radioOptions.get(0).props.disabled).to.eql(false);
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.AvslaYtelseManglendeOpplysninger');
    expect(radioOptions.get(1).props.disabled).to.eql(false);
    expect(radioOptions.get(2).props.label.id).to.eql('PersonArbeidsforholdDetailForm.BenyttAInntektIBeregningsgrunnlag');
    expect(radioOptions.get(2).props.disabled).to.eql(true);
    expect(radioOptions.get(3).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdetErIkkeAktivt');
    expect(radioOptions.get(3).props.disabled).to.eql(true);
  });
  it('skal vise radioknapper når aktivt arbeidsforhold, uten IM, fom før stp, tom undefined', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding={false}
      arbeidsforhold={{
        ...arbeidsforhold,
        tomDato: undefined,
      }}
      aktivtArbeidsforholdTillatUtenIM={false}
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
    />);
    const radiogroup = wrapper.find('[name=\'aktivtArbeidsforholdHandlingField\']');
    expect(radiogroup).has.length(1);
    const radioOptions = wrapper.find(RadioOption);
    expect(radioOptions).has.length(5);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivt');
    expect(radioOptions.get(0).props.disabled).to.eql(false);
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.AvslaYtelseManglendeOpplysninger');
    expect(radioOptions.get(1).props.disabled).to.eql(false);
    expect(radioOptions.get(2).props.label.id).to.eql('PersonArbeidsforholdDetailForm.InntektIkkeMedIBeregningsgrunnlaget');
    expect(radioOptions.get(2).props.disabled).to.eql(false);
    expect(radioOptions.get(3).props.label.id).to.eql('PersonArbeidsforholdDetailForm.BenyttAInntektIBeregningsgrunnlag');
    expect(radioOptions.get(3).props.disabled).to.eql(true);
    expect(radioOptions.get(4).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdetErIkkeAktivt');
    expect(radioOptions.get(4).props.disabled).to.eql(true);
  });
  it('skal vise radioknapper når aktivt arbeidsforhold, uten IM, fom etter stp, tom undefined', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding={false}
      arbeidsforhold={{
        ...arbeidsforhold,
        fomDato: '2019-08-01',
        tomDato: undefined,
      }}
      aktivtArbeidsforholdTillatUtenIM={false}
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
    />);
    const radiogroup = wrapper.find('[name=\'aktivtArbeidsforholdHandlingField\']');
    expect(radiogroup).has.length(1);
    const radioOptions = wrapper.find(RadioOption);
    expect(radioOptions).has.length(4);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivt');
    expect(radioOptions.get(0).props.disabled).to.eql(false);
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.AvslaYtelseManglendeOpplysninger');
    expect(radioOptions.get(1).props.disabled).to.eql(false);
    expect(radioOptions.get(2).props.label.id).to.eql('PersonArbeidsforholdDetailForm.BenyttAInntektIBeregningsgrunnlag');
    expect(radioOptions.get(2).props.disabled).to.eql(true);
    expect(radioOptions.get(3).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdetErIkkeAktivt');
    expect(radioOptions.get(3).props.disabled).to.eql(true);
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
      aktivtArbeidsforholdTillatUtenIM
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.OVERSTYR_TOM}
    />);
    const overstyrtTom = wrapper.find('[name=\'overstyrtTom\']');
    expect(overstyrtTom).has.length(1);
    const radioOptions = wrapper.find('RadioOption');
    expect(radioOptions).has.length(2);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivt');
    expect(radioOptions.get(0).props.disabled).to.eql(false);
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
      aktivtArbeidsforholdTillatUtenIM
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.OVERSTYR_TOM}
    />);
    const overstyrtTom = wrapper.find('[name=\'overstyrtTom\']');
    expect(overstyrtTom).has.length(1);
    const radioOptions = wrapper.find('RadioOption');
    expect(radioOptions).has.length(2);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivt');
    expect(radioOptions.get(0).props.disabled).to.eql(false);
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
      aktivtArbeidsforholdTillatUtenIM
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.FJERN_ARBEIDSFORHOLD}
    />);
    const radioOptions = wrapper.find('RadioOption');
    expect(radioOptions).has.length(2);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivt');
    expect(radioOptions.get(0).props.disabled).to.eql(false);
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.FjernArbeidsforholdet');
    expect(radioOptions.get(1).props.disabled).to.eql(false);
    expect(wrapper.find('[name=\'overstyrtTom\']')).has.length(0);
  });
  it('Skal vise RadioOption knapper som er enabled hvis lagt til av saksbehandler', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding={false}
      arbeidsforhold={{
        ...arbeidsforhold,
        lagtTilAvSaksbehandler: true,
      }}
      aktivtArbeidsforholdTillatUtenIM
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
    />);
    const radiogroup = wrapper.find('[name=\'aktivtArbeidsforholdHandlingField\']');
    expect(radiogroup).has.length(1);
    const radioOptions = wrapper.find(RadioOption);
    expect(radioOptions).has.length(5);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivt');
    expect(radioOptions.get(0).props.disabled).to.eql(false);
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.AvslaYtelseManglendeOpplysninger');
    expect(radioOptions.get(1).props.disabled).to.eql(true);
    expect(radioOptions.get(2).props.label.id).to.eql('PersonArbeidsforholdDetailForm.InntektIkkeMedIBeregningsgrunnlaget');
    expect(radioOptions.get(2).props.disabled).to.eql(true);
    expect(radioOptions.get(3).props.label.id).to.eql('PersonArbeidsforholdDetailForm.BenyttAInntektIBeregningsgrunnlag');
    expect(radioOptions.get(3).props.disabled).to.eql(false);
    expect(radioOptions.get(4).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdetErIkkeAktivt');
    expect(radioOptions.get(4).props.disabled).to.eql(true);
  });
  it('Skal vise utvidet RadioOptions for aktivt arbeidsforhold når arbeidsforholdet har permisjon uten tom og ikke mottatt IM', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding={false}
      arbeidsforhold={{
        ...arbeidsforhold,
        permisjoner: [
          {
            permisjonFom: '2018-10-10',
            permisjonTom: undefined,
            permisjonsprosent: 100,
            permisjonsÅrsak: 'aarsak',
          },
        ],
      }}
      aktivtArbeidsforholdTillatUtenIM
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
    />);
    const radioOptions = wrapper.find('RadioOption');
    expect(radioOptions).has.length(5);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivtOgHarPermisjonMenSoekerErIkkePermisjon');
    expect(radioOptions.get(0).props.disabled).to.eql(false);
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.AvslaYtelseManglendeOpplysninger');
    expect(radioOptions.get(1).props.disabled).to.eql(false);
    expect(radioOptions.get(2).props.label.id).to.eql('PersonArbeidsforholdDetailForm.InntektIkkeMedIBeregningsgrunnlaget');
    expect(radioOptions.get(2).props.disabled).to.eql(false);
    expect(radioOptions.get(3).props.label.id).to.eql('PersonArbeidsforholdDetailForm.BenyttAInntektIBeregningsgrunnlag');
    expect(radioOptions.get(3).props.disabled).to.eql(false);
    expect(radioOptions.get(4).props.label.id).to.eql('PersonArbeidsforholdDetailForm.SokerErIPermisjon');
    expect(radioOptions.get(4).props.disabled).to.eql(false);
  });
  it('Skal ikke vise utvidet RadioOptions for aktivt arbeidsforhold når arbeidsforholdet har permisjon uten tom og mottatt IM', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding
      arbeidsforhold={{
        ...arbeidsforhold,
        permisjoner: [
          {
            permisjonFom: '2018-10-10',
            permisjonTom: undefined,
            permisjonsprosent: 100,
            permisjonsÅrsak: 'aarsak',
          },
        ],
      }}
      aktivtArbeidsforholdTillatUtenIM
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
    />);
    const radioOptions = wrapper.find('RadioOption');
    expect(radioOptions).has.length(2);
    expect(radioOptions.get(0).props.disabled).to.eql(false);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivtOgHarPermisjonMenSoekerErIkkePermisjon');
    expect(radioOptions.get(1).props.disabled).to.eql(false);
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.SokerErIPermisjon');
  });
  it('Skal vise utvidet RadioOptions for aktivt arbeidsforhold når arbeidsforholdet har permisjon med tom og ikke mottatt IM', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding={false}
      arbeidsforhold={{
        ...arbeidsforhold,
        permisjoner: [
          {
            permisjonFom: '2018-10-10',
            permisjonTom: '2025-10-10',
            permisjonsprosent: 100,
            permisjonsÅrsak: 'aarsak',
          },
        ],
      }}
      aktivtArbeidsforholdTillatUtenIM
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
    />);
    const radioOptions = wrapper.find('RadioOption');
    expect(radioOptions).has.length(5);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivtOgHarPermisjonMenSoekerErIkkePermisjon');
    expect(radioOptions.get(0).props.disabled).to.eql(false);
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.AvslaYtelseManglendeOpplysninger');
    expect(radioOptions.get(1).props.disabled).to.eql(false);
    expect(radioOptions.get(2).props.label.id).to.eql('PersonArbeidsforholdDetailForm.InntektIkkeMedIBeregningsgrunnlaget');
    expect(radioOptions.get(2).props.disabled).to.eql(false);
    expect(radioOptions.get(3).props.label.id).to.eql('PersonArbeidsforholdDetailForm.BenyttAInntektIBeregningsgrunnlag');
    expect(radioOptions.get(3).props.disabled).to.eql(false);
    expect(radioOptions.get(4).props.label.id).to.eql('PersonArbeidsforholdDetailForm.SokerErIPermisjon');
    expect(radioOptions.get(4).props.disabled).to.eql(false);
  });
  it('Skal ikke vise utvidet RadioOptions for aktivt arbeidsforhold når arbeidsforholdet har permisjon med tom og mottatt IM', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding
      arbeidsforhold={{
        ...arbeidsforhold,
        permisjoner: [
          {
            permisjonFom: '2018-10-10',
            permisjonTom: '2025-10-10',
            permisjonsprosent: 100,
            permisjonsÅrsak: 'aarsak',
          },
        ],
      }}
      aktivtArbeidsforholdTillatUtenIM
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
    />);
    const radioOptions = wrapper.find('RadioOption');
    expect(radioOptions).has.length(2);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivtOgHarPermisjonMenSoekerErIkkePermisjon');
    expect(radioOptions.get(0).props.disabled).to.eql(false);
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.SokerErIPermisjon');
    expect(radioOptions.get(1).props.disabled).to.eql(false);
  });
  it('Skal vise utvidet RadioOptions for aktivt arbeidsforhold når arbeidsforholdet har flere permisjoner uten mottatt IM, '
    + 'samt disable knapp hvor saksbehandler kan velge at soeker er i permisjon', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding={false}
      arbeidsforhold={{
        ...arbeidsforhold,
        permisjoner: [
          {
            permisjonFom: '2018-10-10',
            permisjonTom: undefined,
            permisjonsprosent: 100,
            permisjonsÅrsak: 'aarsak',
          },
          {
            permisjonFom: '2018-10-10',
            permisjonTom: '2025-10-10',
            permisjonsprosent: 100,
            permisjonsÅrsak: 'aarsak',
          },
        ],
      }}
      aktivtArbeidsforholdTillatUtenIM
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
    />);
    const radioOptions = wrapper.find('RadioOption');
    expect(radioOptions).has.length(5);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivtOgHarPermisjonMenSoekerErIkkePermisjon');
    expect(radioOptions.get(0).props.disabled).to.eql(false);
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.AvslaYtelseManglendeOpplysninger');
    expect(radioOptions.get(1).props.disabled).to.eql(false);
    expect(radioOptions.get(2).props.label.id).to.eql('PersonArbeidsforholdDetailForm.InntektIkkeMedIBeregningsgrunnlaget');
    expect(radioOptions.get(2).props.disabled).to.eql(false);
    expect(radioOptions.get(3).props.label.id).to.eql('PersonArbeidsforholdDetailForm.BenyttAInntektIBeregningsgrunnlag');
    expect(radioOptions.get(3).props.disabled).to.eql(false);
    expect(radioOptions.get(4).props.label.id).to.eql('PersonArbeidsforholdDetailForm.SokerErIPermisjon');
    expect(radioOptions.get(4).props.disabled).to.eql(true);
  });
  it('Skal vise utvidet RadioOptions for aktivt arbeidsforhold når arbeidsforholdet har flere permisjoner og mottatt IM, '
    + 'samt disable knapp hvor saksbehandler kan velge at soeker er i permisjon', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding
      arbeidsforhold={{
        ...arbeidsforhold,
        permisjoner: [
          {
            permisjonFom: '2018-10-10',
            permisjonTom: undefined,
            permisjonsprosent: 100,
            permisjonsÅrsak: 'aarsak',
          },
          {
            permisjonFom: '2018-10-10',
            permisjonTom: '2025-10-10',
            permisjonsprosent: 100,
            permisjonsÅrsak: 'aarsak',
          },
        ],
      }}
      aktivtArbeidsforholdTillatUtenIM
      arbeidsforholdHandlingVerdi={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
    />);
    const radioOptions = wrapper.find('RadioOption');
    expect(radioOptions).has.length(2);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivtOgHarPermisjonMenSoekerErIkkePermisjon');
    expect(radioOptions.get(0).props.disabled).to.eql(false);
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.SokerErIPermisjon');
    expect(radioOptions.get(1).props.disabled).to.eql(true);
  });
  it('skal kun vise to RadioOptions når arbeidsforholdhandling er undefined', () => {
    const wrapper = shallowWithIntl(<ArbeidsforholdRadioknapper
      readOnly={false}
      formName=""
      hasReceivedInntektsmelding={false}
      arbeidsforhold={{
        ...arbeidsforhold,
      }}
      aktivtArbeidsforholdTillatUtenIM
      arbeidsforholdHandlingVerdi={undefined}
    />);
    const radioOptions = wrapper.find('RadioOption');
    expect(radioOptions).has.length(2);
    expect(radioOptions.get(0).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivt');
    expect(radioOptions.get(0).props.disabled).to.eql(false);
    expect(radioOptions.get(1).props.label.id).to.eql('PersonArbeidsforholdDetailForm.ArbeidsforholdetErIkkeAktivt');
    expect(radioOptions.get(1).props.disabled).to.eql(true);
  });
});
