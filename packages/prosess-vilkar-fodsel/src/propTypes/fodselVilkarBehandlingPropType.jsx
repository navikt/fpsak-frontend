import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const fodselVilkarBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  behandlingsresultat: PropTypes.shape({
    avslagsarsak: kodeverkObjektPropType,
  }),
});

export default fodselVilkarBehandlingPropType;
