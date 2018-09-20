import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { MockFieldsWithContent } from 'testHelpers/redux-form-test-helper';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import { PeriodpickerField, SelectField, InputField } from '@fpsak-frontend/form';
import { createAndelnavn } from './FordelingAvBruttoBeregningsgrunnlagPanel';
import { createArbeidsperiodeString } from '../ArbeidsforholdHelper';

import { RenderBruttoBGFordelingFieldArrayImpl } from './RenderBruttoBGFordelingFieldArray';

const inntektskategorier = [
  {
    kode: 'ARBEIDSTAKER',
    navn: 'Arbeidstaker',
  },
  {
    kode: 'SELVSTENDIG_NÆRINGSDRIVENDE',
    navn: 'Selvstendig næringsdrivende',
  },
];

const andeltyper = [
  {
    kode: 'BRUKERS_ANDEL',
    navn: 'Brukers andel',
  },
  {
    kode: 'FRILANS',
    navn: 'Frilans',
  },
  {
    kode: 'EGEN_NÆRING',
    navn: 'Egen næring',
  },
];


describe('<RenderBruttoBGFordelingFieldArray>', () => {
  it('skal vise ein andel med eitt eksisterende arbeidsforhold', () => {
    const arbeidsforholdList = [
      {
        virksomhetNavn: 'Hansens bil og brems AS',
        virksomhetId: '12338',
        startDato: '2016-01-01',
        opphoersdato: '2018-04-01',
        arbeidsforholdId: '121424352',
        andelsnr: 1,
      },
    ];

    const andeler = [
      {
        arbeidsforhold: arbeidsforholdList[0],
        fordelingForrigeYtelse: 400000,
        refusjonskrav: 20000,
        inntektskategori: inntektskategorier[0],
      },
    ];

    const fieldArray = andeler.map(andel => ({
      andel: createAndelnavn(andel, inntektskategorier),
      arbeidsperiode: andel.arbeidsforhold ? createArbeidsperiodeString(andel.arbeidsforhold) : '',
      arbeidsperiodeFom: andel.arbeidsforhold.startdato,
      arbeidsperiodeTom: andel.arbeidsforhold.opphoersdato,
      fordelingForrigeYtelse: formatCurrencyNoKr(andel.fordelingForrigeYtelse),
      refusjonskrav: formatCurrencyNoKr(andel.refusjonskrav),
      inntektskategori: andel.inntektskategori ? inntektskategorier.filter(ik => ik.kode === andel.inntektskategori.kode)[0].kode : '',
      nyAndel: false,
    }));

    const fields = new MockFieldsWithContent('tilstøtendeYtelseAndeler', fieldArray);

    const wrapper = shallowWithIntl(<RenderBruttoBGFordelingFieldArrayImpl
      fields={fields}
      intl={intlMock}
      meta={{}}
      inntektskategoriKoder={inntektskategorier}
      andeltyper={andeltyper}
      arbeidsforholdList={arbeidsforholdList}
      readOnly={false}
      dekningsgrad={100}
      isAksjonspunktClosed={false}
    />);

    const inputFields = wrapper.find(InputField);
    expect(inputFields).has.length(4);

    const periodePickerFields = wrapper.find(PeriodpickerField);
    expect(periodePickerFields).has.length(1);

    const selectFields = wrapper.find(SelectField);
    expect(selectFields).has.length(1);

    const btn = wrapper.find('button');
    expect(btn).has.length(0);
  });


  it('skal vise to andeler med to eksisterende arbeidsforhold', () => {
    const arbeidsforholdList = [
      {
        virksomhetNavn: 'Hansens bil og brems AS',
        virksomhetId: '12338',
        startDato: '2016-01-01',
        opphoersdato: '2018-04-01',
        arbeidsforholdId: '121424352',
        andelsnr: 1,
      },
      {
        virksomhetNavn: 'Jensens bil og brems AS',
        virksomhetId: '23423423',
        startDato: '2016-01-01',
        opphoersdato: '2018-04-01',
        arbeidsforholdId: '6546546546',
        andelsnr: 2,
      },
    ];

    const andeler = [
      {
        arbeidsforhold: arbeidsforholdList[0],
        fordelingForrigeYtelse: 400000,
        refusjonskrav: 20000,
        inntektskategori: inntektskategorier[0],
        andelsnr: 1,
      },
      {
        arbeidsforhold: arbeidsforholdList[1],
        fordelingForrigeYtelse: 400000,
        refusjonskrav: 20000,
        inntektskategori: inntektskategorier[0],
        andelsnr: 2,
      },
    ];

    const fieldArray = andeler.map(andel => ({
      andel: createAndelnavn(andel, inntektskategorier),
      arbeidsperiode: andel.arbeidsforhold ? createArbeidsperiodeString(andel.arbeidsforhold) : '',
      arbeidsperiodeFom: andel.arbeidsforhold.startdato,
      arbeidsperiodeTom: andel.arbeidsforhold.opphoersdato,
      fordelingForrigeYtelse: formatCurrencyNoKr(andel.fordelingForrigeYtelse),
      refusjonskrav: formatCurrencyNoKr(andel.refusjonskrav),
      inntektskategori: andel.inntektskategori ? inntektskategorier.filter(ik => ik.kode === andel.inntektskategori.kode)[0].kode : '',
      nyAndel: false,
    }));

    const fields = new MockFieldsWithContent('tilstøtendeYtelseAndeler', fieldArray);

    const wrapper = shallowWithIntl(<RenderBruttoBGFordelingFieldArrayImpl
      fields={fields}
      intl={intlMock}
      meta={{}}
      inntektskategoriKoder={inntektskategorier}
      andeltyper={andeltyper}
      arbeidsforholdList={arbeidsforholdList}
      readOnly={false}
      dekningsgrad={100}
      isAksjonspunktClosed={false}
    />);

    const inputFields = wrapper.find(InputField);
    expect(inputFields).has.length(8);

    const periodePickerFields = wrapper.find(PeriodpickerField);
    expect(periodePickerFields).has.length(2);

    const selectFields = wrapper.find(SelectField);
    expect(selectFields).has.length(2);

    const btn = wrapper.find('button');
    expect(btn).has.length(0);
  });


  it('skal ikkje vise periode for SN', () => {
    const aktivitetstatuser = [{
      kode: 'SN',
      navn: 'Selvstendig næringsdrivende',
    }];

    const arbeidsforholdList = [
    ];

    const andeler = [
      {
        arbeidsforhold: null,
        fordelingForrigeYtelse: 400000,
        refusjonskrav: 20000,
        inntektskategori: inntektskategorier[1],
        aktivitetStatus: aktivitetstatuser[0],
        andelsnr: 1,
      },

    ];

    const fieldArray = andeler.map(andel => ({
      andel: createAndelnavn(andel, aktivitetstatuser),
      arbeidsperiode: andel.arbeidsforhold ? createArbeidsperiodeString(andel.arbeidsforhold) : '',
      arbeidsperiodeFom: andel.arbeidsforhold ? andel.arbeidsforhold.startdato : '',
      arbeidsperiodeTom: andel.arbeidsforhold ? andel.arbeidsforhold.opphoersdato : '',
      fordelingForrigeYtelse: formatCurrencyNoKr(andel.fordelingForrigeYtelse),
      refusjonskrav: formatCurrencyNoKr(andel.refusjonskrav),
      inntektskategori: andel.inntektskategori ? inntektskategorier.filter(ik => ik.kode === andel.inntektskategori.kode)[0].kode : '',
      nyAndel: false,
    }));

    const fields = new MockFieldsWithContent('tilstøtendeYtelseAndeler', fieldArray);

    const wrapper = shallowWithIntl(<RenderBruttoBGFordelingFieldArrayImpl
      fields={fields}
      intl={intlMock}
      meta={{}}
      inntektskategoriKoder={inntektskategorier}
      andeltyper={andeltyper}
      arbeidsforholdList={arbeidsforholdList}
      readOnly={false}
      dekningsgrad={100}
      isAksjonspunktClosed={false}
    />);

    const inputFields = wrapper.find(InputField);
    expect(inputFields).has.length(4);

    const periodePickerFields = wrapper.find(PeriodpickerField);
    expect(periodePickerFields).has.length(0);

    const selectFields = wrapper.find(SelectField);
    expect(selectFields).has.length(1);

    const btn = wrapper.find('button');
    expect(btn).has.length(0);
  });
});
