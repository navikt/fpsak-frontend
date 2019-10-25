import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import OpptjeningInfoPanel from './components/OpptjeningInfoPanel';
import opptjeningAksjonspunkterPropType from './propTypes/opptjeningAksjonspunkterPropType';
import opptjeningPropType from './propTypes/opptjeningPropType';
import opptjeningBehandlingPropType from './propTypes/opptjeningBehandlingPropType';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const OpptjeningFaktaIndex = ({
  behandling,
  opptjening,
  aksjonspunkter,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  openInfoPanels,
  toggleInfoPanelCallback,
  shouldOpenDefaultInfoPanels,
  submitCallback,
  readOnly,
}) => (
  <RawIntlProvider value={intl}>
    <OpptjeningInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      fastsattOpptjening={opptjening ? opptjening.fastsattOpptjening : undefined}
      opptjeningAktiviteter={opptjening ? opptjening.opptjeningAktivitetList : undefined}
      aksjonspunkter={aksjonspunkter}
      openInfoPanels={openInfoPanels}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
      submitCallback={submitCallback}
      readOnly={readOnly}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      alleKodeverk={alleKodeverk}
    />
  </RawIntlProvider>
);

OpptjeningFaktaIndex.propTypes = {
  behandling: opptjeningBehandlingPropType.isRequired,
  opptjening: opptjeningPropType,
  aksjonspunkter: PropTypes.arrayOf(opptjeningAksjonspunkterPropType).isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

OpptjeningFaktaIndex.defaultProps = {
  opptjening: undefined,
};

export default OpptjeningFaktaIndex;
