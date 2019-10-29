import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { faktaPanelCodes, FaktaEkspandertpanel, withDefaultToggling } from '@fpsak-frontend/fp-felles';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import fodselOgTilretteleggingAksjonspunkterPropType from '../propTypes/fodselOgTilretteleggingAksjonspunkterPropType';
import fodselOgTilretteleggingPropType from '../propTypes/fodselOgTilretteleggingPropType';
import FodselOgTilretteleggingFaktaForm from './FodselOgTilretteleggingFaktaForm';

/**
 * Svangerskapspenger
 * Fakta om Fødsel og tilrettelegging
 */
export const FodselOgTilretteleggingInfoPanel = ({
  intl,
  behandlingId,
  behandlingVersjon,
  svangerskapspengerTilrettelegging,
  aksjonspunkter,
  toggleInfoPanelCallback,
  openInfoPanels,
  readOnly,
  hasOpenAksjonspunkter,
  submitCallback,
  submittable,
}) => (
  <FaktaEkspandertpanel
    title={intl.formatMessage({ id: 'FodselOgTilretteleggingInfoPanel.FaktaFodselOgTilrettelegging' })}
    hasOpenAksjonspunkter={hasOpenAksjonspunkter}
    isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.FODSELTILRETTELEGGING)}
    toggleInfoPanelCallback={toggleInfoPanelCallback}
    faktaId={faktaPanelCodes.FODSELTILRETTELEGGING}
    readOnly={readOnly}
  >
    <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>
      {[<FormattedMessage id="FodselOgTilretteleggingInfoPanel.Aksjonspunkt" key="svangerskapspengerAp" />]}
    </AksjonspunktHelpText>
    <VerticalSpacer eightPx />
    <FodselOgTilretteleggingFaktaForm
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      svangerskapspengerTilrettelegging={svangerskapspengerTilrettelegging}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      readOnly={readOnly}
      hasOpenAksjonspunkter={hasOpenAksjonspunkter}
      submittable={submittable}
    />
  </FaktaEkspandertpanel>
);

FodselOgTilretteleggingInfoPanel.propTypes = {
  intl: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  svangerskapspengerTilrettelegging: fodselOgTilretteleggingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(fodselOgTilretteleggingAksjonspunkterPropType).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  submittable: PropTypes.bool.isRequired,
};

const fodselOgTilretteleggingAksjonspunkt = [aksjonspunktCodes.FODSELTILRETTELEGGING];

export default withDefaultToggling(faktaPanelCodes.FODSELTILRETTELEGGING, fodselOgTilretteleggingAksjonspunkt)(injectIntl(FodselOgTilretteleggingInfoPanel));
