import React from 'react';
import PropTypes from 'prop-types';

import FlexColumn from 'sharedComponents/flexGrid/FlexColumn';
import FlexRow from 'sharedComponents/flexGrid/FlexRow';
import { DecimalField, SelectField, PeriodpickerField } from 'form/Fields';
import {
  required,
  hasValidDecimal,
  maxValue,
  minValue,
} from 'utils/validation/validators';
import { uttakPeriodeNavn, stonadskontoType } from 'kodeverk/uttakPeriodeType';

import styles from '../perioder/periodeTyper.less';

const maxValue100 = maxValue(100);
const minValue1 = minValue(1);

const selectValues = () => Object.keys(stonadskontoType)
  .map(key => (<option key={key} value={key}>{uttakPeriodeNavn[key]}</option>));

const ElementWrapper = ({ children }) => children;

export const EndreSoknadsperiode = ({ withGradering }) => (
  <div className={styles.arrowBox}>
    <FlexRow>
      <FlexColumn>
        <PeriodpickerField
          names={['nyFom', 'nyTom']}
          label={{ id: 'UttakInfoPanel.Periode' }}
        />
      </FlexColumn>
    </FlexRow>
    <FlexRow>
      <FlexColumn>
        <SelectField
          name="kontoType"
          selectValues={selectValues()}
          label={{ id: 'UttakInfoPanel.StonadsKonto' }}
          validate={[required]}
        />
      </FlexColumn>
      {withGradering
        && (
        <ElementWrapper>
          <FlexColumn>
            <DecimalField
              name="nyArbeidstidsprosent"
              label={{ id: 'UttakInfoPanel.AndelIArbeid' }}
              bredde="XS"
              validate={[required, maxValue100, minValue1, hasValidDecimal]}
              normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
            />
          </FlexColumn>
          <div className={styles.suffix}>%</div>
        </ElementWrapper>
        )
      }
    </FlexRow>
  </div>
);

EndreSoknadsperiode.propTypes = {
  withGradering: PropTypes.bool,
};

EndreSoknadsperiode.defaultProps = {
  withGradering: false,
};

export default EndreSoknadsperiode;
