import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

import VilkarresultatMedOverstyringForm from './components/VilkarresultatMedOverstyringForm';
import vilkarOverstyringAksjonspunkterPropType from './propTypes/vilkarOverstyringAksjonspunkterPropType';
import vilkarOverstyringBehandlingPropType from './propTypes/vilkarOverstyringBehandlingPropType';
import vilkarOverstyringMedlemskapPropType from './propTypes/vilkarOverstyringMedlemskapPropType';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const VilkarresultatMedOverstyringProsessIndex = ({
  behandling,
  aksjonspunkter,
  medlemskap,
  submitCallback,
  overrideReadOnly,
  kanOverstyreAccess,
  toggleOverstyring,
  fagsakYtelseType,
  avslagsarsaker,
  behandlingspunktAksjonspunkter,
  behandlingspunktStatus,
  behandlingspunktVilkar,
  behandlingspunktOverridden,
  behandlingspunktOverrideReadOnly,
  behandlingspunktTitleCode,
  behandlingspunkt,
}) => (
  <RawIntlProvider value={intl}>
    <VilkarresultatMedOverstyringForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingType={behandling.type}
      behandlingsresultat={behandling.behandlingsresultat}
      aksjonspunkter={aksjonspunkter}
      medlemskapFom={medlemskap.fom}
      submitCallback={submitCallback}
      overrideReadOnly={overrideReadOnly}
      kanOverstyreAccess={kanOverstyreAccess}
      toggleOverstyring={toggleOverstyring}
      fagsakYtelseType={fagsakYtelseType}
      avslagsarsaker={avslagsarsaker}
      behandlingspunktAksjonspunkter={behandlingspunktAksjonspunkter}
      behandlingspunktStatus={behandlingspunktStatus}
      behandlingspunktVilkar={behandlingspunktVilkar}
      behandlingspunktOverridden={behandlingspunktOverridden}
      behandlingspunktOverrideReadOnly={behandlingspunktOverrideReadOnly}
      behandlingspunktTitleCode={behandlingspunktTitleCode}
      behandlingspunkt={behandlingspunkt}
    />
  </RawIntlProvider>
);

VilkarresultatMedOverstyringProsessIndex.propTypes = {
  behandling: vilkarOverstyringBehandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(vilkarOverstyringAksjonspunkterPropType).isRequired,
  medlemskap: vilkarOverstyringMedlemskapPropType.isRequired,
  submitCallback: PropTypes.func.isRequired,
  overrideReadOnly: PropTypes.bool.isRequired,
  kanOverstyreAccess: PropTypes.shape({
    isEnabled: PropTypes.bool.isRequired,
  }).isRequired,
  toggleOverstyring: PropTypes.func.isRequired,
  fagsakYtelseType: kodeverkObjektPropType.isRequired,
  avslagsarsaker: PropTypes.shape().isRequired,
  behandlingspunktAksjonspunkter: PropTypes.arrayOf(vilkarOverstyringAksjonspunkterPropType).isRequired,
  behandlingspunktStatus: PropTypes.string.isRequired,
  behandlingspunktVilkar: PropTypes.arrayOf(PropTypes.shape({
    vilkarType: PropTypes.shape({
      kode: PropTypes.string,
    }),
  })).isRequired,
  behandlingspunktOverridden: PropTypes.bool.isRequired,
  behandlingspunktOverrideReadOnly: PropTypes.bool.isRequired,
  behandlingspunktTitleCode: PropTypes.string.isRequired,
  behandlingspunkt: PropTypes.string.isRequired,
};

export default VilkarresultatMedOverstyringProsessIndex;
