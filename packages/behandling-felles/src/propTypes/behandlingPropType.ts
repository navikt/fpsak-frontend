import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const behandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  uuid: PropTypes.string.isRequired,
  status: kodeverkObjektPropType.isRequired,
  type: kodeverkObjektPropType.isRequired,
  fristBehandlingPaaVent: PropTypes.string,
  venteArsakKode: PropTypes.string,
  behandlingPaaVent: PropTypes.bool.isRequired,
  behandlingHenlagt: PropTypes.bool.isRequired,
  behandlingsresultat: PropTypes.shape({}),
});

export default behandlingPropType;
