import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';

import { getFamiliehendelse } from 'behandling/behandlingSelectors';
import { behandlingForm } from 'behandling/behandlingForm';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { TextAreaField, RadioGroupField, RadioOption } from 'form/Fields';
import {
  required, hasValidText, maxLength, minLength,
} from 'utils/validation/validators';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import FaktaGruppe from 'fakta/components/FaktaGruppe';

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
