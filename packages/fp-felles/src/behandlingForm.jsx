import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import {
  reduxForm, formValueSelector, getFormSyncErrors, isDirty, getFormValues, getFormInitialValues, isSubmitting,
} from 'redux-form';

import { LoadingPanel } from '@fpsak-frontend/shared-components';

import requireProps from './requireProps';

export const getBehandlingFormPrefix = (behandlingId, behandlingVersjon) => `behandling_${behandlingId}_v${behandlingVersjon}`;
export const getBehandlingFormName = (behandlingId, behandlingVersjon, form) => `${getBehandlingFormPrefix(behandlingId, behandlingVersjon)}.${form}`;

/**
 * behandlingForm
 *
 * Higher-order component som lager forms innen konteksten av en gitt behandling. BehandlingIndex har ansvaret for å styre livssyklusen til disse skjemaene.
 * @see BehandlingIndex
 */
export const getBehandlingForm = (config, WrappedComponent, getSelectedBehandlingId, getBehandlingVersjon) => {
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
    selectedBehandlingId: PropTypes.number.isRequired,
    selectedBehandlingVersjon: PropTypes.number.isRequired,
    behandlingFormName: PropTypes.string.isRequired,
  };

  const mapStateToProps = (state) => ({
    selectedBehandlingId: getSelectedBehandlingId(state),
    selectedBehandlingVersjon: getBehandlingVersjon(state),
  });

  const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    behandlingFormName: getBehandlingFormName(stateProps.selectedBehandlingId, stateProps.selectedBehandlingVersjon, form || ownProps.form),
  });

  return connect(mapStateToProps, null, mergeProps)(requireProps(['selectedBehandlingId'], <LoadingPanel />)(WithBehandlingForm));
};


export const getBehandlingFormSelectors = (getSelectedBehandlingId, getBehandlingVersjon) => {
  const getFormName = (formName) => createSelector([getSelectedBehandlingId, getBehandlingVersjon],
    (selectedBehandlingId, selectedBehandlingVersjon) => {
      if (!selectedBehandlingId || !selectedBehandlingVersjon) {
        return {};
      }
      return getBehandlingFormName(selectedBehandlingId, selectedBehandlingVersjon, formName);
    });

  const behandlingFormValueSelector = (formName) => (state, ...fieldNames) => formValueSelector(getFormName(formName)(state))(state, ...fieldNames);
  const getBehandlingFormSyncErrors = (formName) => (state) => getFormSyncErrors(getFormName(formName)(state))(state);
  const isBehandlingFormDirty = (formName) => (state) => isDirty(getFormName(formName)(state))(state);
  const isBehandlingFormSubmitting = (formName) => (state) => isSubmitting(getFormName(formName)(state))(state);
  const getBehandlingFormValues = (formName) => (state) => getFormValues(getFormName(formName)(state))(state);
  const getBehandlingFormInitialValues = (formName) => (state) => getFormInitialValues(getFormName(formName)(state))(state);

  const getFormState = (state) => state.form;
  const getBehandlingFormRegisteredFields = (formName) => createSelector(
    [getSelectedBehandlingId, getBehandlingVersjon, getFormState],
    (behandlingId, behandlingVersjon, formState = {}) => {
      const behandlingFormId = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
      return (formState[behandlingFormId] && formState[behandlingFormId][formName]
        ? formState[behandlingFormId][formName].registeredFields : {});
    },
  );

  const traverseAndFindValue = (error, idParts) => idParts.reduce((o, i) => (o[i] ? o[i] : []), error);

  const hasBehandlingFormErrorsOfType = (formName, errorMsg) => createSelector(
    [getBehandlingFormRegisteredFields(formName), getBehandlingFormSyncErrors(formName)],
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

  return {
    behandlingFormValueSelector,
    getBehandlingFormSyncErrors,
    isBehandlingFormDirty,
    isBehandlingFormSubmitting,
    getBehandlingFormValues,
    getBehandlingFormInitialValues,
    getBehandlingFormRegisteredFields,
    hasBehandlingFormErrorsOfType,
  };
};
