import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

import fagsakPersonPropType from './fagsakPersonPropType';

const fagsakInfoPropType = PropTypes.shape({
  saksnummer: PropTypes.number.isRequired,
  fagsakYtelseType: kodeverkObjektPropType.isRequired,
  fagsakPerson: fagsakPersonPropType.isRequired,
});

export default fagsakInfoPropType;
