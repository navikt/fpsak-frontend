import React from 'react';
import { expect } from 'chai';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { lagStateMedAksjonspunkterOgBeregningsgrunnlag } from '@fpsak-frontend/utils-test/src/beregning-test-helper';
import { lonnsendringField }
  from 'behandlingForstegangOgRevurdering/src/fakta/components/beregning/fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/LonnsendringForm';
import { erNyoppstartetFLField }
  from 'behandlingForstegangOgRevurdering/src/fakta/components/beregning/fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import {
  createEndretArbeidsforholdString, getHelpTextsEndringBG,
  lagFastsetteATFLInntektHeader, createEndringHeadingForDate, byggListeSomStreng,
} from './EndretBeregningsgrunnlagUtils';
import {
  finnFrilansFieldName,
  utledArbeidsforholdFieldName,
} from '../vurderOgFastsettATFL/forms/VurderMottarYtelseUtils';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
} = aksjonspunktCodes;

const forhold = [
  {
    arbeidsgiverNavn: 'arbeidsgiver 1',
    arbeidsgiverId: '123456789',
    startdato: '2017-01-01',
    opphoersdato: '2017-02-02',
    perioderMedGraderingEllerRefusjon: [
      {
        fom: '2017-01-15',
        erGradering: true,
        erRefusjon: false,
      },
    ],
  },
  {
    arbeidsgiverNavn: 'arbeidsgiver 3',
    arbeidsgiverId: '123456789',
    startdato: '2017-01-01',
    opphoersdato: '2017-02-02',
    perioderMedGraderingEllerRefusjon: [
      {
        fom: '2017-01-15',
        tom: '2017-06-15',
        erGradering: true,
        erRefusjon: false,
      },
    ],
  },
  {
    arbeidsgiverNavn: 'arbeidsgiver 2',
    arbeidsgiverId: '987654321',
    startdato: '2017-02-02',
    opphoersdato: '2017-03-03',
    perioderMedGraderingEllerRefusjon: [
      {
        fom: '2017-01-20',
        erGradering: false,
        erRefusjon: true,
      },
    ],
  },
  {
    arbeidsgiverNavn: 'arbeidsgiver 4',
    arbeidsgiverId: '987654321',
    startdato: '2017-02-02',
    opphoersdato: '2017-03-03',
    perioderMedGraderingEllerRefusjon: [
      {
        fom: '2017-01-20',
        tom: '2017-06-15',
        erGradering: false,
        erRefusjon: true,
      },
    ],
  },
];

const forventetGraderingString = 'arbeidsgiver 1 (123456789) f.o.m. 15.01.2017 og'
+ ' arbeidsgiver 3 (123456789) f.o.m. 15.01.2017 - t.o.m. 15.06.2017';
const forventetRefusjonString = 'arbeidsgiver 2 (987654321) f.o.m. 20.01.2017 og'
+ ' arbeidsgiver 4 (987654321) f.o.m. 20.01.2017 - t.o.m. 15.06.2017';


const lagStateMedFaktaOmBeregningOgValues = (faktaOmBeregning, values = {}) => {
  const ap = { definisjon: { kode: VURDER_FAKTA_FOR_ATFL_SN } };
  return lagStateMedAksjonspunkterOgBeregningsgrunnlag([ap], { faktaOmBeregning }, values);
};

