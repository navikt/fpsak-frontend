import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import sokersOpplysningspliktAksjonspunkterPropType from './propTypes/sokersOpplysningspliktAksjonspunkterPropType';
import sokersOpplysningspliktSoknadPropType from './propTypes/sokersOpplysningspliktSoknadPropType';
import sokersOpplysningspliltBehandlingPropType from './propTypes/sokersOpplysningspliltBehandlingPropType';
import SokersOpplysningspliktForm from './components/SokersOpplysningspliktForm';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const SokersOpplysningspliktVilkarProsessIndex = ({
  behandling,
  soknad,
  aksjonspunkter,
  status,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    <SokersOpplysningspliktForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingsresultat={behandling.behandlingsresultat}
      soknad={soknad}
      aksjonspunkter={aksjonspunkter}
      status={status}
      submitCallback={submitCallback}
      readOnly={isReadOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      alleKodeverk={alleKodeverk}
    />
  </RawIntlProvider>
);

SokersOpplysningspliktVilkarProsessIndex.propTypes = {
  behandling: sokersOpplysningspliltBehandlingPropType.isRequired,
  soknad: sokersOpplysningspliktSoknadPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(sokersOpplysningspliktAksjonspunkterPropType).isRequired,
  status: PropTypes.string.isRequired,
  submitCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

export default SokersOpplysningspliktVilkarProsessIndex;
