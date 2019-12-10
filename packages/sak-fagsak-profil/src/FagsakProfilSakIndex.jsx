import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import FagsakProfile from './components/FagsakProfile';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const FagsakProfilSakIndex = ({
  saksnummer,
  sakstype,
  fagsakStatus,
  toggleShowAll,
  annenPartLink,
  alleKodeverk,
  createLink,
  renderBehandlingMeny,
  renderBehandlingVelger,
}) => (
  <RawIntlProvider value={intl}>
    <FagsakProfile
      saksnummer={saksnummer}
      sakstype={sakstype}
      fagsakStatus={fagsakStatus}
      toggleShowAll={toggleShowAll}
      annenPartLink={annenPartLink}
      alleKodeverk={alleKodeverk}
      createLink={createLink}
      renderBehandlingMeny={renderBehandlingMeny}
      renderBehandlingVelger={renderBehandlingVelger}
    />
  </RawIntlProvider>
);

FagsakProfilSakIndex.propTypes = {
  saksnummer: PropTypes.string.isRequired,
  sakstype: PropTypes.shape().isRequired,
  fagsakStatus: PropTypes.shape().isRequired,
  toggleShowAll: PropTypes.func.isRequired,
  annenPartLink: PropTypes.shape(),
  alleKodeverk: PropTypes.shape().isRequired,
  createLink: PropTypes.func.isRequired,
  renderBehandlingMeny: PropTypes.func.isRequired,
  renderBehandlingVelger: PropTypes.func.isRequired,
};

FagsakProfilSakIndex.defaultProps = {
  annenPartLink: null,
};

export default FagsakProfilSakIndex;
