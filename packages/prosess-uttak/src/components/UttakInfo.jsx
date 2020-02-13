import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { Element, Undertekst } from 'nav-frontend-typografi';
import moment from 'moment/moment';

import { CheckboxField, DecimalField, SelectField } from '@fpsak-frontend/form';
import {
  calcDaysAndWeeks, DDMMYYYY_DATE_FORMAT, hasValidDecimal, maxValue, notDash, required,
} from '@fpsak-frontend/utils';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import periodeResultatType from '@fpsak-frontend/kodeverk/src/periodeResultatType';
import uttakArbeidTypeKodeverk from '@fpsak-frontend/kodeverk/src/uttakArbeidType';
import uttakArbeidTypeTekstCodes from '@fpsak-frontend/kodeverk/src/uttakArbeidTypeCodes';
import oppholdArsakType, { oppholdArsakKontoNavn } from '@fpsak-frontend/kodeverk/src/oppholdArsakType';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import styles from './uttakActivity.less';

/**
 * UttakInfo
 * Presentationskomponent. Viser opp den faktiska informasjonen om en periode i uttak
 */

const maxValue100 = maxValue(100);

const periodeStatusClassName = (periode) => {
  if (periode.erOppfylt === false) {
    return styles.redDetailsPeriod;
  }
  if (periode.erOppfylt
    || (periode.periodeResultatType.kode === periodeResultatType.INNVILGET && !periode.tilknyttetStortinget)) {
    return styles.greenDetailsPeriod;
  }
  if (periode.periodeResultatType.kode === periodeResultatType.MANUELL_BEHANDLING || periode.tilknyttetStortinget) {
    return styles.orangeDetailsPeriod;
  }
  return styles.redDetailsPeriod;
};

const periodeIsInnvilget = (periode) => {
  if (periode.erOppfylt === false) {
    return false;
  }
  if (periode.erOppfylt || (periode.periodeResultatType.kode === periodeResultatType.INNVILGET)) {
    return true;
  }
  return false;
};

const gradertArbforhold = (selectedItem) => {
  let arbeidsforhold = '';
  if (selectedItem.gradertAktivitet) {
    const {
      arbeidsgiver, uttakArbeidType,
    } = selectedItem.gradertAktivitet;

    if (uttakArbeidType && uttakArbeidType.kode !== uttakArbeidTypeKodeverk.ORDINÆRT_ARBEID) {
      arbeidsforhold = <FormattedMessage id={uttakArbeidTypeTekstCodes[uttakArbeidType.kode]} />;
    } else if (arbeidsgiver) {
      const {
        navn, identifikator,
      } = arbeidsgiver;
      arbeidsforhold = navn ? `${navn}` : arbeidsforhold;
      arbeidsforhold = identifikator ? `${arbeidsforhold} (${identifikator})` : arbeidsforhold;
    }
  }
  return arbeidsforhold;
};

const typePeriode = (selectedItem, kontoIkkeSatt, getKodeverknavn) => {
  let returnText = '';
  if (selectedItem.utsettelseType.kode === '-' && !kontoIkkeSatt) {
    returnText = (<FormattedMessage id="UttakActivity.Uttak" />);
  } else if (selectedItem.utsettelseType.kode !== '-') {
    returnText = (<FormattedHTMLMessage id="UttakActivity.Utsettelse" values={{ utsettelseType: getKodeverknavn(selectedItem.utsettelseType) }} />);
  } else if (kontoIkkeSatt) {
    returnText = (<FormattedMessage id="UttakActivity.IngenKonto" />);
  }
  return returnText;
};

const isInnvilgetText = (selectedItemData, getKodeverknavn) => {
  let returnText = '';
  if (periodeIsInnvilget(selectedItemData)) {
    returnText = (
      <FormattedHTMLMessage
        id="UttakActivity.InnvilgelseAarsak"
        values={{ innvilgelseAarsak: getKodeverknavn(selectedItemData.periodeResultatÅrsak) }}
      />
    );
  } else {
    returnText = (
      <FormattedHTMLMessage
        id="UttakActivity.IkkeOppfyltAarsak"
        values={{ avslagAarsak: getKodeverknavn(selectedItemData.periodeResultatÅrsak) }}
      />
    );
  }
  return returnText;
};

