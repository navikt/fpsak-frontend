import React, { Component } from 'react';
import { Field as reduxFormField } from 'redux-form';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Input as NavInput } from 'nav-frontend-skjema';
import renderNavField from './renderNavField';
import ReadOnlyField from './ReadOnlyField';
import { labelPropType } from './Label';

const createNormalizeOnBlurField = (WrappedNavFieldComponent) => {
  class FieldComponent extends Component {
    constructor(props) {
      super(props);
      this.blurHandler = this.blurHandler.bind(this);
    }

    blurHandler({ input: { onBlur, ...input }, ...props }) {
      const { normalizeOnBlur, component: Comp } = this.props;
      return (
        <Comp
          {...props}
          input={{
            ...input,
            onBlur: (event) => {
              const value = event && event.target && Object.prototype.hasOwnProperty.call(event.target, 'value')
                ? event.target.value
                : event;
              const newValue = normalizeOnBlur ? normalizeOnBlur(value) : value;
              onBlur(newValue);
            },
          }}
        />
      );
    }

    render() {
      const { component, normalizeOnBlur, ...props } = this.props;
      if (normalizeOnBlur) {
        return <WrappedNavFieldComponent component={this.blurHandler} {...props} />;
      }
      return <WrappedNavFieldComponent component={component} {...props} />;
    }
  }

  FieldComponent.propTypes = {
    normalizeOnBlur: PropTypes.func.isRequired,
    component: PropTypes.func,
    intl: intlShape.isRequired,
  };
  FieldComponent.defaultProps = {
    component: undefined,
  };

  const FieldComponentWithIntl = injectIntl(FieldComponent);

  FieldComponentWithIntl.WrappedComponent = FieldComponent;

  return FieldComponentWithIntl;
};

const renderNavInput = renderNavField(NavInput);
const NormalizeOnBlurField = createNormalizeOnBlurField(reduxFormField);

const DecimalField = ({
  name, type, label, validate, readOnly, isEdited, normalizeOnBlur, ...otherProps
}) => (
  <NormalizeOnBlurField
    name={name}
    validate={validate}
    component={readOnly ? ReadOnlyField : renderNavInput}
    type={type}
    label={label}
    normalizeOnBlur={normalizeOnBlur}
    {...otherProps}
    readOnly={readOnly}
    readOnlyHideEmpty
    isEdited={isEdited}
    autoComplete="off"
  />
);

DecimalField.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: labelPropType,
  validate: PropTypes.arrayOf(PropTypes.func),
  readOnly: PropTypes.bool,
  isEdited: PropTypes.bool,
  normalizeOnBlur: PropTypes.func.isRequired,
};

DecimalField.defaultProps = {
  type: 'number',
  validate: null,
  readOnly: false,
  label: '',
  isEdited: false,
};

export default DecimalField;
