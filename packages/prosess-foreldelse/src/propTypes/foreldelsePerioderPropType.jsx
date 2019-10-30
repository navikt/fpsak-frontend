import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const foreldelsePerioderPropType = PropTypes.shape({
  perioder: PropTypes.arrayOf(PropTypes.shape({
    fom: PropTypes.string.isRequired,
    tom: PropTypes.string.isRequired,
    belop: PropTypes.number.isRequired,
    foreldelseVurderingType: kodeverkObjektPropType.isRequired,
  })).isRequired,
});

export default foreldelsePerioderPropType;
