import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import AksjonspunktBehandlerTidsbegrenset, { createInputFieldKey, createTableData, getIsAksjonspunktClosed } from './AksjonspunktBehandlerTB';

const firstCol = {
  erTidsbegrenset: true,
  isEditable: false,
  tabellInnhold: 'Arbeidsgiver 1',
  inputfieldKey: '',
};

const secondCol = {
  erTidsbegrenset: false,
  isEditable: true,
  tabellInnhold: '100000',
  inputfieldKey: '',
};

const thirdCol = {
  erTidsbegrenset: false,
  isEditable: true,
  tabellInnhold: '100000',
  inputfieldKey: 'DetteErBareEnTest',
};

const fourthCol = {
  erTidsbegrenset: false,
  isEditable: true,
  tabellInnhold: '100000',
  inputfieldKey: 'detteErOgsåBareEnTest',
};

const mockTableData = {
  arbeidsforholdPeriodeMap: {
    arbeidsgiver1: [firstCol, secondCol, thirdCol, fourthCol],
  },
};
const mockbruttoPerodeList = [
  {
    brutto: 560500,
    periode: 'beregnetInntekt_2019-09-16_2019-09-29',
  },
  { brutto: 0, periode: '2019-09-16_2019-09-29' },
  { brutto: 0, periode: '2019-09-30_2019-10-15' },
  { brutto: 0, periode: '2019-10-15_null' },
];

const beregnetPrAarAndelEn = 250000;
const overstyrtPrAarAndelEn = 100000;

const beregnetPrAarAndelTo = 100000;
const overstyrtPrAarAndelTo = 200000;

