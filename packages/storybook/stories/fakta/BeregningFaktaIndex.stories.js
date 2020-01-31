import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean, object } from '@storybook/addon-knobs';

import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import opptjeningAktivitetType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const behandling = {
  id: 1,
  versjon: 1,
};

const {
  VURDER_MOTTAR_YTELSE,
  VURDER_BESTEBEREGNING,
  VURDER_LONNSENDRING,
  VURDER_NYOPPSTARTET_FL,
  VURDER_AT_OG_FL_I_SAMME_ORGANISASJON,
  VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT,
  VURDER_MILITÆR_SIVILTJENESTE,
  VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD,
  VURDER_ETTERLONN_SLUTTPAKKE,
  FASTSETT_BG_KUN_YTELSE,
  VURDER_SN_NY_I_ARBEIDSLIVET,
} = faktaOmBeregningTilfelle;

const lagBeregningsgrunnlagAvklarAktiviteter = (
  aktiviteter,
) => ({
  faktaOmBeregning: {
    avklarAktiviteter: {
      aktiviteterTomDatoMapping: [
        {
          tom: '01.01.2020',
          aktiviteter,
        },
      ],
    },
    andelerForFaktaOmBeregning: [],
  },
});

const lagBeregningsgrunnlag = (
  andeler,
  faktaOmBeregning,
) => ({
  beregningsgrunnlagPeriode: [
    {
      beregningsgrunnlagPrStatusOgAndel: andeler.map((andel) => (
        {
          andelsnr: andel.andelsnr,
          aktivitetStatus: { kode: andel.aktivitetStatus },
          inntektskategori: { kode: andel.inntektskategori },
          erNyoppstartet: andel.erNyoppstartet,
        }
      )),
    },
  ],
  faktaOmBeregning,
});

const mapTilKodeliste = (arrayOfCodes) => arrayOfCodes.map((kode) => ({ kode }));

const lagAndel = (andelsnr, aktivitetStatus, inntektskategori) => (
  { andelsnr, aktivitetStatus: { kode: aktivitetStatus }, inntektskategori: { kode: inntektskategori } }
);

