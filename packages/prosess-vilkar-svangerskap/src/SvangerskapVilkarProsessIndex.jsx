import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import fodselVilkarAksjonspunkterPropType from './propTypes/fodselVilkarAksjonspunkterPropType';
import fodselVilkarBehandlingPropType from './propTypes/fodselVilkarBehandlingPropType';
import SvangerskapVilkarForm from './components/SvangerskapVilkarForm';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const SvangerskapVilkarProsessIndex = ({
  behandling,
  aksjonspunkter,
  status,
  vilkar,
  submitCallback,
  readOnly,
  readOnlySubmitButton,
  isAksjonspunktOpen,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    <SvangerskapVilkarForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingsresultat={behandling.behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      status={status}
      vilkar={vilkar}
      submitCallback={submitCallback}
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      isAksjonspunktOpen={isAksjonspunktOpen}
      alleKodeverk={alleKodeverk}
    />
  </RawIntlProvider>
);

SvangerskapVilkarProsessIndex.propTypes = {
  behandling: fodselVilkarBehandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(fodselVilkarAksjonspunkterPropType).isRequired,
  status: PropTypes.string.isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

export default SvangerskapVilkarProsessIndex;
