import React from 'react';
import PropTypes from 'prop-types';

import VilkarBegrunnelse from '../VilkarBegrunnelse';

/**
 * OverstyrBegrunnelsePanel
 *
 * Presentasjonskomponent. Lar den NAV-ansatte skrive inn en begrunnelse før overstyring av vilkår eller beregning.
 */
const OverstyrBegrunnelsePanel = ({
  overrideReadOnly,
  isBeregningConfirmation,
}) => (
  <VilkarBegrunnelse
    begrunnelseLabel={isBeregningConfirmation ? 'OverstyrBegrunnelsePanel.Beregning' : 'OverstyrConfirmationForm.Vilkar'}
    isReadOnly={overrideReadOnly}
  />
);

OverstyrBegrunnelsePanel.propTypes = {
  overrideReadOnly: PropTypes.bool.isRequired,
  isBeregningConfirmation: PropTypes.bool,
};

OverstyrBegrunnelsePanel.defaultProps = {
  isBeregningConfirmation: false,
};

OverstyrBegrunnelsePanel.buildInitialValues = (aksjonspunkt) => ({
  ...VilkarBegrunnelse.buildInitialValues(aksjonspunkt),
});

OverstyrBegrunnelsePanel.transformValues = (values) => ({
  begrunnelse: values.begrunnelse,
});

export default OverstyrBegrunnelsePanel;
