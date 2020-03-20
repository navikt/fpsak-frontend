import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';

import { behandlingForm } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import TilleggsopplysningerFaktaForm from './TilleggsopplysningerFaktaForm';

// TODO (TOR) Fjern redux-form => ingen behov for det her

/**
 * TilleggsopplysningerInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å sette opp Redux Formen for Tilleggsopplysninger.
 */
export const TilleggsopplysningerInfoPanel = ({
  hasOpenAksjonspunkter,
  readOnly,
  tilleggsopplysninger,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <TilleggsopplysningerFaktaForm
      readOnly={!hasOpenAksjonspunkter || readOnly}
      submitting={formProps.submitting}
      tilleggsopplysninger={tilleggsopplysninger}
    />
  </form>
);

TilleggsopplysningerInfoPanel.propTypes = {
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

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: 'TilleggsopplysningerInfoPanel',
})(injectIntl(TilleggsopplysningerInfoPanel)));
