import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const fagsakPersonPropType = PropTypes.shape({
  alder: PropTypes.number.isRequired,
  diskresjonskode: kodeverkObjektPropType,
  dodsdato: PropTypes.string,
  erDod: PropTypes.bool.isRequired,
  erKvinne: PropTypes.bool.isRequired,
  navn: PropTypes.string.isRequired,
  personnummer: PropTypes.number.isRequired,
  personstatusType: kodeverkObjektPropType.isRequired,
});

export default fagsakPersonPropType;
