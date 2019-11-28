import PropTypes from 'prop-types';

import fagsakPersonPropType from './fagsakPersonPropType';

const fagsakInfoPropType = PropTypes.shape({
  saksnummer: PropTypes.number.isRequired,
  fagsakPerson: fagsakPersonPropType.isRequired,
});

export default fagsakInfoPropType;
