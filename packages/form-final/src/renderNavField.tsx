import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import Label, { labelPropType } from './Label';

const renderNavField = (WrappedNavFieldComponent) => {
  class FieldComponent extends Component {
    constructor() {
      super();
      this.formatError = this.formatError.bind(this);
    }

    formatError(submitFailed, error, onBlurValidation) {
      const { intl } = this.props;
      if ((onBlurValidation || submitFailed) && error) {
        return { feilmelding: intl.formatMessage(...error) };
      }
      return undefined;
    }

    render() {
      const {
        input, meta: { submitFailed, error }, label, readOnly, isEdited, readOnlyHideEmpty, onBlurValidation, ...otherProps
      } = this.props;
      const isEmpty = input.value === null || input.value === undefined || input.value === '';
      if (readOnly && readOnlyHideEmpty && isEmpty) {
        return null;
      }
      const fieldProps = {
        feil: this.formatError(submitFailed, error, onBlurValidation),
        label: <Label input={label} readOnly={readOnly} />,
      };

      if (!readOnly) {
        return <WrappedNavFieldComponent {...fieldProps} {...input} {...otherProps} readOnly={readOnly} />;
      }
      return <WrappedNavFieldComponent {...fieldProps} {...input} isEdited={isEdited} {...otherProps} readOnly={readOnly} />;
    }
  }

  FieldComponent.propTypes = {
    input: PropTypes.shape().isRequired,
    meta: PropTypes.shape().isRequired,
    intl: intlShape.isRequired,
    label: labelPropType,
    readOnly: PropTypes.bool,
    readOnlyHideEmpty: PropTypes.bool,
    isEdited: PropTypes.bool,
    onBlurValidation: PropTypes.bool,
  };

  FieldComponent.defaultProps = {
    label: undefined,
    readOnly: false,
    readOnlyHideEmpty: false,
    isEdited: false,
    onBlurValidation: false,
  };

  const FieldComponentWithIntl = injectIntl(FieldComponent);

  FieldComponentWithIntl.WrappedComponent = FieldComponent;

  return FieldComponentWithIntl;
};

export default renderNavField;
