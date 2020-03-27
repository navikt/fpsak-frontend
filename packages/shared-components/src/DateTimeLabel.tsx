import React, { FunctionComponent } from 'react';
import { FormattedMessage, FormattedDate, FormattedTime } from 'react-intl';

interface OwnProps {
  dateTimeString: string;
  useNewFormat?: boolean;
}

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
const DateTimeLabel: FunctionComponent<OwnProps> = ({
  dateTimeString,
  useNewFormat = false,
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

export default DateTimeLabel;
