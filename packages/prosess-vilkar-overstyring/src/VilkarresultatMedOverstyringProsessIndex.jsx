import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

import VilkarresultatMedOverstyringForm from './components/VilkarresultatMedOverstyringForm';
import vilkarOverstyringAksjonspunkterPropType from './propTypes/vilkarOverstyringAksjonspunkterPropType';
import vilkarOverstyringBehandlingPropType from './propTypes/vilkarOverstyringBehandlingPropType';
import vilkarOverstyringMedlemskapPropType from './propTypes/vilkarOverstyringMedlemskapPropType';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const VilkarresultatMedOverstyringProsessIndex = ({
  behandling,
  medlemskap,
  aksjonspunkter,
  submitCallback,
  overrideReadOnly,
  kanOverstyreAccess,
  toggleOverstyring,
  avslagsarsaker,
  status,
  erOverstyrt,
  panelTittelKode,
  overstyringApKode,
  lovReferanse,
  erMedlemskapsPanel,
}) => (
  <RawIntlProvider value={intl}>
    <VilkarresultatMedOverstyringForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingType={behandling.type}
      behandlingsresultat={behandling.behandlingsresultat}
      medlemskapFom={medlemskap.fom}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      overrideReadOnly={overrideReadOnly}
      kanOverstyreAccess={kanOverstyreAccess}
      toggleOverstyring={toggleOverstyring}
      avslagsarsaker={avslagsarsaker}
      status={status}
      erOverstyrt={erOverstyrt}
      panelTittelKode={panelTittelKode}
      overstyringApKode={overstyringApKode}
      lovReferanse={lovReferanse}
      erMedlemskapsPanel={erMedlemskapsPanel}
    />
  </RawIntlProvider>
);

VilkarresultatMedOverstyringProsessIndex.propTypes = {
  behandling: vilkarOverstyringBehandlingPropType.isRequired,
  medlemskap: vilkarOverstyringMedlemskapPropType,
  aksjonspunkter: PropTypes.arrayOf(vilkarOverstyringAksjonspunkterPropType).isRequired,
  submitCallback: PropTypes.func.isRequired,
  overrideReadOnly: PropTypes.bool.isRequired,
  kanOverstyreAccess: PropTypes.shape({
    isEnabled: PropTypes.bool.isRequired,
  }).isRequired,
  toggleOverstyring: PropTypes.func.isRequired,
  avslagsarsaker: PropTypes.arrayOf(kodeverkObjektPropType).isRequired,
  status: PropTypes.string.isRequired,
  lovReferanse: PropTypes.string,
  erOverstyrt: PropTypes.bool.isRequired,
  panelTittelKode: PropTypes.string.isRequired,
  overstyringApKode: PropTypes.string.isRequired,
  erMedlemskapsPanel: PropTypes.bool.isRequired,
};

VilkarresultatMedOverstyringProsessIndex.defaultProps = {
  lovReferanse: '',
  medlemskap: {},
};

export default VilkarresultatMedOverstyringProsessIndex;
