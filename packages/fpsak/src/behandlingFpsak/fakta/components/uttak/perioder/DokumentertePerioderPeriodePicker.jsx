import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Column } from 'nav-frontend-grid';

import PeriodFieldArray from 'sharedComponents/PeriodFieldArray';
import { PeriodpickerField } from 'form/Fields';
import { FlexColumn, FlexRow } from 'sharedComponents/flexGrid';
import {
  required, hasValidDate, dateRangesNotOverlapping, dateAfterOrEqual,
} from 'utils/validation/validators';

import styles from './dokumentertePerioderPeriodePicker.less';

const periode = {
  fom: '',
  tom: '',
};

class DokumentertePerioderPeriodePicker extends Component {
  componentWillMount() {
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
                      validate={[required, hasValidDate, dateRangesNotOverlapping, dateAfterOrEqual]}
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