const beregningsgrunnlagPerioder = [
  {
    periodeAarsaker: [],
    beregningsgrunnlagPeriodeFom: '2018-06-01',
    beregningsgrunnlagPeriodeTom: '2018-06-30',
    beregningsgrunnlagPrStatusOgAndel: [
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        erTidsbegrensetArbeidsforhold: true,
        beregnetPrAar: beregnetPrAarAndelEn,
        overstyrtPrAar: overstyrtPrAarAndelEn,
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '123',
          arbeidsforholdId: '123',
          eksternArbeidsforholdId: '345678',
        },
        andelsnr: 1,
      },
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        erTidsbegrensetArbeidsforhold: true,
        beregnetPrAar: beregnetPrAarAndelTo,
        overstyrtPrAar: overstyrtPrAarAndelTo,
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '456',
          arbeidsforholdId: '456',
          eksternArbeidsforholdId: '567890',
        },
        andelsnr: 2,
      },
    ],
  },
  {
    periodeAarsaker: [{ kode: periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET }],
    beregningsgrunnlagPeriodeFom: '2018-07-01',
    beregningsgrunnlagPeriodeTom: '2018-07-31',
    beregningsgrunnlagPrStatusOgAndel: [
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        erTidsbegrensetArbeidsforhold: true,
        beregnetPrAar: beregnetPrAarAndelEn,
        overstyrtPrAar: overstyrtPrAarAndelEn,
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '123',
          arbeidsforholdId: '123',
          eksternArbeidsforholdId: '345678',
        },
        andelsnr: 1,
      },
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        erTidsbegrensetArbeidsforhold: true,
        beregnetPrAar: beregnetPrAarAndelTo,
        overstyrtPrAar: overstyrtPrAarAndelTo,
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '456',
          arbeidsforholdId: '456',
          eksternArbeidsforholdId: '567890',
        },
        andelsnr: 2,
      },
    ],
  },
  {
    periodeAarsaker: [{ kode: periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET }],
    beregningsgrunnlagPeriodeFom: '2018-08-01',
    beregningsgrunnlagPrStatusOgAndel: [
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        erTidsbegrensetArbeidsforhold: true,
        beregnetPrAar: beregnetPrAarAndelEn,
        overstyrtPrAar: overstyrtPrAarAndelEn,
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '123',
          arbeidsforholdId: '123',
          eksternArbeidsforholdId: '345678',
        },
        andelsnr: 1,
      },
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        erTidsbegrensetArbeidsforhold: true,
        beregnetPrAar: beregnetPrAarAndelTo,
        overstyrtPrAar: overstyrtPrAarAndelTo,
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '123',
          arbeidsforholdId: '456',
          eksternArbeidsforholdId: '567890',
        },
        andelsnr: 2,
      },
    ],
  },
  {
    periodeAarsaker: [{ kode: periodeAarsak.REFUSJON_OPPHOERER }],
    beregningsgrunnlagPeriodeFom: '2019-01-01',
    beregningsgrunnlagPrStatusOgAndel: [
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        erTidsbegrensetArbeidsforhold: true,
        beregnetPrAar: beregnetPrAarAndelEn,
        overstyrtPrAar: overstyrtPrAarAndelEn,
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '123',
          arbeidsforholdId: '123',
          eksternArbeidsforholdId: '345678',
        },
        andelsnr: 1,
      },
      {
        aktivitetStatus: {
          kode: aktivitetStatus.ARBEIDSTAKER,
        },
        erTidsbegrensetArbeidsforhold: true,
        beregnetPrAar: beregnetPrAarAndelTo,
        overstyrtPrAar: overstyrtPrAarAndelTo,
        arbeidsforhold: {
          arbeidsgiverNavn: 'arbeidsgiver',
          arbeidsgiverId: '123',
          arbeidsforholdId: '456',
          eksternArbeidsforholdId: '567890',
        },
        andelsnr: 2,
      },
    ],
  },
];
const keyForPeriodeOgAndel = (periodeNr, andelNr) => createInputFieldKey(
  beregningsgrunnlagPerioder[periodeNr].beregningsgrunnlagPrStatusOgAndel[andelNr],
  beregningsgrunnlagPerioder[periodeNr],
);
const alleKodeverk = {
  test: 'test',
};
describe('<AksjonspunktBehandlerTidsbegrenset>', () => {
  it('Skal teste tabellen får korrekte rader', () => {
    const wrapper = shallowWithIntl(<AksjonspunktBehandlerTidsbegrenset.WrappedComponent
      readOnly={false}
      tableData={mockTableData}
      isAksjonspunktClosed={false}
      bruttoPrPeriodeList={mockbruttoPerodeList}
    />);
    const dataRows = wrapper.findWhere((node) => node.key() === 'arbeidsgiver1');
    const arbeidsgiverNavn = dataRows.first().find('Normaltekst');
    expect(arbeidsgiverNavn.first().childAt(0).text()).to.equal(mockTableData.arbeidsforholdPeriodeMap.arbeidsgiver1[0].tabellInnhold);
    const editableFields = mockTableData.arbeidsforholdPeriodeMap.arbeidsgiver1.filter((periode) => periode.isEditable === true);
    expect(editableFields).to.have.length(mockTableData.arbeidsforholdPeriodeMap.arbeidsgiver1.length - 1);
    const sumRows = wrapper.find('#bruttoPrPeriodeRad');
    const sumCols = sumRows.first().find('td');
    expect(sumCols).to.have.length(mockTableData.arbeidsforholdPeriodeMap.arbeidsgiver1.length);
    expect(sumCols.first().find('FormattedMessage').first().props().id).to.equal('Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandlerTB.SumPeriode');
  });
  it('Skal teste at initial values bygges korrekt', () => {
    const expectedInitialValues = {};
    // Første periode
    expectedInitialValues[keyForPeriodeOgAndel(0, 0)] = formatCurrencyNoKr(overstyrtPrAarAndelEn);
    expectedInitialValues[keyForPeriodeOgAndel(0, 1)] = formatCurrencyNoKr(overstyrtPrAarAndelTo);
    // Andre periode
    expectedInitialValues[keyForPeriodeOgAndel(1, 0)] = formatCurrencyNoKr(overstyrtPrAarAndelEn);
    expectedInitialValues[keyForPeriodeOgAndel(1, 1)] = formatCurrencyNoKr(overstyrtPrAarAndelTo);
    // Tredje periode
    expectedInitialValues[keyForPeriodeOgAndel(2, 0)] = formatCurrencyNoKr(overstyrtPrAarAndelEn);
    expectedInitialValues[keyForPeriodeOgAndel(2, 1)] = formatCurrencyNoKr(overstyrtPrAarAndelTo);
    const initialValues = AksjonspunktBehandlerTidsbegrenset.buildInitialValues(beregningsgrunnlagPerioder);
    expect(initialValues).to.eql(expectedInitialValues);
  });
  const aksjonspunkter = [
    {
      definisjon: {
        kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
      },
    },
  ];
  it('Skal teste at selector lager forventet objekt ut av en liste med beregningsgrunnlagperioder '
    + 'som inneholder kortvarige arbeidsforhold når vi har aksjonspunkt', () => {
    const expectedResultObjectWhenWeHaveAksjonspunkt = {
      arbeidsforholdPeriodeMap: {
        arbeidsgiver123: [
          {
            erTidsbegrenset: true,
            isEditable: false,
            tabellInnhold: 'arbeidsgiver (123)...5678',
            inputfieldKey: '',
          },
          {
            erTidsbegrenset: false,
            isEditable: true,
            tabellInnhold: formatCurrencyNoKr(overstyrtPrAarAndelEn),
            inputfieldKey: 'inntektField_123_1_2018-06-01',
          },
          {
            erTidsbegrenset: false,
            isEditable: true,
            tabellInnhold: formatCurrencyNoKr(overstyrtPrAarAndelEn),
            inputfieldKey: 'inntektField_123_1_2018-07-01',
          },
          {
            erTidsbegrenset: false,
            isEditable: true,
            tabellInnhold: formatCurrencyNoKr(overstyrtPrAarAndelEn),
            inputfieldKey: 'inntektField_123_1_2018-08-01',
          },
        ],
        arbeidsgiver456: [
          {
            erTidsbegrenset: true,
            isEditable: false,
            tabellInnhold: 'arbeidsgiver (456)...7890',
            inputfieldKey: '',
          },
          {
            erTidsbegrenset: false,
            isEditable: true,
            tabellInnhold: formatCurrencyNoKr(overstyrtPrAarAndelTo),
            inputfieldKey: 'inntektField_456_2_2018-06-01',
          },
          {
            erTidsbegrenset: false,
            isEditable: true,
            tabellInnhold: formatCurrencyNoKr(overstyrtPrAarAndelTo),
            inputfieldKey: 'inntektField_456_2_2018-07-01',
          },
          {
            erTidsbegrenset: false,
            isEditable: true,
            tabellInnhold: formatCurrencyNoKr(overstyrtPrAarAndelTo),
            inputfieldKey: 'inntektField_456_2_2018-08-01',
          },
        ],
      },
    };
    const selectorData = createTableData.resultFunc(beregningsgrunnlagPerioder, alleKodeverk, aksjonspunkter);
    expect(selectorData).to.deep.equal(expectedResultObjectWhenWeHaveAksjonspunkt);
  });
  it('Skal teste at selector henter ut om aksjonspunktet er lukket eller ikke', () => {
    const korrektApLukket = [{
      definisjon: {
        kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
      },
      status: {
        kode: aksjonspunktStatus.UTFORT,
      },
    }];
    const korrektApApent = [{
      definisjon: {
        kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
    }];
    const selectorDataLukket = getIsAksjonspunktClosed.resultFunc(korrektApLukket);
    expect(selectorDataLukket).to.equal(true);
    const selectorDataApent = getIsAksjonspunktClosed.resultFunc(korrektApApent);
    expect(selectorDataApent).to.equal(false);
  });
  it('Skal teste transformValues metode', () => {
    const formValues = {};
    // Første periode
    formValues[keyForPeriodeOgAndel(0, 0)] = '100 000';
    formValues[keyForPeriodeOgAndel(0, 1)] = '200 000';

    // Andre periode
    formValues[keyForPeriodeOgAndel(1, 0)] = '100 000';
    formValues[keyForPeriodeOgAndel(1, 1)] = '250 000';

    // Tredje periode
    formValues[keyForPeriodeOgAndel(2, 0)] = '100 000';
    formValues[keyForPeriodeOgAndel(2, 1)] = '500 000';

    const expectedTransformedValues = [
      {
        periodeFom: beregningsgrunnlagPerioder[0].beregningsgrunnlagPeriodeFom,
        periodeTom: beregningsgrunnlagPerioder[0].beregningsgrunnlagPeriodeTom,
        fastsatteTidsbegrensedeAndeler: [
          {
            andelsnr: 1,
            bruttoFastsattInntekt: 100000,
          },
          {
            andelsnr: 2,
            bruttoFastsattInntekt: 200000,
          },
        ],
      },
      {
        periodeFom: beregningsgrunnlagPerioder[1].beregningsgrunnlagPeriodeFom,
        periodeTom: beregningsgrunnlagPerioder[1].beregningsgrunnlagPeriodeTom,
        fastsatteTidsbegrensedeAndeler: [
          {
            andelsnr: 1,
            bruttoFastsattInntekt: 100000,
          },
          {
            andelsnr: 2,
            bruttoFastsattInntekt: 250000,
          },
        ],
      },
      {
        periodeFom: beregningsgrunnlagPerioder[2].beregningsgrunnlagPeriodeFom,
        periodeTom: undefined,
        fastsatteTidsbegrensedeAndeler: [
          {
            andelsnr: 1,
            bruttoFastsattInntekt: 100000,
          },
          {
            andelsnr: 2,
            bruttoFastsattInntekt: 500000,
          },
        ],
      },
    ];
    const transformedValues = AksjonspunktBehandlerTidsbegrenset.transformValues(formValues, beregningsgrunnlagPerioder);
    expect(transformedValues).is.deep.equal(expectedTransformedValues);
  });

  it('Skal teste buildInitialValues metode', () => {
    const expectedInitialValues = {};
    // Første periode
    expectedInitialValues[keyForPeriodeOgAndel(0, 0)] = formatCurrencyNoKr(overstyrtPrAarAndelEn);
    expectedInitialValues[keyForPeriodeOgAndel(0, 1)] = formatCurrencyNoKr(overstyrtPrAarAndelTo);
    // Andre periode
    expectedInitialValues[keyForPeriodeOgAndel(1, 0)] = formatCurrencyNoKr(overstyrtPrAarAndelEn);
    expectedInitialValues[keyForPeriodeOgAndel(1, 1)] = formatCurrencyNoKr(overstyrtPrAarAndelTo);
    // Tredje periode
    expectedInitialValues[keyForPeriodeOgAndel(2, 0)] = formatCurrencyNoKr(overstyrtPrAarAndelEn);
    expectedInitialValues[keyForPeriodeOgAndel(2, 1)] = formatCurrencyNoKr(overstyrtPrAarAndelTo);

    const initialValues = AksjonspunktBehandlerTidsbegrenset.buildInitialValues(beregningsgrunnlagPerioder);
    expect(initialValues).is.deep.equal(expectedInitialValues);
  });
});