const stonadskonto = (selectedItem, kontoIkkeSatt, getKodeverknavn) => {
  let returnText = '';
  if (!kontoIkkeSatt) {
    returnText = getKodeverknavn(selectedItem.aktiviteter[0].stønadskontoType);
  }
  return returnText;
};

const gyldigeÅrsaker = [
  oppholdArsakType.UTTAK_MØDREKVOTE_ANNEN_FORELDER,
  oppholdArsakType.UTTAK_FEDREKVOTE_ANNEN_FORELDER,
  oppholdArsakType.UTTAK_FELLESP_ANNEN_FORELDER,
  oppholdArsakType.UTTAK_FORELDREPENGER_ANNEN_FORELDER];

const mapPeriodeTyper = (typer) => typer
  .filter(({ kode }) => gyldigeÅrsaker.includes(kode))
  .map(({ kode }) => <option value={kode} key={kode}>{oppholdArsakKontoNavn[kode]}</option>);

const visGraderingIkkeInnvilget = (selectedItem, readOnly, graderingInnvilget) => {
  const visGradering = selectedItem.periodeResultatType.kode === periodeResultatType.INNVILGET
    && selectedItem.gradertAktivitet
    && graderingInnvilget === false
    && readOnly;
  return visGradering;
};

export const UttakInfo = ({
  selectedItemData,
  kontoIkkeSatt,
  readOnly,
  graderingInnvilget,
  erSamtidigUttak,
  harSoktOmFlerbarnsdager,
  oppholdArsakTyper,
  alleKodeverk,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);

  return (
    <Column xs="12">
      <div className={periodeStatusClassName(selectedItemData)}>
        {selectedItemData.oppholdÅrsak.kode === '-'
          && (
            <Row>
              <Column xs="4">
                <Row>
                  <Column xs="12">
                    <Element>
                      {typePeriode(selectedItemData, kontoIkkeSatt, getKodeverknavn)}
                    </Element>
                  </Column>
                </Row>
                <Row>
                  <Column xs="12">
                    {stonadskonto(selectedItemData, kontoIkkeSatt, getKodeverknavn)}
                  </Column>
                </Row>
              </Column>
              <Column xs="5">
                {readOnly
                  && (
                    <div>
                      {isInnvilgetText(selectedItemData, getKodeverknavn)}
                    </div>
                  )}
              </Column>
              <Column xs="3">
                <>
                  <Row className={styles.fieldHorizontal}>
                    <Column className={styles.textAlignRight}>
                      {(harSoktOmFlerbarnsdager)
                        && (
                          <CheckboxField
                            key="flerbarnsdager"
                            name="flerbarnsdager"
                            label={{ id: 'UttakActivity.Flerbarnsdager' }}
                            disabled={readOnly}
                          />
                        )}
                    </Column>
                  </Row>
                  <Row className={styles.fieldHorizontal}>
                    <Column className={styles.textAlignRight}>
                      <CheckboxField
                        key="samtidigUttak"
                        name="samtidigUttak"
                        label={{ id: 'UttakActivity.SamtidigUttak' }}
                        disabled={readOnly}
                      />
                    </Column>
                  </Row>
                </>
                {erSamtidigUttak
                  && (
                    <>
                      <Row className={styles.fieldHorizontal}>
                        <Column className={styles.textAlignRight}>
                          <DecimalField
                            name="samtidigUttaksprosent"
                            bredde="XS"
                            readOnly={readOnly}
                            value={selectedItemData.samtidigUttaksprosent}
                            label={{ id: 'UttakInfo.SamtidigUttaksprosent' }}
                            validate={[required, maxValue100, hasValidDecimal]}
                            format={(value) => {
                              if (value || value === 0) {
                                return readOnly ? `${value} %` : value;
                              }
                              return '';
                            }}
                            normalizeOnBlur={(value) => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
                          />
                        </Column>
                        {!readOnly && <Column className={styles.suffix}>%</Column>}
                      </Row>
                    </>
                  )}
              </Column>
            </Row>
          )}
        <Row>
          <Column xs="4">
            <Row>
              <Column xs="12">
                <Element>
                  <FormattedMessage
                    id="UttakActivity.PeriodeData.Periode"
                    values={{
                      fomVerdi: moment(selectedItemData.fom.toString())
                        .format(DDMMYYYY_DATE_FORMAT),
                      tomVerdi: moment(selectedItemData.tom.toString())
                        .format(DDMMYYYY_DATE_FORMAT),
                    }}
                  />
                </Element>
              </Column>
            </Row>
            {selectedItemData.oppholdÅrsak.kode === '-'
              && (
                <Row>
                  <Column xs="12">
                    <FormattedMessage
                      id={calcDaysAndWeeks(moment(selectedItemData.fom.toString()), moment(selectedItemData.tom.toString())).id}
                      values={{
                        weeks: calcDaysAndWeeks(moment(selectedItemData.fom.toString()), moment(selectedItemData.tom.toString())).weeks,
                        days: calcDaysAndWeeks(moment(selectedItemData.fom.toString()), moment(selectedItemData.tom.toString())).days,
                      }}
                    />
                  </Column>
                </Row>
              )}
          </Column>
          <Column xs="6">
            <Row>
              <Column xs="12">
                {selectedItemData.gradertAktivitet
                  && (
                    <Undertekst>
                      <FormattedMessage id="UttakActivity.Gradering" />
                    </Undertekst>
                  )}
                {selectedItemData.oppholdÅrsak.kode !== '-'
                  && (
                    <FormattedMessage
                      id={calcDaysAndWeeks(moment(selectedItemData.fom.toString()), moment(selectedItemData.tom.toString())).id}
                      values={{
                        weeks: calcDaysAndWeeks(moment(selectedItemData.fom.toString()), moment(selectedItemData.tom.toString())).weeks,
                        days: calcDaysAndWeeks(moment(selectedItemData.fom.toString()), moment(selectedItemData.tom.toString())).days,
                      }}
                    />
                  )}
              </Column>
            </Row>
            <Row>
              <Column xs="12">
                {gradertArbforhold(selectedItemData)}
              </Column>
            </Row>
            {visGraderingIkkeInnvilget(selectedItemData, readOnly, graderingInnvilget) && (
              <Row>
                <Column xs="12">
                  <b>
                    <FormattedMessage id="UttakActivity.GraderingIkkeOppfylt" />
                    :
                  </b>
                  {getKodeverknavn(selectedItemData.graderingAvslagÅrsak)}
                </Column>
              </Row>
            )}
          </Column>
        </Row>
        {selectedItemData.oppholdÅrsak.kode !== '-'
          && (
            <div>
              <Row>
                <Column xs="12">
                  <FormattedMessage id="UttakInfo.Opphold.AnnenForelder" />
                </Column>
              </Row>
              <Row>
                <Column xs="12">
                  <SelectField
                    name="oppholdArsak"
                    selectValues={mapPeriodeTyper(oppholdArsakTyper)}
                    label=""
                    bredde="m"
                    readOnly={readOnly}
                    value={selectedItemData.oppholdÅrsak.kode}
                    validate={[required, notDash]}
                  />
                </Column>
              </Row>
            </div>
          )}
      </div>
    </Column>
  );
};

UttakInfo.propTypes = {
  oppholdArsakTyper: kodeverkPropType.isRequired,
  selectedItemData: PropTypes.PropTypes.shape().isRequired,
  kontoIkkeSatt: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  harSoktOmFlerbarnsdager: PropTypes.bool.isRequired,
  graderingInnvilget: PropTypes.bool,
  erSamtidigUttak: PropTypes.bool,
  alleKodeverk: PropTypes.shape().isRequired,
};

UttakInfo.defaultProps = {
  kontoIkkeSatt: undefined,
  graderingInnvilget: undefined,
  erSamtidigUttak: undefined,
};

export default UttakInfo;
