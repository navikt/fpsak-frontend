import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import TilbakekrevingVedtak from './components/TilbakekrevingVedtak';
import vedtaksbrevPropType from './propTypes/vedtaksbrevPropType';
import vedtakTilbakekrevingBehandlingPropType from './propTypes/vedtakTilbakekrevingBehandlingPropType';
import vedtakTilbakekrevingBeregningsresultatPropType from './propTypes/vedtakTilbakekrevingBeregningsresultatPropType';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const VedtakTilbakekrevingProsessIndex = ({
  behandling,
  beregningsresultat,
  vedtaksbrev,
  submitCallback,
  readOnly,
  isBehandlingHenlagt,
  alleKodeverk,
  fetchPreviewVedtaksbrev,
  aksjonspunktKodeForeslaVedtak,
}) => (
  <RawIntlProvider value={intl}>
    <TilbakekrevingVedtak
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      perioder={beregningsresultat.beregningResultatPerioder}
      resultat={beregningsresultat.vedtakResultatType}
      avsnittsliste={vedtaksbrev.avsnittsliste}
      submitCallback={submitCallback}
      readOnly={readOnly}
      isBehandlingHenlagt={isBehandlingHenlagt}
      alleKodeverk={alleKodeverk}
      fetchPreviewVedtaksbrev={fetchPreviewVedtaksbrev}
      aksjonspunktKodeForeslaVedtak={aksjonspunktKodeForeslaVedtak}
    />
  </RawIntlProvider>
);

VedtakTilbakekrevingProsessIndex.propTypes = {
  behandling: vedtakTilbakekrevingBehandlingPropType.isRequired,
  beregningsresultat: vedtakTilbakekrevingBeregningsresultatPropType.isRequired,
  vedtaksbrev: vedtaksbrevPropType.isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isBehandlingHenlagt: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  fetchPreviewVedtaksbrev: PropTypes.func.isRequired,
  aksjonspunktKodeForeslaVedtak: PropTypes.string.isRequired,
};

export default VedtakTilbakekrevingProsessIndex;
