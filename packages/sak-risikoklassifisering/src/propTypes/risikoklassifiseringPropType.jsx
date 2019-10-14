import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const risikoklassifiseringPropType = PropTypes.shape({
  kontrollresultat: kodeverkObjektPropType.isRequired,
  faresignalVurdering: kodeverkObjektPropType,
  iayFaresignaler: PropTypes.shape({
    faresignaler: PropTypes.arrayOf(PropTypes.string),
  }),
  medlFaresignaler: PropTypes.shape({
    faresignaler: PropTypes.arrayOf(PropTypes.string),
  }),
});

export default risikoklassifiseringPropType;
