import React, { ReactNode, Component, ChangeEvent } from 'react';
import moment from 'moment';
import { Input } from 'nav-frontend-skjema';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import classnames from 'classnames/bind';
import CalendarOverlay from './CalendarOverlay';
import CalendarToggleButton from './CalendarToggleButton';
import styles from './datepicker.less';

const classNames = classnames.bind(styles);

interface OwnProps {
  label?: ReactNode;
  placeholder?: string;
  feil?: { feilmelding?: string };
  disabled?: boolean;
  onChange: (dato: string | ChangeEvent) => void;
  onBlur: () => void;
  value?: string;
  initialMonth?: Date;
  numberOfMonths?: number;
  disabledDays?: Date | Date[];
}

interface StateProps {
  showCalendar?: boolean;
  inputOffsetTop?: number;
  inputOffsetWidth?: number;
}

class Datepicker extends Component<OwnProps, StateProps> {
  buttonRef: HTMLDivElement;

  inputRef: HTMLDivElement;

  static defaultProps = {
    label: '',
    placeholder: 'dd.mm.åååå',
    value: '',
    feil: null,
    disabled: false,
    initialMonth: new Date(),
    numberOfMonths: 1,
    disabledDays: {},
  };

  constructor(props) {
    super(props);
    this.state = { showCalendar: false };
    this.handleInputRef = this.handleInputRef.bind(this);
    this.handleButtonRef = this.handleButtonRef.bind(this);
    this.handleUpdatedRefs = this.handleUpdatedRefs.bind(this);
    this.toggleShowCalendar = this.toggleShowCalendar.bind(this);
    this.hideCalendar = this.hideCalendar.bind(this);
    this.elementIsCalendarButton = this.elementIsCalendarButton.bind(this);
    this.handleDayChange = this.handleDayChange.bind(this);
  }

  handleButtonRef(buttonRef) {
    if (buttonRef) {
      this.buttonRef = buttonRef;
      this.handleUpdatedRefs();
    }
  }

  handleInputRef(inputRef) {
    if (inputRef) {
      this.inputRef = inputRef;
      this.handleUpdatedRefs();
    }
  }

  handleUpdatedRefs() {
    const { inputRef, buttonRef } = this;
    if (inputRef) {
      this.setState({
        inputOffsetTop: inputRef.offsetTop,
        inputOffsetWidth: inputRef.offsetWidth,
      });
      if (buttonRef) {
        inputRef.style.paddingRight = `${buttonRef.offsetWidth}px`;
      }
    }
  }

  handleDayChange(selectedDay) {
    if (selectedDay) {
      const parsed = moment(selectedDay);
      if (parsed.isValid()) {
        const { onChange } = this.props;
        onChange(parsed.format(DDMMYYYY_DATE_FORMAT));
        this.setState({ showCalendar: false });
        this.inputRef.focus();
      }
    }
  }

  toggleShowCalendar() {
    const { showCalendar } = this.state;
    this.setState({ showCalendar: !showCalendar });
  }

  hideCalendar() {
    this.setState({ showCalendar: false });
  }

  elementIsCalendarButton(element) {
    return element === this.buttonRef;
  }

  render() {
    const {
      label,
      placeholder,
      onChange,
      onBlur,
      value,
      feil,
      disabled,
      disabledDays,
      initialMonth,
      numberOfMonths,
    } = this.props;
    const {
      inputOffsetTop, inputOffsetWidth, showCalendar,
    } = this.state;

    return (
      <>
        <div className={styles.inputWrapper}>
          <Input
            className={styles.dateInput}
            inputRef={this.handleInputRef}
            autoComplete="off"
            bredde="S"
            placeholder={placeholder}
            label={label}
            onChange={onChange}
            onBlur={onBlur}
            value={value || ''}
            feil={feil}
            disabled={disabled}
          />
          <CalendarToggleButton
            inputOffsetTop={inputOffsetTop}
            inputOffsetWidth={inputOffsetWidth}
            className={styles.calendarToggleButton}
            toggleShowCalendar={this.toggleShowCalendar}
            buttonRef={this.handleButtonRef}
            disabled={disabled}

          />
        </div>
        {showCalendar && (
        <CalendarOverlay
          disabled={disabled}
          value={value}
          onDayChange={this.handleDayChange}
          onClose={this.hideCalendar}
          elementIsCalendarButton={this.elementIsCalendarButton}
          className={styles.calendarRoot}
          dayPickerClassName={classNames(`calendarWrapper calendarWrapper--${numberOfMonths}`)}
          disabledDays={disabledDays}
          numberOfMonths={numberOfMonths}
          initialMonth={initialMonth}
        />
        )}
      </>
    );
  }
}

export default Datepicker;
