import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import fodselVilkarAksjonspunkterPropType from './propTypes/fodselVilkarAksjonspunkterPropType';
import fodselVilkarBehandlingPropType from './propTypes/fodselVilkarBehandlingPropType';
import FodselVilkarForm from './components/FodselVilkarForm';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const FodselVilkarProsessIndex = ({
  behandling,
  aksjonspunkter,
  status,
  vilkar,
  ytelseTypeKode,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  isAksjonspunktOpen,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    <FodselVilkarForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingsresultat={behandling.behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      status={status}
      vilkar={vilkar}
      ytelseTypeKode={ytelseTypeKode}
      submitCallback={submitCallback}
      readOnly={isReadOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      isApOpen={isAksjonspunktOpen}
      alleKodeverk={alleKodeverk}
    />
  </RawIntlProvider>
);

FodselVilkarProsessIndex.propTypes = {
  behandling: fodselVilkarBehandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(fodselVilkarAksjonspunkterPropType).isRequired,
  status: PropTypes.string.isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  submitCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

export default FodselVilkarProsessIndex;
