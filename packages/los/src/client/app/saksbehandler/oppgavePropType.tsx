import PropTypes from 'prop-types';

import kodeverkPropType from 'kodeverk/kodeverkPropType';
import oppgaveStatusPropType from './oppgaveStatusPropType';

const oppgavePropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  status: oppgaveStatusPropType.isRequired,
  saksnummer: PropTypes.number.isRequired,
  behandlingId: PropTypes.number.isRequired,
  navn: PropTypes.string.isRequired,
  personnummer: PropTypes.string.isRequired,
  behandlingstype: kodeverkPropType,
  behandlingStatus: kodeverkPropType,
  førsteStønadsdag: PropTypes.string,
  fristForBehandling: PropTypes.string,
  fagsakYtelseType: kodeverkPropType,
  erTilSaksbehandling: PropTypes.bool.isRequired,
});

export default oppgavePropType;
