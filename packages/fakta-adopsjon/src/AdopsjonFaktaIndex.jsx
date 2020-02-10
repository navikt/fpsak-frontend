import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import AdopsjonInfoPanel from './components/AdopsjonInfoPanel';
import adopsjonAksjonspunkterPropType from './propTypes/adopsjonAksjonspunkterPropType';
import adopsjonPersonopplysningerPropType from './propTypes/adopsjonPersonopplysningerPropType';
import adopsjonFamilieHendelsePropType from './propTypes/adopsjonFamilieHendelsePropType';
import adopsjonBehandlingPropType from './propTypes/adopsjonBehandlingPropType';
import adopsjonSoknadPropType from './propTypes/adopsjonSoknadPropType';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const AdopsjonFaktaIndex = ({
  behandling,
  soknad,
  familiehendelse,
  aksjonspunkter,
  personopplysninger,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  submitCallback,
  readOnly,
  isForeldrepengerFagsak,
  harApneAksjonspunkter,
  submittable,
}) => (
  <RawIntlProvider value={intl}>
    <AdopsjonInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      soknad={soknad}
      gjeldendeFamiliehendelse={familiehendelse.gjeldende}
      aksjonspunkter={aksjonspunkter}
      personopplysninger={personopplysninger}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      alleKodeverk={alleKodeverk}
      submitCallback={submitCallback}
      readOnly={readOnly}
      isForeldrepengerFagsak={isForeldrepengerFagsak}
      hasOpenAksjonspunkter={harApneAksjonspunkter}
      submittable={submittable}
    />
  </RawIntlProvider>
);

AdopsjonFaktaIndex.propTypes = {
  behandling: adopsjonBehandlingPropType.isRequired,
  soknad: adopsjonSoknadPropType.isRequired,
  familiehendelse: adopsjonFamilieHendelsePropType.isRequired,
  personopplysninger: adopsjonPersonopplysningerPropType.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(adopsjonAksjonspunkterPropType).isRequired,
  isForeldrepengerFagsak: PropTypes.bool.isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  harApneAksjonspunkter: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
};

export default AdopsjonFaktaIndex;
