import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import tilkjentYtelseBehandlingPropType from './propTypes/tilkjentYtelseBehandlingPropType';
import tilkjentYtelseFagsakPropType from './propTypes/tilkjentYtelseFagsakPropType';
import tilkjentYtelseBeregningresultatPropType from './propTypes/tilkjentYtelseBeregningresultatPropType';
import tilkjentYtelseAksjonspunkterPropType from './propTypes/tilkjentYtelseAksjonspunkterPropType';
import tilkjentYtelseFamilieHendelsePropType from './propTypes/tilkjentYtelseFamilieHendelsePropType';
import tilkjentYtelsePersonopplysningerPropType from './propTypes/tilkjentYtelsePersonopplysningerPropType';
import tilkjentYtelseSoknadPropType from './propTypes/tilkjentYtelseSoknadPropType';
import TilkjentYtelsePanel from './components/TilkjentYtelsePanel';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const TilkjentYtelseProsessIndex = ({
  behandling,
  beregningresultat,
  familiehendelse,
  personopplysninger,
  soknad,
  fagsak,
  aksjonspunkter,
  alleKodeverk,
  isReadOnly,
  submitCallback,
  readOnlySubmitButton,
}) => (
  <RawIntlProvider value={intl}>
    <TilkjentYtelsePanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      beregningresultat={beregningresultat}
      gjeldendeFamiliehendelse={familiehendelse.gjeldende}
      personopplysninger={personopplysninger}
      soknad={soknad}
      fagsakYtelseTypeKode={fagsak.fagsakYtelseType.kode}
      aksjonspunkter={aksjonspunkter}
      alleKodeverk={alleKodeverk}
      readOnly={isReadOnly}
      submitCallback={submitCallback}
      readOnlySubmitButton={readOnlySubmitButton}
    />
  </RawIntlProvider>
);

TilkjentYtelseProsessIndex.propTypes = {
  behandling: tilkjentYtelseBehandlingPropType.isRequired,
  beregningresultat: tilkjentYtelseBeregningresultatPropType.isRequired,
  familiehendelse: tilkjentYtelseFamilieHendelsePropType.isRequired,
  personopplysninger: tilkjentYtelsePersonopplysningerPropType.isRequired,
  soknad: tilkjentYtelseSoknadPropType.isRequired,
  fagsak: tilkjentYtelseFagsakPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(tilkjentYtelseAksjonspunkterPropType).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
};

export default TilkjentYtelseProsessIndex;
