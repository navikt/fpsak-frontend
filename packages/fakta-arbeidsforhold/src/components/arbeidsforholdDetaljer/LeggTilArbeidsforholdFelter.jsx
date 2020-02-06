import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  DDMMYYYY_DATE_FORMAT, hasValidDate, hasValidInteger, maxValue, minValue, required,
} from '@fpsak-frontend/utils';
import { DatepickerField, InputField } from '@fpsak-frontend/form';
import { FlexContainer, FlexRow, FlexColumn } from '@fpsak-frontend/shared-components';

import BehandlingFormFieldCleaner from '../../util/BehandlingFormFieldCleaner';

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
  behandlingId,
  behandlingVersjon,
}) => (
  <BehandlingFormFieldCleaner
    formName={formName}
    fieldNames={['arbeidsgiverNavn', 'startdato', 'sluttdato', 'stillingsprosent']}
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
  >
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
      </FlexRow>
    </FlexContainer>
  </BehandlingFormFieldCleaner>
);

LeggTilArbeidsforholdFelter.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
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
