import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import ForeldelseForm from './components/ForeldelseForm';
import messages from '../i18n/nb_NO.json';
import foreldelsePerioderPropType from './propTypes/foreldelsePerioderPropType';
import foreldelseBehandlingPropType from './propTypes/foreldelseBehandlingPropType';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const ForeldelseProsessIndex = ({
  behandling,
  perioderForeldelse,
  navBrukerKjonn,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  beregnBelop,
  submitCallback,
  readOnly,
  readOnlySubmitButton,
  apCodes,
}) => (
  <RawIntlProvider value={intl}>
    <ForeldelseForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      perioderForeldelse={perioderForeldelse}
      submitCallback={submitCallback}
      readOnly={readOnly}
      apCodes={apCodes}
      readOnlySubmitButton={readOnlySubmitButton}
      navBrukerKjonn={navBrukerKjonn}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      alleKodeverk={alleKodeverk}
      beregnBelop={beregnBelop}
    />
  </RawIntlProvider>
);

ForeldelseProsessIndex.propTypes = {
  behandling: foreldelseBehandlingPropType.isRequired,
  perioderForeldelse: foreldelsePerioderPropType.isRequired,
  navBrukerKjonn: PropTypes.string.isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  beregnBelop: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ForeldelseProsessIndex;
