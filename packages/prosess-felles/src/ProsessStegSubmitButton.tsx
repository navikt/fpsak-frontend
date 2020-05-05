import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Hovedknapp } from 'nav-frontend-knapper';

import { ariaCheck, isRequiredMessage } from '@fpsak-frontend/utils';

const isDisabled = (isDirty, isSubmitting, isSubmittable, hasEmptyRequiredFields) => {
  if ((!isDirty && !isSubmittable) || isSubmitting) {
    return true;
  }
  return (!isDirty && hasEmptyRequiredFields) || hasEmptyRequiredFields;
};

interface OwnProps {
  isReadOnly: boolean;
  isSubmittable: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  hasEmptyRequiredFields: boolean;
  textCode?: string;
}

/**
 * ProsessStegSubmitButton
 */
export const ProsessStegSubmitButton: FunctionComponent<OwnProps> = ({
  isReadOnly,
  isSubmittable,
  isSubmitting,
  isDirty,
  hasEmptyRequiredFields,
  textCode = 'SubmitButton.ConfirmInformation',
}) => (
  <>
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
  </>
);

const mapStateToProps = (state, ownProps) => {
  const { behandlingId, behandlingVersjon } = ownProps;
  const fNames = ownProps.formNames ? ownProps.formNames : [ownProps.formName];
  const formNames = fNames.map((f) => (f.includes('.') ? f.substr(f.lastIndexOf('.') + 1) : f));
  return {
    isSubmitting: formNames.some((formName) => ownProps.isBehandlingFormSubmitting(formName, behandlingId, behandlingVersjon)(state)),
    isDirty: ownProps.isDirty !== undefined
      ? ownProps.isDirty : formNames.some((formName) => ownProps.isBehandlingFormDirty(formName, behandlingId, behandlingVersjon)(state)),
    hasEmptyRequiredFields: formNames.some((formName) => ownProps
      .hasBehandlingFormErrorsOfType(formName, behandlingId, behandlingVersjon, isRequiredMessage())(state)),
  };
};

export default connect(mapStateToProps)(ProsessStegSubmitButton);
