import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import UttakInfoPanel from './components/UttakInfoPanel';
import uttakAksjonspunkterPropType from './propTypes/uttakAksjonspunkterPropType';
import uttakBehandlingPropType from './propTypes/uttakBehandlingPropType';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const UttakFaktaIndex = ({
  behandling,
  aksjonspunkter,
  submitCallback,
  ytelsefordeling,
  uttakKontrollerFaktaPerioder,
  alleKodeverk,
  faktaArbeidsforhold,
  personopplysninger,
  familiehendelse,
  readOnly,
  submittable,
  kanOverstyre,
}) => (
  <RawIntlProvider value={intl}>
    <UttakInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingType={behandling.type}
      behandlingArsaker={behandling.behandlingArsaker}
      behandlingStatus={behandling.status}
      behandlingPaaVent={behandling.behandlingPaaVent}
      ytelsefordeling={ytelsefordeling}
      uttakPerioder={uttakKontrollerFaktaPerioder.perioder}
      alleKodeverk={alleKodeverk}
      faktaArbeidsforhold={faktaArbeidsforhold}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      readOnly={readOnly}
      kanOverstyre={kanOverstyre}
      personopplysninger={personopplysninger}
      familiehendelse={familiehendelse}
      submittable={submittable}
    />
  </RawIntlProvider>
);

UttakFaktaIndex.propTypes = {
  behandling: uttakBehandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(uttakAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  ytelsefordeling: PropTypes.shape().isRequired,
  uttakKontrollerFaktaPerioder: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  familiehendelse: PropTypes.shape().isRequired,
  kanOverstyre: PropTypes.bool.isRequired,
  faktaArbeidsforhold: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  personopplysninger: PropTypes.shape().isRequired,
  submittable: PropTypes.bool.isRequired,
};

export default UttakFaktaIndex;
