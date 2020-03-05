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
  isReadOnly,
  readOnlySubmitButton,
  aksjonspunkter,
}) => (
  <RawIntlProvider value={intl}>
    <ForeldelseForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      perioderForeldelse={perioderForeldelse}
      submitCallback={submitCallback}
      readOnly={isReadOnly}
      apCodes={aksjonspunkter.map((a) => a.definisjon.kode)}
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
  isReadOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default ForeldelseProsessIndex;
