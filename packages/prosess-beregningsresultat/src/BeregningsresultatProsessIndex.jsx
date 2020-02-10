import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import beregningsresultatAksjonspunkterPropType from './propTypes/beregningsresultatAksjonspunkterPropType';
import beregningsresultatBehandlingPropType from './propTypes/beregningsresultatBehandlingPropType';
import BeregningsresultatEngangsstonadForm from './components/BeregningsresultatEngangsstonadForm';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const BeregningsresultatProsessIndex = ({
  behandling,
  beregningresultatEngangsstonad,
  aksjonspunkter,
  overrideReadOnly,
  submitCallback,
  kanOverstyreAccess,
  toggleOverstyring,
}) => (
  <RawIntlProvider value={intl}>
    <BeregningsresultatEngangsstonadForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingResultatstruktur={beregningresultatEngangsstonad}
      aksjonspunkter={aksjonspunkter}
      overrideReadOnly={overrideReadOnly}
      submitCallback={submitCallback}
      kanOverstyreAccess={kanOverstyreAccess}
      toggleOverstyring={toggleOverstyring}
    />
  </RawIntlProvider>
);

BeregningsresultatProsessIndex.propTypes = {
  behandling: beregningsresultatBehandlingPropType.isRequired,
  beregningresultatEngangsstonad: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(beregningsresultatAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  toggleOverstyring: PropTypes.func.isRequired,
  overrideReadOnly: PropTypes.bool.isRequired,
  kanOverstyreAccess: PropTypes.shape({
    isEnabled: PropTypes.bool.isRequired,
  }).isRequired,
};

export default BeregningsresultatProsessIndex;
