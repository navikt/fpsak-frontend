import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import messages from '../i18n/nb_NO.json';
import BehandleKlageFormKa from './components/ka/BehandleKlageFormKa';
import BehandleKlageFormNfp from './components/nfp/BehandleKlageFormNfp';
import klageVurderingPropType from './propTypes/klageVurderingPropType';
import klagevurderingBehandlingPropType from './propTypes/klagevurderingBehandlingPropType';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const KlagevurderingProsessIndex = ({
  behandling,
  klageVurdering,
  alleKodeverk,
  saveKlage,
  submitCallback,
  readOnly,
  previewCallback,
  readOnlySubmitButton,
  apCodes,
}) => (
  <RawIntlProvider value={intl}>
    {apCodes.includes(aksjonspunktCodes.BEHANDLE_KLAGE_NK) && (
      <BehandleKlageFormKa
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        sprakkode={behandling.sprakkode}
        klageVurdering={klageVurdering}
        saveKlage={saveKlage}
        submitCallback={submitCallback}
        readOnly={readOnly}
        previewCallback={previewCallback}
        readOnlySubmitButton={readOnlySubmitButton}
        alleKodeverk={alleKodeverk}
      />
    )}
    {apCodes.includes(aksjonspunktCodes.BEHANDLE_KLAGE_NFP) && (
      <BehandleKlageFormNfp
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        sprakkode={behandling.sprakkode}
        klageVurdering={klageVurdering}
        saveKlage={saveKlage}
        submitCallback={submitCallback}
        readOnly={readOnly}
        previewCallback={previewCallback}
        readOnlySubmitButton={readOnlySubmitButton}
        alleKodeverk={alleKodeverk}
      />
    )}
  </RawIntlProvider>
);

KlagevurderingProsessIndex.propTypes = {
  behandling: klagevurderingBehandlingPropType.isRequired,
  klageVurdering: klageVurderingPropType.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  saveKlage: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default KlagevurderingProsessIndex;
