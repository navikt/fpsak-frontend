import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import BehandlingFormFieldCleaner from 'behandlingForstegangOgRevurdering/src/components/BehandlingFormFieldCleaner';
import {
  DDMMYYYY_DATE_FORMAT, hasValidDate, hasValidInteger, maxValue, minValue, required,
} from '@fpsak-frontend/utils';
import DatepickerField from '@fpsak-frontend/form/src/DatepickerField';
import InputField from '@fpsak-frontend/form/src/InputField';
import FlexContainer from '@fpsak-frontend/shared-components/src/flexGrid/FlexContainer';
import FlexRow from '@fpsak-frontend/shared-components/src/flexGrid/FlexRow';
import FlexColumn from '@fpsak-frontend/shared-components/src/flexGrid/FlexColumn';
import styles from './leggTilArbeidsforholdFelter.less';

// ----------------------------------------------------------------------------------
// Methods
// ----------------------------------------------------------------------------------
const sluttdatoErrorMsg = (dato) => ([{ id: 'PersonArbeidsforholdDetailForm.DateNotAfterOrEqual' }, { dato }]);
const startdatoErrorMsg = (dato) => ([{ id: 'PersonArbeidsforholdDetailForm.DateNotBeforeOrEqual' }, { dato }]);
const formatDate = (dato) => moment(dato).format(DDMMYYYY_DATE_FORMAT);

// ----------------------------------------------------------------------------------
// Component : LeggTilArbeidsforholdFelter
// ----------------------------------------------------------------------------------

/**
 * Component: LeggTilArbeidsforholdFelter
 */
const LeggTilArbeidsforholdFelter = ({
  readOnly,
  formName,
}) => (
  <BehandlingFormFieldCleaner formName={formName} fieldNames={['arbeidsgiverNavn', 'startdato', 'sluttdato', 'stillingsprosent']}>
    <FlexContainer>
      <FlexRow wrap>
        <FlexColumn className={styles.navnColumn}>
          <InputField
            name="navn"
            label={{ id: 'PersonArbeidsforholdDetailForm.ArbeidsgiverNavn' }}
            validate={[required]}
            bredde="XXL"
            readOnly={readOnly}
          />
        </FlexColumn>
        <FlexColumn className={styles.columnItem}>
          <DatepickerField
            name="fomDato"
            label={{ id: 'PersonArbeidsforholdDetailForm.ArbeidsforholdStartdato' }}
            validate={[required, hasValidDate]}
            readOnly={readOnly}
          />
        </FlexColumn>
        <FlexColumn className={styles.columnItem}>
          <DatepickerField
            name="tomDato"
            label={{ id: 'PersonArbeidsforholdDetailForm.ArbeidsforholdSluttdato' }}
            validate={[hasValidDate]}
            readOnly={readOnly}
          />
        </FlexColumn>
        <FlexColumn className={styles.columnItem}>
          <InputField
            name="stillingsprosent"
            label={{ id: 'PersonArbeidsforholdDetailForm.Stillingsprosent' }}
            validate={[required, minValue(0), maxValue(100), hasValidInteger]}
            readOnly={readOnly}
            bredde="S"
            parse={(value) => {
              const parsedValue = parseInt(value, 10);
              return Number.isNaN(parsedValue) ? value : parsedValue;
            }}
          />
        </FlexColumn>
        <FlexColumn className={styles.suffix}>
          %
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  </BehandlingFormFieldCleaner>
);

LeggTilArbeidsforholdFelter.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
};

LeggTilArbeidsforholdFelter.validate = (values) => {
  if (values === undefined || values === null) {
    return null;
  }
  if (values.fomDato && values.tomDato && moment(values.fomDato).isAfter(moment(values.tomDato))) {
    return ({
      tomDato: sluttdatoErrorMsg(formatDate(values.fomDato)),
      fomDato: startdatoErrorMsg(formatDate(values.tomDato)),
    });
  }
  return null;
};

export default LeggTilArbeidsforholdFelter;
