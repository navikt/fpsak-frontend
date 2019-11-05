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

const faktaOmBeregningAndelPropType = PropTypes.shape({
  arbeidsforhold: beregningsgrunnlagArbeidsforholdProptype,
  andelsnr: PropTypes.number,
  inntektskategori: kodeverkObjektPropType,
  aktivitetStatus: kodeverkObjektPropType,
});

const andelForFaktaOmBeregningPropType = PropTypes.shape({
  arbeidsforhold: beregningsgrunnlagArbeidsforholdProptype,
  andelsnr: PropTypes.number,
  inntektskategori: kodeverkObjektPropType,
  aktivitetStatus: kodeverkObjektPropType,
  belopReadOnly: PropTypes.number,
  fastsattBelop: PropTypes.number,
  visningsnavn: PropTypes.string.isRequired,
  skalKunneEndreAktivitet: PropTypes.bool.isRequired,
  lagtTilAvSaksbehandler: PropTypes.bool.isRequired,
});

const refusjonskravSomKommerForSentListePropType = PropTypes.shape({
  arbeidsgiverId: PropTypes.string.isRequired,
  arbeidsgiverVisningsnavn: PropTypes.string.isRequired,
  erRefusjonskravGyldig: PropTypes.bool,
});

const vurderMilitaerPropType = PropTypes.shape({
  harMilitaer: PropTypes.bool,
});

const vurderBesteberegningPropType = PropTypes.shape({
  skalHaBesteberegning: PropTypes.bool,
});

export const avklarAktiviteterPropType = PropTypes.shape({
  aktiviteterTomDatoMapping: PropTypes.arrayOf(PropTypes.shape({
    tom: PropTypes.string.isRequired,
    aktiviteter: PropTypes.arrayOf(PropTypes.shape({
      arbeidsgiverNavn: PropTypes.string,
      arbeidsgiverId: PropTypes.string,
      eksternArbeidsforholdId: PropTypes.string,
      fom: PropTypes.string.isRequired,
      tom: PropTypes.string,
      arbeidsforholdId: PropTypes.string,
      arbeidsforholdType: kodeverkObjektPropType.isRequired,
      aktørIdString: PropTypes.string,
    })),
  })),
});

export const faktaOmBeregningPropType = PropTypes.shape({
  beregningsgrunnlagArbeidsforhold: PropTypes.arrayOf(PropTypes.shape({
    ...beregningsgrunnlagArbeidsforholdProptype,
    erTidsbegrensetArbeidsforhold: PropTypes.bool,
  })),
  avklarAktiviteter: avklarAktiviteterPropType,
  frilansAndel: faktaOmBeregningAndelPropType,
  vurderMilitaer: vurderMilitaerPropType,
  vurderBesteberegning: vurderBesteberegningPropType,
  refusjonskravSomKommerForSentListe: PropTypes.arrayOf(refusjonskravSomKommerForSentListePropType),
  arbeidsforholdMedLønnsendringUtenIM: PropTypes.arrayOf(faktaOmBeregningAndelPropType),
  andelerForFaktaOmBeregning: PropTypes.arrayOf(andelForFaktaOmBeregningPropType).isRequired,
});

const beregningsgrunnlagPropType = PropTypes.shape({
  aktivitetStatus: PropTypes.arrayOf(PropTypes.shape({
    aktivitetStatus: kodeverkObjektPropType,
  })),
  beregningsgrunnlagPeriode: PropTypes.arrayOf(PropTypes.shape({
    beregningsgrunnlagPrStatusOgAndel: PropTypes.arrayOf(PropTypes.shape({
      aktivitetStatus: kodeverkObjektPropType,
      arbeidsforholdType: kodeverkObjektPropType,
      beregnetPrAar: PropTypes.number,
      arbeidsforholdId: PropTypes.string,
      erNyIArbeidslivet: PropTypes.bool,
      erTidsbegrensetArbeidsforhold: PropTypes.bool,
      erNyoppstartet: PropTypes.bool,
      arbeidsgiverId: PropTypes.string,
      arbeidsgiverNavn: PropTypes.string,
      andelsnr: PropTypes.number,
      lonnsendringIBeregningsperioden: PropTypes.bool,
    })),
  })),
  faktaOmBeregning: faktaOmBeregningPropType.isRequired,
});

export default beregningsgrunnlagPropType;
