import React from 'react';
import PropTypes from 'prop-types';
import { Fields } from 'redux-form';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import { haystack } from 'utils/arrayUtils';
import { ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT, ACCEPTED_DATE_INPUT_FORMATS } from 'utils/formats';
import Periodpicker from 'sharedComponents/periodpicker/Periodpicker';
import ReadOnlyField from './ReadOnlyField';
import Label, { labelPropType } from './Label';

const formatError = (intl, otherProps, names) => {
  const getField1 = haystack(otherProps, names[0]);
  const meta1 = getField1.meta;

  if (meta1.submitFailed && meta1.error) {
    return { feilmelding: intl.formatMessage(...meta1.error) };
  }
  const getField2 = haystack(otherProps, names[1]);
  const meta2 = getField2.meta;
  if (meta2.submitFailed && meta2.error) {
    return { feilmelding: intl.formatMessage(...meta2.error) };
  }
  return undefined;
};

const hasValue = value => value !== undefined && value !== null && value !== '';

// eslint-disable-next-line react/prop-types
const renderReadOnly = () => ({ names, renderIfMissingDateOnReadOnly, ...otherProps }) => {
  const getFomDate = haystack(otherProps, names[0]);
  const getTomDate = haystack(otherProps, names[1]);
  const fomDate = getFomDate.input.value;
  const tomDate = getTomDate.input.value;
  if (hasValue(fomDate) && hasValue(tomDate)) {
    return <ReadOnlyField input={{ value: `${fomDate} - ${tomDate}` }} {...otherProps} />;
  }
  if (renderIfMissingDateOnReadOnly) {
    if (hasValue(fomDate) && !hasValue(tomDate)) {
      return <ReadOnlyField input={{ value: `${fomDate} - ` }} {...otherProps} />;
    }
    if (!hasValue(fomDate) && hasValue(tomDate)) {
      return <ReadOnlyField input={{ value: ` - ${tomDate}` }} {...otherProps} />;
    }
  }
  return null;
};

const renderPeriodpicker = () => injectIntl(({
  intl, label, isEdited, names, ...otherProps
}) => {
  const fieldProps = {
    id: `${names[0]}-${names[1]}`,
    feil: formatError(intl, otherProps, names),
    label: <Label input={label} readOnly={false} />,
    names,
  };
  return <Periodpicker {...fieldProps} {...otherProps} />;
});

const PeriodpickerWrapped = renderPeriodpicker();
const ReadOnlyFieldWrapped = renderReadOnly();

const isoToDdMmYyyy = (string) => {
  const parsedDate = moment(string, ISO_DATE_FORMAT, true);
  return parsedDate.isValid() ? parsedDate.format(DDMMYYYY_DATE_FORMAT) : string;
};

const acceptedFormatToIso = (value, name, names) => {
  const dates = value.split('-').map(date => date.trim());
  const date = dates[names.indexOf(name)];

  const validDate = ACCEPTED_DATE_INPUT_FORMATS
    .map(format => moment(date, format, true))
    .find(parsedDate => parsedDate.isValid());

  return validDate ? validDate.format(ISO_DATE_FORMAT) : date;
};

const formatValue = format => value => isoToDdMmYyyy(format(value));
const parseValue = (parse, names) => (value, name) => parse(acceptedFormatToIso(value, name, names));

const PeriodpickerField = ({
  names, label, readOnly, format, parse, isEdited, ...otherProps
}) => (
  <Fields
    names={names}
    component={readOnly ? ReadOnlyFieldWrapped : PeriodpickerWrapped}
    label={label}
    {...otherProps}
    format={formatValue(format)}
    parse={parseValue(parse, names)}
    readOnly={readOnly}
    isEdited={isEdited}
  />
);

PeriodpickerField.propTypes = {
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: labelPropType,
  readOnly: PropTypes.bool,
  format: PropTypes.func,
  parse: PropTypes.func,
  isEdited: PropTypes.bool,
  renderIfMissingDateOnReadOnly: PropTypes.bool,
};

PeriodpickerField.defaultProps = {
  label: '',
  readOnly: false,
  isEdited: false,
  renderIfMissingDateOnReadOnly: false,
  format: value => value,
  parse: value => value,
};

export default PeriodpickerField;
