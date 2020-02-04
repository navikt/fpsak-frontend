import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import opptjeningVilkarAksjonspunkterPropType from './propTypes/opptjeningVilkarAksjonspunkterPropType';
import opptjeningVilkarBehandlingPropType from './propTypes/opptjeningVilkarBehandlingPropType';
import opptjeningVilkarOpptjeningPropType from './propTypes/opptjeningVilkarOpptjeningPropType';
import OpptjeningVilkarForm from './components/OpptjeningVilkarForm';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const OpptjeningVilkarProsessIndex = ({
  behandling,
  opptjening,
  aksjonspunkter,
  status,
  lovReferanse,
  submitCallback,
  isReadOnly,
  isAksjonspunktOpen,
  readOnlySubmitButton,
}) => (
  <RawIntlProvider value={intl}>
    <OpptjeningVilkarForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingsresultat={behandling.behandlingsresultat}
      fastsattOpptjening={opptjening.fastsattOpptjening}
      status={status}
      lovReferanse={lovReferanse}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      readOnly={isReadOnly}
      isAksjonspunktOpen={isAksjonspunktOpen}
      readOnlySubmitButton={readOnlySubmitButton}
    />
  </RawIntlProvider>
);

OpptjeningVilkarProsessIndex.propTypes = {
  behandling: opptjeningVilkarBehandlingPropType.isRequired,
  opptjening: opptjeningVilkarOpptjeningPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(opptjeningVilkarAksjonspunkterPropType).isRequired,
  status: PropTypes.string.isRequired,
  lovReferanse: PropTypes.string,
  submitCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
};

OpptjeningVilkarProsessIndex.defaultProps = {
  lovReferanse: undefined,
};

export default OpptjeningVilkarProsessIndex;
