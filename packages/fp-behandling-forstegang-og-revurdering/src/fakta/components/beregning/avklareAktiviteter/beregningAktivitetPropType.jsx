import PropTypes from 'prop-types';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

export const beregningAktivitetPropType = PropTypes.shape({
  arbeidsgiverNavn: PropTypes.string,
  arbeidsgiverId: PropTypes.string,
  fom: PropTypes.string,
  tom: PropTypes.string,
  arbeidsforholdId: PropTypes.string,
  aktørId: PropTypes.shape({
    aktørId: PropTypes.string,
  }),
  arbeidsforholdType: kodeverkObjektPropType,
  skalBrukes: PropTypes.bool,
});

export default beregningAktivitetPropType;
