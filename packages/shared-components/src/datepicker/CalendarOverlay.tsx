import React, { Component } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import moment from 'moment';
import DayPicker from 'react-day-picker';

import { DDMMYYYY_DATE_FORMAT, getRelatedTargetIE11, isIE11 } from '@fpsak-frontend/utils';

const getRelatedTarget = (e) => {
  if (isIE11()) {
    return getRelatedTargetIE11();
  }
  return Promise.resolve(e.relatedTarget);
};

interface OwnProps {
  onDayChange: () => void;
  className: string;
  dayPickerClassName: string;
  elementIsCalendarButton: (target: EventTarget) => void;
  value?: string;
  disabled?: boolean;
  onClose?: () => void;
  initialMonth?: Date;
  numberOfMonths: number;
  disabledDays: Date | Date[];
}

class CalendarOverlay extends Component<OwnProps & WrappedComponentProps> {
  calendarRootRef: HTMLDivElement

  static defaultProps = {
    value: '',
    disabled: false,
    onClose: () => undefined,
    initialMonth: null,
  };

  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.setCalendarRootRef = this.setCalendarRootRef.bind(this);
    this.getDayPickerLocalization = this.getDayPickerLocalization.bind(this);
    this.parseDateValue = this.parseDateValue.bind(this);
    this.targetIsCalendarOrCalendarButton = this.targetIsCalendarOrCalendarButton.bind(this);
  }

  onBlur(e) {
    const { targetIsCalendarOrCalendarButton, props: { onClose } } = this;
    getRelatedTarget(e)
      .then((relatedTarget) => {
        if (targetIsCalendarOrCalendarButton(relatedTarget)) {
          return;
        }
        onClose();
      });
  }

  onKeyDown({ keyCode }) {
    if (keyCode === 27) {
      const { onClose } = this.props;
      onClose();
    }
  }

  setCalendarRootRef(calendarRootRef) {
    if (calendarRootRef) {
      this.calendarRootRef = calendarRootRef;
      calendarRootRef.focus();
    }
  }

  getDayPickerLocalization() {
    const { intl: { formatMessage, locale } } = this.props;
    return {
      locale,
      months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((monthNum) => formatMessage({ id: `Calendar.Month.${monthNum}` })),
      weekdaysLong: [0, 1, 2, 3, 4, 5, 6].map((dayNum) => formatMessage({ id: `Calendar.Day.${dayNum}` })),
      weekdaysShort: [0, 1, 2, 3, 4, 5, 6].map((dayName) => formatMessage({ id: `Calendar.Day.Short.${dayName}` })),
      firstDayOfWeek: 1,
    };
  }

  parseDateValue() {
    const { value } = this.props;
    const parsedValue = moment(value, DDMMYYYY_DATE_FORMAT, true);
    if (parsedValue.isValid()) {
      return parsedValue.toDate();
    }
    return null;
  }

  targetIsCalendarOrCalendarButton(target) {
    const { calendarRootRef, props: { elementIsCalendarButton } } = this;

    const targetIsInsideCalendar = calendarRootRef && calendarRootRef.contains(target);
    const targetIsCalendarButton = elementIsCalendarButton(target);

    return targetIsInsideCalendar || targetIsCalendarButton;
  }

  render() {
    const { disabled } = this.props;
    if (disabled) {
      return null;
    }

    const {
      onDayChange, className, dayPickerClassName, initialMonth, numberOfMonths, disabledDays,
    } = this.props;
    const selectedDay = this.parseDateValue();
    return (
      <div
        className={className}
        ref={this.setCalendarRootRef}
        onBlur={this.onBlur}
        tabIndex={0} // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
        onKeyDown={this.onKeyDown}
        role="link"
      >
        <DayPicker
          {...this.getDayPickerLocalization()}
          className={dayPickerClassName}
          month={selectedDay}
          selectedDays={selectedDay}
          onDayClick={onDayChange}
          onKeyDown={this.onKeyDown}
          initialMonth={initialMonth}
          disabledDays={disabledDays}
          numberOfMonths={numberOfMonths}
        />
      </div>
    );
  }
}

export default injectIntl(CalendarOverlay);
