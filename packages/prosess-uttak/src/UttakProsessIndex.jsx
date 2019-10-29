import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import UttakPanel from './components/UttakPanel';
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

const UttakProsessIndex = ({
  fagsak,
  behandling,
  faktaArbeidsforhold,
  uttaksresultatPerioder,
  uttakStonadskontoer,
  aksjonspunkter,
  simuleringResultat,
  tilbakekrevingvalg,
  familiehendelse,
  soknad,
  personopplysninger,
  uttakPeriodeGrense,
  ytelsefordeling,
  alleKodeverk,
  employeeHasAccess,
  submitCallback,
  readOnly,
  readOnlySubmitButton,
  tempUpdateStonadskontoer,
  apCodes,
  isApOpen,
  previewCallback,
  featureToggles,
}) => (
  <RawIntlProvider value={intl}>
    <UttakPanel
      fagsak={fagsak}
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingType={behandling.type}
      behandlingsresultat={behandling.behandlingsresultat}
      sprakkode={behandling.sprakkode}
      faktaArbeidsforhold={faktaArbeidsforhold}
      uttaksresultat={uttaksresultatPerioder}
      stonadskonto={uttakStonadskontoer}
      aksjonspunkter={aksjonspunkter}
      employeeHasAccess={employeeHasAccess}
      soknad={soknad}
      person={personopplysninger}
      familiehendelse={familiehendelse}
      simuleringResultat={simuleringResultat}
      tilbakekrevingvalg={tilbakekrevingvalg}
      uttakPeriodeGrense={uttakPeriodeGrense}
      alleKodeverk={alleKodeverk}
      ytelsefordeling={ytelsefordeling}
      featureToggles={featureToggles}
      tempUpdateStonadskontoer={tempUpdateStonadskontoer}
      submitCallback={submitCallback}
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      apCodes={apCodes}
      isApOpen={isApOpen}
      previewCallback={previewCallback}
    />
  </RawIntlProvider>
);

UttakProsessIndex.propTypes = {
  fagsak: avregningFagsakPropType.isRequired,
  behandling: avregningBehandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(avregningAksjonspunkterPropType).isRequired,
  uttakStonadskontoer: PropTypes.shape().isRequired,
  simuleringResultat: avregningSimuleringResultatPropType,
  soknad: PropTypes.shape().isRequired,
  tilbakekrevingvalg: PropTypes.shape(),
  submitCallback: PropTypes.func.isRequired,
  previewCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  faktaArbeidsforhold: PropTypes.shape().isRequired,
  uttaksresultatPerioder: PropTypes.shape().isRequired,
  isApOpen: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  featureToggles: PropTypes.shape().isRequired,
  familiehendelse: PropTypes.shape().isRequired,
  personopplysninger: PropTypes.shape().isRequired,
  uttakPeriodeGrense: PropTypes.shape().isRequired,
  ytelsefordeling: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  employeeHasAccess: PropTypes.bool.isRequired,
  tempUpdateStonadskontoer: PropTypes.func.isRequired,
};

UttakProsessIndex.defaultProps = {
  simuleringResultat: undefined,
  tilbakekrevingvalg: undefined,
};

export default UttakProsessIndex;
