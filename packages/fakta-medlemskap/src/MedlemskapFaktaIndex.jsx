import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import MedlemskapInfoPanel from './components/MedlemskapInfoPanel';
import medlemskapAksjonspunkterPropType from './propTypes/medlemskapAksjonspunkterPropType';
import medlemskapMedlemskapPropType from './propTypes/medlemskapMedlemskapPropType';
import medlemskapBehandlingPropType from './propTypes/medlemskapBehandlingPropType';
import medlemskapSoknadPropType from './propTypes/medlemskapSoknadPropType';
import medlemskapInntektArbeidYtelsePropType from './propTypes/medlemskapInntektArbeidYtelsePropType';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const MedlemskapFaktaIndex = ({
  behandling,
  soknad,
  inntektArbeidYtelse,
  medlemskap,
  medlemskapV2,
  aksjonspunkter,
  fagsakPerson,
  isForeldrepengerFagsak,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  submitCallback,
  openInfoPanels,
  toggleInfoPanelCallback,
  shouldOpenDefaultInfoPanels,
  readOnly,
  readOnlyBehandling,
}) => (
  <RawIntlProvider value={intl}>
    <MedlemskapInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingType={behandling.type}
      behandlingPaaVent={behandling.behandlingPaaVent}
      soknad={soknad}
      inntektArbeidYtelse={inntektArbeidYtelse}
      medlemskap={medlemskap}
      medlemskapV2={medlemskapV2}
      fagsakPerson={fagsakPerson}
      aksjonspunkter={aksjonspunkter}
      isForeldrepenger={isForeldrepengerFagsak}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      alleKodeverk={alleKodeverk}
      submitCallback={submitCallback}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
      readOnly={readOnly}
      readOnlyBehandling={readOnlyBehandling}
    />
  </RawIntlProvider>
);

MedlemskapFaktaIndex.propTypes = {
  behandling: medlemskapBehandlingPropType.isRequired,
  medlemskap: medlemskapMedlemskapPropType.isRequired,
  medlemskapV2: medlemskapMedlemskapPropType.isRequired,
  soknad: medlemskapSoknadPropType.isRequired,
  inntektArbeidYtelse: medlemskapInntektArbeidYtelsePropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(medlemskapAksjonspunkterPropType).isRequired,
  fagsakPerson: PropTypes.shape().isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  isForeldrepengerFagsak: PropTypes.bool.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlyBehandling: PropTypes.bool.isRequired,
};

export default MedlemskapFaktaIndex;
