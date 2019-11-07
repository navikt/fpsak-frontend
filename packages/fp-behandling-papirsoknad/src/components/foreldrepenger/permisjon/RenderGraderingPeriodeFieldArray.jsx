import React from 'react';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import { FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import AlertStripe from 'nav-frontend-alertstriper';

import {
  FlexColumn, FlexContainer, FlexRow, PeriodFieldArray, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { hasValidDecimal, maxValue } from '@fpsak-frontend/utils';
import {
  CheckboxField, DatepickerField, DecimalField, InputField, SelectField,
} from '@fpsak-frontend/form';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import arbeidskategori from '@fpsak-frontend/kodeverk/src/arbeidskategori';

import { gyldigeUttakperioder } from './RenderPermisjonPeriodeFieldArray';

import styles from './renderGraderingPeriodeFieldArray.less';

const defaultGraderingPeriode = {
  periodeFom: '',
  periodeTom: '',
  periodeForGradering: '',
  prosentandelArbeid: '',
  skalGraderes: false,
};

export const gyldigArbeidskategori = [
  arbeidskategori.ARBEIDSTAKER,
  arbeidskategori.SELVSTENDIG_NAERINGSDRIVENDE,
  arbeidskategori.FRILANSER,
];


const maxValue100 = maxValue(100);

const mapKvoter = (typer) => typer
  .filter(({ kode }) => gyldigeUttakperioder.includes(kode))
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

const mapArbeidskategori = (typer) => typer
  .filter(({ kode }) => gyldigArbeidskategori.includes(kode))
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

/**
 *  RenderGraderingPeriodeFieldArray
 *
 * Presentasjonskomponent: Viser inputfelter for dato for bestemmelse av graderingperiode.
 * Komponenten må rendres som komponenten til et FieldArray.
 */
export const RenderGraderingPeriodeFieldArray = ({
  fields,
  meta,
  graderingKvoter,
  readOnly,
  graderingValues,
  arbeidskategoriTyper,
}) => (
  <PeriodFieldArray
    fields={fields}
    meta={meta}
    emptyPeriodTemplate={defaultGraderingPeriode}
    textCode="Registrering.Permisjon.Gradering.LeggTilPeriode"
    readOnly={readOnly}
  >
    {(periodeElementFieldId, index, getRemoveButton) => {
      const { periodeFom } = fields.get(index);
      const { harSamtidigUttak } = graderingValues[index];
      const periodeFomForTidlig = periodeFom && moment(periodeFom).isBefore(moment('2019-01-01'));
      return (
        <Row key={periodeElementFieldId}>
          <Column xs="12" className={index !== (fields.length - 1) ? styles.notLastRow : ''}>
            <FlexContainer wrap>
              <FlexRow>
                <FlexColumn>
                  <SelectField
                    name={`${periodeElementFieldId}.periodeForGradering`}
                    bredde="s"
                    selectValues={mapKvoter(graderingKvoter)}
                    label={{ id: 'Registrering.Permisjon.Gradering.Periode' }}
                  />
                </FlexColumn>
                <FlexColumn>
                  <DatepickerField
                    label={{ id: 'Registrering.Permisjon.periodeFom' }}
                    name={`${periodeElementFieldId}.periodeFom`}
                    defaultValue={null}
                  />
                </FlexColumn>
                <FlexColumn>
                  <DatepickerField
                    label={{ id: 'Registrering.Permisjon.periodeTom' }}
                    name={`${periodeElementFieldId}.periodeTom`}
                    defaultValue={null}
                  />
                </FlexColumn>
                <FlexColumn className={styles.prosentHeader}>
                  <Undertekst>
                    <FormattedMessage id="Registrering.Permisjon.Gradering.Prosentandel" />
                  </Undertekst>
                  <DecimalField
                    name={`${periodeElementFieldId}.prosentandelArbeid`}
                    bredde="S"
                    validate={[hasValidDecimal,
                      maxValue100,
                    ]}
                    normalizeOnBlur={(value) => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
                  />
                </FlexColumn>
                <FlexColumn>
                  <InputField
                    label={{ id: 'Registrering.Permisjon.Orgnr' }}
                    name={`${periodeElementFieldId}.arbeidsgiverIdentifikator`}
                    bredde="S"
                  />
                </FlexColumn>
              </FlexRow>
              <FlexRow>
                <FlexColumn>
                  <SelectField
                    label={{ id: 'Registrering.Permisjon.ArbeidskategoriLabel' }}
                    name={`${periodeElementFieldId}.arbeidskategoriType`}
                    bredde="m"
                    selectValues={mapArbeidskategori(arbeidskategoriTyper)}
                  />
                </FlexColumn>
                <FlexColumn>
                  <div className={styles.graderesHeader}>
                    <Undertekst>
                      <FormattedMessage id="Registrering.Permisjon.Gradering.SkalGraderes" />
                    </Undertekst>
                  </div>
                  <CheckboxField
                    name={`${periodeElementFieldId}.skalGraderes`}
                    label=" "
                  />
                </FlexColumn>
                <FlexColumn>
                  <div className={styles.smalHeader}>
                    <Undertekst>
                      <FormattedMessage id="Registrering.Permisjon.Flerbarnsdager" />
                    </Undertekst>
                    <CheckboxField
                      readOnly={readOnly}
                      name={`${periodeElementFieldId}.flerbarnsdager`}
                      label=" "
                    />
                  </div>
                </FlexColumn>
                <FlexColumn>
                  <div className={styles.smalHeader}>
                    <Undertekst>
                      <FormattedMessage id="Registrering.Permisjon.HarSamtidigUttak" />
                    </Undertekst>
                  </div>
                  <CheckboxField
                    name={`${periodeElementFieldId}.harSamtidigUttak`}
                    label=""
                  />
                </FlexColumn>
                <FlexColumn>
                  {harSamtidigUttak
                  && (
                    <DecimalField
                      name={`${periodeElementFieldId}.samtidigUttaksprosent`}
                      bredde="S"
                      validate={[hasValidDecimal, maxValue100]}
                      label={{ id: 'Registrering.Permisjon.SamtidigUttaksprosent' }}
                      normalizeOnBlur={(value) => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
                    />
                  )}
                </FlexColumn>
                <FlexColumn className={styles.placeRemoveButton}>
                  {getRemoveButton()}
                </FlexColumn>
              </FlexRow>
              {periodeFomForTidlig
              && (
                <div>
                  <FlexRow wrap>
                    <AlertStripe type="advarsel">
                      <FormattedMessage id="Registrering.Permisjon.PeriodeFomForTidlig" />
                    </AlertStripe>
                  </FlexRow>
                  <VerticalSpacer eightPx />
                </div>
              )}
            </FlexContainer>
          </Column>
        </Row>
      );
    }}
  </PeriodFieldArray>
);

RenderGraderingPeriodeFieldArray.propTypes = {
  fields: PropTypes.shape().isRequired,
  graderingKvoter: kodeverkPropType.isRequired,
  meta: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  graderingValues: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  arbeidskategoriTyper: kodeverkPropType.isRequired,
};

const arrayMedTomtElement = [{}];

const mapStateToProps = (state, ownProps) => {
  const values = getFormValues(ownProps.meta.form)(state);
  const graderingValues = values ? values[ownProps.namePrefix][ownProps.graderingPrefix] : arrayMedTomtElement;
  return {
    graderingValues,
  };
};

export default connect(mapStateToProps)(RenderGraderingPeriodeFieldArray);
