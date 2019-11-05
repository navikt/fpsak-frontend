import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';

/**
 * VurderMilitær
 *
 * Presentasjonskomponent. Setter opp fakta om beregning tilfelle VURDER_MILITAER som ber
 * saksbehandler bestemme om en søker har inntekt fra militær eller siviltjeneste.
 */
export const vurderMilitaerField = 'vurderMilitær';

const VurderMilitaer = ({
  readOnly,
  isAksjonspunktClosed,
}) => (
  <div>
    <Normaltekst>
      <FormattedMessage id="BeregningInfoPanel.VurderMilitaer.HarSøkerMilitærinntekt" />
    </Normaltekst>
    <RadioGroupField
      name={vurderMilitaerField}
      validate={[required]}
      readOnly={readOnly}
      isEdited={isAksjonspunktClosed}
    >
      <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Ja" />} value />
      <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Nei" />} value={false} />
    </RadioGroupField>
  </div>
);

VurderMilitaer.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
};

VurderMilitaer.buildInitialValues = (faktaOmBeregning) => {
  const initialValues = {};
  if (!faktaOmBeregning || !faktaOmBeregning.vurderMilitaer) {
    return initialValues;
  }
  initialValues[vurderMilitaerField] = faktaOmBeregning.vurderMilitaer.harMilitaer === true;
  return initialValues;
};

VurderMilitaer.transformValues = (values) => ({
  vurderMilitaer: { harMilitaer: values[vurderMilitaerField] },
});

export default VurderMilitaer;
