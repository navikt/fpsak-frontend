import React from 'react';
import PropTypes from 'prop-types';
import { Row, Column } from 'nav-frontend-grid';

import {
  hasValidDate, required,
} from '@fpsak-frontend/utils';
import {
  PeriodFieldArray, FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';
import { DatepickerField, CheckboxField } from '@fpsak-frontend/form';

export const defaultAntallBarn = {
  fodselsdato: '',
  barnDod: false,
  dodsDato: '',
};

export const AvklartBarnFieldArray = ({
  fields,
  meta,
  readOnly,
  avklartBarn,
}) => (
  <PeriodFieldArray fields={fields} meta={meta} emptyPeriodTemplate={defaultAntallBarn} readOnly={readOnly}>
    {(periodeElementFieldId, index, getRemoveButton) => (
      <Row key={periodeElementFieldId}>
        <Column xs="12">
          <FlexContainer>
            <FlexRow>
              <FlexColumn>
                <DatepickerField
                  name={`${periodeElementFieldId}.fodselsdato`}
                  defaultValue={null}
                  label={{ id: 'Registrering.FrilansOppdrag.FieldArray.periodeFom' }}
                  validate={[hasValidDate, required]}
                />
              </FlexColumn>
              <FlexColumn>
                <CheckboxField
                  name={`${periodeElementFieldId}.barnDod`}
                  label="dod"
                />
              </FlexColumn>
              {avklartBarn[index].barnDod
              && (
              <FlexColumn>
                <span>{periodeElementFieldId.dod}</span>
                <DatepickerField
                  name={`${periodeElementFieldId}.dodsdato`}
                  defaultValue={null}
                  label={{ id: 'Registrering.FrilansOppdrag.FieldArray.periodeTom' }}
                  validate={[hasValidDate]}
                />
              </FlexColumn>
              )
              }
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

AvklartBarnFieldArray.propTypes = {
  fields: PropTypes.shape().isRequired,
  meta: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default AvklartBarnFieldArray;
