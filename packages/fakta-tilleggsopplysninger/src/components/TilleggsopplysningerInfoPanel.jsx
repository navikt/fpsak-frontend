import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';

import {
  faktaPanelCodes, FaktaEkspandertpanel, withDefaultToggling, behandlingForm,
} from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import TilleggsopplysningerFaktaForm from './TilleggsopplysningerFaktaForm';

// TODO (TOR) Fjern redux-form => ingen behov for det her

/**
 * TilleggsopplysningerInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å sette opp Redux Formen for Tilleggsopplysninger.
 * Denne brukes også funksjonen withDefaultToggling for å håndtere automatisk åpning av panelet
 * når det finnes åpne aksjonspunkter.
 */
export const TilleggsopplysningerInfoPanel = ({
  intl,
  openInfoPanels,
  toggleInfoPanelCallback,
  hasOpenAksjonspunkter,
  readOnly,
  tilleggsopplysninger,
  ...formProps
}) => (
  <FaktaEkspandertpanel
    title={intl.formatMessage({ id: 'TilleggsopplysningerInfoPanel.Tilleggsopplysninger' })}
    hasOpenAksjonspunkter={hasOpenAksjonspunkter}
    isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.TILLEGGSOPPLYSNINGER)}
    toggleInfoPanelCallback={toggleInfoPanelCallback}
    faktaId={faktaPanelCodes.TILLEGGSOPPLYSNINGER}
    readOnly={readOnly}
  >
    <form onSubmit={formProps.handleSubmit}>
      <TilleggsopplysningerFaktaForm
        readOnly={!hasOpenAksjonspunkter || readOnly}
        submitting={formProps.submitting}
        tilleggsopplysninger={tilleggsopplysninger}
      />
    </form>
  </FaktaEkspandertpanel>
);

TilleggsopplysningerInfoPanel.propTypes = {
  intl: PropTypes.shape().isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  tilleggsopplysninger: PropTypes.string,
  ...formPropTypes,
};

TilleggsopplysningerInfoPanel.defaultProps = {
  tilleggsopplysninger: '',
};

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = () => initialOwnProps.submitCallback([{
    kode: aksjonspunktCodes.TILLEGGSOPPLYSNINGER,
  }]);

  return (state, ownProps) => ({
    onSubmit,
    dirty: !ownProps.notSubmittable && ownProps.dirty,
  });
};

const tilleggsopplysningerAksjonspunkter = [aksjonspunktCodes.TILLEGGSOPPLYSNINGER];

const ConnectedComponent = connect(mapStateToPropsFactory)(behandlingForm({
  form: 'TilleggsopplysningerInfoPanel',
})(injectIntl(TilleggsopplysningerInfoPanel)));
export default withDefaultToggling(faktaPanelCodes.TILLEGGSOPPLYSNINGER, tilleggsopplysningerAksjonspunkter)(ConnectedComponent);
