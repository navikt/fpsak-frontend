import PropTypes from 'prop-types';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const beregningsgrunnlagArbeidsforholdProptype = PropTypes.shape({
  arbeidsgiverNavn: PropTypes.string,
  arbeidsgiverId: PropTypes.string,
  startdato: PropTypes.string,
  opphoersdato: PropTypes.string,
  arbeidsforholdId: PropTypes.string,
  arbeidsforholdType: kodeverkObjektPropType,
});

const perioderMedGraderingEllerRefusjonPropType = PropTypes.shape({
  erRefusjon: PropTypes.bool,
  erGradering: PropTypes.bool,
  fom: PropTypes.string,
  tom: PropTypes.string,
});

const arbeidsforholdTilFordelingPropType = PropTypes.shape({
  aktørId: PropTypes.number,
  arbeidsforholdId: PropTypes.string,
  arbeidsforholdType: kodeverkObjektPropType,
  arbeidsgiverId: PropTypes.string,
  arbeidsgiverNavn: PropTypes.string,
  belopFraInntektsmeldingPrMnd: PropTypes.number,
  eksternArbeidsforholdId: PropTypes.string,
  naturalytelseBortfaltPrÅr: PropTypes.number,
  naturalytelseTilkommetPrÅr: PropTypes.number,
  organisasjonstype: kodeverkObjektPropType,
  perioderMedGraderingEllerRefusjon: PropTypes.arrayOf(perioderMedGraderingEllerRefusjonPropType),
  permisjon: PropTypes.shape({
    permisjonFom: PropTypes.string,
    permisjonTom: PropTypes.string,
  }),
  refusjonPrAar: PropTypes.number,
  startdato: PropTypes.string,
  opphoersdato: PropTypes.string,
});

const fordelBeregningsgrunnlagAndelPropType = PropTypes.shape({
  aktivitetStatus: kodeverkObjektPropType,
  andelIArbeid: PropTypes.arrayOf(PropTypes.number),
  andelsnr: PropTypes.number,
  arbeidsforhold: beregningsgrunnlagArbeidsforholdProptype,
  arbeidsforholdType: kodeverkObjektPropType,
  belopFraInntektsmeldingPrAar: PropTypes.number,
  fastsattForrigePrAar: PropTypes.number,
  fordelingForrigeBehandlingPrAar: PropTypes.number,
  fordeltPrAar: PropTypes.number,
  inntektskategori: kodeverkObjektPropType,
  lagtTilAvSaksbehandler: PropTypes.bool,
  nyttArbeidsforhold: PropTypes.bool,
  refusjonskravFraInntektsmeldingPrAar: PropTypes.number,
  refusjonskravPrAar: PropTypes.number,
});

const fordelBeregningsgrunnlagPeriodePropType = PropTypes.shape({
  fom: PropTypes.string,
  fordelBeregningsgrunnlagAndeler: PropTypes.arrayOf(fordelBeregningsgrunnlagAndelPropType),
  harPeriodeAarsakGraderingEllerRefusjon: PropTypes.bool,
  skalKunneEndreRefusjon: PropTypes.bool,
  tom: PropTypes.string,
});

const fordelBeregningsgrunnlagPropType = PropTypes.shape({
  arbeidsforholdTilFordeling: PropTypes.arrayOf(arbeidsforholdTilFordelingPropType),
  fordelBeregningsgrunnlagPerioder: PropTypes.arrayOf(fordelBeregningsgrunnlagPeriodePropType),
});

const faktaOmFordelingPropType = PropTypes.shape({
  fordelBeregningsgrunnlag: fordelBeregningsgrunnlagPropType,
});

const beregningsgrunnlagPropType = PropTypes.shape({
  aktivitetStatus: PropTypes.arrayOf(PropTypes.shape({
    aktivitetStatus: kodeverkObjektPropType,
  })),
  beregningsgrunnlagPeriode: PropTypes.arrayOf(PropTypes.shape({
    avkortetPrAar: PropTypes.number,
    beregnetPrAar: PropTypes.number,
    beregningsgrunnlagPeriodeFom: PropTypes.string,
    beregningsgrunnlagPeriodeTom: PropTypes.string,
    bruttoInkludertBortfaltNaturalytelsePrAar: PropTypes.number,
    bruttoPrAar: PropTypes.number,
    dagsats: PropTypes.number,
    ledetekstAvkortet: PropTypes.string,
    ledetekstBrutto: PropTypes.string,
    ledetekstRedusert: PropTypes.string,
    overstyrtPrAar: PropTypes.number,
    redusertPrAar: PropTypes.number,
    periodeAarsaker: PropTypes.arrayOf(kodeverkObjektPropType),
    beregningsgrunnlagPrStatusOgAndel: PropTypes.arrayOf(PropTypes.shape({
      aktivitetStatus: kodeverkObjektPropType,
      arbeidsforholdType: kodeverkObjektPropType,
      avkortetPrAar: PropTypes.number,
      beregnetPrAar: PropTypes.number,
      beregningsgrunnlagFom: PropTypes.string,
      beregningsgrunnlagTom: PropTypes.string,
      bruttoPrAar: PropTypes.number,
      arbeidsforholdId: PropTypes.string,
      overstyrtPrAar: PropTypes.number,
      redusertPrAar: PropTypes.number,
      pgi1: PropTypes.number,
      pgi2: PropTypes.number,
      pgi3: PropTypes.number,
      pgiSnitt: PropTypes.number,
      aarsbeloepFraTilstoetendeYtelse: PropTypes.number,
      bortfaltNaturalytelse: PropTypes.number,
      erNyIArbeidslivet: PropTypes.bool,
      erTidsbegrensetArbeidsforhold: PropTypes.bool,
      erNyoppstartet: PropTypes.bool,
      arbeidsgiverId: PropTypes.string,
      arbeidsgiverNavn: PropTypes.string,
      andelsnr: PropTypes.number,
      lonnsendringIBeregningsperioden: PropTypes.bool,
      besteberegningPrAar: PropTypes.number,
    })),
  })),
  skjaeringstidspunktBeregning: PropTypes.string,
  faktaOmFordeling: faktaOmFordelingPropType,
});

export default beregningsgrunnlagPropType;
