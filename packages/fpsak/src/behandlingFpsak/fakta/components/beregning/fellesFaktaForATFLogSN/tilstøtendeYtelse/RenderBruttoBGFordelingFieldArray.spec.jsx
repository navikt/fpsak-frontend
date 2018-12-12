import React from 'react';
import { expect } from 'chai';
import { intlMock, shallowWithIntl } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';
import { MockFieldsWithContent } from '@fpsak-frontend/assets/testHelpers/redux-form-test-helper';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import {
  InputField, NavFieldGroup, PeriodpickerField, SelectField,
} from '@fpsak-frontend/form';
import { createAndelnavn } from '../BgFordelingUtils';
import { createArbeidsperiodeString } from '../../ArbeidsforholdHelper';

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
        arbeidsgiverNavn: 'Hansens bil og brems AS',
        arbeidsgiverId: '12338',
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
      isBeregningFormDirty={false}
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
        arbeidsgiverNavn: 'Hansens bil og brems AS',
        arbeidsgiverId: '12338',
        startDato: '2016-01-01',
        opphoersdato: '2018-04-01',
        arbeidsforholdId: '121424352',
        andelsnr: 1,
      },
      {
        arbeidsgiverNavn: 'Jensens bil og brems AS',
        arbeidsgiverId: '23423423',
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
      isBeregningFormDirty={false}
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
      isBeregningFormDirty={false}
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


  it('skal vise errors når beregningForm er dirty', () => {
    const arbeidsforholdList = [
    ];
    const fieldArray = [];
    const fields = new MockFieldsWithContent('tilstøtendeYtelseAndeler', fieldArray);

    const meta = {
      error: [{ id: 'BeregningInfoPanel.EndringBG.Validation.LikFordeling' },
        { fordeling: '10 000' }],
      dirty: false,
      submitFailed: true,
    };

    const wrapper = shallowWithIntl(<RenderBruttoBGFordelingFieldArrayImpl
      fields={fields}
      intl={intlMock}
      meta={meta}
      inntektskategoriKoder={inntektskategorier}
      andeltyper={andeltyper}
      arbeidsforholdList={arbeidsforholdList}
      readOnly={false}
      dekningsgrad={100}
      isAksjonspunktClosed={false}
      isBeregningFormDirty
    />);

    const navFieldGroup = wrapper.find(NavFieldGroup);
    expect(navFieldGroup).has.length(1);
    expect(navFieldGroup.prop('errorMessage')).to.equal('Summen må være lik 10 000');
  });

  it('skal ikkje vise errors når beregningForm er dirty, men submitFailed er false', () => {
    const arbeidsforholdList = [
    ];
    const fieldArray = [];
    const fields = new MockFieldsWithContent('tilstøtendeYtelseAndeler', fieldArray);

    const meta = {
      error: [{ id: 'BeregningInfoPanel.EndringBG.Validation.LikFordeling' },
        { fordeling: '10 000' }],
      dirty: false,
      submitFailed: false,
    };

    const wrapper = shallowWithIntl(<RenderBruttoBGFordelingFieldArrayImpl
      fields={fields}
      intl={intlMock}
      meta={meta}
      inntektskategoriKoder={inntektskategorier}
      andeltyper={andeltyper}
      arbeidsforholdList={arbeidsforholdList}
      readOnly={false}
      dekningsgrad={100}
      isAksjonspunktClosed={false}
      isBeregningFormDirty
    />);

    const navFieldGroup = wrapper.find(NavFieldGroup);
    expect(navFieldGroup).has.length(1);
    expect(navFieldGroup.prop('errorMessage')).to.equal(null);
  });


  it('skal ikkje vise errors når beregningForm er dirty, men errors er undefined', () => {
    const arbeidsforholdList = [
    ];
    const fieldArray = [];
    const fields = new MockFieldsWithContent('tilstøtendeYtelseAndeler', fieldArray);

    const meta = {
      error: undefined,
      dirty: true,
      submitFailed: true,
    };

    const wrapper = shallowWithIntl(<RenderBruttoBGFordelingFieldArrayImpl
      fields={fields}
      intl={intlMock}
      meta={meta}
      inntektskategoriKoder={inntektskategorier}
      andeltyper={andeltyper}
      arbeidsforholdList={arbeidsforholdList}
      readOnly={false}
      dekningsgrad={100}
      isAksjonspunktClosed={false}
      isBeregningFormDirty
    />);

    const navFieldGroup = wrapper.find(NavFieldGroup);
    expect(navFieldGroup).has.length(1);
    expect(navFieldGroup.prop('errorMessage')).to.equal(null);
  });
});
