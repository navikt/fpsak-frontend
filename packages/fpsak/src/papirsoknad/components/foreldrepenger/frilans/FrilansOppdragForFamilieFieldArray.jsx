import React from 'react';
import PropTypes from 'prop-types';
import { Row, Column } from 'nav-frontend-grid';
import moment from 'moment';

import PeriodFieldArray from 'sharedComponents/PeriodFieldArray';
import { hasValidDate, dateAfterOrEqual, maxLength } from 'utils/validation/validators';
import { ISO_DATE_FORMAT } from 'utils/formats';
import { FlexContainer, FlexColumn, FlexRow } from 'sharedComponents/flexGrid';
import { DatepickerField, InputField } from 'form/Fields';

import styles from './frilansOppdragForFamilieFieldArray.less';

export const defaultFrilansPeriode = {
  fomDato: '',
  tomDato: '',
};

const maxLength50 = maxLength(50);

/**
 *  FrilansOppdragForFamilieFieldArray
 *
 * Presentasjonskomponent: Viser inputfelter for fra og til dato for frilansperioder
 * Komponenten må rendres som komponenten til et FieldArray.
 */
export const FrilansOppdragForFamilieFieldArray = ({
  fields,
  meta,
  readOnly,
}) => (
  <PeriodFieldArray fields={fields} meta={meta} emptyPeriodTemplate={defaultFrilansPeriode} readOnly={readOnly}>
    {(periodeElementFieldId, index, getRemoveButton) => (
      <Row key={periodeElementFieldId}>
        <Column xs="12" className={index !== (fields.length - 1) ? styles.notLastRow : ''}>
          <FlexContainer>
            <FlexRow>
              <FlexColumn>
                <DatepickerField
                  name={`${periodeElementFieldId}.fomDato`}
                  defaultValue={null}
                  label={{ id: 'Registrering.FrilansOppdrag.FieldArray.periodeFom' }}
                  validate={[hasValidDate]}
                />
              </FlexColumn>
              <FlexColumn>
                <DatepickerField
                  name={`${periodeElementFieldId}.tomDato`}
                  defaultValue={null}
                  label={{ id: 'Registrering.FrilansOppdrag.FieldArray.periodeTom' }}
                  validate={[hasValidDate]}
                />
              </FlexColumn>
              <FlexColumn>
                <InputField
                  name={`${periodeElementFieldId}.oppdragsgiver`}
                  bredde="S"
                  validate={[maxLength50]}
                  label={{ id: 'Registrering.FrilansOppdrag.FieldArray.Oppdragsgiver' }}
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

FrilansOppdragForFamilieFieldArray.propTypes = {
  fields: PropTypes.shape().isRequired,
  meta: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
};

FrilansOppdragForFamilieFieldArray.validate = (values) => {
  const { oppdragPerioder, perioder } = values;
  const sortedFomDates = perioder.map(p => p.periodeFom).filter(p => p && p !== '')
    .sort((periodeFom1, periodeFom2) => moment(periodeFom1, ISO_DATE_FORMAT).diff(moment(periodeFom2, ISO_DATE_FORMAT)));

  const arrayErrors = oppdragPerioder.map(({ fomDato, tomDato }) => {
    if (fomDato || tomDato) {
      const periodeFomDate = moment(fomDato, ISO_DATE_FORMAT);
      const periodeTomDate = moment(tomDato, ISO_DATE_FORMAT);
      const error = dateAfterOrEqual(periodeFomDate)(periodeTomDate);
      if (error) {
        return { tomDato: error };
      }

      if (sortedFomDates.length > 0) {
        const isBefore = moment(sortedFomDates[0]).isSameOrBefore(moment(periodeFomDate));
        if (!isBefore) {
          return { fomDato: [{ id: 'Registrering.FrilansOppdrag.FieldArray.BeforeFomValidation' }] };
        }
      }
    }


    return null;
  });

  if (arrayErrors.some(errors => errors !== null)) {
    return arrayErrors;
  }
  return null;
};


export default FrilansOppdragForFamilieFieldArray;
