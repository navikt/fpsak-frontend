import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import FodselInfoPanel from './components/FodselInfoPanel';
import fodselAksjonspunkterPropType from './propTypes/fodselAksjonspunkterPropType';
import fodselPersonopplysningerPropType from './propTypes/fodselPersonopplysningerPropType';
import fodselFamilieHendelsePropType from './propTypes/fodselFamilieHendelsePropType';
import fodselBehandlingPropType from './propTypes/fodselBehandlingPropType';
import fodselSoknadPropType from './propTypes/fodselSoknadPropType';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const FodselFaktaIndex = ({
  behandling,
  soknad,
  familiehendelse,
  personopplysninger,
  soknadOriginalBehandling,
  familiehendelseOriginalBehandling,
  aksjonspunkter,
  harApneAksjonspunkter,
  submittable,
  alleMerknaderFraBeslutter,
  submitCallback,
  readOnly,
}) => (
  <RawIntlProvider value={intl}>
    <FodselInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingType={behandling.type}
      soknad={soknad}
      familiehendelse={familiehendelse}
      soknadOriginalBehandling={soknadOriginalBehandling}
      familiehendelseOriginalBehandling={familiehendelseOriginalBehandling}
      personopplysninger={personopplysninger}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      aksjonspunkter={aksjonspunkter}
      hasOpenAksjonspunkter={harApneAksjonspunkter}
      submittable={submittable}
      submitCallback={submitCallback}
      readOnly={readOnly}
    />
  </RawIntlProvider>
);

FodselFaktaIndex.propTypes = {
  behandling: fodselBehandlingPropType.isRequired,
  soknad: fodselSoknadPropType.isRequired,
  familiehendelse: fodselFamilieHendelsePropType.isRequired,
  personopplysninger: fodselPersonopplysningerPropType.isRequired,
  soknadOriginalBehandling: fodselSoknadPropType,
  familiehendelseOriginalBehandling: fodselFamilieHendelsePropType,
  aksjonspunkter: PropTypes.arrayOf(fodselAksjonspunkterPropType).isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  harApneAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
};

FodselFaktaIndex.defaultProps = {
  soknadOriginalBehandling: undefined,
  familiehendelseOriginalBehandling: undefined,
};

export default FodselFaktaIndex;
