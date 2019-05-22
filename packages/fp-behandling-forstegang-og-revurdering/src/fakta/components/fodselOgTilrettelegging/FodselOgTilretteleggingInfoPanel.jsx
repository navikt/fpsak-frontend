import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import { FaktaEkspandertpanel, withDefaultToggling } from '@fpsak-frontend/fp-behandling-felles';
import { AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import FodselOgTilretteleggingFaktaForm from './FodselOgTilretteleggingFaktaForm';

/**
 * Svangerskapspenger
 * Fakta om Fødsel og tilrettelegging
 */
// TODO: Må tilpasses med riktig aksjonspunkt og ap.tekst når backend er klar


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
    readOnly={readOnly}
  >
    <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>
      {[<FormattedMessage id="FodselOgTilretteleggingInfoPanel.Aksjonspunkt" key="svangerskapspengerAp" />]}
    </AksjonspunktHelpText>
    <FodselOgTilretteleggingFaktaForm submitCallback={submitCallback} readOnly={readOnly} hasOpenAksjonspunkter={hasOpenAksjonspunkter} />
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

const fodselOgTilretteleggingAksjonspunkt = [aksjonspunktCodes.FODSELTILRETTELEGGING];

const ConnectedComponent = injectIntl(FodselOgTilretteleggingInfoPanelImpl);

const FodselOgTilretteleggingInfoPanel = withDefaultToggling(faktaPanelCodes.FODSELTILRETTELEGGING, fodselOgTilretteleggingAksjonspunkt)(ConnectedComponent);

FodselOgTilretteleggingInfoPanel.supports = aksjonspunkter => aksjonspunkter.some(ap => fodselOgTilretteleggingAksjonspunkt.includes(ap.definisjon.kode));

export default (FodselOgTilretteleggingInfoPanel);
