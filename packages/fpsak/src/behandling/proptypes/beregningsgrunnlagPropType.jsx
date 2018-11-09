import PropTypes from 'prop-types';

const beregningsgrunnlagArbeidsforholdProptype = PropTypes.shape({
  arbeidsgiverNavn: PropTypes.string,
  arbeidsgiverId: PropTypes.string,
  startdato: PropTypes.string,
  opphoersdato: PropTypes.string,
  arbeidsforholdId: PropTypes.string,
  arbeidsforholdType: PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
    kodeverk: PropTypes.string,
  }),
});

const faktaOmBeregningAndelPropType = PropTypes.shape({
  arbeidsforhold: beregningsgrunnlagArbeidsforholdProptype,
  andelsnr: PropTypes.number,
  inntektskategori: PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
    kodeverk: PropTypes.string,
  }),
  aktivitetStatus: PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
    kodeverk: PropTypes.string,
  }),
});


const faktaOmBeregningPropType = PropTypes.shape({
  beregningsgrunnlagArbeidsforhold: PropTypes.arrayOf(PropTypes.shape({
    ...beregningsgrunnlagArbeidsforholdProptype,
    erTidsbegrensetArbeidsforhold: PropTypes.bool,
  })),
  frilansAndel: faktaOmBeregningAndelPropType,
  arbeidsforholdMedLønnsendringUtenIM: faktaOmBeregningAndelPropType,
});

const beregningsgrunnlagPropType = PropTypes.shape({
  aktivitetStatus: PropTypes.arrayOf(PropTypes.shape({
    aktivitetStatus: PropTypes.shape({
      kode: PropTypes.string.isRequired,
      navn: PropTypes.string.isRequired,
      kodeverk: PropTypes.string.isRequired,
    }),
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
    periodeAarsaker: PropTypes.arrayOf(PropTypes.shape({
      kode: PropTypes.string.isRequired,
      kodeverk: PropTypes.string.isRequired,
      navn: PropTypes.string.isRequired,
    })),
    beregningsgrunnlagPrStatusOgAndel: PropTypes.arrayOf(PropTypes.shape({
      aktivitetStatus: PropTypes.shape({
        kode: PropTypes.string.isRequired,
        navn: PropTypes.string.isRequired,
        kodeverk: PropTypes.string.isRequired,
      }),
      arbeidsforholdType: PropTypes.shape({
        kode: PropTypes.string.isRequired,
        navn: PropTypes.string.isRequired,
        kodeverk: PropTypes.string.isRequired,
      }),
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
      erNyoppstartetEllerSammeOrganisasjon: PropTypes.bool,
      arbeidsgiverId: PropTypes.string,
      arbeidsgiverNavn: PropTypes.string,
      andelsnr: PropTypes.number,
      lonnsendringIBeregningsperioden: PropTypes.bool,
      besteberegningPrAar: PropTypes.number,
    })),
  })),
  sammenligningsgrunnlag: PropTypes.shape({
    avvikPromille: PropTypes.number,
    rapportertPrAar: PropTypes.number,
    sammenligningsgrunnlagFom: PropTypes.string,
    sammenligningsgrunnlagTom: PropTypes.string,
  }),
  skjaeringstidspunktBeregning: PropTypes.string,
  faktaOmBeregning: faktaOmBeregningPropType,
});

export default beregningsgrunnlagPropType;
