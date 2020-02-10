import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import omsorgVilkarAksjonspunkterPropType from './propTypes/omsorgVilkarAksjonspunkterPropType';
import omsorgVilkarBehandlingPropType from './propTypes/omsorgVilkarBehandlingPropType';
import ErOmsorgVilkaarOppfyltForm from './components/ErOmsorgVilkaarOppfyltForm';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const OmsorgVilkarProsessIndex = ({
  behandling,
  aksjonspunkter,
  status,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    <ErOmsorgVilkaarOppfyltForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingsresultat={behandling.behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      status={status}
      submitCallback={submitCallback}
      readOnly={isReadOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      alleKodeverk={alleKodeverk}
    />
  </RawIntlProvider>
);

OmsorgVilkarProsessIndex.propTypes = {
  behandling: omsorgVilkarBehandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(omsorgVilkarAksjonspunkterPropType).isRequired,
  status: PropTypes.string.isRequired,
  submitCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

export default OmsorgVilkarProsessIndex;
