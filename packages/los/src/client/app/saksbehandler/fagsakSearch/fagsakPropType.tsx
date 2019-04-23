import PropTypes from 'prop-types';

import kodeverkPropType from 'kodeverk/kodeverkPropType';
import personPropType from './personPropType';

const fagsakPropType = PropTypes.shape({
  saksnummer: PropTypes.number.isRequired,
  sakstype: kodeverkPropType.isRequired,
  status: kodeverkPropType.isRequired,
  person: personPropType.isRequired,
  barnFodt: PropTypes.string,
  opprettet: PropTypes.string.isRequired,
  endret: PropTypes.string,
});

export default fagsakPropType;
