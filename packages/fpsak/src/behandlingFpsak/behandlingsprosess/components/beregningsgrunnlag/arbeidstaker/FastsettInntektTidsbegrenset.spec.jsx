import React from 'react';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';
import Image from 'sharedComponents/Image';
import periodeAarsak from 'kodeverk/periodeAarsak';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import aksjonspunktStatus from 'kodeverk/aksjonspunktStatus';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import FastsettInntektTidsbegrenset, {
  createTableData,
  getIsAksjonspunktClosed,
  getTableHeaderData,
  getOppsummertBruttoInntektForTidsbegrensedePerioder,
  createInputFieldKey,
} from './FastsettInntektTidsbegrenset';

const firstCol = {
  erTidsbegrenset: true,
  isEditable: false,
  tabellInnhold: 'Arbeidsgiver 1',
  inputfieldKey: '',
};

const secondCol = {
  erTidsbegrenset: false,
  isEditable: false,
  tabellInnhold: '100000',
  inputfieldKey: '',
};

const thirdCol = {
  erTidsbegrenset: false,
  isEditable: false,
  tabellInnhold: '100000',
  inputfieldKey: 'DetteErBareEnTest',
};

const fourthCol = {
  erTidsbegrenset: false,
  isEditable: false,
  tabellInnhold: '100000',
  inputfieldKey: 'detteErOgsåBareEnTest',
};


const tableData = {
  arbeidsforholdPeriodeMap: {
    ag1: [firstCol, secondCol, thirdCol, fourthCol],
  },
  headers: [' ', ' ', ' ', ' '],
};

const bruttoList = [{ periode: '01.01.2018', brutto: 100000 }, { periode: '03.03.2018', brutto: 200000 }];

const tableHeaders = [
  (<FormattedMessage
    id="test"
    key="test"
  />),
  (<FormattedMessage
    id="test2"
    key="test2"
  />),
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
        },
        andelsnr: 2,
      },
    ],
  },
];

