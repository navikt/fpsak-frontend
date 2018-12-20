import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Column } from 'nav-frontend-grid';
import AlertStripe from 'nav-frontend-alertstriper';
import {
  RadioGroupField, RadioOption, TextAreaField, SelectField,
} from '@fpsak-frontend/form';
import {
  minLength,
  maxLength,
  requiredIfNotPristine,
  hasValidText,
  required,
  notDash,
  isUtbetalingsgradMerSamitidigUttaksprosent,
  isUkerOgDagerVidNullUtbetalningsgrad,
  isArbeidsProsentVidUtsettelse100,
  isutbetalingPlusArbeidsprosentMerEn100,
} from '@fpsak-frontend/utils';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { behandlingForm, behandlingFormValueSelector } from 'behandlingFpsak/behandlingForm';
import { getSkjaeringstidspunktForeldrepenger } from 'behandlingFpsak/behandlingSelectors';
import kodeverkPropType from '@fpsak-frontend/kodeverk/src/kodeverkPropType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import utsettelseArsakCodes from '@fpsak-frontend/kodeverk/src/utsettelseArsakCodes';
import oppholdArsakType, { oppholdArsakMapper } from '@fpsak-frontend/kodeverk/src/oppholdArsakType';
import { getKodeverk } from 'kodeverk/duck';
import { FieldArray, formPropTypes } from 'redux-form';
import periodeResultatType from '@fpsak-frontend/kodeverk/src/periodeResultatType';
import { uttakPeriodeNavn } from '@fpsak-frontend/kodeverk/src/uttakPeriodeType';
import { Undertekst } from 'nav-frontend-typografi';
import {
  ArrowBox, ElementWrapper, VerticalSpacer, FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';
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

const errorsNotCautghtInValidation = () => {
  const begrunnelse = document.getElementById('uttakVurdering');
  const aarsaknode = document.getElementById('aarsak');
  return !!(!begrunnelse || begrunnelse.innerHTML.length < 1 || (aarsaknode && aarsaknode.value === ''));
};

const mapAarsak = (kodeverk, starttidspunktForeldrepenger) => {
  kodeverk.sort(sortAlphabetically);
  const nyKodeArray = kodeverk.filter(kodeItem => kodeItem.gyldigTom >= starttidspunktForeldrepenger
    && kodeItem.gyldigFom <= starttidspunktForeldrepenger);
  return (nyKodeArray
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
      )
    }
    <ElementWrapper>
      <div className={styles.marginBottom20}>
        <TextAreaField
          name="begrunnelse"
          label={{ id: 'UttakActivity.Vurdering' }}
          validate={[requiredIfNotPristine, minLength3, maxLength1500, hasValidText]}
          maxLength={1500}
          readOnly={readOnly}
          id="uttakVurdering"
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
                <ArrowBox alignOffset={erOppfylt ? -6 : 90}>
                  <SelectField
                    id="aarsak"
                    name={erOppfylt ? 'innvilgelseAarsak' : 'avslagAarsak'}
                    selectValues={erOppfylt ? mapAarsak(innvilgelseAarsakKoder, starttidspunktForeldrepenger)
                      : mapAarsak(avslagAarsakKoder, starttidspunktForeldrepenger)}
                    validate={[required, notDash]}
                    label={erOppfylt ? { id: 'UttakActivity.InnvilgelseAarsaker' } : { id: 'UttakActivity.AvslagAarsak' }}
                    readOnly={readOnly}
                    bredde="fullbredde"
                  />
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
                        />)}
                    </div>
                  )}
                </ArrowBox>
              </div>
            )
            }
          </div>
          )
          }
          {formProps.error}
          {formProps.warning}
          <FlexContainer fluid>
            <FlexRow>
              <FlexColumn>
                <Hovedknapp
                  mini
                  htmlType="button"
                  onClick={formProps.handleSubmit}
                  disabled={formProps.pristine || errorsNotCautghtInValidation()}
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
      )
      }
    </ElementWrapper>
  </div>
);


UttakActivity.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  harSoktOmFlerbarnsdager: PropTypes.bool.isRequired,
  periodeTyper: kodeverkPropType.isRequired,
  cancelSelectedActivity: PropTypes.func.isRequired,
  avslagAarsakKoder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  innvilgelseAarsakKoder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  graderingAvslagAarsakKoder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  starttidspunktForeldrepenger: PropTypes.string.isRequired,
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
      rowArray.forEach((item) => {
        aktiviteter[item + 1].classList.add('tableRowHighlight');
      });
      warnings = {
        _warning:
  <AlertStripe type="info" className={styles.advarsel}>
    <FormattedMessage
      id="ValidationMessage.MerEn100Prosent"
    />
  </AlertStripe>,
      };
    }
  }
  return warnings;
};

const validateUttakActivity = (values) => {
  let errors = {};
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
    const invalidArbeidsProsentVidUsettelse = isArbeidsProsentVidUtsettelse100(values, values.UttakFieldArray);
    if (invalidArbeidsProsentVidUsettelse && values.utsettelseType.kode === utsettelseArsakCodes.ARBEID) {
      errors = {
        _error:
  <AlertStripe type="advarsel" className={styles.advarsel}>
    <FormattedMessage
      id="ValidationMessage.UtsettelseUtenFullArbeid"
    />
  </AlertStripe>,
      };
    }
  }
  return errors;
};

