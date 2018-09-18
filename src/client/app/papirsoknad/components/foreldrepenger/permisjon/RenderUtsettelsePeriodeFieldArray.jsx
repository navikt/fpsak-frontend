import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';

import { FlexContainer, FlexColumn, FlexRow } from 'sharedComponents/flexGrid';
import PeriodFieldArray from 'sharedComponents/PeriodFieldArray';
import {
  DatepickerField, SelectField, InputField,
} from 'form/Fields';
import kodeverkPropType from 'kodeverk/kodeverkPropType';
import { gyldigeUttakperioder } from './RenderPermisjonPeriodeFieldArray';

import styles from './renderUtsettelsePeriodeFieldArray.less';

const defaultUtsettelsePeriode = {
  periodeFom: '',
  periodeTom: '',
  periodeForUtsettelse: '',
  arsakForUtsettelse: '',
};

const mapTyper = typer => typer
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

const mapKvoter = typer => typer
  .filter(({ kode }) => gyldigeUttakperioder.includes(kode))
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

/**
 *  RenderUtsettelsePeriodeFieldArray
 *
 * Presentasjonskomponent: Viser inputfelter for dato for bestemmelse av utsettelseperiode.
 * Komponenten må rendres som komponenten til et FieldArray.
 */
export const RenderUtsettelsePeriodeFieldArray = ({
  fields,
  utsettelseReasons,
  utsettelseKvoter,
  meta,
  intl,
  readOnly,
}) => (
  <PeriodFieldArray
    fields={fields}
    meta={meta}
    emptyPeriodTemplate={defaultUtsettelsePeriode}
    textCode="Registrering.Permisjon.Utsettelse.LeggTilPeriode"
    readOnly={readOnly}
  >
    {(periodeElementFieldId, index, getRemoveButton) => (
      <Row key={periodeElementFieldId}>
        <Column xs="12" className={index !== (fields.length - 1) ? styles.notLastRow : ''}>
          <FlexContainer wrap>
            <FlexRow>
              <FlexColumn>
                <SelectField
                  name={`${periodeElementFieldId}.periodeForUtsettelse`}
                  bredde="xl"
                  label={index === 0 ? { id: 'Registrering.Permisjon.Utsettelse.Periode' } : ''}
                  selectValues={mapKvoter(utsettelseKvoter)}
                />
              </FlexColumn>
              <FlexColumn>
                <DatepickerField
                  name={`${periodeElementFieldId}.periodeFom`}
                  defaultValue={null}
                  label={index === 0 ? { id: 'Registrering.Permisjon.periodeFom' } : ''}
                />
              </FlexColumn>
              <FlexColumn>
                <DatepickerField
                  name={`${periodeElementFieldId}.periodeTom`}
                  defaultValue={null}
                  label={index === 0 ? { id: 'Registrering.Permisjon.periodeTom' } : ''}
                />
              </FlexColumn>
              <FlexColumn>
                <SelectField
                  name={`${periodeElementFieldId}.arsakForUtsettelse`}
                  bredde="xl"
                  label={index === 0 ? { id: 'Registrering.Permisjon.Utsettelse.Arsak' } : ''}
                  selectValues={mapTyper(utsettelseReasons)}
                />
              </FlexColumn>
            </FlexRow>
            <FlexRow>
              <FlexColumn>
                <SelectField
                  label={index === 0 ? { id: 'Registrering.Permisjon.ErArbeidstakerLabel' } : ''}
                  name={`${periodeElementFieldId}.erArbeidstaker`}
                  bredde="xl"
                  selectValues={[
                    <option value="true" key="true">{intl.formatMessage({ id: 'Registrering.Permisjon.ErArbeidstaker' })}</option>,
                    <option value="false" key="false">{intl.formatMessage({ id: 'Registrering.Permisjon.ErIkkeArbeidstaker' })}</option>,
                  ]}
                />
              </FlexColumn>
              <FlexColumn>
                <InputField
                  label={index === 0 ? { id: 'Registrering.Permisjon.Orgnr' } : ''}
                  name={`${periodeElementFieldId}.orgNr`}
                  bredde="S"
                  parse={(value) => {
                    const parsedValue = parseInt(value, 10);
                    return Number.isNaN(parsedValue) ? value : parsedValue;
                  }}
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

RenderUtsettelsePeriodeFieldArray.propTypes = {
  fields: PropTypes.shape().isRequired,
  utsettelseReasons: kodeverkPropType.isRequired,
  utsettelseKvoter: kodeverkPropType.isRequired,
  meta: PropTypes.shape().isRequired,
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default injectIntl(RenderUtsettelsePeriodeFieldArray);
