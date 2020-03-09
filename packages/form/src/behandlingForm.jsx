import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import {
  reduxForm, formValueSelector, isDirty, getFormSyncErrors, isSubmitting, getFormValues, getFormInitialValues,
} from 'redux-form';

import { LoadingPanel, requireProps } from '@fpsak-frontend/shared-components';

export const getBehandlingFormPrefix = (behandlingId, behandlingVersjon) => `behandling_${behandlingId}_v${behandlingVersjon}`;
export const getBehandlingFormName = (behandlingId, behandlingVersjon, form) => `${getBehandlingFormPrefix(behandlingId, behandlingVersjon)}.${form}`;

/**
 * behandlingForm
 *
 * Higher-order component som lager forms innen konteksten av en gitt behandling. BehandlingIndex har ansvaret for å styre livssyklusen til disse skjemaene.
 * @see BehandlingIndex
 */
export const behandlingForm = (config = {}) => (WrappedComponent) => {
  const { form, ...reduxFormConfig } = config;
  // Default configuration lets BehandlingIndex manage the lifecycle of the forms
  const defaultReduxFormConfig = {
    destroyOnUnmount: false,
    keepDirtyOnReinitialize: true,
  };
  const FormComponent = reduxForm({
    ...defaultReduxFormConfig,
    ...reduxFormConfig,
  })(WrappedComponent);

  const WithBehandlingForm = ({ behandlingFormName, ...otherProps }) => (
    <FormComponent
      {...otherProps}
      key={behandlingFormName}
      form={behandlingFormName}
    />
  );

  WithBehandlingForm.propTypes = {
    behandlingId: PropTypes.number.isRequired,
    behandlingVersjon: PropTypes.number.isRequired,
    behandlingFormName: PropTypes.string.isRequired,
  };

  const mapStateToProps = (state, ownProps) => ({
    behandlingFormName: getBehandlingFormName(ownProps.behandlingId, ownProps.behandlingVersjon, form || ownProps.form),
  });

  return connect(mapStateToProps)(requireProps(['behandlingId', 'behandlingVersjon'], <LoadingPanel />)(WithBehandlingForm));
};

const getFormName = (formName, behandlingId, behandlingVersjon) => (behandlingId && behandlingVersjon
  ? getBehandlingFormName(behandlingId, behandlingVersjon, formName)
  : {});

export const behandlingFormValueSelector = (formName, behandlingId, behandlingVersjon) => (
  state, ...fieldNames
) => formValueSelector(getFormName(formName, behandlingId, behandlingVersjon))(state, ...fieldNames);

export const isBehandlingFormDirty = (formName, behandlingId, behandlingVersjon) => (
  state,
) => isDirty(getFormName(formName, behandlingId, behandlingVersjon))(state);

export const isBehandlingFormSubmitting = (formName, behandlingId, behandlingVersjon) => (
  state,
) => isSubmitting(getFormName(formName, behandlingId, behandlingVersjon))(state);

export const getBehandlingFormValues = (formName, behandlingId, behandlingVersjon) => (
  state,
) => getFormValues(getFormName(formName, behandlingId, behandlingVersjon))(state);

export const getBehandlingFormInitialValues = (formName, behandlingId, behandlingVersjon) => (
  state,
) => getFormInitialValues(getFormName(formName, behandlingId, behandlingVersjon))(state);

export const getBehandlingFormSyncErrors = (formName, behandlingId, behandlingVersjon) => (
  state,
) => getFormSyncErrors(getFormName(formName, behandlingId, behandlingVersjon))(state);

const getFormState = (state) => state.form;
export const getBehandlingFormRegisteredFields = (formName, behandlingId, behandlingVersjon) => createSelector(
  [getFormState], (formState = {}) => {
    const behandlingFormId = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
    return (formState[behandlingFormId] && formState[behandlingFormId][formName]
      ? formState[behandlingFormId][formName].registeredFields : {});
  },
);

const traverseAndFindValue = (error, idParts) => idParts.reduce((o, i) => (o[i] ? o[i] : []), error);

export const hasBehandlingFormErrorsOfType = (formName, behandlingId, behandlingVersjon, errorMsg) => createSelector(
  [getBehandlingFormRegisteredFields(formName, behandlingId, behandlingVersjon),
    getBehandlingFormSyncErrors(formName, behandlingId, behandlingVersjon)],
  (registeredFields = {}, errors = {}) => {
    const shownFieldIds = Object.keys(registeredFields).filter((rf) => registeredFields[rf].count > 0);

    return shownFieldIds.some((id) => {
      const idParts = id.split(/[.|\[|\]]/).filter((parts) => parts && parts !== ''); /* eslint-disable-line no-useless-escape */
      return Object.keys(errors)
        .some((errorKey) => {
          const value = traverseAndFindValue({ [errorKey]: errors[errorKey] }, idParts);
          return Array.isArray(value) ? value.some((eo) => eo && eo.id === errorMsg[0].id) : false;
        });
    });
  },
);
