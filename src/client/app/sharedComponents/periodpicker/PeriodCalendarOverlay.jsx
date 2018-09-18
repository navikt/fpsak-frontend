import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape, injectIntl } from 'react-intl';
import DayPicker from 'react-day-picker';
import moment from 'moment';

import { getRelatedTargetIE11, isIE11 } from 'utils/browserUtils';

const getRelatedTarget = (e) => {
  if (isIE11()) {
    return getRelatedTargetIE11();
  }
  return Promise.resolve(e.relatedTarget);
};

class PeriodCalendarOverlay extends Component {
  constructor() {
    super();
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.setCalendarRootRef = this.setCalendarRootRef.bind(this);
    this.onDayClick = this.onDayClick.bind(this);
    this.getDayPickerLocalization = this.getDayPickerLocalization.bind(this);
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

  onDayClick(selectedDate) {
    let isSelectable = true;
    const { disabledDays, onDayChange } = this.props;
    const { before: intervalStart } = disabledDays;
    if (intervalStart) {
      isSelectable = moment(selectedDate).isSameOrAfter(moment(intervalStart).startOf('day'));
    }
    const { after: intervalEnd } = disabledDays;
    if (isSelectable && intervalEnd) {
      isSelectable = moment(selectedDate).isSameOrBefore(moment(intervalEnd).endOf('day'));
    }
    if (isSelectable) {
      onDayChange(selectedDate);
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
      months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(monthNum => formatMessage({ id: `Calendar.Month.${monthNum}` })),
      weekdaysLong: [0, 1, 2, 3, 4, 5, 6].map(dayNum => formatMessage({ id: `Calendar.Day.${dayNum}` })),
      weekdaysShort: [0, 1, 2, 3, 4, 5, 6].map(dayName => formatMessage({ id: `Calendar.Day.Short.${dayName}` })),
      firstDayOfWeek: 1,
    };
  }

  targetIsCalendarOrCalendarButton(target) {
    const { calendarRootRef, props: { elementIsCalendarButton } } = this;

    const targetIsInsideCalendar = calendarRootRef && calendarRootRef.contains(target);
    const targetIsCalendarButton = elementIsCalendarButton(target);

    return targetIsInsideCalendar || targetIsCalendarButton;
  }

  render() {
    const {
      disabled, className, dayPickerClassName, disabledDays, startDate, endDate,
    } = this.props;
    if (disabled) {
      return null;
    }

    return (
      <div
        className={className}
        ref={this.setCalendarRootRef}
        onBlur={this.onBlur}
        tabIndex="0" // eslint-disable-line jsx-a11y/no-noninteractive-tabindex
        onKeyDown={this.onKeyDown}
        role="link"
      >
        <DayPicker
          {...this.getDayPickerLocalization()}
          className={dayPickerClassName}
          numberOfMonths={2}
          selectedDays={[{ from: startDate, to: endDate }]}
          onDayClick={this.onDayClick}
          onKeyDown={this.onKeyDown}
          disabledDays={disabledDays}
          initialMonth={endDate || moment().toDate()}
        />
      </div>
    );
  }
}

PeriodCalendarOverlay.propTypes = {
  intl: intlShape.isRequired,
  onDayChange: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  dayPickerClassName: PropTypes.string.isRequired,
  elementIsCalendarButton: PropTypes.func.isRequired,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  disabled: PropTypes.bool,
  onClose: PropTypes.func,
  disabledDays: PropTypes.shape().isRequired,
};

PeriodCalendarOverlay.defaultProps = {
  startDate: null,
  endDate: null,
  disabled: false,
  onClose: () => undefined,
};

export default injectIntl(PeriodCalendarOverlay);
