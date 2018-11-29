import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/assets/testHelpers//intl-enzyme-test-helper';

import aktivitetStatus from 'kodeverk/aktivitetStatus';
import periodeAarsak from 'kodeverk/periodeAarsak';
import NaturalytelsePanel, { createNaturalytelseTableData } from './NaturalytelsePanel';


const bortfaltYtlelseP1 = 85000;
const bortfaltYtelseP2 = 32000;
const bortfaltYtelseP3 = 66000;

const tableData = {
  arbeidsforholdPeriodeMap: {
    ag1: ['Første arbeidsgiver', bortfaltYtlelseP1, ' ', bortfaltYtelseP3],
    ag2: ['Andre arbeidsgiver', ' ', bortfaltYtelseP2, ' '],
    ag3: ['Tredje arbeidsgiver', ' ', ' ', bortfaltYtelseP3],
  },
  headers: [' ', ' ', ' ', ' '],
};

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
    const wrapper = shallowWithIntl(<NaturalytelsePanel.WrappedComponent
      tableData={tableData}
    />);
    const rows = wrapper.find('TableRow');
    expect(rows.length).to.equal(3);
  });

  it('Skal teste at innholdet i radene er korrekt fordelt', () => {
    const wrapper = shallowWithIntl(<NaturalytelsePanel.WrappedComponent
      tableData={tableData}
    />);
    const rows = wrapper.find('TableRow');
    // Første rad
    expect(rows.find('Normaltekst').at(0).childAt(0).text()).to.equal('Første arbeidsgiver');
    expect(rows.find('Normaltekst').at(1).childAt(0).text()).to.equal(bortfaltYtlelseP1.toString());
    expect(rows.find('Normaltekst').at(2).childAt(0).text()).to.equal(' ');
    expect(rows.find('Normaltekst').at(3).childAt(0).text()).to.equal(bortfaltYtelseP3.toString());

    // Andre rad
    expect(rows.find('Normaltekst').at(4).childAt(0).text()).to.equal('Andre arbeidsgiver');
    expect(rows.find('Normaltekst').at(5).childAt(0).text()).to.equal(' ');
    expect(rows.find('Normaltekst').at(6).childAt(0).text()).to.equal(bortfaltYtelseP2.toString());
    expect(rows.find('Normaltekst').at(7).childAt(0).text()).to.equal(' ');

    // Tredje rad
    expect(rows.find('Normaltekst').at(8).childAt(0).text()).to.equal('Tredje arbeidsgiver');
    expect(rows.find('Normaltekst').at(9).childAt(0).text()).to.equal(' ');
    expect(rows.find('Normaltekst').at(10).childAt(0).text()).to.equal(' ');
    expect(rows.find('Normaltekst').at(11).childAt(0).text()).to.equal(bortfaltYtelseP3.toString());
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
    const selectorResult = createNaturalytelseTableData.resultFunc(bgPerioder);
    expect(selectorResult).to.deep.equal(expectedReturnObject);
  });
});
