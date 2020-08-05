import React, { Component } from 'react';
import { Select as NavSelect } from 'nav-frontend-skjema';

interface CustomNavSelectProps {
  selectValues: React.ReactElement[];
  placeholder?: React.ReactNode;
  value?: React.ReactNode;
  hideValueOnDisable?: boolean;
  disabled?: boolean;
  label: string;
}

class CustomNavSelect extends Component<CustomNavSelectProps> {
  selectElement: any;

  static defaultProps = {
    hideValueOnDisable: false,
    disabled: false,
  };

  constructor(props: CustomNavSelectProps) {
    super(props);
    this.getOptionValues = this.getOptionValues.bind(this);
    this.checkCorrespondingOptionForValue = this.checkCorrespondingOptionForValue.bind(this);
    this.handleSelectRef = this.handleSelectRef.bind(this);
    this.selectedValue = this.selectedValue.bind(this);
  }

  componentDidMount() {
    this.checkCorrespondingOptionForValue();
  }

  componentDidUpdate() {
    this.checkCorrespondingOptionForValue();
  }

  getOptionValues(): React.ReactNode[] {
    const { props: { selectValues } } = this;
    return selectValues
      .map((option) => option.props)
      .map((props = {}) => props.value);
  }

  selectedValue(value): any {
    const selectedValue = this.getOptionValues().find((optionValue) => optionValue === value);

    return selectedValue || '';
  }

  checkCorrespondingOptionForValue() {
    const { getOptionValues, props: { value } } = this;
    // (aa) added "&& value !== ''" as to not spam other browsers
    if (!getOptionValues().includes(value) && value !== '') {
      // eslint-disable-next-line no-console
      console.warn(`No corresponding option found for value '${value}'`); // NOSONAR Viser ikke sensitiv info
    }
  }

  handleSelectRef(selectRef?: any) {
    if (selectRef) {
      this.selectElement = selectRef;
    }
  }

  render() {
    const {
      handleSelectRef,
      selectedValue,
      props: {
        placeholder, selectValues, value, hideValueOnDisable, disabled, ...otherProps
      },
    } = this;
    return (
      <NavSelect
        {...otherProps}
        selectRef={handleSelectRef}
        value={hideValueOnDisable && disabled ? '' : selectedValue(value)}
        disabled={disabled}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {selectValues}
      </NavSelect>
    );
  }
}

export default CustomNavSelect;
