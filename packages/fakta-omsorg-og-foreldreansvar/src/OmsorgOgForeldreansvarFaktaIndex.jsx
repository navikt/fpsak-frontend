import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import OmsorgOgForeldreansvarInfoPanel from './components/OmsorgOgForeldreansvarInfoPanel';
import omsorgOgForeldreInntektArbeidYtelsePropType from './propTypes/omsorgOgForeldreInntektArbeidYtelsePropType';
import omsorgOgForeldreAksjonspunkterPropType from './propTypes/omsorgOgForeldreAksjonspunkterPropType';
import omsorgOgForeldrePersonopplysningerPropType from './propTypes/omsorgOgForeldrePersonopplysningerPropType';
import omsorgOgForeldreFamilieHendelsePropType from './propTypes/omsorgOgForeldreFamilieHendelsePropType';
import omsorgOgForeldreBehandlingPropType from './propTypes/omsorgOgForeldreBehandlingPropType';
import omsorgOgForeldreSoknadPropType from './propTypes/omsorgOgForeldreSoknadPropType';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const OmsorgOgForeldreansvarFaktaIndex = ({
  behandling,
  familiehendelse,
  soknad,
  personopplysninger,
  inntektArbeidYtelse,
  aksjonspunkter,
  alleMerknaderFraBeslutter,
  submitCallback,
  openInfoPanels,
  toggleInfoPanelCallback,
  shouldOpenDefaultInfoPanels,
  readOnly,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    <OmsorgOgForeldreansvarInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      gjeldendeFamiliehendelse={familiehendelse.gjeldende}
      soknad={soknad}
      personopplysninger={personopplysninger}
      aksjonspunkter={aksjonspunkter}
      innvilgetRelatertTilgrensendeYtelserForAnnenForelder={inntektArbeidYtelse.innvilgetRelatertTilgrensendeYtelserForAnnenForelder}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      submitCallback={submitCallback}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
      readOnly={readOnly}
      alleKodeverk={alleKodeverk}
    />
  </RawIntlProvider>
);

OmsorgOgForeldreansvarFaktaIndex.propTypes = {
  behandling: omsorgOgForeldreBehandlingPropType.isRequired,
  familiehendelse: omsorgOgForeldreFamilieHendelsePropType.isRequired,
  soknad: omsorgOgForeldreSoknadPropType.isRequired,
  personopplysninger: omsorgOgForeldrePersonopplysningerPropType.isRequired,
  inntektArbeidYtelse: omsorgOgForeldreInntektArbeidYtelsePropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(omsorgOgForeldreAksjonspunkterPropType).isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  submitCallback: PropTypes.func.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

export default OmsorgOgForeldreansvarFaktaIndex;
