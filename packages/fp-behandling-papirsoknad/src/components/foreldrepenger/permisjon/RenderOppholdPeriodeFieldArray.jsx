import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';

import {
  FlexColumn, FlexContainer, FlexRow, PeriodFieldArray,
} from '@fpsak-frontend/shared-components';
import { DatepickerField, SelectField } from '@fpsak-frontend/form';
import oppholdArsakType from '@fpsak-frontend/kodeverk/src/oppholdArsakType';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';

import styles from './renderOppholdPeriodeFieldArray.less';

const defaultOppholdPeriode = {
  periodeFom: '',
  periodeTom: '',
  årsak: '',
};


const gyldigeÅrsaker = [
  oppholdArsakType.UTTAK_MØDREKVOTE_ANNEN_FORELDER,
  oppholdArsakType.UTTAK_FEDREKVOTE_ANNEN_FORELDER,
  oppholdArsakType.UTTAK_FELLESP_ANNEN_FORELDER,
  oppholdArsakType.UTTAK_FORELDREPENGER_ANNEN_FORELDER];

const mapTyper = (typer) => typer
  .filter(({ kode }) => gyldigeÅrsaker.includes(kode))
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