const standardFaktaArbeidstakerAndel = {
  ...lagAndel(1, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER),
  visningsnavn: 'Bedriften (12345678)',
  belopReadOnly: 30000,
  lagtTilAvSaksbehandler: false,
  arbeidsforhold: {
    arbeidsgiverNavn: 'Bedriften',
    arbeidsgiverId: '12345678',
    arbeidsforholdId: null,
    startdato: '01.01.2019',
    opphoersdato: null,
    arbeidsforholdType: { kode: opptjeningAktivitetType.ARBEID, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
  },
};
const standardFaktaArbeidstakerAndel2 = {
  ...lagAndel(4, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER),
  visningsnavn: 'Bedriften2 (12345679)',
  belopReadOnly: 30000,
  lagtTilAvSaksbehandler: false,
  arbeidsforhold: {
    arbeidsgiverNavn: 'Bedriften2',
    arbeidsgiverId: '12345679',
    arbeidsforholdId: null,
    startdato: '01.01.2019',
    opphoersdato: '01.01.2020',
    arbeidsforholdType: { kode: opptjeningAktivitetType.ARBEID, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
  },
};
const tidsbegrensetFaktaArbeidstakerAndel = {
  ...lagAndel(6, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER),
  visningsnavn: 'Bedriften3 (12345671)',
  belopReadOnly: 30000,
  lagtTilAvSaksbehandler: false,
  arbeidsforhold: {
    arbeidsgiverNavn: 'Bedriften3',
    arbeidsgiverId: '12345671',
    arbeidsforholdId: null,
    startdato: '01.09.2019',
    opphoersdato: '01.01.2020',
    arbeidsforholdType: { kode: opptjeningAktivitetType.ARBEID, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
  },
};
const etterlønnSluttpakkeFaktaArbeidstakerAndel = {
  ...lagAndel(7, aktivitetStatuser.ARBEIDSTAKER, inntektskategorier.ARBEIDSTAKER),
  visningsnavn: 'Bedriften4 (795349533)',
  belopReadOnly: 30000,
  lagtTilAvSaksbehandler: false,
  arbeidsforhold: {
    arbeidsgiverNavn: 'Bedriften4',
    arbeidsgiverId: '795349533',
    arbeidsforholdId: null,
    startdato: '01.09.2019',
    opphoersdato: null,
    arbeidsforholdType: { kode: opptjeningAktivitetType.ETTERLONN_SLUTTPAKKE, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
  },
};
const standardFaktaDagpengerAndel = {
  ...lagAndel(3, aktivitetStatuser.DAGPENGER, inntektskategorier.DAGPENGER),
  visningsnavn: 'Dagpenger',
  belopReadOnly: 30000,
  lagtTilAvSaksbehandler: false,
};
const standardFaktaFrilansAndel = {
  ...lagAndel(2, aktivitetStatuser.FRILANSER, inntektskategorier.FRILANSER),
  visningsnavn: 'Frilans',
  belopReadOnly: 10000,
  lagtTilAvSaksbehandler: false,
};
const standardFaktaMilitærAndel = {
  ...lagAndel(5, aktivitetStatuser.MILITAER_ELLER_SIVIL, inntektskategorier.ARBEIDSTAKER),
  visningsnavn: 'Militær- eller sivilforsvarstjeneste',
  belopReadOnly: 10000,
  lagtTilAvSaksbehandler: false,
};
const standardFaktaYtelseAndel = {
  ...lagAndel(8, aktivitetStatuser.KUN_YTELSE, inntektskategorier.UDEFINERT),
  visningsnavn: 'Ytelse',
  belopReadOnly: 10000,
  lagtTilAvSaksbehandler: false,
};
const standardFaktaNæringAndel = {
  ...lagAndel(9, aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE, inntektskategorier.SELVSTENDIG_NAERINGSDRIVENDE),
  visningsnavn: 'Selvstendig næringsdrivende',
  belopReadOnly: 10000,
  lagtTilAvSaksbehandler: false,
};
const standardFaktaAAPAndel = {
  ...lagAndel(10, aktivitetStatuser.ARBEIDSAVKLARINGSPENGER, inntektskategorier.ARBEIDSAVKLARINGSPENGER),
  visningsnavn: 'Arbeidsavklaringspenger',
  belopReadOnly: 10000,
  lagtTilAvSaksbehandler: false,
};


const merknaderFraBeslutter = {
  notAccepted: false,
};

export default {
  title: 'fakta/fakta-beregning',
  component: BeregningFaktaIndex,
  decorators: [withKnobs, withReduxProvider],
};


export const test = () => {
  const beregningsgrunnlag = {
    skjaeringstidspunktBeregning: '2019-12-31',
    skjæringstidspunkt: '2019-12-31',
    aktivitetStatus: [{ kode: 'AT', kodeverk: 'AKTIVITET_STATUS' }],
    beregningsgrunnlagPeriode: [{
      beregningsgrunnlagPeriodeFom: '2019-12-31',
      beregningsgrunnlagPeriodeTom: '2019-12-31',
      beregnetPrAar: 817260,
      bruttoPrAar: 817260,
      bruttoInkludertBortfaltNaturalytelsePrAar: 817260,
      avkortetPrAar: 599148,
      redusertPrAar: null,
      periodeAarsaker: [],
      dagsats: null,
      beregningsgrunnlagPrStatusOgAndel: [{
        beregningsgrunnlagFom: '2019-09-01',
        beregningsgrunnlagTom: '2019-11-30',
        aktivitetStatus: { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
        beregningsperiodeFom: '2019-09-01',
        beregningsperiodeTom: '2019-11-30',
        beregnetPrAar: 817260,
        fastsattForrigePrAar: null,
        overstyrtPrAar: null,
        bruttoPrAar: 817260,
        avkortetPrAar: null,
        redusertPrAar: null,
        erTidsbegrensetArbeidsforhold: null,
        erNyIArbeidslivet: null,
        lonnsendringIBeregningsperioden: null,
        andelsnr: 1,
        besteberegningPrAar: null,
        inntektskategori: { kode: 'ARBEIDSTAKER', kodeverk: 'INNTEKTSKATEGORI' },
        arbeidsforhold: {
          arbeidsgiverNavn: 'BERTEL O STEEN OSLO AS AVD SALG ØKERN',
          arbeidsgiverId: '973624385',
          startdato: '2018-05-01',
          opphoersdato: '2019-12-31',
          arbeidsforholdId: null,
          eksternArbeidsforholdId: null,
          arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
          aktørId: null,
          refusjonPrAar: 817260,
          belopFraInntektsmeldingPrMnd: 68105.00,
          organisasjonstype: { kode: 'VIRKSOMHET', kodeverk: 'ORGANISASJONSTYPE' },
          naturalytelseBortfaltPrÅr: null,
          naturalytelseTilkommetPrÅr: null,
        },
        fastsattAvSaksbehandler: false,
        lagtTilAvSaksbehandler: false,
        belopPrMndEtterAOrdningen: 69600.0000000000,
        belopPrAarEtterAOrdningen: 835200.000000000000,
        dagsats: null,
        originalDagsatsFraTilstøtendeYtelse: null,
        fordeltPrAar: null,
        erTilkommetAndel: false,
        skalFastsetteGrunnlag: false,
      }],
    }, {
      beregningsgrunnlagPeriodeFom: '2020-01-01',
      beregningsgrunnlagPeriodeTom: '2020-01-01',
      beregnetPrAar: 817260,
      bruttoPrAar: 817260,
      bruttoInkludertBortfaltNaturalytelsePrAar: 817260,
      avkortetPrAar: 599148,
      redusertPrAar: null,
      periodeAarsaker: [{ kode: 'ENDRING_I_REFUSJONSKRAV', kodeverk: 'PERIODE_AARSAK' }],
      dagsats: null,
      beregningsgrunnlagPrStatusOgAndel: [{
        beregningsgrunnlagFom: '2019-09-01',
        beregningsgrunnlagTom: '2019-11-30',
        aktivitetStatus: { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
        beregningsperiodeFom: '2019-09-01',
        beregningsperiodeTom: '2019-11-30',
        beregnetPrAar: 817260,
        fastsattForrigePrAar: null,
        overstyrtPrAar: null,
        bruttoPrAar: 817260,
        avkortetPrAar: null,
        redusertPrAar: null,
        erTidsbegrensetArbeidsforhold: null,
        erNyIArbeidslivet: null,
        lonnsendringIBeregningsperioden: null,
        andelsnr: 1,
        besteberegningPrAar: null,
        inntektskategori: { kode: 'ARBEIDSTAKER', kodeverk: 'INNTEKTSKATEGORI' },
        arbeidsforhold: {
          arbeidsgiverNavn: 'BERTEL O STEEN OSLO AS AVD SALG ØKERN',
          arbeidsgiverId: '973624385',
          startdato: '2018-05-01',
          opphoersdato: '2019-12-31',
          arbeidsforholdId: null,
          eksternArbeidsforholdId: null,
          arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
          aktørId: null,
          refusjonPrAar: 817260,
          belopFraInntektsmeldingPrMnd: 68105.00,
          organisasjonstype: { kode: 'VIRKSOMHET', kodeverk: 'ORGANISASJONSTYPE' },
          naturalytelseBortfaltPrÅr: null,
          naturalytelseTilkommetPrÅr: null,
        },
        fastsattAvSaksbehandler: false,
        lagtTilAvSaksbehandler: false,
        belopPrMndEtterAOrdningen: 69600.0000000000,
        belopPrAarEtterAOrdningen: 835200.000000000000,
        dagsats: null,
        originalDagsatsFraTilstøtendeYtelse: null,
        fordeltPrAar: null,
        erTilkommetAndel: false,
        skalFastsetteGrunnlag: false,
      }, {
        beregningsgrunnlagFom: '2019-09-01',
        beregningsgrunnlagTom: '2019-11-30',
        aktivitetStatus: { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
        beregningsperiodeFom: '2019-09-01',
        beregningsperiodeTom: '2019-11-30',
        beregnetPrAar: null,
        fastsattForrigePrAar: null,
        overstyrtPrAar: null,
        bruttoPrAar: null,
        avkortetPrAar: null,
        redusertPrAar: null,
        erTidsbegrensetArbeidsforhold: null,
        erNyIArbeidslivet: null,
        lonnsendringIBeregningsperioden: null,
        andelsnr: 2,
        besteberegningPrAar: null,
        inntektskategori: { kode: '-', kodeverk: 'INNTEKTSKATEGORI' },
        arbeidsforhold: {
          arbeidsgiverNavn: 'BERTEL O STEEN LØRENSKOG AS AVD SALG KIA OG CITROËN',
          arbeidsgiverId: '987225734',
          startdato: '2020-01-01',
          opphoersdato: null,
          arbeidsforholdId: null,
          eksternArbeidsforholdId: null,
          arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
          aktørId: null,
          refusjonPrAar: 8499996,
          belopFraInntektsmeldingPrMnd: 708333.00,
          organisasjonstype: { kode: 'VIRKSOMHET', kodeverk: 'ORGANISASJONSTYPE' },
          naturalytelseBortfaltPrÅr: null,
          naturalytelseTilkommetPrÅr: null,
        },
        fastsattAvSaksbehandler: false,
        lagtTilAvSaksbehandler: false,
        belopPrMndEtterAOrdningen: 0E-10,
        belopPrAarEtterAOrdningen: 0E-10,
        dagsats: null,
        originalDagsatsFraTilstøtendeYtelse: null,
        fordeltPrAar: null,
        erTilkommetAndel: true,
        skalFastsetteGrunnlag: false,
      }],
    }, {
      beregningsgrunnlagPeriodeFom: '2020-01-02',
      beregningsgrunnlagPeriodeTom: null,
      beregnetPrAar: 817260,
      bruttoPrAar: 817260,
      bruttoInkludertBortfaltNaturalytelsePrAar: 817260,
      avkortetPrAar: 599148,
      redusertPrAar: null,
      periodeAarsaker: [{ kode: 'REFUSJON_OPPHØRER', kodeverk: 'PERIODE_AARSAK' }],
      dagsats: null,
      beregningsgrunnlagPrStatusOgAndel: [{
        beregningsgrunnlagFom: '2019-09-01',
        beregningsgrunnlagTom: '2019-11-30',
        aktivitetStatus: { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
        beregningsperiodeFom: '2019-09-01',
        beregningsperiodeTom: '2019-11-30',
        beregnetPrAar: 817260,
        fastsattForrigePrAar: null,
        overstyrtPrAar: null,
        bruttoPrAar: 817260,
        avkortetPrAar: null,
        redusertPrAar: null,
        erTidsbegrensetArbeidsforhold: null,
        erNyIArbeidslivet: null,
        lonnsendringIBeregningsperioden: null,
        andelsnr: 1,
        besteberegningPrAar: null,
        inntektskategori: { kode: 'ARBEIDSTAKER', kodeverk: 'INNTEKTSKATEGORI' },
        arbeidsforhold: {
          arbeidsgiverNavn: 'BERTEL O STEEN OSLO AS AVD SALG ØKERN',
          arbeidsgiverId: '973624385',
          startdato: '2018-05-01',
          opphoersdato: '2019-12-31',
          arbeidsforholdId: null,
          eksternArbeidsforholdId: null,
          arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
          aktørId: null,
          refusjonPrAar: 0,
          belopFraInntektsmeldingPrMnd: 68105.00,
          organisasjonstype: { kode: 'VIRKSOMHET', kodeverk: 'ORGANISASJONSTYPE' },
          naturalytelseBortfaltPrÅr: null,
          naturalytelseTilkommetPrÅr: null,
        },
        fastsattAvSaksbehandler: false,
        lagtTilAvSaksbehandler: false,
        belopPrMndEtterAOrdningen: 69600.0000000000,
        belopPrAarEtterAOrdningen: 835200.000000000000,
        dagsats: null,
        originalDagsatsFraTilstøtendeYtelse: null,
        fordeltPrAar: null,
        erTilkommetAndel: false,
        skalFastsetteGrunnlag: false,
      }, {
        beregningsgrunnlagFom: '2019-09-01',
        beregningsgrunnlagTom: '2019-11-30',
        aktivitetStatus: { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
        beregningsperiodeFom: '2019-09-01',
        beregningsperiodeTom: '2019-11-30',
        beregnetPrAar: null,
        fastsattForrigePrAar: null,
        overstyrtPrAar: null,
        bruttoPrAar: null,
        avkortetPrAar: null,
        redusertPrAar: null,
        erTidsbegrensetArbeidsforhold: null,
        erNyIArbeidslivet: null,
        lonnsendringIBeregningsperioden: null,
        andelsnr: 2,
        besteberegningPrAar: null,
        inntektskategori: { kode: '-', kodeverk: 'INNTEKTSKATEGORI' },
        arbeidsforhold: {
          arbeidsgiverNavn: 'BERTEL O STEEN LØRENSKOG AS AVD SALG KIA OG CITROËN',
          arbeidsgiverId: '987225734',
          startdato: '2020-01-01',
          opphoersdato: null,
          arbeidsforholdId: null,
          eksternArbeidsforholdId: null,
          arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
          aktørId: null,
          refusjonPrAar: 8499996,
          belopFraInntektsmeldingPrMnd: 708333.00,
          organisasjonstype: { kode: 'VIRKSOMHET', kodeverk: 'ORGANISASJONSTYPE' },
          naturalytelseBortfaltPrÅr: null,
          naturalytelseTilkommetPrÅr: null,
        },
        fastsattAvSaksbehandler: false,
        lagtTilAvSaksbehandler: false,
        belopPrMndEtterAOrdningen: 0E-10,
        belopPrAarEtterAOrdningen: 0E-10,
        dagsats: null,
        originalDagsatsFraTilstøtendeYtelse: null,
        fordeltPrAar: null,
        erTilkommetAndel: true,
        skalFastsetteGrunnlag: false,
      }],
    }],
    sammenligningsgrunnlag: {
      sammenligningsgrunnlagFom: '2018-12-01',
      sammenligningsgrunnlagTom: '2019-11-30',
      rapportertPrAar: 923892.56,
      avvikPromille: 115.4166238,
      avvikProsent: 11.54166238,
      sammenligningsgrunnlagType: { kode: 'SAMMENLIGNING_ATFL_SN', kodeverk: 'SAMMENLIGNINGSGRUNNLAG_TYPE' },
      differanseBeregnet: -106632.56,
    },
    sammenligningsgrunnlagPrStatus: [{
      sammenligningsgrunnlagFom: '2018-12-01',
      sammenligningsgrunnlagTom: '2019-11-30',
      rapportertPrAar: 923892.56,
      avvikPromille: 115.4166238,
      avvikProsent: 11.54166238,
      sammenligningsgrunnlagType: { kode: 'SAMMENLIGNING_ATFL_SN', kodeverk: 'SAMMENLIGNINGSGRUNNLAG_TYPE' },
      differanseBeregnet: -106632.56,
    }],
    ledetekstBrutto: 'Brutto beregningsgrunnlag',
    ledetekstAvkortet: 'Avkortet beregningsgrunnlag (6G=599148)',
    ledetekstRedusert: 'Redusert beregningsgrunnlag (100%)',
    halvG: 49929.0,
    grunnbeløp: 99858,
    faktaOmBeregning: {
      kortvarigeArbeidsforhold: null,
      frilansAndel: null,
      kunYtelse: null,
      faktaOmBeregningTilfeller: null,
      arbeidstakerOgFrilanserISammeOrganisasjonListe: null,
      arbeidsforholdMedLønnsendringUtenIM: null,
      besteberegningAndeler: null,
      vurderMottarYtelse: null,
      avklarAktiviteter: {
        aktiviteterTomDatoMapping: [{
          tom: '2019-12-31',
          aktiviteter: [{
            arbeidsgiverNavn: 'BERTEL O STEEN OSLO AS AVD SALG ØKERN',
            arbeidsgiverId: '973624385',
            eksternArbeidsforholdId: null,
            fom: '2018-05-01',
            tom: '2019-12-31',
            arbeidsforholdId: null,
            arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
            aktørIdString: null,
            skalBrukes: null,
          }],
        }],
      },
      vurderBesteberegning: null,
      andelerForFaktaOmBeregning: [{
        belopReadOnly: 68105.00,
        fastsattBelop: null,
        inntektskategori: { kode: 'ARBEIDSTAKER', kodeverk: 'INNTEKTSKATEGORI' },
        aktivitetStatus: { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
        refusjonskrav: 68105.00,
        visningsnavn: 'BERTEL O STEEN OSLO AS AVD SALG ØKERN (973624385)',
        arbeidsforhold: {
          arbeidsgiverNavn: 'BERTEL O STEEN OSLO AS AVD SALG ØKERN',
          arbeidsgiverId: '973624385',
          startdato: '2018-05-01',
          opphoersdato: '2019-12-31',
          arbeidsforholdId: null,
          eksternArbeidsforholdId: null,
          arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
          aktørId: null,
          refusjonPrAar: null,
          belopFraInntektsmeldingPrMnd: 68105.00,
          organisasjonstype: { kode: 'VIRKSOMHET', kodeverk: 'ORGANISASJONSTYPE' },
          naturalytelseBortfaltPrÅr: null,
          naturalytelseTilkommetPrÅr: null,
        },
        andelsnr: 1,
        skalKunneEndreAktivitet: false,
        lagtTilAvSaksbehandler: false,
      }],
      vurderMilitaer: null,
      refusjonskravSomKommerForSentListe: null,
    },
    andelerMedGraderingUtenBG: null,
    hjemmel: { kode: 'F_14_7_8_30', kodeverk: 'BG_HJEMMEL' },
    faktaOmFordeling: {
      fordelBeregningsgrunnlag: {
        fordelBeregningsgrunnlagPerioder: [{
          fom: '2019-12-31',
          tom: '2019-12-31',
          fordelBeregningsgrunnlagAndeler: [{
            fordelingForrigeBehandlingPrAar: null,
            refusjonskravPrAar: 817260,
            fordeltPrAar: null,
            belopFraInntektsmeldingPrAar: 817260,
            refusjonskravFraInntektsmeldingPrAar: 817260,
            nyttArbeidsforhold: false,
            arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
            andelsnr: 1,
            arbeidsforhold: {
              arbeidsgiverNavn: 'BERTEL O STEEN OSLO AS AVD SALG ØKERN',
              arbeidsgiverId: '973624385',
              startdato: '2018-05-01',
              opphoersdato: '2019-12-31',
              arbeidsforholdId: null,
              eksternArbeidsforholdId: null,
              arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
              aktørId: null,
              refusjonPrAar: 817260,
              belopFraInntektsmeldingPrMnd: null,
              organisasjonstype: { kode: 'VIRKSOMHET', kodeverk: 'ORGANISASJONSTYPE' },
              naturalytelseBortfaltPrÅr: null,
              naturalytelseTilkommetPrÅr: null,
            },
            inntektskategori: { kode: 'ARBEIDSTAKER', kodeverk: 'INNTEKTSKATEGORI' },
            aktivitetStatus: { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
            lagtTilAvSaksbehandler: false,
            fastsattAvSaksbehandler: false,
            andelIArbeid: [0],
          }],
          harPeriodeAarsakGraderingEllerRefusjon: false,
          skalKunneEndreRefusjon: false,
        }, {
          fom: '2020-01-01',
          tom: '2020-01-01',
          fordelBeregningsgrunnlagAndeler: [{
            fordelingForrigeBehandlingPrAar: null,
            refusjonskravPrAar: 817260,
            fordeltPrAar: null,
            belopFraInntektsmeldingPrAar: 817260,
            refusjonskravFraInntektsmeldingPrAar: 0,
            nyttArbeidsforhold: false,
            arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
            andelsnr: 1,
            arbeidsforhold: {
              arbeidsgiverNavn: 'BERTEL O STEEN OSLO AS AVD SALG ØKERN',
              arbeidsgiverId: '973624385',
              startdato: '2018-05-01',
              opphoersdato: '2019-12-31',
              arbeidsforholdId: null,
              eksternArbeidsforholdId: null,
              arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
              aktørId: null,
              refusjonPrAar: 817260,
              belopFraInntektsmeldingPrMnd: null,
              organisasjonstype: { kode: 'VIRKSOMHET', kodeverk: 'ORGANISASJONSTYPE' },
              naturalytelseBortfaltPrÅr: null,
              naturalytelseTilkommetPrÅr: null,
            },
            inntektskategori: { kode: 'ARBEIDSTAKER', kodeverk: 'INNTEKTSKATEGORI' },
            aktivitetStatus: { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
            lagtTilAvSaksbehandler: false,
            fastsattAvSaksbehandler: false,
            andelIArbeid: [0],
          }, {
            fordelingForrigeBehandlingPrAar: null,
            refusjonskravPrAar: 8499996,
            fordeltPrAar: null,
            belopFraInntektsmeldingPrAar: 8499996,
            refusjonskravFraInntektsmeldingPrAar: 8499996,
            nyttArbeidsforhold: true,
            arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
            andelsnr: 2,
            arbeidsforhold: {
              arbeidsgiverNavn: 'BERTEL O STEEN LØRENSKOG AS AVD SALG KIA OG CITROËN',
              arbeidsgiverId: '987225734',
              startdato: '2020-01-01',
              opphoersdato: null,
              arbeidsforholdId: null,
              eksternArbeidsforholdId: null,
              arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
              aktørId: null,
              refusjonPrAar: 8499996,
              belopFraInntektsmeldingPrMnd: null,
              organisasjonstype: { kode: 'VIRKSOMHET', kodeverk: 'ORGANISASJONSTYPE' },
              naturalytelseBortfaltPrÅr: null,
              naturalytelseTilkommetPrÅr: null,
            },
            inntektskategori: null,
            aktivitetStatus: { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
            lagtTilAvSaksbehandler: false,
            fastsattAvSaksbehandler: false,
            andelIArbeid: [0],
          }],
          harPeriodeAarsakGraderingEllerRefusjon: true,
          skalKunneEndreRefusjon: false,
        }, {
          fom: '2020-01-02',
          tom: null,
          fordelBeregningsgrunnlagAndeler: [{
            fordelingForrigeBehandlingPrAar: null,
            refusjonskravPrAar: 0,
            fordeltPrAar: null,
            belopFraInntektsmeldingPrAar: 817260,
            refusjonskravFraInntektsmeldingPrAar: 0,
            nyttArbeidsforhold: false,
            arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
            andelsnr: 1,
            arbeidsforhold: {
              arbeidsgiverNavn: 'BERTEL O STEEN OSLO AS AVD SALG ØKERN',
              arbeidsgiverId: '973624385',
              startdato: '2018-05-01',
              opphoersdato: '2019-12-31',
              arbeidsforholdId: null,
              eksternArbeidsforholdId: null,
              arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
              aktørId: null,
              refusjonPrAar: 0,
              belopFraInntektsmeldingPrMnd: null,
              organisasjonstype: { kode: 'VIRKSOMHET', kodeverk: 'ORGANISASJONSTYPE' },
              naturalytelseBortfaltPrÅr: null,
              naturalytelseTilkommetPrÅr: null,
            },
            inntektskategori: { kode: 'ARBEIDSTAKER', kodeverk: 'INNTEKTSKATEGORI' },
            aktivitetStatus: { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
            lagtTilAvSaksbehandler: false,
            fastsattAvSaksbehandler: false,
            andelIArbeid: [0],
          }, {
            fordelingForrigeBehandlingPrAar: null,
            refusjonskravPrAar: 8499996,
            fordeltPrAar: null,
            belopFraInntektsmeldingPrAar: 8499996,
            refusjonskravFraInntektsmeldingPrAar: 8499996,
            nyttArbeidsforhold: true,
            arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
            andelsnr: 2,
            arbeidsforhold: {
              arbeidsgiverNavn: 'BERTEL O STEEN LØRENSKOG AS AVD SALG KIA OG CITROËN',
              arbeidsgiverId: '987225734',
              startdato: '2020-01-01',
              opphoersdato: null,
              arbeidsforholdId: null,
              eksternArbeidsforholdId: null,
              arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
              aktørId: null,
              refusjonPrAar: 8499996,
              belopFraInntektsmeldingPrMnd: null,
              organisasjonstype: { kode: 'VIRKSOMHET', kodeverk: 'ORGANISASJONSTYPE' },
              naturalytelseBortfaltPrÅr: null,
              naturalytelseTilkommetPrÅr: null,
            },
            inntektskategori: null,
            aktivitetStatus: { kode: 'AT', kodeverk: 'AKTIVITET_STATUS' },
            lagtTilAvSaksbehandler: false,
            fastsattAvSaksbehandler: false,
            andelIArbeid: [0],
          }],
          harPeriodeAarsakGraderingEllerRefusjon: true,
          skalKunneEndreRefusjon: false,
        }],
        arbeidsforholdTilFordeling: [{
          arbeidsgiverNavn: 'BERTEL O STEEN LØRENSKOG AS AVD SALG KIA OG CITROËN',
          arbeidsgiverId: '987225734',
          startdato: '2020-01-01',
          opphoersdato: null,
          arbeidsforholdId: null,
          eksternArbeidsforholdId: null,
          arbeidsforholdType: { kode: 'ARBEID', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
          aktørId: null,
          refusjonPrAar: 8499996,
          belopFraInntektsmeldingPrMnd: null,
          organisasjonstype: { kode: 'VIRKSOMHET', kodeverk: 'ORGANISASJONSTYPE' },
          naturalytelseBortfaltPrÅr: null,
          naturalytelseTilkommetPrÅr: null,
          perioderMedGraderingEllerRefusjon: [{
            erRefusjon: true, erGradering: false, fom: '2020-01-01', tom: null,
          }],
          permisjon: null,
        }],
      },
    },
    årsinntektVisningstall: 817260,
    dekningsgrad: 100,
  };

  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_AKTIVITETER,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      readOnly={boolean('readOnly', false)}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
    />
  );
};


export const AvklarAktiviteterFullAAPOgAndreAktiviteter = () => {
  const aapAktivitet = {
    arbeidsforholdType: { kode: opptjeningAktivitetType.AAP, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
    fom: '01-01-2019',
    tom: '01-04-2020',
  };
  const arbeidsAktivitet = {
    ...standardFaktaArbeidstakerAndel.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
  };
  const aktiviteter = [
    aapAktivitet,
    arbeidsAktivitet,
  ];
  const beregningsgrunnlag = lagBeregningsgrunnlagAvklarAktiviteter(aktiviteter);

  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_AKTIVITETER,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      readOnly={boolean('readOnly', false)}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
    />
  );
};


export const AvklartAktiviteterMedAksjonspunktIFaktaAvklaring = () => {
  const aapAktivitet = {
    arbeidsforholdType: { kode: opptjeningAktivitetType.AAP, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
    fom: '01-01-2019',
    tom: '01-04-2020',
  };
  const arbeidsAktivitet = {
    ...standardFaktaArbeidstakerAndel.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const aktiviteter = [
    aapAktivitet,
    arbeidsAktivitet,
  ];
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const aapBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaAAPAndel.andelsnr,
    aktivitetStatus: standardFaktaAAPAndel.aktivitetStatus,
    inntektskategori: standardFaktaAAPAndel.inntektskategori,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    aapBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaAAPAndel,
  ];
  const refusjonskravSomKommerForSentListe = [
    {
      arbeidsgiverId: standardFaktaArbeidstakerAndel.arbeidsforhold.arbeidsforholdId,
      arbeidsgiverVisningsnavn: standardFaktaArbeidstakerAndel.visningsnavn,
    },
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT]),
    refusjonskravSomKommerForSentListe,
    andelerForFaktaOmBeregning,
    avklarAktiviteter: {
      aktiviteterTomDatoMapping: [
        {
          tom: '01-01-2020',
          aktiviteter,
        },
      ],
    },
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_AKTIVITETER,
        },
        status: {
          kode: aksjonspunktStatus.UTFORT,
        },
        begrunnelse: 'En begrunnelse for at arbeidsforholdet var gyldig.',
        kanLoses: true,
        erAktivt: true,
      },
      {
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      readOnly={boolean('readOnly', false)}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
    />
  );
};

export const FrilansOgArbeidsforholdMedLønnendringOgNyoppstartet = () => {
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const frilansBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaFrilansAndel.andelsnr,
    aktivitetStatus: standardFaktaFrilansAndel.aktivitetStatus,
    inntektskategori: standardFaktaFrilansAndel.inntektskategori,
    erNyoppstartet: null,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    frilansBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaFrilansAndel,
  ];
  const vurderMottarYtelse = {
    erFrilans: true,
    frilansMottarYtelse: null,
    frilansInntektPrMnd: 20000,
    arbeidstakerAndelerUtenIM: [],
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_LONNSENDRING, VURDER_NYOPPSTARTET_FL, VURDER_MOTTAR_YTELSE]),
    arbeidsforholdMedLønnsendringUtenIM: [arbeidstakerBeregningsgrunnlagAndel],
    vurderMottarYtelse,
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);

  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      readOnly={boolean('readOnly', false)}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
    />
  );
};


export const DagpengerOgArbeidstakerMedVurderingAvBesteberegning = () => {
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const dagpengerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaDagpengerAndel.andelsnr,
    aktivitetStatus: standardFaktaDagpengerAndel.aktivitetStatus,
    inntektskategori: standardFaktaDagpengerAndel.inntektskategori,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    dagpengerBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaDagpengerAndel,
  ];
  const vurderBesteberegning = {
    skalHaBesteberegning: null,
    andeler: [standardFaktaDagpengerAndel, standardFaktaArbeidstakerAndel],
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_BESTEBEREGNING]),
    vurderBesteberegning,
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);

  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      readOnly={boolean('readOnly', false)}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
    />
  );
};


export const KunArbeidstakerMedVurderingAvBesteberegning = () => {
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const arbeidstakerBeregningsgrunnlagAndel2 = {
    andelsnr: standardFaktaArbeidstakerAndel2.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel2.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel2.inntektskategori,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    arbeidstakerBeregningsgrunnlagAndel2,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaArbeidstakerAndel2,
  ];
  const vurderBesteberegning = {
    skalHaBesteberegning: null,
    andeler: [standardFaktaArbeidstakerAndel2, standardFaktaArbeidstakerAndel],
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_BESTEBEREGNING]),
    vurderBesteberegning,
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      readOnly={boolean('readOnly', false)}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
    />
  );
};

export const KunArbeidstakerMedVurderingSentRefusjonskrav = () => {
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const arbeidstakerBeregningsgrunnlagAndel2 = {
    andelsnr: standardFaktaArbeidstakerAndel2.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel2.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel2.inntektskategori,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    arbeidstakerBeregningsgrunnlagAndel2,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaArbeidstakerAndel2,
  ];
  const refusjonskravSomKommerForSentListe = [
    {
      arbeidsgiverId: standardFaktaArbeidstakerAndel.arbeidsforhold.arbeidsforholdId,
      arbeidsgiverVisningsnavn: standardFaktaArbeidstakerAndel.visningsnavn,
    },
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT]),
    refusjonskravSomKommerForSentListe,
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);

  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      readOnly={boolean('readOnly', false)}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
    />
  );
};

