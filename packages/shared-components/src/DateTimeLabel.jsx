import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedDate, FormattedTime } from 'react-intl';

/**
 * DateTimeLabel
 *
 * Presentasjonskomponent. Formaterer dato til formatet dd.mm.yyyy - hh:mm.
 *
 * Eksempel:
 * ```html
 * <DateTimeLabel dateTimeString="2017-08-02T00:54:25.455" />
 * ```
 */
const DateTimeLabel = ({
  dateTimeString,
  useNewFormat,
}) => (
  <>
    <FormattedDate day="2-digit" month="2-digit" year="numeric" value={new Date(dateTimeString)} />
    {!useNewFormat && (
      <>
        -
        <FormattedTime value={new Date(dateTimeString)} />
      </>
    )}
    {useNewFormat && (
      <>
        <FormattedMessage id="DateTimeLabel.Kl" />
        <FormattedTime value={new Date(dateTimeString)} hour="numeric" minute="numeric" second="numeric" />
      </>
    )}
  </>
);

DateTimeLabel.propTypes = {
  dateTimeString: PropTypes.string.isRequired,
  useNewFormat: PropTypes.bool,
};

DateTimeLabel.defaultProps = {
  useNewFormat: false,
};

export default DateTimeLabel;