const transformValues = (values, selectedItemData, avslagAarsakKoder, innvilgelseAarsakKoder, graderingAvslagAarsakKoder) => {
  const { ...transformvalue } = selectedItemData;
  const { ...nyeVerdier } = values;
  const [avslagAarsakObject] = avslagAarsakKoder.filter(a => a.kode === values.avslagAarsak);
  const [innvilgelseAarsakObject] = innvilgelseAarsakKoder.filter(a => a.kode === values.innvilgelseAarsak);
  const [graderingAvslagAarsakObject] = graderingAvslagAarsakKoder.filter(a => a.kode === values.graderingAvslagAarsak);
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
  transformvalue.samtidigUttaksprosent = values.samtidigUttaksprosent;
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

const calculateCorrectWeeks = (aktivitet) => {
  if ((aktivitet.utbetalingsgrad || aktivitet.utbetalingsgrad === 0) || !aktivitet.prosentArbeid) {
    return Math.floor(aktivitet.trekkdager / 5);
  }
  return Math.floor((aktivitet.trekkdager * parseFloat(1 - (aktivitet.prosentArbeid * 0.01)).toPrecision(2)) / 5);
};

const calculateCorrectDays = (aktivitet) => {
  if ((aktivitet.utbetalingsgrad || aktivitet.utbetalingsgrad === 0) || !aktivitet.prosentArbeid) {
    return Math.floor(aktivitet.trekkdager % 5);
  }
  return Math.floor((aktivitet.trekkdager * parseFloat(1 - (aktivitet.prosentArbeid * 0.01)).toPrecision(2)) % 5);
};

export const initialValue = (selectedItem, kontoIkkeSatt) => {
  const { ...returnValues } = selectedItem;
  return returnValues.aktiviteter.map((a) => {
    const { ...aktivitet } = a;
    aktivitet.utbetalingsgrad = !kontoIkkeSatt ? aktivitet.utbetalingsgrad : 0;
    aktivitet.fom = selectedItem.fom;
    aktivitet.tom = selectedItem.tom;
    aktivitet.weeks = typeof a.weeks !== 'undefined' ? a.weeks : calculateCorrectWeeks(aktivitet);
    aktivitet.days = typeof a.weeks !== 'undefined' ? a.days : calculateCorrectDays(aktivitet);
    if (aktivitet.weeks === 0 && aktivitet.days === 0 && selectedItem.periodeResultatType.kode === periodeResultatType.MANUELL_BEHANDLING) {
      aktivitet.weeks = '';
      aktivitet.days = '';
    }
    return aktivitet;
  });
};

const mapStateToProps = (state, ownProps) => {
  const selectedItem = ownProps.selectedItemData;
  const avslagAarsaker = getKodeverk(kodeverkTyper.UTTAK_AVSLAG_ARSAK)(state);
  const innvilgelseAarsaker = getKodeverk(kodeverkTyper.INNVILGET_AARSAK)(state);
  const graderingAvslagAarsakKoder = getKodeverk(kodeverkTyper.GRADERING_AVSLAG_AARSAK)(state);
  const utsettelseAarsak = getKodeverk(kodeverkTyper.UTSETTELSE_ARSAK)(state);
  const kontoIkkeSatt = !selectedItem.periodeType
    && (selectedItem.aktiviteter[0].stønadskontoType.kode === '-');

  return {
    kontoIkkeSatt,
    graderingAvslagAarsakKoder,
    utsettelseAarsak,
    initialValues: {
      UttakFieldArray: initialValue(selectedItem, kontoIkkeSatt),
      erOppfylt: erPeriodeOppfylt(selectedItem, kontoIkkeSatt),
      begrunnelse: selectedItem.begrunnelse,
      flerbarnsdager: selectedItem.flerbarnsdager,
      samtidigUttak: selectedItem.samtidigUttak,
      samtidigUttaksprosent: selectedItem.samtidigUttaksprosent,
      avslagAarsak: selectedItem.periodeResultatÅrsak.kode,
      innvilgelseAarsak: selectedItem.periodeResultatÅrsak.kode,
      graderingInnvilget: selectedItem.graderingInnvilget,
      graderingAvslagAarsak: selectedItem.graderingAvslagÅrsak ? selectedItem.graderingAvslagÅrsak.kode : '-',
      oppholdArsak: selectedItem.oppholdÅrsak.kode,
    },
    erOppfylt: behandlingFormValueSelector(uttakActivityForm)(state, 'erOppfylt'),
    avslagAarsakKoder: avslagAarsaker,
    innvilgelseAarsakKoder: innvilgelseAarsaker,
    graderingInnvilget: behandlingFormValueSelector(uttakActivityForm)(state, 'graderingInnvilget'),
    erSamtidigUttak: behandlingFormValueSelector(uttakActivityForm)(state, 'samtidigUttak'),
    samtidigUttaksprosent: behandlingFormValueSelector(uttakActivityForm)(state, 'samtidigUttaksprosent'),
    periodeTyper: getKodeverk(kodeverkTyper.UTTAK_PERIODE_TYPE)(state),
    oppholdArsakTyper: getKodeverk(kodeverkTyper.OPPHOLD_ARSAK)(state),
    starttidspunktForeldrepenger: getSkjaeringstidspunktForeldrepenger(state),
    validate: values => validateUttakActivity(values),
    warn: values => warningUttakActivity(values),
    onSubmit: values => ownProps.updateActivity(transformValues(values, selectedItem, avslagAarsaker, innvilgelseAarsaker, graderingAvslagAarsakKoder)),
  };
};

export default connect(mapStateToProps)(injectIntl(behandlingForm({
  form: uttakActivityForm,
  enableReinitialize: true,
})(UttakActivity)));
