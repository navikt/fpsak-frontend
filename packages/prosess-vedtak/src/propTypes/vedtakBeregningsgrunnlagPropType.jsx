import PropTypes from 'prop-types';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const beregningsgrunnlagPropType = PropTypes.shape({
  aktivitetStatus: PropTypes.arrayOf(PropTypes.shape({
    aktivitetStatus: kodeverkObjektPropType,
  })),
  beregningsgrunnlagPeriode: PropTypes.arrayOf(PropTypes.shape({
    beregningsgrunnlagPrStatusOgAndel: PropTypes.arrayOf(PropTypes.shape({
      aktivitetStatus: kodeverkObjektPropType,
      arbeidsforholdType: kodeverkObjektPropType,
      beregnetPrAar: PropTypes.number,
      overstyrtPrAar: PropTypes.number,
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
});

export default beregningsgrunnlagPropType;
