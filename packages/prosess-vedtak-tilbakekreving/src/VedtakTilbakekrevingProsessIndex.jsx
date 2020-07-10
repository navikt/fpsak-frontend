import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import TilbakekrevingVedtak from './components/TilbakekrevingVedtak';
import vedtaksbrevPropType from './propTypes/vedtaksbrevPropType';
import vedtakTilbakekrevingBehandlingPropType from './propTypes/vedtakTilbakekrevingBehandlingPropType';
import vedtakTilbakekrevingBeregningsresultatPropType from './propTypes/vedtakTilbakekrevingBeregningsresultatPropType';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const tilbakekrevingÅrsakTyperKlage = [
  behandlingArsakType.RE_KLAGE_KA,
  behandlingArsakType.RE_KLAGE_NFP,
];

const erTilbakekrevingÅrsakKlage = (årsak) => årsak && tilbakekrevingÅrsakTyperKlage.includes(årsak.kode);

const VedtakTilbakekrevingProsessIndex = ({
  behandling,
  beregningsresultat,
  vedtaksbrev,
  submitCallback,
  isReadOnly,
  isBehandlingHenlagt,
  alleKodeverk,
  fetchPreviewVedtaksbrev,
  aksjonspunktKodeForeslaVedtak,
}) => {
  const erRevurderingTilbakekrevingKlage = behandling.førsteÅrsak && erTilbakekrevingÅrsakKlage(behandling.førsteÅrsak.behandlingArsakType);
  return (
    <RawIntlProvider value={intl}>
      <TilbakekrevingVedtak
        behandlingId={behandling.id}
        behandlingUuid={behandling.uuid}
        behandlingVersjon={behandling.versjon}
        perioder={beregningsresultat.beregningResultatPerioder}
        resultat={beregningsresultat.vedtakResultatType}
        avsnittsliste={vedtaksbrev.avsnittsliste}
        submitCallback={submitCallback}
        readOnly={isReadOnly}
        isBehandlingHenlagt={isBehandlingHenlagt}
        alleKodeverk={alleKodeverk}
        fetchPreviewVedtaksbrev={fetchPreviewVedtaksbrev}
        aksjonspunktKodeForeslaVedtak={aksjonspunktKodeForeslaVedtak}
        erRevurderingTilbakekrevingKlage={erRevurderingTilbakekrevingKlage}
      />
    </RawIntlProvider>
  );
};

VedtakTilbakekrevingProsessIndex.propTypes = {
  behandling: vedtakTilbakekrevingBehandlingPropType.isRequired,
  beregningsresultat: vedtakTilbakekrevingBeregningsresultatPropType.isRequired,
  vedtaksbrev: vedtaksbrevPropType.isRequired,
  submitCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  isBehandlingHenlagt: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  fetchPreviewVedtaksbrev: PropTypes.func.isRequired,
  aksjonspunktKodeForeslaVedtak: PropTypes.string.isRequired,
};

export default VedtakTilbakekrevingProsessIndex;
