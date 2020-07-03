import React, { ReactNode, Component, FunctionComponent } from 'react';
import { Field as reduxFormField } from 'redux-form';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Input as NavInput } from 'nav-frontend-skjema';

import renderNavField from './renderNavField';
import ReadOnlyField from './ReadOnlyField';
import LabelType from './LabelType';

interface DecimalFieldProps {
  name: string;
  type?: string;
  className?: string;
  label?: LabelType;
  validate?: (((text: any) => ({ id: string; length?: undefined }
    | { length: any; id?: undefined })[])
    | ((value: any) => { id: string }[])
    | ((text: any) => ({ id: string; text?: undefined }
    | { text: any; id?: undefined })[]))[];
  readOnly?: boolean;
  isEdited?: boolean;
  normalizeOnBlur: (value: number) => number;
  alignRightCenterOnReadOnly?: boolean;
  onChange?: (elmt: ReactNode, value: number) => void;
}

const createNormalizeOnBlurField = (WrappedNavFieldComponent) => {
  interface FieldComponent {
    normalizeOnBlur: (value: any) => void;
    component?: () => reduxFormField;
  }
  class FieldComponent extends Component<FieldComponent & WrappedComponentProps> {
    constructor(props: FieldComponent & WrappedComponentProps) {
      super(props);
      this.blurHandler = this.blurHandler.bind(this);
    }

    blurHandler({ input: { onBlur, ...input }, ...props }) {
      const { normalizeOnBlur, component: Comp } = this.props;
      return (
        // @ts-ignore Fiks
        <Comp
          {...props}
          // @ts-ignore TODO Fiks
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

  const FieldComponentWithIntl = injectIntl(FieldComponent);

  FieldComponentWithIntl.WrappedComponent = FieldComponent;

  return FieldComponentWithIntl;
};

const renderNavInput = renderNavField(NavInput);
const NormalizeOnBlurField = createNormalizeOnBlurField(reduxFormField);

const DecimalField: FunctionComponent<DecimalFieldProps> = ({
  name, type, label, validate, readOnly, isEdited, normalizeOnBlur, alignRightCenterOnReadOnly, ...otherProps
}) => {
  const other = readOnly ? {
    ...otherProps,
    alignRightCenterOnReadOnly,
  } : otherProps;

  return (
    <NormalizeOnBlurField
      name={name}
      validate={validate}
      // @ts-ignore TODO Fiks
      component={readOnly ? ReadOnlyField : renderNavInput}
      type={type}
      label={label}
      normalizeOnBlur={normalizeOnBlur}
      {...other}
      readOnly={readOnly}
      readOnlyHideEmpty
      isEdited={isEdited}
      autoComplete="off"
    />
  );
};

DecimalField.defaultProps = {
  type: 'number',
  validate: null,
  readOnly: false,
  label: '',
  isEdited: false,
  alignRightCenterOnReadOnly: false,
};

export default DecimalField;
