import React from 'react';
import PropTypes from 'prop-types';
import { Row, Column } from 'nav-frontend-grid';

import {
  PeriodFieldArray, FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';
import {
  DatepickerField, SelectField,
} from '@fpsak-frontend/form';
<<<<<<< HEAD
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
=======
import kodeverkPropType from '@fpsak-frontend/kodeverk/src/kodeverkPropType';
import arbeidskategori from '@fpsak-frontend/kodeverk/src/arbeidskategori';
>>>>>>> PFP-4354 Lager samme for utsettelse
import { gyldigeUttakperioder } from './RenderPermisjonPeriodeFieldArray';

import styles from './renderUtsettelsePeriodeFieldArray.less';

const defaultUtsettelsePeriode = {
  periodeFom: '',
  periodeTom: '',
  arsakForUtsettelse: '',
};

export const gyldigArbeidskategori = [
  arbeidskategori.ARBEIDSTAKER,
  arbeidskategori.SELVSTENDIG_NAERINGSDRIVENDE,
  arbeidskategori.FRILANSER,
];

const mapTyper = typer => typer
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

const mapKvoter = typer => typer
  .filter(({ kode }) => gyldigeUttakperioder.includes(kode))
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

const mapArbeidskategori = typer => typer
  .filter(({ kode }) => gyldigArbeidskategori.includes(kode))
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
  arbeidskategoriTyper,
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
                  selectValues={mapArbeidskategori(arbeidskategoriTyper)}
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
  arbeidskategoriTyper: kodeverkPropType.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default RenderUtsettelsePeriodeFieldArray;
