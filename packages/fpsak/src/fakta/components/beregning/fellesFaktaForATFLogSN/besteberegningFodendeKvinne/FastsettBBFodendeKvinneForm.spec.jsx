import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import aktivitetStatus from 'kodeverk/aktivitetStatus';
import FastsettBBFodendeKvinneForm from './FastsettBBFodendeKvinneForm';

const beregningsgrunnlag = {
  beregningsgrunnlagPeriode: [
    {
      beregningsgrunnlagPrStatusOgAndel: [
        {
          andelsnr: 1,
          aktivitetStatus: {
            kode: aktivitetStatus.ARBEIDSTAKER,
          },
          beregnetPrAar: 120000,
        },
        {
          andelsnr: 2,
          aktivitetStatus: {
            kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
          },
          beregnetPrAar: 120000,
        },
      ],
    },
  ],
  faktaOmBeregning: {
    besteberegningAndeler: [
      {
        arbeidsforhold: {
          arbeidsgiverNavn: 'bedrift',
          arbeidsgiverId: '123',
          arbeidsperiodeFom: '2018-01-01',
        },
        andelsnr: 1,
        refusjonskrav: 100000,
        inntektskategori: {
          kode: 'ARBEIDSTAKER',
          navn: 'ATTest',
        },
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
      },
      {
        arbeidsforhold: {
          arbeidsgiverNavn: 'bedrift',
          arbeidsgiverId: '123',
          arbeidsperiodeFom: '2018-01-01',
        },
        andelsnr: 2,
        refusjonskrav: 100000,
        inntektskategori: {
          kode: 'SELVSTENDIG_NÆRINGSDRIVENDE',
          navn: 'SNTest',
        },
        aktivitetStatus: {
          kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
        },
      },
    ],
  },
};

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

describe('<FastsettBBFodendeKvinneForm>', () => {
  it('Skal teste at korrekte komponenter vises', () => {
    const wrapper = shallow(<FastsettBBFodendeKvinneForm.WrappedComponent
      readOnly={false}
      isAksjonspunktClosed={false}
      besteberegningAndeler={beregningsgrunnlag.faktaOmBeregning.besteberegningAndeler}
      inntektskategorier={inntektskategorier}
      totalSum=""
    />);
    const tableRows = wrapper.find('TableRow');
    expect(tableRows).to.have.length(3);
    const tableColumns = wrapper.find('TableColumn');
    expect(tableColumns).to.have.length(15);
    const inputfield = wrapper.find('InputField');
    expect(inputfield).to.have.length(2);
    const selectfield = wrapper.find('SelectField');
    expect(selectfield).to.have.length(2);
  });

  it('Skal teste at buildInitialValues lager korrekt dataobjekt for initalValues', () => {
    const initialValues = FastsettBBFodendeKvinneForm.buildInitialValues(beregningsgrunnlag);
    const expectedInputKeyOne = 'Inputfield_AT_1';
    const expectedSelectKeyOne = 'Selectfield_AT_1';
    const expectedInputKeyTwo = 'Inputfield_SN_2';
    const expectedSelectKeyTwo = 'Selectfield_SN_2';

    expect(initialValues[expectedInputKeyOne]).to.eql('10 000');
    expect(initialValues[expectedSelectKeyOne]).to.eql('ARBEIDSTAKER');

    expect(initialValues[expectedInputKeyTwo]).to.eql('10 000');
    expect(initialValues[expectedSelectKeyTwo]).to.eql('SELVSTENDIG_NÆRINGSDRIVENDE');
  });
});
