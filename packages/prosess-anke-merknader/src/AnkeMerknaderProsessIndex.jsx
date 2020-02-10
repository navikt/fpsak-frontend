import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import BehandleMerknaderForm from './components/BehandleMerknaderForm';
import messages from '../i18n/nb_NO.json';
import ankeMerknaderBehandlingPropType from './propTypes/ankeMerknaderBehandlingPropType';
import ankeMerknaderAksjonspunkterPropType from './propTypes/ankeMerknaderAksjonspunkterPropType';
import ankeVurderingPropType from './propTypes/ankeVurderingPropType';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const AnkeMerknaderProsessIndex = ({
  behandling,
  ankeVurdering,
  aksjonspunkter,
  submitCallback,
  readOnly,
  readOnlySubmitButton,
  saveAnke,
  previewCallback,
  previewVedtakCallback,
}) => (
  <RawIntlProvider value={intl}>
    <BehandleMerknaderForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      ankeVurderingResultat={ankeVurdering.ankeVurderingResultat}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      saveAnke={saveAnke}
      previewCallback={previewCallback}
      previewVedtakCallback={previewVedtakCallback}
    />
  </RawIntlProvider>
);

AnkeMerknaderProsessIndex.propTypes = {
  behandling: ankeMerknaderBehandlingPropType.isRequired,
  ankeVurdering: ankeVurderingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(ankeMerknaderAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  saveAnke: PropTypes.func.isRequired,
  previewCallback: PropTypes.func.isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
};

export default AnkeMerknaderProsessIndex;