describe('<FastsettInntektTidsbegrenset>', () => {
  it('Skal tabell for riktig antall rader', () => {
    const wrapper = shallow(<FastsettInntektTidsbegrenset.WrappedComponent
      tableData={tableData}
      readOnly={false}
      isAksjonspunktClosed={false}
      bruttoPrPeriodeList={bruttoList}
      allePerioder={beregningsgrunnlagPerioder}
      tableHeaderData={tableHeaders}
    />);
    const rows = wrapper.find('TableRow');
    expect(rows.length).to.equal(2);
  });

  it('Skal teste kolonner vises med korrekt innhold uten inputfelter når ingen kolonner er redigerbare', () => {
    const wrapper = shallow(<FastsettInntektTidsbegrenset.WrappedComponent
      tableData={tableData}
      readOnly={false}
      isAksjonspunktClosed={false}
      bruttoPrPeriodeList={bruttoList}
      allePerioder={beregningsgrunnlagPerioder}
      tableHeaderData={tableHeaders}
    />);
    const rows = wrapper.find('TableRow');
    const inputs = rows.find('InputField');

    expect(rows.find('Normaltekst').at(0).childAt(0).text()).to.equal('Arbeidsgiver 1');
    expect(rows.find('Normaltekst').at(1).childAt(0).text()).to.equal('100000');
    expect(rows.find('Normaltekst').at(2).childAt(0).text()).to.equal('100000');
    expect(rows.find('Normaltekst').at(3).childAt(0).text()).to.equal('100000');
    expect(inputs.length).to.equal(0);
  });

  it('Skal teste at kolonner lages med inputfelter når de skal være redigerbare', () => {
    fourthCol.isEditable = true;
    const wrapper = shallow(<FastsettInntektTidsbegrenset.WrappedComponent
      tableData={tableData}
      readOnly={false}
      isAksjonspunktClosed={false}
      bruttoPrPeriodeList={bruttoList}
      tableHeaderData={tableHeaders}
      allePerioder={beregningsgrunnlagPerioder}
    />);
    const rows = wrapper.find('TableRow');
    const inputs = rows.find('InputField');

    expect(inputs.length).to.equal(1);
  });

  it('Skal teste at ikonet for tidsbegrenset arbeidsforhold  vises når et forhold et tidsbegrenset', () => {
    thirdCol.isEditable = true;
    fourthCol.isEditable = true;
    fourthCol.erTidsbegrenset = true;
    const wrapper = shallow(<FastsettInntektTidsbegrenset.WrappedComponent
      tableData={tableData}
      readOnly={false}
      isAksjonspunktClosed={false}
      tableHeaderData={tableHeaders}
      bruttoPrPeriodeList={bruttoList}
      allePerioder={beregningsgrunnlagPerioder}
    />);
    const rows = wrapper.find('TableRow');
    const image = rows.find(Image);
    const inputs = rows.find('InputField');

    expect(inputs.length).to.equal(2);
    expect(image.length).to.equal(1);
    expect(image.at(0).prop('titleCode')).to.equal('Beregningsgrunnlag.AarsinntektPanel.TidsbegrensetHjelpetekst');
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
            tabellInnhold: 'arbeidsgiver (123) ...123',
            inputfieldKey: '',
          },
          {
            erTidsbegrenset: false,
            isEditable: false,
            tabellInnhold: formatCurrencyNoKr(beregnetPrAarAndelEn),
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
            tabellInnhold: 'arbeidsgiver (456) ...456',
            inputfieldKey: '',
          },
          {
            erTidsbegrenset: false,
            isEditable: false,
            tabellInnhold: formatCurrencyNoKr(beregnetPrAarAndelTo),
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
    const selectorData = createTableData.resultFunc(beregningsgrunnlagPerioder, aksjonspunkter);
    expect(selectorData).to.deep.equal(expectedResultObjectWhenWeHaveAksjonspunkt);
  });
  it('Skal teste at selector lager forventet objekt ut av en liste med beregningsgrunnlagperioder '
    + 'som inneholder kortvarige arbeidsforhold når vi ikke har AP', () => {
    const expectedResultObjectWhenWeHaveNoAksjonspunkt = {
      arbeidsforholdPeriodeMap: {
        arbeidsgiver123: [
          {
            erTidsbegrenset: true,
            isEditable: false,
            tabellInnhold: 'arbeidsgiver (123) ...123',
            inputfieldKey: '',
          },
          {
            erTidsbegrenset: false,
            isEditable: false,
            tabellInnhold: '250 000',
            inputfieldKey: '',
          },
          {
            erTidsbegrenset: false,
            isEditable: false,
            tabellInnhold: '250 000',
            inputfieldKey: 'inntektField_123_1_2018-07-01',
          },
          {
            erTidsbegrenset: false,
            isEditable: false,
            tabellInnhold: '250 000',
            inputfieldKey: 'inntektField_123_1_2018-08-01',
          },
        ],
        arbeidsgiver456: [
          {
            erTidsbegrenset: true,
            isEditable: false,
            tabellInnhold: 'arbeidsgiver (456) ...456',
            inputfieldKey: '',
          },
          {
            erTidsbegrenset: false,
            isEditable: false,
            tabellInnhold: '100 000',
            inputfieldKey: '',
          },
          {
            erTidsbegrenset: false,
            isEditable: false,
            tabellInnhold: '100 000',
            inputfieldKey: 'inntektField_456_2_2018-07-01',
          },
          {
            erTidsbegrenset: false,
            isEditable: false,
            tabellInnhold: '100 000',
            inputfieldKey: 'inntektField_456_2_2018-08-01',
          },
        ],
      },
    };
    const selectorData = createTableData.resultFunc(beregningsgrunnlagPerioder, undefined);
    expect(selectorData).to.deep.equal(expectedResultObjectWhenWeHaveNoAksjonspunkt);
  });

  it('Skal teste at selector henter ut om aksjonspunktet er lukket eller ikke', () => {
    const korrektApLukket = {
      definisjon: {
        kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
      },
      status: {
        kode: aksjonspunktStatus.UTFORT,
      },
    };
    const korrektApApent = {
      definisjon: {
        kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
    };
    const selectorDataLukket = getIsAksjonspunktClosed.resultFunc(korrektApLukket);
    expect(selectorDataLukket).to.equal(true);
    const selectorDataApent = getIsAksjonspunktClosed.resultFunc(korrektApApent);
    expect(selectorDataApent).to.equal(false);
  });

  it('Skal teste at selector lager korrekte tableheaders', () => {
    const korrektApApent = {
      definisjon: {
        kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
    };
    const selectorHeaders = getTableHeaderData.resultFunc(beregningsgrunnlagPerioder, korrektApApent);
    expect(selectorHeaders).to.have.length(5);
    expect(selectorHeaders[0].props.id).to.eql('Beregningsgrunnlag.AarsinntektPanel.Arbeidsgiver');
    expect(selectorHeaders[1].props.id).to.eql('Beregningsgrunnlag.AarsinntektPanel.Inntekt');
    expect(selectorHeaders[2].props.id).to.eql('Beregningsgrunnlag.AarsinntektPanel.FastsattInntektPeriode');
    expect(selectorHeaders[2].props.values).to.eql({ fom: '01.06.2018', tom: '30.06.2018' });
    expect(selectorHeaders[3].props.values).to.eql({ fom: '01.07.2018', tom: '31.07.2018' });
    expect(selectorHeaders[4].props.values).to.eql({ fom: '01.08.2018', tom: '' });
  });

  const keyForPeriodeOgAndel = (periodeNr, andelNr) => createInputFieldKey(
    beregningsgrunnlagPerioder[periodeNr].beregningsgrunnlagPrStatusOgAndel[andelNr],
    beregningsgrunnlagPerioder[periodeNr],
  );

  it('Skal teste at selector finner oppsummert inntekt for hver periode når vi har AP', () => {
    const korrektApApent = {
      definisjon: {
        kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
      },
      status: {
        kode: aksjonspunktStatus.OPPRETTET,
      },
    };
    const formValues = {};

    // Første periode
    formValues[keyForPeriodeOgAndel(0, 0)] = '100 000';
    formValues[keyForPeriodeOgAndel(0, 1)] = '200 000';

    // Andre periode
    formValues[keyForPeriodeOgAndel(1, 0)] = '100 000';
    formValues[keyForPeriodeOgAndel(1, 1)] = undefined;

    // Tredje periode
    formValues[keyForPeriodeOgAndel(2, 0)] = '100 000';
    formValues[keyForPeriodeOgAndel(2, 1)] = '500 000';

    const oppsummerteInntekter = getOppsummertBruttoInntektForTidsbegrensedePerioder
      .resultFunc(beregningsgrunnlagPerioder, korrektApApent, formValues);
    expect(oppsummerteInntekter).to.have.length(4);

    // Første brutto er eradOnly og basert på beregnetPrAar, ikke hva som er skrevet i forms
    expect(oppsummerteInntekter[0].brutto).to.have.equal(350000);

    expect(oppsummerteInntekter[1].brutto).to.have.equal(300000);
    expect(oppsummerteInntekter[2].brutto).to.have.equal(100000);
    expect(oppsummerteInntekter[3].brutto).to.have.equal(600000);
  });

  it('Skal teste at selector finner oppsummert inntekt for hver periode når vi ikke har AP', () => {
    const formValues = undefined;

    const oppsummerteInntekter = getOppsummertBruttoInntektForTidsbegrensedePerioder
      .resultFunc(beregningsgrunnlagPerioder, undefined, formValues);
    expect(oppsummerteInntekter).to.have.length(3);

    // Uten AP er alle bruttoer basert på beregnetPrAar
    expect(oppsummerteInntekter[0].brutto).to.have.equal(350000);
    expect(oppsummerteInntekter[1].brutto).to.have.equal(350000);
    expect(oppsummerteInntekter[2].brutto).to.have.equal(350000);
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
    const transformedValues = FastsettInntektTidsbegrenset.transformValues(formValues, beregningsgrunnlagPerioder);
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

    const initialValues = FastsettInntektTidsbegrenset.buildInitialValues(beregningsgrunnlagPerioder);
    expect(initialValues).is.deep.equal(expectedInitialValues);
  });
});
