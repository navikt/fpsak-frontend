import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import TilbakekrevingForm from './components/TilbakekrevingForm';
import messages from '../i18n/nb_NO';
import foreldelsePerioderPropType from './propTypes/foreldelsePerioderPropType';
import foreldelseBehandlingPropType from './propTypes/foreldelseBehandlingPropType';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const TilbakekrevingProsessIndex = ({
  behandling,
  perioderForeldelse,
  vilkarvurderingsperioder,
  vilkarvurdering,
  submitCallback,
  readOnly,
  apCodes,
  readOnlySubmitButton,
  navBrukerKjonn,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  beregnBelop,
}) => (
  <RawIntlProvider value={intl}>
    <TilbakekrevingForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      perioderForeldelse={perioderForeldelse}
      perioder={vilkarvurderingsperioder.perioder}
      rettsgebyr={vilkarvurderingsperioder.rettsgebyr}
      vilkarvurdering={vilkarvurdering}
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

TilbakekrevingProsessIndex.propTypes = {
  behandling: foreldelseBehandlingPropType.isRequired,
  perioderForeldelse: foreldelsePerioderPropType.isRequired,
  vilkarvurderingsperioder: foreldelsePerioderPropType.isRequired,
  vilkarvurdering: foreldelsePerioderPropType.isRequired,
  navBrukerKjonn: PropTypes.string.isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  beregnBelop: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TilbakekrevingProsessIndex;
