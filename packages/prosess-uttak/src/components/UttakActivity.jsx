import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FieldArray, formPropTypes } from 'redux-form';
import { Column, Row } from 'nav-frontend-grid';
import AlertStripe from 'nav-frontend-alertstriper';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Undertekst } from 'nav-frontend-typografi';

import {
  RadioGroupField, RadioOption, SelectField, TextAreaField,
} from '@fpsak-frontend/form';
import {
  hasValidText,
  isArbeidsProsentVidUtsettelse100,
  isTrekkdagerMerEnnNullUtsettelse,
  isUkerOgDagerVidNullUtbetalningsgrad,
  isUtbetalingMerEnnNullUtsettelse,
  isutbetalingPlusArbeidsprosentMerEn100,
  isUtbetalingsgradMerSamitidigUttaksprosent,
  maxLength,
  minLength,
  notDash,
  omit,
  required,
  requiredIfNotPristine,
} from '@fpsak-frontend/utils';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import periodeResultatType from '@fpsak-frontend/kodeverk/src/periodeResultatType';
import { uttakPeriodeNavn } from '@fpsak-frontend/kodeverk/src/uttakPeriodeType';
import utsettelseArsakCodes from '@fpsak-frontend/kodeverk/src/utsettelseArsakCodes';
import oppholdArsakType, { oppholdArsakMapper } from '@fpsak-frontend/kodeverk/src/oppholdArsakType';
import {
  ArrowBox, ElementWrapper, FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { behandlingFormValueSelector, behandlingForm } from '@fpsak-frontend/fp-felles';
import RenderUttakTable from './RenderUttakTable';
import UttakInfo from './UttakInfo';

import styles from './uttakActivity.less';

const uttakActivityForm = 'uttaksresultatActivity';
const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);
const IKKE_OPPFYLT_AARSAK = 'IKKE_OPPFYLT_AARSAK';
const INNVILGET_AARSAK = 'INNVILGET_AARSAK';
const PERIODE_RESULTAT_TYPE = 'PERIODE_RESULTAT_TYPE';
const innvilgetTekst = 'Innvilget';
const avlsattTekst = 'Avslått';

function sortAlphabetically(a, b) {
  if (a.navn < b.navn) {
    return -1;
  }
  if (a.navn > b.navn) {
    return 1;
  }
  return 0;
}

const mapAarsak = (kodeverk, starttidspunktForeldrepenger, utsettelseType, periodeType) => {
  kodeverk.sort(sortAlphabetically);
  const nyKodeverkListe = kodeverk.filter((kodeItem) => kodeItem.gyldigTom >= starttidspunktForeldrepenger
    && kodeItem.gyldigFom <= starttidspunktForeldrepenger);
  let filteredNyKodeArray = nyKodeverkListe.filter((item) => (item.kode < 4096 || item.kode > 4099));

  if (utsettelseType && utsettelseType.kode !== utsettelseArsakCodes.UDEFINERT) {
    filteredNyKodeArray = filteredNyKodeArray.filter((kv) => kv.uttakTyper.includes('UTSETTELSE'));
  }

  if (periodeType && utsettelseType && utsettelseType.kode === utsettelseArsakCodes.UDEFINERT) {
    filteredNyKodeArray = filteredNyKodeArray
      .filter((kv) => kv.uttakTyper.includes('UTTAK'))
      .filter((kv) => kv.valgbarForKonto.includes(periodeType.kode));
  }

  return (filteredNyKodeArray
    .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>));
};

export const UttakActivity = ({
  periodeTyper,
  oppholdArsakTyper,
  readOnly,
  cancelSelectedActivity,
  erOppfylt,
  graderingInnvilget,
  erSamtidigUttak,
  avslagAarsakKoder,
  innvilgelseAarsakKoder,
  graderingAvslagAarsakKoder,
  selectedItemData,
  isApOpen,
  kontoIkkeSatt,
  starttidspunktForeldrepenger,
  harSoktOmFlerbarnsdager,
  alleKodeverk,
  hasValidationError,
  ...formProps
}) => (
  <div>
    <Row className={styles.uttakDataWrapper}>
      <UttakInfo
        oppholdArsakTyper={oppholdArsakTyper}
        selectedItemData={selectedItemData}
        kontoIkkeSatt={kontoIkkeSatt}
        isApOpen={isApOpen}
        readOnly={readOnly}
        graderingInnvilget={graderingInnvilget}
        erSamtidigUttak={erSamtidigUttak}
        harSoktOmFlerbarnsdager={harSoktOmFlerbarnsdager}
        alleKodeverk={alleKodeverk}
      />
    </Row>
    {selectedItemData.oppholdÅrsak.kode === oppholdArsakType.UDEFINERT
        && (
          <Row className={readOnly ? null : styles.marginTop}>
            <Column xs="12">
              <FieldArray
                name="UttakFieldArray"
                component={RenderUttakTable}
                periodeTyper={periodeTyper}
                readOnly={readOnly}
              />
            </Column>
          </Row>
        )}
    <ElementWrapper>
      <div className={styles.marginBottom20}>
        <TextAreaField
          name="begrunnelse"
          label={{ id: 'UttakActivity.Vurdering' }}
          validate={[requiredIfNotPristine, minLength3, maxLength1500, hasValidText]}
          maxLength={1500}
          readOnly={readOnly}
        />
      </div>
      {!readOnly
          && (
            <div>
              {selectedItemData.oppholdÅrsak.kode === oppholdArsakType.UDEFINERT
                && (
                  <div className={styles.marginBottom}>
                    <RadioGroupField validate={[required]} name="erOppfylt" readOnly={readOnly}>
                      <RadioOption value label={{ id: 'UttakActivity.Oppfylt' }} />
                      <RadioOption value={false} label={{ id: 'UttakActivity.IkkeOppfylt' }} />
                    </RadioGroupField>
                    {erOppfylt !== undefined
                      && (
                        <div className={styles.marginBottom20}>
                          <ArrowBox alignOffset={erOppfylt ? 0 : 98}>
                            {erOppfylt && (
                              <SelectField
                                name="innvilgelseAarsak"
                                selectValues={
                                  mapAarsak(
                                    innvilgelseAarsakKoder,
                                    starttidspunktForeldrepenger,
                                    selectedItemData.utsettelseType,
                                    selectedItemData.periodeType,
                                  )
                                }
                                validate={[required, notDash]}
                                label={{ id: 'UttakActivity.InnvilgelseAarsaker' }}
                                readOnly={readOnly}
                                bredde="fullbredde"
                              />
                            )}
                            {!erOppfylt && (
                              <SelectField
                                name="avslagAarsak"
                                selectValues={
                                  mapAarsak(
                                    avslagAarsakKoder,
                                    starttidspunktForeldrepenger,
                                    selectedItemData.utsettelseType,
                                    selectedItemData.periodeType,
                                  )
                                }
                                validate={[required, notDash]}
                                label={{ id: 'UttakActivity.AvslagAarsak' }}
                                readOnly={readOnly}
                                bredde="fullbredde"
                              />
                            )}
                            {(selectedItemData.gradertAktivitet && erOppfylt) && (
                              <div className={styles.marginTop30}>
                                <Undertekst>
                                  <FormattedMessage id="UttakActivity.Gradering" />
                                </Undertekst>
                                <VerticalSpacer eightPx />
                                <RadioGroupField validate={[required]} name="graderingInnvilget" readOnly={readOnly}>
                                  <RadioOption value label={{ id: 'UttakActivity.Oppfylt' }} />
                                  <RadioOption value={false} label={{ id: 'UttakActivity.IkkeOppfylt' }} />
                                </RadioGroupField>
                                {graderingInnvilget === false && (
                                  <SelectField
                                    name="graderingAvslagAarsak"
                                    selectValues={mapAarsak(graderingAvslagAarsakKoder, starttidspunktForeldrepenger)}
                                    validate={[required, notDash]}
                                    label={{ id: 'UttakActivity.GraderingAvslagAarsaker' }}
                                    readOnly={readOnly}
                                    bredde="fullbredde"
                                  />
                                )}
                              </div>
                            )}
                          </ArrowBox>
                        </div>
                      )}
                  </div>
                )}
              {formProps.error}
              {formProps.warning}
              <FlexContainer fluid>
                <FlexRow>
                  <FlexColumn>
                    <Hovedknapp
                      mini
                      htmlType="button"
                      onClick={formProps.handleSubmit}
                      disabled={formProps.pristine || hasValidationError}
                    >
                      <FormattedMessage id="UttakActivity.Oppdater" />
                    </Hovedknapp>
                  </FlexColumn>
                  <FlexColumn>
                    <Knapp mini htmlType="button" onClick={cancelSelectedActivity}>
                      <FormattedMessage id="UttakActivity.Avbryt" />
                    </Knapp>
                  </FlexColumn>
                </FlexRow>
              </FlexContainer>
            </div>
          )}
    </ElementWrapper>
  </div>
);


UttakActivity.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasValidationError: PropTypes.bool.isRequired,
  harSoktOmFlerbarnsdager: PropTypes.bool.isRequired,
  periodeTyper: kodeverkPropType.isRequired,
  cancelSelectedActivity: PropTypes.func.isRequired,
  avslagAarsakKoder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  innvilgelseAarsakKoder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  graderingAvslagAarsakKoder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  starttidspunktForeldrepenger: PropTypes.string.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  ...formPropTypes,
};

const erPeriodeOppfylt = (periode, kontoIkkeSatt) => {
  if (periode.erOppfylt === false) {
    return false;
  }
  if (periode.erOppfylt || (periode.periodeResultatType && periode.periodeResultatType.kode === periodeResultatType.INNVILGET)) {
    return true;
  }
  if (kontoIkkeSatt) {
    return false;
  }
  if (periode.periodeResultatType && periode.periodeResultatType.kode === periodeResultatType.MANUELL_BEHANDLING) {
    if (periode.periodeResultatÅrsak.kodeverk === INNVILGET_AARSAK || periode.oppholdÅrsak.kode !== oppholdArsakType.UDEFINERT) {
      return true;
    }
    if (periode.periodeResultatÅrsak.kodeverk === IKKE_OPPFYLT_AARSAK) {
      return false;
    }
    return undefined;
  }
  return false;
};

const resultatTypeObject = (value, oppholdArsak) => {
  if (value || oppholdArsak !== oppholdArsakType.UDEFINERT) {
    return ({
      kode: periodeResultatType.INNVILGET,
      navn: innvilgetTekst,
      kodeverk: PERIODE_RESULTAT_TYPE,
    });
  }
  return ({
    kode: periodeResultatType.AVSLATT,
    navn: avlsattTekst,
    kodeverk: PERIODE_RESULTAT_TYPE,
  });
};

const warningUttakActivity = (values) => {
  let warnings = {};
  const rowArray = [];
  const touchedaktiviteter = document.getElementsByClassName('tableRowHighlight');
  const invalidArbeidsProsentVidUsettelse = isArbeidsProsentVidUtsettelse100(values, values.UttakFieldArray);
  if (invalidArbeidsProsentVidUsettelse && values.utsettelseType.kode === utsettelseArsakCodes.ARBEID) {
    warnings = {
      _warning:
  <AlertStripe type="advarsel" className={styles.advarsel}>
    <FormattedMessage
      id="ValidationMessage.UtsettelseUtenFullArbeid"
    />
  </AlertStripe>,
    };
  }

  if (touchedaktiviteter) {
    for (let i = 0; i < touchedaktiviteter.length; i += 1) {
      touchedaktiviteter[i].classList.remove('tableRowHighlight');
    }
  }
  if (values.UttakFieldArray) {
    values.UttakFieldArray.forEach((aktivitet, index) => {
      const utbetalingsgrad = parseFloat(aktivitet.utbetalingsgrad);
      const utbetalingPlusArbeidsprosentMerEn100 = isutbetalingPlusArbeidsprosentMerEn100(utbetalingsgrad, aktivitet.prosentArbeid);
      if (utbetalingPlusArbeidsprosentMerEn100) {
        rowArray.push(index);
      }
    });
    if (rowArray.length > 0) {
      const aktiviteter = document.querySelectorAll('[class^=renderUttakTable] tr');
      if (aktiviteter.length > 0) {
        rowArray.forEach((item) => {
          aktiviteter[item + 1].classList.add('tableRowHighlight');
        });
      }
      if (invalidArbeidsProsentVidUsettelse && values.utsettelseType.kode === utsettelseArsakCodes.ARBEID) {
        warnings = {
          ...warnings,
          _warning:
  <AlertStripe type="advarsel" className={styles.advarsel}>
    <FormattedMessage
      id="ValidationMessage.MerEn100ProsentOgOgyldigUtsettlse"
    />
  </AlertStripe>,
        };
      } else {
        warnings = {
          ...warnings,
          _warning:
  <AlertStripe type="advarsel" className={styles.advarsel}>
    <FormattedMessage
      id="ValidationMessage.MerEn100Prosent"
    />
  </AlertStripe>,
        };
      }
    }
  }
  return warnings;
};

const validateUttakActivity = (values) => {
  const errors = {};
  errors.UttakFieldArray = [];
  if (values.UttakFieldArray) {
    values.UttakFieldArray.forEach((aktivitet, index) => {
      const samtidigUttaksprosent = parseFloat(values.samtidigUttaksprosent);
      const utbetalingsgrad = parseFloat(aktivitet.utbetalingsgrad);
      const invalidUtbetalingsgradMerSamitidigUttaksprosent = isUtbetalingsgradMerSamitidigUttaksprosent(samtidigUttaksprosent, utbetalingsgrad);
      const invalidUkerOgDagerVidNullUtbetalningsgrad = isUkerOgDagerVidNullUtbetalningsgrad(aktivitet.weeks, aktivitet.days, utbetalingsgrad);
      if (values.samtidigUttak && invalidUtbetalingsgradMerSamitidigUttaksprosent) {
        errors.UttakFieldArray[index] = {
          utbetalingsgrad: invalidUtbetalingsgradMerSamitidigUttaksprosent,
        };
      }
      if (invalidUkerOgDagerVidNullUtbetalningsgrad) {
        errors.UttakFieldArray[index] = {
          utbetalingsgrad: invalidUkerOgDagerVidNullUtbetalningsgrad,
        };
      }
    });
    if (values.utsettelseType && values.utsettelseType.kode !== '-' && values.erOppfylt) {
      values.UttakFieldArray.forEach((aktivitet, index) => {
        const daysInvalid = isTrekkdagerMerEnnNullUtsettelse(aktivitet.days);
        const weeksInvalid = isTrekkdagerMerEnnNullUtsettelse(aktivitet.weeks);
        const utbetalingsgradInvalid = isUtbetalingMerEnnNullUtsettelse(aktivitet.utbetalingsgrad);
        errors.UttakFieldArray[index] = {
          days: daysInvalid,
          weeks: weeksInvalid,
          utbetalingsgrad: utbetalingsgradInvalid,
        };
      });
    }
  }

  return errors;
};

const transformValues = (values, avslagAarsakKoder, innvilgelseAarsakKoder, graderingAvslagAarsakKoder) => {
  const { ...transformvalue } = values.selectedItem;
  const { ...nyeVerdier } = omit(values, 'selectedItem');
  const [avslagAarsakObject] = avslagAarsakKoder.filter((a) => a.kode === values.avslagAarsak);
  const [innvilgelseAarsakObject] = innvilgelseAarsakKoder.filter((a) => a.kode === values.innvilgelseAarsak);
  const [graderingAvslagAarsakObject] = graderingAvslagAarsakKoder.filter((a) => a.kode === values.graderingAvslagAarsak);
  if (values.oppholdArsak !== oppholdArsakType.UDEFINERT) {
    nyeVerdier.UttakFieldArray[0].stønadskontoType.kode = oppholdArsakMapper[values.oppholdArsak];
  }
  transformvalue.aktiviteter = nyeVerdier.UttakFieldArray.map((a) => {
    const { ...bekreftetAktivitet } = a;
    bekreftetAktivitet.stønadskontoType.navn = uttakPeriodeNavn[a.stønadskontoType.kode];
    return bekreftetAktivitet;
  });
  transformvalue.begrunnelse = values.begrunnelse;
  transformvalue.flerbarnsdager = values.flerbarnsdager;
  transformvalue.samtidigUttak = values.samtidigUttak;
  transformvalue.samtidigUttaksprosent = values.samtidigUttaksprosent !== 'NaN' ? values.samtidigUttaksprosent : null;
  transformvalue.erOppfylt = values.erOppfylt;
  transformvalue.graderingInnvilget = values.erOppfylt ? values.graderingInnvilget : false;
  transformvalue.oppholdÅrsak.kode = values.oppholdArsak;
  transformvalue.periodeResultatType = resultatTypeObject(values.erOppfylt, values.oppholdArsak);
  transformvalue.periodeResultatÅrsak = {
    kode: '-',
  };
  transformvalue.graderingAvslagÅrsak = {
    kode: '-',
  };
  if (!values.erOppfylt && avslagAarsakObject) {
    transformvalue.periodeResultatÅrsak = avslagAarsakObject;
  }
  if (values.erOppfylt && innvilgelseAarsakObject) {
    transformvalue.periodeResultatÅrsak = innvilgelseAarsakObject;
  }
  if (values.erOppfylt && !values.graderingInnvilget && graderingAvslagAarsakObject) {
    transformvalue.graderingAvslagÅrsak = graderingAvslagAarsakObject;
  }

  return transformvalue;
};

// https://jira.adeo.no/browse/PFP-7937
const calculateCorrectWeeks = (aktivitet, item) => {
  if (item.periodeResultatType && !aktivitet.trekkdagerDesimaler && (item.periodeResultatType.kode === periodeResultatType.MANUELL_BEHANDLING)) {
    return 0;
  }
  if (aktivitet.trekkdagerDesimaler && aktivitet.trekkdagerDesimaler < 0) {
    return 0;
  }
  return Math.floor(aktivitet.trekkdagerDesimaler / 5);
};

const calculateCorrectDays = (aktivitet, item) => {
  if (item.periodeResultatType && !aktivitet.trekkdagerDesimaler && (item.periodeResultatType.kode === periodeResultatType.MANUELL_BEHANDLING)) {
    return 0;
  }
  if (aktivitet.trekkdagerDesimaler && aktivitet.trekkdagerDesimaler < 0) {
    return 0;
  }
  return ((aktivitet.trekkdagerDesimaler % 5).toFixed(1));
};

export const initialValue = (selectedItem, kontoIkkeSatt) => {
  const { ...returnValues } = selectedItem;
  return returnValues.aktiviteter.map((a) => {
    const { ...aktivitet } = a;
    aktivitet.utbetalingsgrad = !kontoIkkeSatt ? aktivitet.utbetalingsgrad : 0;
    aktivitet.fom = selectedItem.fom;
    aktivitet.tom = selectedItem.tom;
    aktivitet.weeks = typeof a.weeks !== 'undefined' ? a.weeks : calculateCorrectWeeks(aktivitet, selectedItem);
    aktivitet.days = typeof a.weeks !== 'undefined' ? a.days : calculateCorrectDays(aktivitet, selectedItem);
    if (aktivitet.weeks === 0 && aktivitet.days === 0 && selectedItem.periodeResultatType.kode === periodeResultatType.MANUELL_BEHANDLING) {
      aktivitet.weeks = '';
      aktivitet.days = '';
    }
    if (aktivitet.weeks < 0) { aktivitet.weeks = 0; }
    if (aktivitet.days < 0) { aktivitet.days = 0; }
    return aktivitet;
  });
};

