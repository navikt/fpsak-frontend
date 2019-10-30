import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import VedtakKlageForm from './components/VedtakKlageForm';
import vedtakKlageVurderingPropType from './propTypes/vedtakKlageVurderingPropType';
import vedtakKlageBehandlingPropType from './propTypes/vedtakKlageBehandlingPropType';
import vedtakKlageAksjonspunkterPropType from './propTypes/vedtakKlageAksjonspunkterPropType';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const VedtakKlageProsessIndex = ({
  behandling,
  klageVurdering,
  aksjonspunkter,
  submitCallback,
  previewVedtakCallback,
  readOnly,
}) => (
  <RawIntlProvider value={intl}>
    <VedtakKlageForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingsresultat={behandling.behandlingsresultat}
      behandlingPaaVent={behandling.behandlingPaaVent}
      klageVurdering={klageVurdering}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      previewVedtakCallback={previewVedtakCallback}
      readOnly={readOnly}
    />
  </RawIntlProvider>
);

VedtakKlageProsessIndex.propTypes = {
  behandling: vedtakKlageBehandlingPropType.isRequired,
  klageVurdering: vedtakKlageVurderingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(vedtakKlageAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default VedtakKlageProsessIndex;
