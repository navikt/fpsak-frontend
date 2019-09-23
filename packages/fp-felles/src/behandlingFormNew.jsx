import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  reduxForm, formValueSelector,
} from 'redux-form';

import { LoadingPanel } from '@fpsak-frontend/shared-components';
import requireProps from './requireProps';

export const getBehandlingFormPrefix = (behandlingId, behandlingVersjon) => `behandling_${behandlingId}_v${behandlingVersjon}`;
export const getBehandlingFormName = (behandlingId, behandlingVersjon, form) => `${getBehandlingFormPrefix(behandlingId, behandlingVersjon)}.${form}`;

// TODO (TOR) Denne skal ta over for behandlingForm

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

export const behandlingFormValueSelector = (formName, behandlingId, behandlingVersjon) => (state, ...fieldNames) => {
  const behandlingFormName = behandlingId && behandlingVersjon
    ? getBehandlingFormName(behandlingId, behandlingVersjon, formName)
    : {};
  return formValueSelector(behandlingFormName)(state, ...fieldNames);
};