export const FrilansOgArbeidsforholdISammeOrganisasjon = () => {
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
    arbeidsforhold: standardFaktaArbeidstakerAndel.arbeidsforhold,
  };
  const frilansBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaFrilansAndel.andelsnr,
    aktivitetStatus: standardFaktaFrilansAndel.aktivitetStatus,
    inntektskategori: standardFaktaFrilansAndel.inntektskategori,
    erNyoppstartet: null,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    frilansBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaFrilansAndel,
  ];
  const vurderMottarYtelse = {
    erFrilans: true,
    frilansMottarYtelse: null,
    frilansInntektPrMnd: 30000,
    arbeidstakerAndelerUtenIM: [],
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_AT_OG_FL_I_SAMME_ORGANISASJON, VURDER_MOTTAR_YTELSE]),
    arbeidstakerOgFrilanserISammeOrganisasjonListe: [arbeidstakerBeregningsgrunnlagAndel],
    vurderMottarYtelse,
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      readOnly={boolean('readOnly', false)}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
    />
  );
};

export const VurderingAvMilitær = () => {
  const arbeidstakerMilitærAndel = {
    andelsnr: standardFaktaMilitærAndel.andelsnr,
    aktivitetStatus: standardFaktaMilitærAndel.aktivitetStatus,
    inntektskategori: standardFaktaMilitærAndel.inntektskategori,
  };
  const andeler = [
    arbeidstakerMilitærAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaMilitærAndel,
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_MILITÆR_SIVILTJENESTE]),
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      readOnly={boolean('readOnly', false)}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
    />
  );
};


