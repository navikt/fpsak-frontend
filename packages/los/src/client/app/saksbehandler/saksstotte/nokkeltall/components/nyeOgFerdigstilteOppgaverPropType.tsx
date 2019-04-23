import PropTypes from 'prop-types';

import kodeverkPropType from 'kodeverk/kodeverkPropType';

const nyeOgFerdigstilteOppgaverPropType = PropTypes.shape({
  behandlingType: kodeverkPropType.isRequired,
  antallNye: PropTypes.number.isRequired,
  antallFerdigstilte: PropTypes.number.isRequired,
  dato: PropTypes.string.isRequired,
});

export default nyeOgFerdigstilteOppgaverPropType;
