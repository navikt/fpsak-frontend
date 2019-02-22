import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import { FaktaEkspandertpanel, withDefaultToggling } from '@fpsak-frontend/fp-behandling-felles';
import { AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import FodselOgPermisjonFaktaForm from './FodselOgPermisjonFaktaForm';

const fodselOgPermAksjonspunkter = [

];

export const FodselOgPermisjonInfoPanelImpl = ({
  intl,
  toggleInfoPanelCallback,
  openInfoPanels,
  readOnly,
  hasOpenAksjonspunkter,
  submitCallback,
}) => (
  <FaktaEkspandertpanel
    title={intl.formatMessage({ id: 'FodselOgPermisjonInfoPanel.FaktaFodselOgPermisjon' })}
    hasOpenAksjonspunkter
    isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.FODSELPERMISJON)}
    toggleInfoPanelCallback={toggleInfoPanelCallback}
    faktaId={faktaPanelCodes.FODSELPERMISJON}
    readOnly={readOnly}
    disabledTextCode="FodselOgPermisjonInfoPanel.FodselOgPermisjon"
  >
    <AksjonspunktHelpText isAksjonspunktOpen>
      {[<FormattedMessage id="Kontroller opplysninger fra jordmor og arbeidsgiver" key="svangerskapspengerAp" />]}
    </AksjonspunktHelpText>
    <FodselOgPermisjonFaktaForm readOnly={readOnly} hasOpenAksjonspunkter={hasOpenAksjonspunkter} />
  </FaktaEkspandertpanel>
);

FodselOgPermisjonInfoPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
});

const ConnectedComponent = injectIntl(FodselOgPermisjonInfoPanelImpl);

const FodselOgPermisjonInfoPanel = withDefaultToggling(faktaPanelCodes.FODSELPERMISJON, fodselOgPermAksjonspunkter)(ConnectedComponent);

export default connect(mapStateToProps)(FodselOgPermisjonInfoPanel);
