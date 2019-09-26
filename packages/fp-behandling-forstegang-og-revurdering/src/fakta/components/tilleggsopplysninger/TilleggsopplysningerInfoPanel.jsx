import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import { behandlingFormForstegangOgRevurdering } from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import { faktaPanelCodes, FaktaEkspandertpanel, withDefaultToggling } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import TilleggsopplysningerFaktaForm from './TilleggsopplysningerFaktaForm';

/**
 * TilleggsopplysningerInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å sette opp Redux Formen for Tilleggsopplysninger.
 * Denne brukes også funksjonen withDefaultToggling for å håndtere automatisk åpning av panelet
 * når det finnes åpne aksjonspunkter.
 */
export const TilleggsopplysningerInfoPanelImpl = ({
  intl,
  openInfoPanels,
  toggleInfoPanelCallback,
  hasOpenAksjonspunkter,
  readOnly,
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
      />
    </form>
  </FaktaEkspandertpanel>
);

TilleggsopplysningerInfoPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  ...formPropTypes,
};

const buildInitialValues = createSelector([behandlingSelectors.getSoknad], (soknad) => ({
  ...TilleggsopplysningerFaktaForm.buildInitialValues(soknad),
}));

const transformValues = (values) => TilleggsopplysningerFaktaForm.transformValues(values);

const mapStateToPropsFactory = (initialState, ownProps) => {
  const onSubmit = (values) => ownProps.submitCallback([transformValues(values)]);
  return (state) => ({
    onSubmit,
    initialValues: buildInitialValues(state),
    dirty: !ownProps.notSubmittable && ownProps.dirty,
  });
};

const tilleggsopplysningerAksjonspunkter = [aksjonspunktCodes.TILLEGGSOPPLYSNINGER];

const ConnectedComponent = connect(mapStateToPropsFactory)(behandlingFormForstegangOgRevurdering({
  form: 'TilleggsopplysningerInfoPanel',
})(injectIntl(TilleggsopplysningerInfoPanelImpl)));
const TilleggsopplysningerInfoPanel = withDefaultToggling(faktaPanelCodes.TILLEGGSOPPLYSNINGER, tilleggsopplysningerAksjonspunkter)(ConnectedComponent);

TilleggsopplysningerInfoPanel.supports = (aksjonspunkter) => aksjonspunkter.some((ap) => ap.definisjon.kode === tilleggsopplysningerAksjonspunkter[0]);

export default TilleggsopplysningerInfoPanel;
