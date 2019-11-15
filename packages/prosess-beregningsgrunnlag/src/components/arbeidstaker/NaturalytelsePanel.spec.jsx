import React from 'react';
import { expect } from 'chai';

import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import NaturalytelsePanel, { createNaturalytelseTableData } from './NaturalytelsePanel';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-prosess-beregningsgrunnlag';

const bgPerioder = [
  {
    periodeAarsaker: [{
      kode: periodeAarsak.UDEFINERT,
    }],
    beregningsgrunnlagPeriodeFom: '2018-06-01',
    beregningsgrunnlagPrStatusOgAndel: [
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '123',
          arbeidsforholdId: '123',
        },
      },
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '456',
          arbeidsforholdId: '456',
        },
      },
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '789',
          arbeidsforholdId: '789',
        },
      },
    ],
  },
  {
    periodeAarsaker: [{
      kode: periodeAarsak.NATURALYTELSE_BORTFALT,
    }],
    beregningsgrunnlagPeriodeFom: '2018-07-01',
    beregningsgrunnlagPrStatusOgAndel: [
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '123',
          arbeidsforholdId: '123',
        },
      },
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        bortfaltNaturalytelse: 10000,
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '456',
          arbeidsforholdId: '456',
        },
      },
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        bortfaltNaturalytelse: 70000,
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '789',
          arbeidsforholdId: '789',
        },
      },
    ],
  },
  {
    periodeAarsaker: [{
      kode: periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET,
    }],
    beregningsgrunnlagPeriodeFom: '2018-08-01',
    beregningsgrunnlagPrStatusOgAndel: [
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '123',
          arbeidsforholdId: '123',
        },
      },
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        bortfaltNaturalytelse: 70000,
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '456',
          arbeidsforholdId: '456',
        },
      },
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        bortfaltNaturalytelse: 10000,
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '789',
          arbeidsforholdId: '789',
        },
      },
    ],
  },
  {
    periodeAarsaker: [{
      kode: periodeAarsak.NATURALYTELSE_BORTFALT,
    }],
    beregningsgrunnlagPeriodeFom: '2018-09-01',
    beregningsgrunnlagPrStatusOgAndel: [
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        bortfaltNaturalytelse: 50000,
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '123',
          arbeidsforholdId: '123',
        },
      },
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '456',
          arbeidsforholdId: '456',
        },
      },
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '789',
          arbeidsforholdId: '789',
        },
      },
    ],
  },
];

describe('<NaturalytelsePanel>', () => {
  it('Skal tabell for riktig antall rader', () => {
    const wrapper = shallowWithIntl(<NaturalytelsePanel
      allePerioder={bgPerioder}
    />);
    const rows = wrapper.find('TableRow');
    expect(rows.length).to.equal(3);
  });

  xit('Skal teste at innholdet i radene er korrekt fordelt', () => {
    const wrapper = shallowWithIntl(<NaturalytelsePanel
      allePerioder={bgPerioder}
    />);
    const rows = wrapper.find('TableRow');
    // Første rad
    expect(rows.find('Normaltekst').at(0).childAt(0).text()).to.equal('arbeidsgiver');
    expect(rows.find('Normaltekst').at(1).childAt(0).text()).to.equal(' ');
    expect(rows.find('Normaltekst').at(2).childAt(0).text()).to.equal('50 000');

    // Andre rad
    expect(rows.find('Normaltekst').at(3).childAt(0).text()).to.equal('arbeidsgiver');
    expect(rows.find('Normaltekst').at(4).childAt(0).text()).to.equal('10 000');
    expect(rows.find('Normaltekst').at(5).childAt(0).text()).to.equal(' ');

    // Tredje rad
    expect(rows.find('Normaltekst').at(6).childAt(0).text()).to.equal('arbeidsgiver');
    expect(rows.find('Normaltekst').at(7).childAt(0).text()).to.equal('70 000');
    expect(rows.find('Normaltekst').at(8).childAt(0).text()).to.equal(' ');
  });

  it('Skal teste at selector lager forventet objekt ut av en liste med '
    + 'beregningsgrunnlagperioder som inneholder naturalytelser', () => {
    const expectedReturnObject = {
      arbeidsforholdPeriodeMap: {
        arbeidsgiver123: ['arbeidsgiver', ' ', '50 000'],
        arbeidsgiver456: ['arbeidsgiver', '10 000', ' '],
        arbeidsgiver789: ['arbeidsgiver', '70 000', ' '],

      },
      headers: ['2018-07-01', '2018-09-01'],
    };
    const selectorResult = createNaturalytelseTableData(bgPerioder);
    expect(selectorResult).to.deep.equal(expectedReturnObject);
  });
});
