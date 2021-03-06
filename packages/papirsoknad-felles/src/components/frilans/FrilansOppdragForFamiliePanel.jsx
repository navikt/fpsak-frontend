import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FieldArray, formValueSelector } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { ArrowBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';

import FrilansOppdragForFamilieFieldArray, { defaultFrilansPeriode } from './FrilansOppdragForFamilieFieldArray';

/**
 * FrilansOppdragForFamiliePanel
 *
 * Presentasjonskomponent.
 */
export const FrilansOppdragForFamiliePanelImpl = ({
  intl,
  readOnly,
  harHattOppdragForFamilie,
}) => (
  <>
    <RadioGroupField
      name="harHattOppdragForFamilie"
      readOnly={readOnly}
      label={<FormattedMessage id="Registrering.FrilansOppdrag.HarHattOppdragForFamilie" />}
    >
      <RadioOption label={intl.formatMessage({ id: 'Registrering.FrilansOppdrag.Yes' })} value />
      <RadioOption label={intl.formatMessage({ id: 'Registrering.FrilansOppdrag.No' })} value={false} />
    </RadioGroupField>
    {harHattOppdragForFamilie
      && (
      <ArrowBox>
        <Normaltekst><FormattedMessage id="Registrering.FrilansOppdrag.OppgiPeriode" /></Normaltekst>
        <VerticalSpacer space={2} />
        <FieldArray name="oppdragPerioder" component={FrilansOppdragForFamilieFieldArray} readOnly={readOnly} />
      </ArrowBox>
      )}
  </>
);

FrilansOppdragForFamiliePanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  harHattOppdragForFamilie: PropTypes.bool,
};

FrilansOppdragForFamiliePanelImpl.defaultProps = {
  harHattOppdragForFamilie: undefined,
};

const mapStateToProps = (state, ownProps) => ({
  harHattOppdragForFamilie: formValueSelector(ownProps.formName)(state, ownProps.namePrefix).harHattOppdragForFamilie,
});

const FrilansOppdragForFamiliePanel = connect(mapStateToProps)(injectIntl(FrilansOppdragForFamiliePanelImpl));

FrilansOppdragForFamiliePanel.buildInitialValues = () => ({
  oppdragPerioder: [defaultFrilansPeriode],
});

FrilansOppdragForFamiliePanel.validate = (values) => ({
  oppdragPerioder: FrilansOppdragForFamilieFieldArray.validate(values),
});

export default FrilansOppdragForFamiliePanel;
