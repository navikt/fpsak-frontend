import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { FaktaEkspandertpanel, faktaPanelCodes } from '@fpsak-frontend/fp-behandling-felles';
import withDefaultToggling from 'behandlingFpsak/src/fakta/withDefaultToggling';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import AnnenForelderHarRettForm from './AnnenForelderHarRettForm';
import UttakFaktaForm from './UttakFaktaForm';

const uttakAksjonspunkter = [
  aksjonspunktCodes.AVKLAR_UTTAK,
  aksjonspunktCodes.AVKLAR_FØRSTE_UTTAKSDATO,
  aksjonspunktCodes.AVKLAR_ANNEN_FORELDER_RETT,
  aksjonspunktCodes.MANUELL_AVKLAR_FAKTA_UTTAK,
];

export const UttakInfoPanelImpl = ({
  intl,
  toggleInfoPanelCallback,
  openInfoPanels,
  readOnly,
  hasOpenAksjonspunkter,
  aksjonspunkter,
  submitCallback,
}) => {
  const avklarAnnenForelderRettAp = aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_ANNEN_FORELDER_RETT);
  return (
    <FaktaEkspandertpanel
      title={intl.formatMessage({ id: 'UttakInfoPanel.FaktaUttak' })}
      hasOpenAksjonspunkter={hasOpenAksjonspunkter}
      isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.UTTAK)}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      faktaId={faktaPanelCodes.UTTAK}
      readOnly={readOnly}
      disabledTextCode="UttakInfoPanel.Uttak"
    >
      {avklarAnnenForelderRettAp
      && (
      <AnnenForelderHarRettForm
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        readOnly={readOnly}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        aksjonspunkter={aksjonspunkter.filter(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_ANNEN_FORELDER_RETT)}
        submitCallback={submitCallback}
      />
      )
    }

      <UttakFaktaForm
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        readOnly={readOnly}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        aksjonspunkter={aksjonspunkter.filter(ap => ap.definisjon.kode !== aksjonspunktCodes.AVKLAR_ANNEN_FORELDER_RETT)}
        submitCallback={submitCallback}
      />

    </FaktaEkspandertpanel>
  );
};

UttakInfoPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  submitCallback: PropTypes.func.isRequired,
};

const ConnectedComponent = injectIntl(UttakInfoPanelImpl);

const UttakInfoPanel = withDefaultToggling(faktaPanelCodes.UTTAK, uttakAksjonspunkter)(ConnectedComponent);

UttakInfoPanel.supports = (personopplysninger, ytelsesType) => personopplysninger !== null
    && personopplysninger !== undefined
    && ytelsesType.kode === fagsakYtelseType.FORELDREPENGER;

export default UttakInfoPanel;
