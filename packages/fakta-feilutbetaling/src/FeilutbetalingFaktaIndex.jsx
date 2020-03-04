import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import FeilutbetalingInfoPanel from './components/FeilutbetalingInfoPanel';
import feilutbetalingAksjonspunkterPropType from './propTypes/feilutbetalingAksjonspunkterPropType';
import feilutbetalingFaktaPropType from './propTypes/feilutbetalingFaktaPropType';
import feilutbetalingBehandlingPropType from './propTypes/feilutbetalingBehandlingPropType';
import feilutbetalingAarsakPropType from './propTypes/feilutbetalingAarsakPropType';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const FeilutbetalingFaktaIndex = ({
  behandling,
  feilutbetalingFakta,
  feilutbetalingAarsak,
  fagsakYtelseTypeKode,
  aksjonspunkter,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  submitCallback,
  readOnly,
  harApneAksjonspunkter,
}) => (
  <RawIntlProvider value={intl}>
    <FeilutbetalingInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      feilutbetalingFakta={feilutbetalingFakta.behandlingFakta}
      feilutbetalingAarsak={feilutbetalingAarsak.find((a) => a.ytelseType.kode === fagsakYtelseTypeKode)}
      aksjonspunkter={aksjonspunkter}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      alleKodeverk={alleKodeverk}
      submitCallback={submitCallback}
      readOnly={readOnly}
      hasOpenAksjonspunkter={harApneAksjonspunkter}
    />
  </RawIntlProvider>
);

FeilutbetalingFaktaIndex.propTypes = {
  behandling: feilutbetalingBehandlingPropType.isRequired,
  feilutbetalingFakta: feilutbetalingFaktaPropType.isRequired,
  feilutbetalingAarsak: PropTypes.arrayOf(feilutbetalingAarsakPropType).isRequired,
  aksjonspunkter: PropTypes.arrayOf(feilutbetalingAksjonspunkterPropType).isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  fagsakYtelseTypeKode: PropTypes.string.isRequired,
  harApneAksjonspunkter: PropTypes.bool.isRequired,
};

export default FeilutbetalingFaktaIndex;
