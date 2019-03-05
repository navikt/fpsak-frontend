import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import { FaktaEkspandertpanel, withDefaultToggling } from '@fpsak-frontend/fp-behandling-felles';
import { AksjonspunktHelpText } from '@fpsak-frontend/shared-components';

import FodselOgTilretteleggingFaktaForm from './FodselOgTilretteleggingFaktaForm';

const fodselOgPermAksjonspunkter = ['ap'];

export const FodselOgTilretteleggingInfoPanelImpl = ({
  intl,
  toggleInfoPanelCallback,
  openInfoPanels,
  readOnly,
  hasOpenAksjonspunkter,
  submitCallback,
}) => (
  <FaktaEkspandertpanel
    title={intl.formatMessage({ id: 'FodselOgTilretteleggingInfoPanel.FaktaFodselOgTilrettelegging' })}
    hasOpenAksjonspunkter={hasOpenAksjonspunkter}
    isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.FODSELTILRETTELEGGING)}
    toggleInfoPanelCallback={toggleInfoPanelCallback}
    faktaId={faktaPanelCodes.FODSELTILRETTELEGGING}
    readOnly={false}
    disabledTextCode="FodselOgTilretteleggingInfoPanel.FodselOgTilrettelegging"
  >
    <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>
      {[<FormattedMessage id="Kontroller opplysninger fra jordmor og arbeidsgiver" key="svangerskapspengerAp" />]}
    </AksjonspunktHelpText>
    <FodselOgTilretteleggingFaktaForm submitCallback={submitCallback} readOnly={false} hasOpenAksjonspunkter={hasOpenAksjonspunkter} />
  </FaktaEkspandertpanel>
);

FodselOgTilretteleggingInfoPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
};


const ConnectedComponent = injectIntl(FodselOgTilretteleggingInfoPanelImpl);

const FodselOgTilretteleggingInfoPanel = withDefaultToggling(faktaPanelCodes.FODSELTILRETTELEGGING, fodselOgPermAksjonspunkter)(ConnectedComponent);

export default (FodselOgTilretteleggingInfoPanel);
