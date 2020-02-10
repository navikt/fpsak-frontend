import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import soknadsfristVilkarAksjonspunkterPropType from './propTypes/soknadsfristVilkarAksjonspunkterPropType';
import soknadsfristVilkarVilkarPropType from './propTypes/soknadsfristVilkarVilkarPropType';
import soknadsfristVilkarSoknadPropType from './propTypes/soknadsfristVilkarSoknadPropType';
import soknadsfristVilkarFamilieHendelsePropType from './propTypes/soknadsfristVilkarFamilieHendelsePropType';
import soknadsfristVilkarBehandlingPropType from './propTypes/soknadsfristVilkarBehandlingPropType';
import ErSoknadsfristVilkaretOppfyltForm from './components/ErSoknadsfristVilkaretOppfyltForm';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const SoknadsfristVilkarProsessIndex = ({
  behandling,
  vilkar,
  soknad,
  familiehendelse,
  aksjonspunkter,
  status,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    <ErSoknadsfristVilkaretOppfyltForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingsresultat={behandling.behandlingsresultat}
      vilkar={vilkar}
      soknad={soknad}
      gjeldendeFamiliehendelse={familiehendelse.gjeldene}
      aksjonspunkter={aksjonspunkter}
      status={status}
      submitCallback={submitCallback}
      readOnly={isReadOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      alleKodeverk={alleKodeverk}
    />
  </RawIntlProvider>
);

SoknadsfristVilkarProsessIndex.propTypes = {
  behandling: soknadsfristVilkarBehandlingPropType.isRequired,
  soknad: soknadsfristVilkarSoknadPropType.isRequired,
  familiehendelse: soknadsfristVilkarFamilieHendelsePropType.isRequired,
  vilkar: PropTypes.arrayOf(soknadsfristVilkarVilkarPropType).isRequired,
  aksjonspunkter: PropTypes.arrayOf(soknadsfristVilkarAksjonspunkterPropType).isRequired,
  status: PropTypes.string.isRequired,
  submitCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

export default SoknadsfristVilkarProsessIndex;