export const FrilansOgTidsbegrensetArbeidsforholdISammeOrganisasjon = () => {
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: tidsbegrensetFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: tidsbegrensetFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: tidsbegrensetFaktaArbeidstakerAndel.inntektskategori,
    arbeidsforhold: tidsbegrensetFaktaArbeidstakerAndel.arbeidsforhold,
  };
  const frilansBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaFrilansAndel.andelsnr,
    aktivitetStatus: standardFaktaFrilansAndel.aktivitetStatus,
    inntektskategori: standardFaktaFrilansAndel.inntektskategori,
    erNyoppstartet: null,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    frilansBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    tidsbegrensetFaktaArbeidstakerAndel,
    standardFaktaFrilansAndel,
  ];
  const vurderMottarYtelse = {
    erFrilans: true,
    frilansMottarYtelse: null,
    frilansInntektPrMnd: 30000,
    arbeidstakerAndelerUtenIM: [],
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_AT_OG_FL_I_SAMME_ORGANISASJON, VURDER_MOTTAR_YTELSE, VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD]),
    arbeidstakerOgFrilanserISammeOrganisasjonListe: [arbeidstakerBeregningsgrunnlagAndel],
    kortvarigeArbeidsforhold: [arbeidstakerBeregningsgrunnlagAndel],
    vurderMottarYtelse,
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      readOnly={boolean('readOnly', false)}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
    />
  );
};


