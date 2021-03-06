import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';

import { hasValidDate, required, dateBeforeOrEqualToToday } from '@fpsak-frontend/utils';
import {
  FlexColumn, FlexContainer, FlexRow, PeriodFieldArray,
} from '@fpsak-frontend/shared-components';
import { CheckboxField, DatepickerField } from '@fpsak-frontend/form';

import styles from './avklartBarnFieldArray.less';

export const defaultAntallBarn = {
  fodselsdato: '',
  isBarnDodt: false,
  dodsDato: '',
};

export const AvklartBarnFieldArray = ({
  fields,
  meta,
  readOnly,
  avklartBarn,
}) => (
  <PeriodFieldArray
    fields={fields}
    meta={meta}
    emptyPeriodTemplate={defaultAntallBarn}
    readOnly={readOnly}
    textCode="AvklartBarnFieldArray.LeggTilBarn"
    shouldShowAddButton={avklartBarn.length < 9}
  >
    {(periodeElementFieldId, index, getRemoveButton) => (
      <Row key={periodeElementFieldId}>
        <Column xs="12">
          <FlexContainer>
            <FlexRow>
              <FlexColumn>
                <DatepickerField
                  name={`${periodeElementFieldId}.fodselsdato`}
                  defaultValue={null}
                  label={{ id: 'AvklartBarnFieldArray.Title' }}
                  validate={[hasValidDate, required, dateBeforeOrEqualToToday]}
                  readOnly={readOnly}
                />
              </FlexColumn>
              <FlexColumn>
                <CheckboxField
                  className={styles.registerBarnCheckbox}
                  name={`${periodeElementFieldId}.isBarnDodt`}
                  label={{ id: 'AvklartBarnFieldArray.ErBarnetDott' }}
                  disabled={readOnly}
                />
              </FlexColumn>
              {avklartBarn[index].isBarnDodt
              && (
              <FlexColumn>
                <span>{periodeElementFieldId.dod}</span>
                <DatepickerField
                  name={`${periodeElementFieldId}.dodsdato`}
                  defaultValue={null}
                  label={{ id: 'AvklartBarnFieldArray.Dodsdato' }}
                  validate={[hasValidDate, dateBeforeOrEqualToToday]}
                  readOnly={readOnly}
                />
              </FlexColumn>
              )}
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
  avklartBarn: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default AvklartBarnFieldArray;
