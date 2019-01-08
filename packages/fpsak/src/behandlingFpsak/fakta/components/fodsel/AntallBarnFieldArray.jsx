

import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Row, Column } from 'nav-frontend-grid';

import { DatepickerField, InputField } from '@fpsak-frontend/form';
import {
  required, hasValidDate, dateBeforeOrEqualToToday,
} from '@fpsak-frontend/utils';

import styles from './SjekkFodselDokForm.less';

const AvklartBarnFieldArray = ({
  fields,
  meta,
  readOnly,
}) => (
  <div>
    {fields.map((AvklartBarnFieldArrayId, index) => (
      <div className={styles.fodselRow}>
        <Row>
          <Column xs="6" className={styles.datePickerField}>
            {fields[index].fodselsdato}
          </Column>
          <Column xs="1" />
          <Column xs="2">
            <button type="button" onClick={() => fields.push({})} title="add" />
          </Column>
        </Row>
      </div>
    ))}
  </div>
);


AvklartBarnFieldArray.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  meta: PropTypes.shape(),
  fields: PropTypes.shape(),
};

AvklartBarnFieldArray.defaultProps = {
  readOnly: true,
  meta: undefined,
};


export default AvklartBarnFieldArray;