export const KunTidsbegrensetArbeidsforhold = () => {
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: tidsbegrensetFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: tidsbegrensetFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: tidsbegrensetFaktaArbeidstakerAndel.inntektskategori,
    arbeidsforhold: tidsbegrensetFaktaArbeidstakerAndel.arbeidsforhold,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    tidsbegrensetFaktaArbeidstakerAndel,
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD]),
    kortvarigeArbeidsforhold: [arbeidstakerBeregningsgrunnlagAndel],
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      readOnly={boolean('readOnly', false)}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
    />
  );
};

export const VurderingAvEtterlønnSluttpakke = () => {
  const etterlønnSluttpakkeBeregningsgrunnlagAndel = {
    andelsnr: etterlønnSluttpakkeFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: etterlønnSluttpakkeFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: etterlønnSluttpakkeFaktaArbeidstakerAndel.inntektskategori,
    arbeidsforhold: etterlønnSluttpakkeFaktaArbeidstakerAndel.arbeidsforhold,
  };
  const andeler = [
    etterlønnSluttpakkeBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    etterlønnSluttpakkeFaktaArbeidstakerAndel,
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_ETTERLONN_SLUTTPAKKE]),
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      readOnly={boolean('readOnly', false)}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
    />
  );
};

export const FastsettingAvBeregningsgrunnlagForKunYtelse = () => {
  const beregningsgrunnlagYtelseAndel = {
    andelsnr: standardFaktaYtelseAndel.andelsnr,
    aktivitetStatus: standardFaktaYtelseAndel.aktivitetStatus,
    inntektskategori: standardFaktaYtelseAndel.inntektskategori,
  };
  const andeler = [
    beregningsgrunnlagYtelseAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaYtelseAndel,
  ];
  const kunYtelse = {
    fodendeKvinneMedDP: false,
    andeler,
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([FASTSETT_BG_KUN_YTELSE]),
    andelerForFaktaOmBeregning,
    kunYtelse,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      readOnly={boolean('readOnly', false)}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
    />
  );
};

