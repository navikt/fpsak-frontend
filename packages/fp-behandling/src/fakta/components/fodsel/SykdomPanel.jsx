import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';

import { getFamiliehendelse } from 'behandlingFpsak/src/behandlingSelectors';
import { behandlingForm } from 'behandlingFpsak/src/behandlingForm';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { TextAreaField, RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import {
  required, hasValidText, maxLength, minLength,
} from '@fpsak-frontend/utils';
import FaktaGruppe from 'behandlingFpsak/src/fakta/components/FaktaGruppe';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);

/**
 * SykdomPanel
 */
export const SykdomPanel = ({
  readOnly,
}) => (
  <FaktaGruppe aksjonspunktCode={aksjonspunktCodes.VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT} titleCode="SykdomPanel.ApplicationInformation">
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
      <RadioOption value={false} label={<FormattedHTMLMessage id="SykdomPanel.AnnenForelderIkkeForSyk" />} />
    </RadioGroupField>
  </FaktaGruppe>
);

SykdomPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
};

const buildInitialValues = (aksjonspunkt, familiehendelse) => ({
  begrunnelseSykdom: aksjonspunkt.begrunnelse ? aksjonspunkt.begrunnelse : '',
  erMorForSykVedFodsel: familiehendelse.morForSykVedFodsel,
});

const transformValues = values => ({
  kode: aksjonspunktCodes.VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT,
  begrunnelse: values.begrunnelseSykdom,
  erMorForSykVedFodsel: values.erMorForSykVedFodsel,
});

const mapStateToProps = (state, ownProps) => ({
  initialValues: buildInitialValues(ownProps.aksjonspunkt, getFamiliehendelse(state)),
  onSubmit: values => ownProps.submitHandler(transformValues(values)),
});

export const sykdomPanelName = 'SykdomPanel';

export default connect(mapStateToProps)(behandlingForm({
  form: sykdomPanelName,
})(SykdomPanel));