describe('<EndretBeregningsgrunnlagUtils>', () => {
  it('skal lage streng fra liste med 2 elementer', () => {
    const inntektskategoriliste = [{ kode: 'ARBEIDSTAKER', navn: 'Arbeidstaker' }, { kode: 'FRILANSER', navn: 'Frilanser' }];
    const message = byggListeSomStreng(inntektskategoriliste.map(({ navn }) => (navn)));
    expect(message).to.equal('Arbeidstaker og Frilanser');
  });

  it('skal lage streng fra liste med 3 elementer', () => {
    const inntektskategoriliste = [{ kode: 'ARBEIDSTAKER', navn: 'Arbeidstaker' },
      { kode: 'FRILANSER', navn: 'Frilanser' }, { kode: 'SJØMANN', navn: 'Sjømann' }];
    const message = byggListeSomStreng(inntektskategoriliste.map(({ navn }) => (navn)));
    expect(message).to.equal('Arbeidstaker, Frilanser og Sjømann');
  });


  it('skal få header med kun dateheading', () => {
    const periodeFom = '2018-01-01';
    const periodeTom = '2019-01-01';
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG }],
      endringBeregningsgrunnlag: {
        endringBeregningsgrunnlagPerioder: [
          { fom: periodeFom, tom: periodeTom },
        ],
        endredeArbeidsforhold: [],
      },
    };
    const state = lagStateMedFaktaOmBeregningOgValues(faktaOmBeregning);
    const dateHeading = <div id="DateHeading" />;
    const endringHeading = createEndringHeadingForDate(state, periodeFom, periodeTom, dateHeading, false);
    expect(endringHeading.props.children.length).to.equal(3);
    expect(endringHeading.props.children[2].props.id).to.equal('DateHeading');
    expect(endringHeading.props.children[0].props.children.length).to.equal(3);
    expect(endringHeading.props.children[0].props.children[0].length).to.equal(0);
    expect(endringHeading.props.children[0].props.children[1]).to.equal(null);
    expect(endringHeading.props.children[0].props.children[2]).to.equal(false);
  });

  it('skal lage header med gradering og refusjon informasjon', () => {
    const periodeFom = '2018-01-01';
    const periodeTom = '2019-01-01';
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG }],
      endringBeregningsgrunnlag: {
        endringBeregningsgrunnlagPerioder: [
          { fom: periodeFom, tom: periodeTom },
        ],
        endredeArbeidsforhold: forhold,
      },
    };
    const state = lagStateMedFaktaOmBeregningOgValues(faktaOmBeregning);
    const dateHeading = <div id="DateHeading" />;
    const endringHeading = createEndringHeadingForDate(state, periodeFom, periodeTom, dateHeading, false);
    expect(endringHeading.props.children.length).to.equal(3);
    expect(endringHeading.props.children[2].props.id).to.equal('DateHeading');
    expect(endringHeading.props.children[0].props.children.length).to.equal(3);
    expect(endringHeading.props.children[0].props.children[0].length).to.equal(2);
    expect(endringHeading.props.children[0].props.children[0][0].key).to.equal('gradering');
    expect(endringHeading.props.children[0].props.children[0][1].key).to.equal('refusjon');
    expect(endringHeading.props.children[0].props.children[1]).to.equal(false);
    expect(endringHeading.props.children[0].props.children[2]).to.equal(false);
  });


  it('skal lage header med informasjon om ATFL i samme org', () => {
    const periodeFom = '2018-01-01';
    const periodeTom = '2019-01-01';
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG },
        { kode: faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON }],
      endringBeregningsgrunnlag: {
        endringBeregningsgrunnlagPerioder: [
          { fom: periodeFom, tom: periodeTom },
        ],
        endredeArbeidsforhold: [],
      },
    };
    const state = lagStateMedFaktaOmBeregningOgValues(faktaOmBeregning);
    const dateHeading = <div id="DateHeading" />;
    const endringHeading = createEndringHeadingForDate(state, periodeFom, periodeTom, dateHeading, false);
    expect(endringHeading.props.children.length).to.equal(3);
    expect(endringHeading.props.children[2].props.id).to.equal('DateHeading');
    expect(endringHeading.props.children[0].props.children.length).to.equal(3);
    expect(endringHeading.props.children[0].props.children[0].length).to.equal(0);
    expect(endringHeading.props.children[0].props.children[1].props.id).to.equal('BeregningInfoPanel.VurderOgFastsettATFL.ATFLSammeOrgFastsettATFLAlleOppdrag');
    expect(endringHeading.props.children[0].props.children[2]).to.equal(false);
  });


  it('skal ikkje lage header med informasjon om ATFL i samme org, men tekst om å fastsette årsbeløp', () => {
    const periodeFom = '2018-01-01';
    const periodeTom = '2019-01-01';
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG },
        { kode: faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON }],
      endringBeregningsgrunnlag: {
        endringBeregningsgrunnlagPerioder: [
          { fom: periodeFom, tom: periodeTom },
        ],
        endredeArbeidsforhold: [],
      },
    };
    const state = lagStateMedFaktaOmBeregningOgValues(faktaOmBeregning);
    const dateHeading = <div id="DateHeading" />;
    const endringHeading = createEndringHeadingForDate(state, periodeFom, periodeTom, dateHeading, true);
    expect(endringHeading.props.children.length).to.equal(3);
    expect(endringHeading.props.children[2].props.id).to.equal('DateHeading');
    expect(endringHeading.props.children[0].props.children.length).to.equal(3);
    expect(endringHeading.props.children[0].props.children[0].length).to.equal(0);
    expect(endringHeading.props.children[0].props.children[1]).to.equal(false);
    expect(endringHeading.props.children[0].props.children[2].props.id).to.equal('BeregningInfoPanel.FordelingBG.FastsettMånedsbeløp');
  });


  it('skal lage endret arbeidsforhold string', () => {
    const endretAFGraderingString = createEndretArbeidsforholdString(forhold
      .filter(af => af.perioderMedGraderingEllerRefusjon.map(({ erGradering }) => erGradering).includes(true)), true);
    expect(endretAFGraderingString).to.equal(forventetGraderingString);


    const endretAFRefusjonString = createEndretArbeidsforholdString(forhold
      .filter(af => af.perioderMedGraderingEllerRefusjon.map(({ erRefusjon }) => erRefusjon).includes(true)), false);
    expect(endretAFRefusjonString).to.equal(forventetRefusjonString);
  });

  const ap = {
    definisjon: {
      kode: '5058',
    },
  };

  it('skal lage helptext', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const helpText = getHelpTextsEndringBG.resultFunc(aktivertePaneler, forhold, [ap]);
    expect(helpText[0].props.children).to.have.length(3);
    expect(helpText[0].props.children[0].props.id).to.equal('BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.EndringBeregningsgrunnlag.Gradering');
    expect(helpText[0].props.children[0].props.values.arbeidsforhold)
      .to.equal('arbeidsgiver 1 (123456789) f.o.m. 15.01.2017 og arbeidsgiver 3 (123456789) f.o.m. 15.01.2017 - t.o.m. 15.06.2017');
    expect(helpText[0].props.children[2].props.id).to.equal('BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.EndringBeregningsgrunnlag.Refusjon');
    expect(helpText[0].props.children[2].props.values.arbeidsforhold)
      .to.equal('arbeidsgiver 2 (987654321) f.o.m. 20.01.2017 og arbeidsgiver 4 (987654321) f.o.m. 20.01.2017 - t.o.m. 15.06.2017');
  });


  it('skal vise ATFL i samme org tekst om ATFL i samme org', () => {
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [
        { kode: faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON },
      ],
    };
    const values = {};
    const inntektHeader = lagFastsetteATFLInntektHeader(values, faktaOmBeregning);
    expect(inntektHeader.props.id).to.equal('BeregningInfoPanel.VurderOgFastsettATFL.ATFLSammeOrgFastsettATFLAlleOppdrag');
  });

  const arbeidsforhold = {
    arbeidsgiverNavn: 'Virksomheten',
    arbeidsgiverId: '3284788923',
    arbeidsforholdId: '321378huda7e2',
    startdato: '2017-01-01',
    opphoersdato: '2018-01-01',
  };

  const andel = {
    andelsnr: 1,
    inntektPrMnd: 25000,
    arbeidsforhold,
  };

  it('skal vise arbeidstaker fastsett tekst for fastsetting av kun arbeidstaker pga vurder mottar ytelse', () => {
    const arbeidstakerAndelerUtenIM = [
      { ...andel, mottarYtelse: null },
    ];

    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [
        { kode: faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE },
      ],
      vurderMottarYtelse: {
        arbeidstakerAndelerUtenIM,
      },
    };
    const values = {};
    values[utledArbeidsforholdFieldName(andel)] = true;
    const inntektHeader = lagFastsetteATFLInntektHeader(values, faktaOmBeregning);
    expect(inntektHeader.props.id).to.equal('BeregningInfoPanel.VurderOgFastsettATFL.FastsettArbeidsinntekt');
  });

  it('skal vise arbeidstaker fastsett tekst for fastsetting av kun arbeidstaker pga lønnsendring', () => {
    const arbeidstakerAndelerUtenIM = [
      { ...andel, mottarYtelse: null },
    ];

    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [
        { kode: faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE },
      ],
      vurderMottarYtelse: {
        arbeidstakerAndelerUtenIM,
      },
    };
    const values = {};
    values[lonnsendringField] = true;
    const inntektHeader = lagFastsetteATFLInntektHeader(values, faktaOmBeregning);
    expect(inntektHeader.props.id).to.equal('BeregningInfoPanel.VurderOgFastsettATFL.FastsettArbeidsinntekt');
  });

  it('skal vise frilans fastsett tekst for fastsetting av kun frilans pga vurder mottar ytelse', () => {
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [
        { kode: faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE },
      ],
    };
    const values = {};
    values[finnFrilansFieldName()] = true;
    const inntektHeader = lagFastsetteATFLInntektHeader(values, faktaOmBeregning);
    expect(inntektHeader.props.id).to.equal('BeregningInfoPanel.VurderOgFastsettATFL.FastsettFrilansAlleOppdrag');
  });

  it('skal vise tekst for fastsetting av både arbeidstaker og frilanser', () => {
    const arbeidstakerAndelerUtenIM = [
      { ...andel, mottarYtelse: null },
    ];

    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: [
        { kode: faktaOmBeregningTilfelle.VURDER_MOTTAR_YTELSE },
      ],
      vurderMottarYtelse: {
        arbeidstakerAndelerUtenIM,
      },
    };
    const values = {};
    values[lonnsendringField] = true;
    values[erNyoppstartetFLField] = true;
    const inntektHeader = lagFastsetteATFLInntektHeader(values, faktaOmBeregning);
    expect(inntektHeader.props.id).to.equal('BeregningInfoPanel.VurderOgFastsettATFL.FastsettATFLAlleOppdrag');
  });
});
