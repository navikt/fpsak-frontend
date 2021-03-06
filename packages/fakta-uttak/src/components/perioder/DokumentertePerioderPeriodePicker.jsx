import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';

import { PeriodpickerField } from '@fpsak-frontend/form';
import { FlexColumn, FlexRow, PeriodFieldArray } from '@fpsak-frontend/shared-components';
import {
  dateRangesNotOverlapping, hasValidDate, required,
} from '@fpsak-frontend/utils';

import styles from './dokumentertePerioderPeriodePicker.less';

const periode = {
  fom: '',
  tom: '',
};

class DokumentertePerioderPeriodePicker extends PureComponent {
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    const { fields, fraDato, tilDato } = this.props;
    if (fields.length === 0) {
      fields.push({ fom: fraDato, tom: tilDato });
    }
  }

  render() {
    const { fields, readOnly } = this.props;
    return (
      <PeriodFieldArray fields={fields} emptyPeriodTemplate={periode} shouldShowAddButton={!readOnly} readOnly={readOnly}>
        {(fieldId, index, getRemoveButton) => (
          <Row key={fieldId}>
            <Column xs="12" className={index !== (fields.length - 1) ? styles.notLastRow : ''}>
              <FlexColumn>
                <FlexRow>
                  <FlexColumn>
                    <PeriodpickerField
                      names={[`${fieldId}.fom`, `${fieldId}.tom`]}
                      label={index === 0 ? { id: 'UttakInfoPanel.AvklartPeriode' } : ''}
                      validate={[required, hasValidDate, dateRangesNotOverlapping]}
                      defaultValue={null}
                      readOnly={readOnly}
                    />
                  </FlexColumn>
                  <FlexColumn>
                    {getRemoveButton()}
                  </FlexColumn>
                </FlexRow>
              </FlexColumn>
            </Column>
          </Row>
        )}
      </PeriodFieldArray>
    );
  }
}

DokumentertePerioderPeriodePicker.propTypes = {
  fields: PropTypes.shape().isRequired,
  fraDato: PropTypes.string.isRequired,
  tilDato: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default DokumentertePerioderPeriodePicker;
