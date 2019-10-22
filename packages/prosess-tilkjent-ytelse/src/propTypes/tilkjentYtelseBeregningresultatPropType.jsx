import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const tilkjentYtelseBeregningresultatPropType = PropTypes.shape({
  perioder: PropTypes.arrayOf(PropTypes.shape({
    andeler: PropTypes.arrayOf(PropTypes.shape({
      fom: PropTypes.string.isRequired,
      tom: PropTypes.string.isRequired,
      uttak: PropTypes.shape({
        stonadskontoType: kodeverkObjektPropType.isRequired,
      }).isRequired,
      aktivitetStatus: kodeverkObjektPropType.isRequired,
    })),
    fom: PropTypes.string.isRequired,
    tom: PropTypes.string.isRequired,
    dagsats: PropTypes.number.isRequired,
  })),
});

export default tilkjentYtelseBeregningresultatPropType;
