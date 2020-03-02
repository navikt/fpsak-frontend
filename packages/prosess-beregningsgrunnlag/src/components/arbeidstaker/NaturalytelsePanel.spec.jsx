import React from 'react';
import { expect } from 'chai';

import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import NaturalytelsePanel, { createNaturalytelseTableData } from './NaturalytelsePanel';

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
          arbeidsgiverNavn: 'arbeidsgiver1',
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
          arbeidsgiverNavn: 'arbeidsgiver2',
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
          arbeidsgiverNavn: 'arbeidsgiver3',
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
          arbeidsgiverNavn: 'arbeidsgiver1',
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
          arbeidsgiverNavn: 'arbeidsgiver2',
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
          arbeidsgiverNavn: 'arbeidsgiver3',
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
    beregningsgrunnlagPeriodeTom: '2018-12-01',
    beregningsgrunnlagPrStatusOgAndel: [
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        bortfaltNaturalytelse: 50000,
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver1',
          arbeidsgiverId: '123',
          arbeidsforholdId: '123',
        },
      },
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver2',
          arbeidsgiverId: '456',
          arbeidsforholdId: '456',
        },
      },
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver3',
          arbeidsgiverId: '789',
          arbeidsforholdId: '789',
        },
      },
    ],
  },
];

describe('<NaturalytelsePanel>', () => {
  it('Skal teste for riktig antall rader', () => {
    const wrapper = shallowWithIntl(<NaturalytelsePanel
      allePerioder={bgPerioder}
    />);
    const rows = wrapper.find('Row');
    expect(rows.length).to.equal(7);
  });

  it('Skal teste at innholdet i radene er korrekt fordelt', () => {
    const wrapper = shallowWithIntl(<NaturalytelsePanel
      allePerioder={bgPerioder}
    />);
    const rows = wrapper.find('Row');
    // Header rad
    const formaterteTekster = rows.at(0).find('FormattedMessage');
    expect(formaterteTekster.at(0).props().id).to.equal('Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt.Maaned');
    expect(formaterteTekster.at(1).props().id).to.equal('Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt.Aar');

    // Første firma
    expect(rows.at(1).find('Element').childAt(0).text()).to.equal('arbeidsgiver1');
    const normalTekster = rows.at(2).find('Normaltekst');
    expect(normalTekster.at(0).childAt(0).text()).to.equal('01.09.2018 - 01.12.2018');
    expect(normalTekster.at(1).childAt(0).text()).to.equal('4 167');
    expect(rows.at(2).find('Element').childAt(0).text()).to.equal('50 000');

    // Andre firma
    expect(rows.at(3).find('Element').childAt(0).text()).to.equal('arbeidsgiver2');
    const normalTekster2 = rows.at(4).find('Normaltekst');
    expect(normalTekster2.at(0).childAt(0).text()).to.equal('01.07.2018');
    expect(normalTekster2.at(1).childAt(0).text()).to.equal('833');
    expect(rows.at(4).find('Element').childAt(0).text()).to.equal('10 000');

    // Tredje firma
    expect(rows.at(5).find('Element').childAt(0).text()).to.equal('arbeidsgiver3');
    const normalTekster3 = rows.at(6).find('Normaltekst');
    expect(normalTekster3.at(0).childAt(0).text()).to.equal('01.07.2018');
    expect(normalTekster3.at(1).childAt(0).text()).to.equal('5 833');
    expect(rows.at(6).find('Element').childAt(0).text()).to.equal('70 000');
  });

  it('Skal teste at selector lager forventet objekt ut av en liste med '
    + 'beregningsgrunnlagperioder som inneholder naturalytelser', () => {
    const expectedReturnObject = {
      arbeidsforholdPeriodeMap: {
        arbeidsgiver1123: ['arbeidsgiver1', { periodeTekst: '01.09.2018 - 01.12.2018', aar: 50000, maaned: 50000 / 12 }],
        arbeidsgiver2456: ['arbeidsgiver2', { periodeTekst: '01.07.2018', aar: 10000, maaned: 10000 / 12 }],
        arbeidsgiver3789: ['arbeidsgiver3', { periodeTekst: '01.07.2018', aar: 70000, maaned: 70000 / 12 }],

      },
    };
    const selectorResult = createNaturalytelseTableData(bgPerioder);
    expect(selectorResult).to.deep.equal(expectedReturnObject);
  });
});
