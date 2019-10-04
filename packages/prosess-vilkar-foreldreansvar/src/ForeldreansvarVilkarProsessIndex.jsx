import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';

import foreldreansvarVilkarAksjonspunkterPropType from './propTypes/foreldreansvarVilkarAksjonspunkterPropType';
import foreldreansvarVilkarBehandlingPropType from './propTypes/foreldreansvarVilkarBehandlingPropType';
import ErForeldreansvarVilkaarOppfyltForm from './components/ErForeldreansvarVilkaarOppfyltForm';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const ForeldreansvarVilkarProsessIndex = ({
  behandling,
  aksjonspunkter,
  isEngangsstonad,
  vilkarTypeCodes,
  status,
  submitCallback,
  readOnly,
  readOnlySubmitButton,
  alleKodeverk,
}) => {
  const isForeldreansvar2Ledd = vilkarTypeCodes.includes(vilkarType.FORELDREANSVARSVILKARET_2_LEDD);
  return (
    <RawIntlProvider value={intl}>
      <ErForeldreansvarVilkaarOppfyltForm
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        behandlingsresultat={behandling.behandlingsresultat}
        isForeldreansvar2Ledd={isForeldreansvar2Ledd}
        isEngangsstonad={isEngangsstonad}
        aksjonspunkter={aksjonspunkter}
        status={status}
        submitCallback={submitCallback}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        alleKodeverk={alleKodeverk}
      />
    </RawIntlProvider>
  );
};

ForeldreansvarVilkarProsessIndex.propTypes = {
  behandling: foreldreansvarVilkarBehandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(foreldreansvarVilkarAksjonspunkterPropType).isRequired,
  vilkarTypeCodes: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  isEngangsstonad: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

export default ForeldreansvarVilkarProsessIndex;
