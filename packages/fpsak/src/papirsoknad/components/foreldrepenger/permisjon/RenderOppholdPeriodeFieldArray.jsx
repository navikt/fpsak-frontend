import React from 'react';
import PropTypes from 'prop-types';
import { Row, Column } from 'nav-frontend-grid';

import { FlexContainer, FlexColumn, FlexRow } from 'sharedComponents/flexGrid';
import PeriodFieldArray from 'sharedComponents/PeriodFieldArray';
import {
  DatepickerField, SelectField,
} from 'form/Fields';
import kodeverkPropType from 'kodeverk/kodeverkPropType';

import styles from './renderOppholdPeriodeFieldArray.less';

const defaultOppholdPeriode = {
  periodeFom: '',
  periodeTom: '',
  årsak: '',
};

const mapTyper = typer => typer
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

/**
 *  RenderOppholdPeriodeFieldArray
 *
 * Presentasjonskomponent: Viser inputfelter for dato for bestemmelse av oppholdsperiode.
 * Komponenten må rendres som komponenten til et FieldArray.
 */
export const RenderOppholdPeriodeFieldArray = ({
  fields,
  oppholdsReasons,
  meta,
  readOnly,
}) => (
  <PeriodFieldArray
    fields={fields}
    meta={meta}
    emptyPeriodTemplate={defaultOppholdPeriode}
    textCode="Registrering.Permisjon.Opphold.LeggTilPeriode"
    readOnly={readOnly}
  >
    {(periodeElementFieldId, index, getRemoveButton) => (
      <Row key={periodeElementFieldId}>
        <Column xs="12" className={index !== (fields.length - 1) ? styles.notLastRow : ''}>
          <FlexContainer wrap>
            <FlexRow>
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
                  name={`${periodeElementFieldId}.årsak`}
                  bredde="xl"
                  label={index === 0 ? { id: 'Registrering.Permisjon.Opphold.Arsak' } : ''}
                  selectValues={mapTyper(oppholdsReasons)}
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

RenderOppholdPeriodeFieldArray.propTypes = {
  fields: PropTypes.shape().isRequired,
  oppholdsReasons: kodeverkPropType.isRequired,
  meta: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default RenderOppholdPeriodeFieldArray;
