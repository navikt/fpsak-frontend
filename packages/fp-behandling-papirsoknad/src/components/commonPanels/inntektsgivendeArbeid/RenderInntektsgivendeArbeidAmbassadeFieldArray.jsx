import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';

import {
  dateAfterOrEqual, hasValidDate, isArrayEmpty, ISO_DATE_FORMAT, maxLength, required,
} from '@fpsak-frontend/utils';
import {
  FlexColumn, FlexContainer, FlexRow, PeriodFieldArray,
} from '@fpsak-frontend/shared-components';
import { DatepickerField, InputField } from '@fpsak-frontend/form';

import styles from './renderInntektsgivendeArbeidFieldArray.less';

const maxLength50 = maxLength(50);

const defaultInntektsgivendeArbeidAmbassade = {
  arbeidsgiver: '',
  periodeFom: '',
  periodeTom: '',
};

/**
 *  RenderInntektsgivendeArbeidAmbassadFieldArray
 *
 * Presentasjonskomponent: Viser inputfelter for arbeidsgiver og organisasjonsnummer for registrering av arbeidsforhold som ambassadpersonell.
 * Komponenten må rendres som komponenten til et FieldArray.
 */
export const RenderInntektsgivendeArbeidAmbassadeFieldArray = ({
  fields,
  meta,
  readOnly,
}) => (
  <PeriodFieldArray
    fields={fields}
    meta={meta}
    emptyPeriodTemplate={defaultInntektsgivendeArbeidAmbassade}
    textCode="Registrering.InntektsgivendeArbeid.LeggTilArbeidAmbassade"
    readOnly={readOnly}
  >
    {(ambassadeElementFieldId, index, getRemoveButton) => (
      <Row key={ambassadeElementFieldId} className={index !== (fields.length - 1) ? styles.notLastRow : ''}>
        <Column xs="12">
          <FlexContainer>
            <FlexRow>
              <FlexColumn>
                <InputField
                  readOnly={readOnly}
                  name={`${ambassadeElementFieldId}.arbeidsgiver`}
                  label={index === 0 ? { id: 'Registrering.InntektsgivendeArbeid.Arbeidsgiver' } : ''}
                  bredde="XXL"
                  validate={[maxLength50]}
                  maxLength={99}
                />
              </FlexColumn>
              <FlexColumn>
                <DatepickerField
                  readOnly={readOnly}
                  name={`${ambassadeElementFieldId}.periodeFom`}
                  defaultValue={null}
                  label={index === 0 ? { id: 'Registrering.InntektsgivendeArbeid.periodeFom' } : ''}
                />
              </FlexColumn>
              <FlexColumn>
                <DatepickerField
                  readOnly={readOnly}
                  name={`${ambassadeElementFieldId}.periodeTom`}
                  defaultValue={null}
                  label={index === 0 ? { id: 'Registrering.InntektsgivendeArbeid.periodeTom' } : ''}
                />
              </FlexColumn>
              <FlexColumn>
                {getRemoveButton()}
              </FlexColumn>
            </FlexRow>
          </FlexContainer>
        </Column>
      </Row>
    )}
  </PeriodFieldArray>
);


RenderInntektsgivendeArbeidAmbassadeFieldArray.validate = (values) => {
  if (!values) {
    return null;
  }
  const arrayErrors = values.map(({ arbeidsgiver, periodeFom, periodeTom }) => {
    const periodeFomDate = moment(periodeFom, ISO_DATE_FORMAT);
    const periodeTomDate = moment(periodeTom, ISO_DATE_FORMAT);
    const periodeFomError = arbeidsgiver ? (required(periodeFom) || hasValidDate(periodeFom)) : hasValidDate(periodeFom);
    let periodeTomError = hasValidDate(periodeTom);

    if (!periodeFomError) {
      periodeTomError = periodeTom ? (periodeTomError || dateAfterOrEqual(periodeFomDate)(periodeTomDate)) : periodeTomError;
    }
    if ((periodeFomError || periodeTomError)) {
      return {
        periodeFom: periodeFomError,
        periodeTom: periodeTomError,
      };
    }
    return null;
  });

  if (arrayErrors.some((errors) => errors !== null)) {
    return arrayErrors;
  }

  if (isArrayEmpty(values)) {
    return null;
  }

  return null;
};

RenderInntektsgivendeArbeidAmbassadeFieldArray.propTypes = {
  fields: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  meta: PropTypes.shape().isRequired,
};

export default RenderInntektsgivendeArbeidAmbassadeFieldArray;