const buildInitialValues = createSelector(
  [(props) => props.selectedItemData],
  (selectedItem) => {
    const kontoIkkeSatt = !selectedItem.periodeType
      && (selectedItem.aktiviteter[0].stønadskontoType.kode === '-');
    const erOppfylt = erPeriodeOppfylt(selectedItem, kontoIkkeSatt);
    return {
      UttakFieldArray: initialValue(selectedItem, kontoIkkeSatt),
      begrunnelse: selectedItem.begrunnelse,
      flerbarnsdager: selectedItem.flerbarnsdager,
      samtidigUttak: selectedItem.samtidigUttak,
      samtidigUttaksprosent: selectedItem.samtidigUttaksprosent,
      avslagAarsak: erOppfylt ? undefined : selectedItem.periodeResultatÅrsak.kode,
      innvilgelseAarsak: erOppfylt ? selectedItem.periodeResultatÅrsak.kode : undefined,
      graderingInnvilget: selectedItem.graderingInnvilget,
      graderingAvslagAarsak: selectedItem.graderingAvslagÅrsak ? selectedItem.graderingAvslagÅrsak.kode : '-',
      oppholdArsak: selectedItem.oppholdÅrsak.kode,
      utsettelseType: selectedItem.utsettelseType,
      erOppfylt,
      selectedItem,
    };
  },
);

const mapStateToPropsFactory = (_initialState, initialOwnProps) => {
  const {
    behandlingVersjon, behandlingId, behandlingsresultat, alleKodeverk,
  } = initialOwnProps;
  const avslagAarsaker = alleKodeverk[kodeverkTyper.UTTAK_AVSLAG_ARSAK];
  const innvilgelseAarsaker = alleKodeverk[kodeverkTyper.INNVILGET_AARSAK];
  const graderingAvslagAarsakKoder = alleKodeverk[kodeverkTyper.GRADERING_AVSLAG_AARSAK];
  const utsettelseAarsak = alleKodeverk[kodeverkTyper.UTSETTELSE_AARSAK_TYPE];
  const periodeTyper = alleKodeverk[kodeverkTyper.UTTAK_PERIODE_TYPE];
  const oppholdArsakTyper = alleKodeverk[kodeverkTyper.OPPHOLD_ARSAK];

  const validate = (values) => validateUttakActivity(values);
  const warn = (values) => warningUttakActivity(values);
  const onSubmit = (values) => initialOwnProps.updateActivity(transformValues(
    values,
    avslagAarsaker,
    innvilgelseAarsaker,
    graderingAvslagAarsakKoder,
  ));

  return (state, ownProps) => {
    const erOppfylt = behandlingFormValueSelector(uttakActivityForm, behandlingId, behandlingVersjon)(state, 'erOppfylt');
    const begrunnelse = behandlingFormValueSelector(uttakActivityForm, behandlingId, behandlingVersjon)(state, 'begrunnelse');
    const arsak = behandlingFormValueSelector(uttakActivityForm, behandlingId, behandlingVersjon)(state, erOppfylt ? 'innvilgelseAarsak' : 'avslagAarsak');
    const uttakFieldArray = behandlingFormValueSelector(uttakActivityForm, behandlingId, behandlingVersjon)(state, 'UttakFieldArray');
    const hasValidationError = erOppfylt === undefined || !begrunnelse || !arsak;
    return {
      hasValidationError,
      validate,
      warn,
      onSubmit,
      kontoIkkeSatt: !ownProps.selectedItemData.periodeType && (ownProps.selectedItemData.aktiviteter[0].stønadskontoType.kode === '-'),
      periodeTyper,
      oppholdArsakTyper,
      graderingAvslagAarsakKoder,
      utsettelseAarsak,
      uttakFieldArray,
      erOppfylt,
      initialValues: buildInitialValues(ownProps),
      avslagAarsakKoder: avslagAarsaker,
      innvilgelseAarsakKoder: innvilgelseAarsaker,
      graderingInnvilget: behandlingFormValueSelector(uttakActivityForm, behandlingId, behandlingVersjon)(state, 'graderingInnvilget'),
      erSamtidigUttak: behandlingFormValueSelector(uttakActivityForm, behandlingId, behandlingVersjon)(state, 'samtidigUttak'),
      samtidigUttaksprosent: behandlingFormValueSelector(uttakActivityForm, behandlingId, behandlingVersjon)(state, 'samtidigUttaksprosent'),
      starttidspunktForeldrepenger: behandlingsresultat.skjæringstidspunkt ? behandlingsresultat.skjæringstidspunkt.dato : undefined,
    };
  };
};

export default connect(mapStateToPropsFactory)(injectIntl(behandlingForm({
  form: uttakActivityForm,
  enableReinitialize: true,
})(UttakActivity)));
