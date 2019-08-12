import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isSelectedBehandlingspunktOverrideReadOnly } from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/behandlingsprosessSelectors';
import VilkarBegrunnelse from './VilkarBegrunnelse';

/**
 * OverstyrConfirmationForm
 *
 * Presentasjonskomponent. Lar den NAV-ansatte skrive inn en begrunnelse før overstyring av vilkår eller beregning.
 */
const OverstyrConfirmationFormImpl = ({
  isReadOnly,
  isBeregningConfirmation,
}) => (
  <VilkarBegrunnelse
    begrunnelseLabel={isBeregningConfirmation ? 'OverstyrConfirmationForm.Beregning' : 'OverstyrConfirmationForm.Vilkar'}
    isReadOnly={isReadOnly}
  />
);


OverstyrConfirmationFormImpl.propTypes = {
  isReadOnly: PropTypes.bool.isRequired,
  isBeregningConfirmation: PropTypes.bool,
};

OverstyrConfirmationFormImpl.defaultProps = {
  isBeregningConfirmation: false,
};

const mapStateToProps = state => ({
  isReadOnly: isSelectedBehandlingspunktOverrideReadOnly(state),
});

const OverstyrConfirmationForm = connect(mapStateToProps)(OverstyrConfirmationFormImpl);

OverstyrConfirmationForm.buildInitialValues = aksjonspunkt => ({
  begrunnelse: VilkarBegrunnelse.buildInitialValues(aksjonspunkt),
});

OverstyrConfirmationForm.transformValues = values => ({
  begrunnelse: values.begrunnelse,
});

export default OverstyrConfirmationForm;
