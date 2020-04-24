import React, { FunctionComponent } from 'react';

import VilkarBegrunnelse from './VilkarBegrunnelse';

interface OwnProps {
  overrideReadOnly: boolean;
  isBeregningConfirmation?: boolean;
}


/**
 * OverstyrBegrunnelsePanel
 *
 * Presentasjonskomponent. Lar den NAV-ansatte skrive inn en begrunnelse før overstyring av vilkår eller beregning.
 */
const OverstyrBegrunnelsePanel: FunctionComponent<OwnProps> = ({
  overrideReadOnly,
  isBeregningConfirmation,
}) => (
  <VilkarBegrunnelse
    begrunnelseLabel={isBeregningConfirmation ? 'OverstyrBegrunnelsePanel.Beregning' : 'OverstyrConfirmationForm.Vilkar'}
    isReadOnly={overrideReadOnly}
  />
);

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
