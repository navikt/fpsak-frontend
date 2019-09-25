import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';

import { faktaPanelCodes, FaktaEkspandertpanel, withDefaultToggling } from '@fpsak-frontend/fp-felles';
import { AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import FodselOgTilretteleggingFaktaForm from './FodselOgTilretteleggingFaktaForm';

/**
 * Svangerskapspenger
 * Fakta om Fødsel og tilrettelegging
 */

export const FodselOgTilretteleggingInfoPanelImpl = ({
  intl,
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
    <FodselOgTilretteleggingFaktaForm
      submitCallback={submitCallback}
      readOnly={readOnly}
      hasOpenAksjonspunkter={hasOpenAksjonspunkter}
      submittable={submittable}
    />
  </FaktaEkspandertpanel>
);

FodselOgTilretteleggingInfoPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  submittable: PropTypes.bool.isRequired,
};

const fodselOgTilretteleggingAksjonspunkt = [aksjonspunktCodes.FODSELTILRETTELEGGING];

const ConnectedComponent = injectIntl(FodselOgTilretteleggingInfoPanelImpl);

const FodselOgTilretteleggingInfoPanel = withDefaultToggling(faktaPanelCodes.FODSELTILRETTELEGGING, fodselOgTilretteleggingAksjonspunkt)(ConnectedComponent);

FodselOgTilretteleggingInfoPanel.supports = (aksjonspunkter) => aksjonspunkter.some((ap) => fodselOgTilretteleggingAksjonspunkt.includes(ap.definisjon.kode));

export default (FodselOgTilretteleggingInfoPanel);
