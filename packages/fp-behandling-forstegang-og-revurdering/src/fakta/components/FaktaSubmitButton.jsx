import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Hovedknapp } from 'nav-frontend-knapper';

import {
  isBehandlingFormDirty, hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting,
} from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import { isRequiredMessage, ariaCheck } from '@fpsak-frontend/utils';
import { ElementWrapper } from '@fpsak-frontend/shared-components';

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
  buttonTextId,
  onClick,
}) => (
  <ElementWrapper>
    {!isReadOnly
      && (
      <Hovedknapp
        mini
        spinner={isSubmitting}
        disabled={isDisabled(isDirty, isSubmitting, isSubmittable, hasEmptyRequiredFields, hasOpenAksjonspunkter)}
        onClick={onClick || ariaCheck}
        htmlType={onClick ? 'button' : 'submit'}
      >
        <FormattedMessage id={buttonTextId} />
      </Hovedknapp>
      )}
  </ElementWrapper>
);

FaktaSubmitButton.propTypes = {
  buttonTextId: PropTypes.string,
  isReadOnly: PropTypes.bool.isRequired,
  isSubmittable: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isDirty: PropTypes.bool.isRequired,
  hasEmptyRequiredFields: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};

FaktaSubmitButton.defaultProps = {
  buttonTextId: 'SubmitButton.ConfirmInformation',
  onClick: undefined,
};

const mapStateToProps = (state, ownProps) => {
  const fNames = ownProps.formNames ? ownProps.formNames : [ownProps.formName];
  const formNames = fNames.map((f) => (f.includes('.') ? f.substr(f.lastIndexOf('.') + 1) : f));
  return {
    isSubmitting: formNames.some((formName) => isBehandlingFormSubmitting(formName)(state)),
    isDirty: formNames.some((formName) => isBehandlingFormDirty(formName)(state)),
    hasEmptyRequiredFields: ownProps.doNotCheckForRequiredFields
      ? false : formNames.some((formName) => hasBehandlingFormErrorsOfType(formName, isRequiredMessage())(state)),
  };
};

export default connect(mapStateToProps)(FaktaSubmitButton);
