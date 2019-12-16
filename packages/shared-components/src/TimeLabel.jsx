import React from 'react';
import PropTypes from 'prop-types';
import { FormattedTime } from 'react-intl';

/**
 * TimeLabel
 *
 * Presentasjonskomponent. Formaterer tidspunkt til formatet hh:mm:ss.
 *
 * Eksempel:
 * ```html
 * <DateTimeLabel dateTimeString="2017-08-02T00:54:25.455" />
 * ```
 */
const TimeLabel = ({
  dateTimeString,
}) => (
  <FormattedTime value={new Date(dateTimeString)} hour="numeric" minute="numeric" second="numeric" />
);

TimeLabel.propTypes = {
  dateTimeString: PropTypes.string.isRequired,
};

export default TimeLabel;
