import React from 'react';
import PropTypes from 'prop-types';

import FlexColumn from 'sharedComponents/flexGrid/FlexColumn';
import FlexRow from 'sharedComponents/flexGrid/FlexRow';
import { DecimalField, SelectField, PeriodpickerField } from 'form/Fields';
import oppholdArsakType, { oppholdArsakKontoNavn } from 'kodeverk/oppholdArsakType';
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

const gyldigeÅrsaker = [
  oppholdArsakType.UTTAK_MØDREKVOTE_ANNEN_FORELDER,
  oppholdArsakType.UTTAK_FEDREKVOTE_ANNEN_FORELDER,
  oppholdArsakType.UTTAK_FELLESP_ANNEN_FORELDER,
  oppholdArsakType.UTTAK_FORELDREPENGER_ANNEN_FORELDER];

const mapPeriodeTyper = () => Object.keys(oppholdArsakType)
  .filter(key => gyldigeÅrsaker.includes(key))
  .map(key => (<option key={key} value={key}>{oppholdArsakKontoNavn[key]}</option>));

const ElementWrapper = ({ children }) => children;

export const EndreSoknadsperiode = ({ withGradering, oppholdArsak }) => (
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
        {(!oppholdArsak || oppholdArsak.kode === oppholdArsakType.UDEFINERT)
        && (
        <SelectField
          name="kontoType"
          selectValues={selectValues()}
          label={{ id: 'UttakInfoPanel.StonadsKonto' }}
        />
        )
        }
        {oppholdArsak && oppholdArsak.kode !== oppholdArsakType.UDEFINERT
        && (
        <SelectField
          name="oppholdArsak"
          selectValues={mapPeriodeTyper()}
          label={{ id: 'UttakInfoPanel.StonadsKonto' }}
          validate={[required]}
        />
        )
        }
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
  oppholdArsak: PropTypes.shape(),
};

EndreSoknadsperiode.defaultProps = {
  withGradering: false,
  oppholdArsak: undefined,
};

export default EndreSoknadsperiode;
