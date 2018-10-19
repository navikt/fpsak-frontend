import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import uttakPeriodeType from 'kodeverk/uttakPeriodeType';
import kodeverkPropType from 'kodeverk/kodeverkPropType';
import TableColumn from 'sharedComponents/TableColumn';
import TableRow from 'sharedComponents/TableRow';
import Table from 'sharedComponents/Table';
import { SelectField, InputField, DecimalField } from 'form/Fields';
import uttakArbeidTypeKodeverk from 'kodeverk/uttakArbeidType';
import uttakArbeidTypeTekstCodes from 'kodeverk/uttakArbeidTypeCodes';
import {
  minValue, maxValue, hasValidInteger, maxLength, required, hasValidDecimal, notDash,
} from 'utils/validation/validators';
import styles from './renderUttakTable.less';

/**
 *  RenderUttakTable
 *
 * Presentasjonskomponent: Viser felter for arbeidsforhold, stønadskonto, samtidig uttak, trakk uker og dager, andel i arbeid, utbetalingsgrad.
 * Komponenten må rendres som komponenten til et FieldArray.
 */
const headerTextCodes = [
  'RenderUttakTable.PeriodeData.Aktivitet',
  'RenderUttakTable.PeriodeData.Stonadskonto',
  'RenderUttakTable.PeriodeData.Trekk',
  'RenderUttakTable.PeriodeData.Andel',
  'RenderUttakTable.PeriodeData.Utbetalingsgrad',
];

const maxLength3 = maxLength(3);
const minValue0 = minValue(0);
const maxProsentValue100 = maxValue(100);


const gyldigeUttakperioder = [
  uttakPeriodeType.FELLESPERIODE,
  uttakPeriodeType.FEDREKVOTE,
  uttakPeriodeType.FORELDREPENGER_FOR_FODSEL,
  uttakPeriodeType.FORELDREPENGER,
  uttakPeriodeType.MODREKVOTE];

const mapPeriodeTyper = typer => typer
  .filter(({ kode }) => gyldigeUttakperioder.includes(kode))
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);


const createTextStrings = (fields) => {
  const {
    prosentArbeid, stillingsprosent, arbeidsforholdNavn, arbeidsforholdOrgnr, arbeidsforholdId, uttakArbeidType,
  } = fields;

  const prosentArbeidText = (typeof prosentArbeid !== 'undefined') ? `${prosentArbeid}%` : '';
  const stillingsProsentText = (typeof stillingsprosent !== 'undefined') ? `${stillingsprosent}%` : '';
  let arbeidsforhold = '';
  if (uttakArbeidType && uttakArbeidType.kode !== uttakArbeidTypeKodeverk.ORDINÆRT_ARBEID) {
    arbeidsforhold = <FormattedMessage id={uttakArbeidTypeTekstCodes[uttakArbeidType.kode]} />;
  } else {
    arbeidsforhold = arbeidsforholdNavn ? `${arbeidsforholdNavn}` : arbeidsforhold;
    arbeidsforhold = arbeidsforholdOrgnr ? `${arbeidsforhold} (${arbeidsforholdOrgnr})` : arbeidsforhold;
    arbeidsforhold = arbeidsforholdId ? `${arbeidsforhold}...${arbeidsforholdId.substr(-4)}` : arbeidsforhold;
  }
  return {
    prosentArbeidText,
    stillingsProsentText,
    arbeidsforhold,
  };
};

export const RenderUttakTableImpl = ({
  fields,
  periodeTyper,
  readOnly,
}) => (
  <div className={styles.tableOverflow}>
    {fields.length > 0
    && (
    <Table headerTextCodes={headerTextCodes}>
      {fields.map((uttakElementFieldId, index) => {
        const textStrings = createTextStrings(fields.get(index));
        return (
          <TableRow key={uttakElementFieldId}>
            <TableColumn><Normaltekst className={styles.forsteKolWidth}>{textStrings.arbeidsforhold}</Normaltekst></TableColumn>
            <TableColumn>
              <div className={styles.selectStonad}>
                <SelectField
                  name={`${uttakElementFieldId}.stønadskontoType.kode`}
                  selectValues={mapPeriodeTyper(periodeTyper)}
                  label=""
                  readOnly={readOnly}
                  validate={[required, notDash]}
                />
              </div>
            </TableColumn>
            <TableColumn>
              <Row>
                <div className={styles.align}>
                  <Column xs="6">
                    <span className={styles.weekPosition}>
                      <InputField
                        name={`${uttakElementFieldId}.weeks`}
                        readOnly={readOnly}
                        bredde="XS"
                        validate={[required, hasValidInteger, maxLength3]}
                        parse={(value) => {
                          const parsedValue = parseInt(value, 10);
                          return Number.isNaN(parsedValue) ? value : parsedValue;
                        }}
                      />
                    </span>
                  </Column>
                  <Column xs="1">
                    {readOnly ? <span>/</span> : <span className={styles.verticalCharPlacementInTable}>/</span>}
                  </Column>
                  <Column xs="3">
                    <InputField
                      name={`${uttakElementFieldId}.days`}
                      readOnly={readOnly}
                      bredde="XXS"
                      validate={[required, hasValidInteger, maxLength3]}
                      parse={(value) => {
                        const parsedValue = parseInt(value, 10);
                        return Number.isNaN(parsedValue) ? value : parsedValue;
                      }}
                    />
                  </Column>
                </div>
              </Row>
            </TableColumn>
            <TableColumn><Normaltekst>{textStrings.prosentArbeidText}</Normaltekst></TableColumn>
            <TableColumn>
              <Row>
                <Column xs="7">
                  <DecimalField
                    name={`${uttakElementFieldId}.utbetalingsgrad`}
                    validate={[required, minValue0, maxProsentValue100, hasValidDecimal]}
                    readOnly={readOnly}
                    bredde="XS"
                    format={(value) => {
                      if (value || value === 0) {
                        return readOnly ? `${value} %` : value;
                      }
                      return '';
                    }}
                    normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
                  />
                </Column>
                <Column xs="3">
                  {!readOnly
                    && (
                    <span className={styles.verticalCharPlacementInTable}>
                      %
                    </span>
                    )
                  }
                </Column>
              </Row>
            </TableColumn>
          </TableRow>
        );
      })}
    </Table>
    )
    }
  </div>
);

RenderUttakTableImpl.propTypes = {
  fields: PropTypes.shape().isRequired,
  periodeTyper: kodeverkPropType.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

const RenderUttakTable = injectIntl(RenderUttakTableImpl);

export default connect()(RenderUttakTable);
