import React, { FunctionComponent } from 'react';
import { FormattedDate } from 'react-intl';

interface OwnProps {
  dateString: string;
}

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
const DateLabel: FunctionComponent<OwnProps> = ({
  dateString,
}) => (
  <FormattedDate day="2-digit" month="2-digit" year="numeric" value={new Date(dateString)} />
);

export default DateLabel;
