import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const beregningsresultatPropType = PropTypes.shape({
  beregningResultatPerioder: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  vedtakResultatType: kodeverkObjektPropType.isRequired,
});

export default beregningsresultatPropType;
