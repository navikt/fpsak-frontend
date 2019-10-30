import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import BehandleKlageFormKa from './components/ka/BehandleKlageFormKa';
import BehandleKlageFormNfp from './components/nfp/BehandleKlageFormNfp';
import messages from '../i18n/nb_NO';
import avregningFagsakPropType from './propTypes/avregningFagsakPropType';
import avregningBehandlingPropType from './propTypes/avregningBehandlingPropType';
import avregningAksjonspunkterPropType from './propTypes/avregningAksjonspunkterPropType';
import avregningSimuleringResultatPropType from './propTypes/avregningSimuleringResultatPropType';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const KlagevurderingProsessIndex = ({
  behandling,
  klageVurdering,
  aksjonspunkter,
  alleKodeverk,

  simuleringResultat,
  tilbakekrevingvalg,
  submitCallback,
  readOnly,
  readOnlySubmitButton,
  apCodes,
  isApOpen,
  previewCallback,
  featureToggles,
}) => (
  <RawIntlProvider value={intl}>
    {apCodes.includes(aksjonspunktCodes.BEHANDLE_KLAGE_NK) && (
      <BehandleKlageFormKa
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        sprakkode={behandling.sprakkode}
        klageVurdering={klageVurdering}
        aksjonspunkter={aksjonspunkter}
        saveKlage={saveTempKlage}
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
        aksjonspunkter={aksjonspunkter}
        saveKlage={saveTempKlage}
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
  behandling: avregningBehandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(avregningAksjonspunkterPropType).isRequired,
  simuleringResultat: avregningSimuleringResultatPropType,
  tilbakekrevingvalg: PropTypes.shape(),
  submitCallback: PropTypes.func.isRequired,
  previewCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isApOpen: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  featureToggles: PropTypes.shape().isRequired,
};

KlagevurderingProsessIndex.defaultProps = {
  simuleringResultat: undefined,
  tilbakekrevingvalg: undefined,
};

export default KlagevurderingProsessIndex;
