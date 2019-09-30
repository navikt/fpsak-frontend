import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Hovedknapp } from 'nav-frontend-knapper';

import { ariaCheck, isRequiredMessage } from '@fpsak-frontend/utils';
import { ElementWrapper } from '@fpsak-frontend/shared-components';

const isDisabled = (isDirty, isSubmitting, isSubmittable, hasEmptyRequiredFields) => {
  if ((!isDirty && !isSubmittable) || isSubmitting) {
    return true;
  }
  return (!isDirty && hasEmptyRequiredFields) || hasEmptyRequiredFields;
};

// TODO (TOR) Fjern denne når alle behandlingspunkt er flytta ut til eigne pakker

/**
 * BehandlingspunktSubmitButton
 */
export const BehandlingspunktSubmitButton = ({
  isReadOnly,
  isSubmittable,
  isSubmitting,
  isDirty,
  hasEmptyRequiredFields,
  textCode,
}) => (
  <ElementWrapper>
    {!isReadOnly
      && (
      <Hovedknapp
        mini
        spinner={isSubmitting}
        disabled={isDisabled(isDirty, isSubmitting, isSubmittable, hasEmptyRequiredFields)}
        onClick={ariaCheck}
      >
        <FormattedMessage id={textCode} />
      </Hovedknapp>
      )}
  </ElementWrapper>
);

BehandlingspunktSubmitButton.propTypes = {
  isReadOnly: PropTypes.bool.isRequired,
  isSubmittable: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  isDirty: PropTypes.bool.isRequired,
  hasEmptyRequiredFields: PropTypes.bool.isRequired,
  textCode: PropTypes.string,
};

BehandlingspunktSubmitButton.defaultProps = {
  textCode: 'SubmitButton.ConfirmInformation',
};

const mapStateToProps = (state, ownProps) => {
  const fNames = ownProps.formNames ? ownProps.formNames : [ownProps.formName];
  const formNames = fNames.map((f) => (f.includes('.') ? f.substr(f.lastIndexOf('.') + 1) : f));
  return {
    isSubmitting: formNames.some((formName) => ownProps.isBehandlingFormSubmitting(formName)(state)),
    isDirty: ownProps.isDirty !== undefined ? ownProps.isDirty : formNames.some((formName) => ownProps.isBehandlingFormDirty(formName)(state)),
    hasEmptyRequiredFields: formNames.some((formName) => ownProps.hasBehandlingFormErrorsOfType(formName, isRequiredMessage())(state)),
  };
};

export default connect(mapStateToProps)(BehandlingspunktSubmitButton);
