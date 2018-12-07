import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate } from 'react-intl';

/**
 * DateLabel
 *
 * Presentasjonskomponent. Formaterer dato på formatet dd.mm.yyyy.
 *
 * Eksempel:
 * ```html
 * <DateLabel dateString="2017-08-31" />
 * ```
 */
const DateLabel = ({
  dateString,
}) => (
  <FormattedDate day="2-digit" month="2-digit" year="numeric" value={new Date(dateString)} />
);

DateLabel.propTypes = {
  dateString: PropTypes.string.isRequired,
};

export default DateLabel;
