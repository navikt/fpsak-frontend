import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const tilkjentYtelseBeregningresultatPropType = PropTypes.shape({
  perioder: PropTypes.arrayOf(PropTypes.shape({
    andeler: PropTypes.arrayOf(PropTypes.shape({
      fom: PropTypes.string,
      tom: PropTypes.string,
      uttak: PropTypes.shape({
        stonadskontoType: PropTypes.string,
      }),
      aktivitetStatus: kodeverkObjektPropType,
    })),
    fom: PropTypes.string.isRequired,
    tom: PropTypes.string.isRequired,
    dagsats: PropTypes.number.isRequired,
  })),
});

export default tilkjentYtelseBeregningresultatPropType;
