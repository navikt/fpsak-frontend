import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { VerticalSpacer, FaktaGruppe } from '@fpsak-frontend/shared-components';
import {
  RadioGroupField, RadioOption, TextAreaField, behandlingForm,
} from '@fpsak-frontend/form';
import {
  hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);

/**
 * SykdomPanel
 */
export const SykdomPanel = ({
  readOnly,
  alleMerknaderFraBeslutter,
}) => (
  <FaktaGruppe
    aksjonspunktCode={aksjonspunktCodes.VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT}
    titleCode="SykdomPanel.ApplicationInformation"
    merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT]}
  >
    <TextAreaField
      name="begrunnelseSykdom"
      label={{ id: 'SykdomPanel.Begrunnelse' }}
      validate={[required, minLength3, maxLength1500, hasValidText]}
      maxLength={1500}
      readOnly={readOnly}
    />
    <VerticalSpacer eightPx />
    <RadioGroupField name="erMorForSykVedFodsel" validate={[required]} bredde="XL" readOnly={readOnly} direction="vertical">
      <RadioOption value label={{ id: 'SykdomPanel.AnnenForelderForSyk' }} />
      <RadioOption
        value={false}
        label={(
          <FormattedMessage
            id="SykdomPanel.AnnenForelderIkkeForSyk"
            values={{
              b: (...chunks) => <b>{chunks}</b>,
            }}
          />
      )}
      />
    </RadioGroupField>
  </FaktaGruppe>
);

SykdomPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
};

const buildInitialValues = (aksjonspunkt, morForSykVedFodsel) => ({
  begrunnelseSykdom: aksjonspunkt.begrunnelse ? aksjonspunkt.begrunnelse : '',
  erMorForSykVedFodsel: morForSykVedFodsel,
});

const transformValues = (values) => ({
  kode: aksjonspunktCodes.VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT,
  begrunnelse: values.begrunnelseSykdom,
  erMorForSykVedFodsel: values.erMorForSykVedFodsel,
});

const mapStateToPropsFactory = (initialState, staticOwnProps) => {
  const onSubmit = (values) => staticOwnProps.submitHandler(transformValues(values));
  return (state, ownProps) => ({
    initialValues: buildInitialValues(ownProps.aksjonspunkt, ownProps.morForSykVedFodsel),
    onSubmit,
  });
};

export const sykdomPanelName = 'SykdomPanel';

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: sykdomPanelName,
})(SykdomPanel));
