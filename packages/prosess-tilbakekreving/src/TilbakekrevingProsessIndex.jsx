import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import TilbakekrevingForm from './components/TilbakekrevingForm';
import messages from '../i18n/nb_NO.json';
import perioderForeldelsePropType from './propTypes/perioderForeldelsePropType';
import vilkarvurderingsperioderPropType from './propTypes/vilkarvurderingsperioderPropType';
import tilbakekrevingBehandlingPropType from './propTypes/tilbakekrevingBehandlingPropType';
import vilkarsvurderingPropType from './propTypes/vilkarsvurderingPropType';

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
  isReadOnly,
  readOnlySubmitButton,
  navBrukerKjonn,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  beregnBelop,
  aksjonspunkter,
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

TilbakekrevingProsessIndex.propTypes = {
  behandling: tilbakekrevingBehandlingPropType.isRequired,
  perioderForeldelse: perioderForeldelsePropType.isRequired,
  vilkarvurderingsperioder: vilkarvurderingsperioderPropType.isRequired,
  vilkarvurdering: vilkarsvurderingPropType.isRequired,
  navBrukerKjonn: PropTypes.string.isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  beregnBelop: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default TilbakekrevingProsessIndex;
