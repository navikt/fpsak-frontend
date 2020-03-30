import React, { FunctionComponent } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';

interface OwnProps {
  dateStringFom: string;
  dateStringTom?: string;
  showTodayString?: boolean;
}

/**
 * PeriodLabel
 *
 * Presentasjonskomponent. Formaterer til og fra dato til en periode på formatet dd.mm.yyyy - dd.mm.yyyy.
 *
 * Eksempel:
 * ```html
 * <PeriodLabel dateStringFom="2017-08-25" dateStringTom="2017-08-31" />
 * ```
 */
const PeriodLabel: FunctionComponent<OwnProps> = ({
  dateStringFom,
  dateStringTom,
  showTodayString = false,
}) => (
  <span>
    <FormattedDate day="2-digit" month="2-digit" year="numeric" value={new Date(dateStringFom)} />
    -
    {dateStringTom
      && <FormattedDate day="2-digit" month="2-digit" year="numeric" value={new Date(dateStringTom)} />}
    {showTodayString && !dateStringTom
      && (
      <span>
        <FormattedMessage id="PeriodLabel.DateToday" />
      </span>
      )}
  </span>
);

export default PeriodLabel;
