import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import UttakPanel from './components/UttakPanel';
import messages from '../i18n/nb_NO';
import uttakFagsakPropType from './propTypes/uttakFagsakPropType';
import uttakBehandlingPropType from './propTypes/uttakBehandlingPropType';
import uttakAksjonspunkterPropType from './propTypes/uttakAksjonspunkterPropType';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const UttakProsessIndex = ({
  fagsak,
  behandling,
  uttaksresultatPerioder,
  uttakStonadskontoer,
  aksjonspunkter,
  familiehendelse,
  soknad,
  personopplysninger,
  uttakPeriodeGrense,
  ytelsefordeling,
  alleKodeverk,
  employeeHasAccess,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  tempUpdateStonadskontoer,
  isAksjonspunktOpen,
}) => (
  <RawIntlProvider value={intl}>
    <UttakPanel
      fagsak={fagsak}
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingType={behandling.type}
      behandlingsresultat={behandling.behandlingsresultat}
      behandlingStatus={behandling.status}
      sprakkode={behandling.sprakkode}
      uttaksresultat={uttaksresultatPerioder}
      stonadskonto={uttakStonadskontoer}
      aksjonspunkter={aksjonspunkter}
      employeeHasAccess={employeeHasAccess}
      soknad={soknad}
      person={personopplysninger}
      familiehendelse={familiehendelse}
      uttakPeriodeGrense={uttakPeriodeGrense}
      alleKodeverk={alleKodeverk}
      ytelsefordeling={ytelsefordeling}
      tempUpdateStonadskontoer={tempUpdateStonadskontoer}
      submitCallback={submitCallback}
      readOnly={isReadOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      apCodes={aksjonspunkter.map((a) => a.definisjon.kode)}
      isApOpen={isAksjonspunktOpen}
    />
  </RawIntlProvider>
);

UttakProsessIndex.propTypes = {
  fagsak: uttakFagsakPropType.isRequired,
  behandling: uttakBehandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(uttakAksjonspunkterPropType).isRequired,
  uttakStonadskontoer: PropTypes.shape().isRequired,
  soknad: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  uttaksresultatPerioder: PropTypes.shape().isRequired,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  familiehendelse: PropTypes.shape().isRequired,
  personopplysninger: PropTypes.shape().isRequired,
  uttakPeriodeGrense: PropTypes.shape().isRequired,
  ytelsefordeling: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  employeeHasAccess: PropTypes.bool.isRequired,
  tempUpdateStonadskontoer: PropTypes.func.isRequired,
};

export default UttakProsessIndex;