export const SelvstendigNæringNyIArbeidslivet = () => {
  const beregningsgrunnlagNæringAndel = {
    andelsnr: standardFaktaNæringAndel.andelsnr,
    aktivitetStatus: standardFaktaNæringAndel.aktivitetStatus,
    inntektskategori: standardFaktaNæringAndel.inntektskategori,
  };
  const andeler = [
    beregningsgrunnlagNæringAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaNæringAndel,
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_SN_NY_I_ARBEIDSLIVET]),
    andelerForFaktaOmBeregning,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      readOnly={boolean('readOnly', false)}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
    />
  );
};

export const KombinasjonstestForFaktapanel = () => {
  const aapAktivitet = {
    arbeidsforholdType: { kode: opptjeningAktivitetType.AAP, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
    fom: '01-01-2019',
    tom: '01-04-2020',
  };
  const arbeidsAktivitet = {
    ...standardFaktaArbeidstakerAndel.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const arbeidsAktivitet2 = {
    ...standardFaktaArbeidstakerAndel2.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const tidsbegrensetarbeidsAktivitet = {
    ...tidsbegrensetFaktaArbeidstakerAndel.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const næringAktivitet = {
    arbeidsforholdType: { kode: opptjeningAktivitetType.NARING, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const etterlonnSluttpakkeAktivitet = {
    ...etterlønnSluttpakkeFaktaArbeidstakerAndel.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const frilansAktivitet = {
    arbeidsforholdType: { kode: opptjeningAktivitetType.FRILANS, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const militærAktivitet = {
    arbeidsforholdType: { kode: opptjeningAktivitetType.MILITAR_ELLER_SIVILTJENESTE, kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const aktiviteter = [
    aapAktivitet,
    arbeidsAktivitet,
    arbeidsAktivitet2,
    næringAktivitet,
    tidsbegrensetarbeidsAktivitet,
    etterlonnSluttpakkeAktivitet,
    frilansAktivitet,
    militærAktivitet,
  ];
  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const arbeidstakerBeregningsgrunnlagAndel2 = {
    andelsnr: standardFaktaArbeidstakerAndel2.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel2.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel2.inntektskategori,
    arbeidsforhold: standardFaktaArbeidstakerAndel2.arbeidsforhold,

  };
  const tidsbegrensetarbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: tidsbegrensetFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: tidsbegrensetFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: tidsbegrensetFaktaArbeidstakerAndel.inntektskategori,
    arbeidsforhold: tidsbegrensetFaktaArbeidstakerAndel.arbeidsforhold,
  };
  const beregningsgrunnlagNæringAndel = {
    andelsnr: standardFaktaNæringAndel.andelsnr,
    aktivitetStatus: standardFaktaNæringAndel.aktivitetStatus,
    inntektskategori: standardFaktaNæringAndel.inntektskategori,
  };
  const aapBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaAAPAndel.andelsnr,
    aktivitetStatus: standardFaktaAAPAndel.aktivitetStatus,
    inntektskategori: standardFaktaAAPAndel.inntektskategori,
  };
  const etterlønnSluttpakkeBeregningsgrunnlagAndel = {
    andelsnr: etterlønnSluttpakkeFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: etterlønnSluttpakkeFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: etterlønnSluttpakkeFaktaArbeidstakerAndel.inntektskategori,
    arbeidsforhold: etterlønnSluttpakkeFaktaArbeidstakerAndel.arbeidsforhold,
  };
  const frilansBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaFrilansAndel.andelsnr,
    aktivitetStatus: standardFaktaFrilansAndel.aktivitetStatus,
    inntektskategori: standardFaktaFrilansAndel.inntektskategori,
    erNyoppstartet: null,
  };
  const militærBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaMilitærAndel.andelsnr,
    aktivitetStatus: standardFaktaMilitærAndel.aktivitetStatus,
    inntektskategori: standardFaktaMilitærAndel.inntektskategori,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    arbeidstakerBeregningsgrunnlagAndel2,
    tidsbegrensetarbeidstakerBeregningsgrunnlagAndel,
    beregningsgrunnlagNæringAndel,
    aapBeregningsgrunnlagAndel,
    etterlønnSluttpakkeBeregningsgrunnlagAndel,
    frilansBeregningsgrunnlagAndel,
    militærBeregningsgrunnlagAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaArbeidstakerAndel2,
    tidsbegrensetFaktaArbeidstakerAndel,
    standardFaktaNæringAndel,
    standardFaktaAAPAndel,
    etterlønnSluttpakkeFaktaArbeidstakerAndel,
    standardFaktaFrilansAndel,
    standardFaktaMilitærAndel,
  ];
  const refusjonskravSomKommerForSentListe = [
    {
      arbeidsgiverId: standardFaktaArbeidstakerAndel.arbeidsforhold.arbeidsforholdId,
      arbeidsgiverVisningsnavn: standardFaktaArbeidstakerAndel.visningsnavn,
    },
  ];
  const vurderMottarYtelse = {
    erFrilans: true,
    frilansMottarYtelse: null,
    frilansInntektPrMnd: 30000,
    arbeidstakerAndelerUtenIM: [standardFaktaArbeidstakerAndel2],
  };
  const vurderBesteberegning = {
    skalHaBesteberegning: null,
    andeler: andelerForFaktaOmBeregning,
  };

  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT, VURDER_SN_NY_I_ARBEIDSLIVET, VURDER_NYOPPSTARTET_FL,
      VURDER_ETTERLONN_SLUTTPAKKE, VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD, VURDER_BESTEBEREGNING, VURDER_AT_OG_FL_I_SAMME_ORGANISASJON, VURDER_MOTTAR_YTELSE,
      VURDER_MILITÆR_SIVILTJENESTE]),
    refusjonskravSomKommerForSentListe,
    arbeidstakerOgFrilanserISammeOrganisasjonListe: [arbeidstakerBeregningsgrunnlagAndel2],
    kortvarigeArbeidsforhold: [tidsbegrensetarbeidstakerBeregningsgrunnlagAndel],
    vurderBesteberegning,
    andelerForFaktaOmBeregning,
    vurderMottarYtelse,
    avklarAktiviteter: {
      aktiviteterTomDatoMapping: [
        {
          tom: '01-01-2020',
          aktiviteter,
        },
      ],
    },
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_AKTIVITETER,
        },
        status: {
          kode: aksjonspunktStatus.UTFORT,
        },
        begrunnelse: 'En begrunnelse for at arbeidsforholdet var gyldig.',
        kanLoses: true,
        erAktivt: true,
      },
      {
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      readOnly={boolean('readOnly', false)}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
    />
  );
};


export const OverstyringAvInntekt = () => {
  const arbeidsAktivitet = {
    ...standardFaktaArbeidstakerAndel.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const arbeidsAktivitet2 = {
    ...standardFaktaArbeidstakerAndel2.arbeidsforhold,
    fom: '01-01-2019',
    tom: '01-04-2020',
    skalBrukes: true,
  };
  const aktiviteter = [
    arbeidsAktivitet,
    arbeidsAktivitet2,
  ];

  const arbeidstakerBeregningsgrunnlagAndel = {
    andelsnr: standardFaktaArbeidstakerAndel.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel.inntektskategori,
  };
  const arbeidstakerBeregningsgrunnlagAndel2 = {
    andelsnr: standardFaktaArbeidstakerAndel2.andelsnr,
    aktivitetStatus: standardFaktaArbeidstakerAndel2.aktivitetStatus,
    inntektskategori: standardFaktaArbeidstakerAndel2.inntektskategori,
  };
  const andeler = [
    arbeidstakerBeregningsgrunnlagAndel,
    arbeidstakerBeregningsgrunnlagAndel2,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaArbeidstakerAndel,
    standardFaktaArbeidstakerAndel2,
  ];
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: [],
    andelerForFaktaOmBeregning,
    avklarAktiviteter: {
      aktiviteterTomDatoMapping: [
        {
          tom: '01-01-2020',
          aktiviteter,
        },
      ],
    },
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);

  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      readOnly={boolean('readOnly', false)}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
    />
  );
};

export const VurderKunYtelseBesteberegning = () => {
  const beregningsgrunnlagYtelseAndel = {
    andelsnr: standardFaktaYtelseAndel.andelsnr,
    aktivitetStatus: standardFaktaYtelseAndel.aktivitetStatus,
    inntektskategori: standardFaktaYtelseAndel.inntektskategori,
  };
  const andeler = [
    beregningsgrunnlagYtelseAndel,
  ];
  const andelerForFaktaOmBeregning = [
    standardFaktaYtelseAndel,
  ];
  const kunYtelse = {
    fodendeKvinneMedDP: true,
    andeler,
  };
  const faktaOmBeregning = {
    faktaOmBeregningTilfeller: mapTilKodeliste([FASTSETT_BG_KUN_YTELSE]),
    andelerForFaktaOmBeregning,
    kunYtelse,
  };
  const beregningsgrunnlag = lagBeregningsgrunnlag(andeler, faktaOmBeregning);
  return (
    <BeregningFaktaIndex
      behandling={behandling}
      beregningsgrunnlag={object('beregningsgrunnlag', beregningsgrunnlag)}
      aksjonspunkter={[{
        definisjon: {
          kode: aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
        begrunnelse: undefined,
        kanLoses: true,
        erAktivt: true,
      }]}
      erOverstyrer={false}
      alleKodeverk={alleKodeverk}
      alleMerknaderFraBeslutter={{
        [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: object('merknaderFraBeslutter', merknaderFraBeslutter),
      }}
      submitCallback={action('button-click')}
      readOnly={boolean('readOnly', false)}
      harApneAksjonspunkter={boolean('harApneAksjonspunkter', true)}
      submittable={boolean('submittable', true)}
    />
  );
};
