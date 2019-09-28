import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import soknadsfristAksjonspunkterPropType from './propTypes/soknadsfristAksjonspunkterPropType';
import soknadsfristBehandlingPropType from './propTypes/soknadsfristBehandlingPropType';
import soknadsfristUttakPeriodeGrensePropType from './propTypes/soknadsfristUttakPeriodeGrensePropType';
import soknadsfristSoknadPropType from './propTypes/soknadsfristSoknadPropType';
import VurderSoknadsfristForeldrepengerForm from './components/VurderSoknadsfristForeldrepengerForm';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const VurderSoknadsfristForeldrepengerIndex = ({
  behandling,
  uttakPeriodeGrense,
  soknad,
  aksjonspunkter,
  submitCallback,
  readOnly,
  readOnlySubmitButton,
  isApOpen,
}) => (
  <RawIntlProvider value={intl}>
    <VurderSoknadsfristForeldrepengerForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      uttakPeriodeGrense={uttakPeriodeGrense}
      mottattDato={soknad.mottattDato}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      isApOpen={isApOpen}
    />
  </RawIntlProvider>
);

VurderSoknadsfristForeldrepengerIndex.propTypes = {
  behandling: soknadsfristBehandlingPropType.isRequired,
  uttakPeriodeGrense: soknadsfristUttakPeriodeGrensePropType.isRequired,
  soknad: soknadsfristSoknadPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(soknadsfristAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  isApOpen: PropTypes.bool.isRequired,
};

export default VurderSoknadsfristForeldrepengerIndex;
