import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import BehandlingPicker from './components/BehandlingPicker';
import behandlingVelgerBehandlingPropType from './propTypes/behandlingVelgerBehandlingPropType';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const BehandlingVelgerSakIndex = ({
  behandlinger,
  saksnummer,
  noExistingBehandlinger,
  behandlingId,
  showAll,
  toggleShowAll,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    <BehandlingPicker
      behandlinger={behandlinger}
      saksnummer={saksnummer}
      noExistingBehandlinger={noExistingBehandlinger}
      behandlingId={behandlingId}
      showAll={showAll}
      toggleShowAll={toggleShowAll}
      alleKodeverk={alleKodeverk}
    />
  </RawIntlProvider>
);

BehandlingVelgerSakIndex.propTypes = {
  behandlinger: PropTypes.arrayOf(behandlingVelgerBehandlingPropType).isRequired,
  saksnummer: PropTypes.string.isRequired,
  noExistingBehandlinger: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number,
  showAll: PropTypes.bool.isRequired,
  toggleShowAll: PropTypes.func.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

BehandlingVelgerSakIndex.defaultProps = {
  behandlingId: undefined,
};

export default BehandlingVelgerSakIndex;
