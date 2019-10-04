import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const vergeVergePropType = PropTypes.shape({
  navn: PropTypes.string,
  gyldigFom: PropTypes.string,
  gyldigTom: PropTypes.string,
  fnr: PropTypes.number,
  mandatTekst: PropTypes.number,
  sokerErKontaktPerson: PropTypes.bool,
  vergeErKontaktPerson: PropTypes.string,
  sokerErUnderTvungenForvaltning: PropTypes.bool,
  vergeType: kodeverkObjektPropType,
});

export default vergeVergePropType;
