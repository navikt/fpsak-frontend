import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import AvregningPanel from './components/AvregningPanel';
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

const AvregningProsessIndex = ({
  fagsak,
  behandling,
  aksjonspunkter,
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
    <AvregningPanel
      fagsak={fagsak}
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      sprakkode={behandling.sprakkode}
      aksjonspunkter={aksjonspunkter}
      simuleringResultat={simuleringResultat}
      tilbakekrevingvalg={tilbakekrevingvalg}
      featureToggles={featureToggles}
      submitCallback={submitCallback}
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      apCodes={apCodes}
      isApOpen={isApOpen}
      previewCallback={previewCallback}
    />
  </RawIntlProvider>
);

AvregningProsessIndex.propTypes = {
  fagsak: avregningFagsakPropType.isRequired,
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

AvregningProsessIndex.defaultProps = {
  simuleringResultat: undefined,
  tilbakekrevingvalg: undefined,
};

export default AvregningProsessIndex;
