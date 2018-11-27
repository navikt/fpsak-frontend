import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Hovedknapp } from 'nav-frontend-knapper';

import { isRequiredMessage } from 'utils/validation/messages';
import { isBehandlingFormDirty, hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting } from 'behandling/behandlingForm';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import { ariaCheck } from 'utils/validation/validators';

const isDisabled = (isDirty, isSubmitting, isSubmittable, hasEmptyRequiredFields, hasOpenAksjonspunkter) => {
  if (!isSubmittable || isSubmitting) {
    return true;
  }
  if (hasOpenAksjonspunkter) {
    return hasEmptyRequiredFields || (!isDirty && hasEmptyRequiredFields);
  }

  return !isDirty;
};

/**
 * FaktaSubmitButton
 */
export const FaktaSubmitButton = ({
  isReadOnly,
  isSubmittable,
  isSubmitting,
  isDirty,
  hasEmptyRequiredFields,
  hasOpenAksjonspunkter,
}) => (
  <ElementWrapper>
    {!isReadOnly
      && (
      <Hovedknapp
        mini
        spinner={isSubmitting}
        disabled={isDisabled(isDirty, isSubmitting, isSubmittable, hasEmptyRequiredFields, hasOpenAksjonspunkter)}
        onClick={ariaCheck}
      >
        <FormattedMessage id="SubmitButton.ConfirmInformation" />
      </Hovedknapp>
      )
    }
  </ElementWrapper>
);

FaktaSubmitButton.propTypes = {
  isReadOnly: PropTypes.bool.isRequired,
  isSubmittable: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isDirty: PropTypes.bool.isRequired,
  hasEmptyRequiredFields: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const fNames = ownProps.formNames ? ownProps.formNames : [ownProps.formName];
  const formNames = fNames.map(f => (f.includes('.') ? f.substr(f.lastIndexOf('.') + 1) : f));
  return {
    isSubmitting: formNames.some(formName => isBehandlingFormSubmitting(formName)(state)),
    isDirty: formNames.some(formName => isBehandlingFormDirty(formName)(state)),
    hasEmptyRequiredFields: ownProps.doNotCheckForRequiredFields
      ? false : formNames.some(formName => hasBehandlingFormErrorsOfType(formName, isRequiredMessage())(state)),
  };
};

export default connect(mapStateToProps)(FaktaSubmitButton);
