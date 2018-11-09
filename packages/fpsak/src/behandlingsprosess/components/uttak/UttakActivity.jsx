import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Column } from 'nav-frontend-grid';
import { FlexContainer, FlexColumn, FlexRow } from '@fpsak-frontend/shared-components/flexGrid';
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
} from '@fpsak-frontend/utils/validation/validators';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import { getSkjaeringstidspunktForeldrepenger } from 'behandling/behandlingSelectors';
import kodeverkPropType from '@fpsak-frontend/kodeverk/kodeverkPropType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/kodeverkTyper';
import { getKodeverk } from '@fpsak-frontend/kodeverk/duck';
import { FieldArray, formPropTypes } from 'redux-form';
import periodeResultatType from '@fpsak-frontend/kodeverk/periodeResultatType';
import { uttakPeriodeNavn } from '@fpsak-frontend/kodeverk/uttakPeriodeType';
import { Undertekst } from 'nav-frontend-typografi';
import ElementWrapper from '@fpsak-frontend/shared-components/ElementWrapper';
import ArrowBox from '@fpsak-frontend/shared-components/ArrowBox';
import VerticalSpacer from '@fpsak-frontend/shared-components/VerticalSpacer';
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

// TODO:(aa) fix this in a correct manner
const emptyBegrunnelse = () => {
  const begrunnelse = document.getElementById('uttakVurdering');
  if (!begrunnelse || begrunnelse.innerHTML.length < 1) {
    return true;
  }
  return false;
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
  stonadskontoer,
  ...formProps
}) => (
  <div>
    <Row className={styles.uttakDataWrapper}>
      <UttakInfo
        stonadskontoer={stonadskontoer}
        selectedItemData={selectedItemData}
        kontoIkkeSatt={kontoIkkeSatt}
        isApOpen={isApOpen}
        readOnly={readOnly}
        graderingInnvilget={graderingInnvilget}
        erSamtidigUttak={erSamtidigUttak}
      />
    </Row>
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
          <div className={styles.marginBottom}>
            <RadioGroupField validate={[required]} name="erOppfylt" readOnly={readOnly}>
              <RadioOption value label={{ id: 'UttakActivity.Oppfylt' }} />
              <RadioOption value={false} label={{ id: 'UttakActivity.IkkeOppfylt' }} />
            </RadioGroupField>
            {erOppfylt === false
            && (
              <div className={styles.marginBottom20}>
                <ArrowBox alignOffset={90}>
                  <SelectField
                    name="avslagAarsak"
                    selectValues={mapAarsak(avslagAarsakKoder, starttidspunktForeldrepenger)}
                    validate={[required, notDash]}
                    label={{ id: 'UttakActivity.AvslagAarsak' }}
                    readOnly={readOnly}
                    bredde="fullbredde"
                  />
                </ArrowBox>
              </div>
            )
            }
            {erOppfylt
            && (
              <div className={styles.marginBottom20}>
                <ArrowBox alignOffset={-6}>
                  <SelectField
                    name="innvilgelseAarsak"
                    selectValues={mapAarsak(innvilgelseAarsakKoder, starttidspunktForeldrepenger)}
                    validate={[required, notDash]}
                    label={{ id: 'UttakActivity.InnvilgelseAarsaker' }}
                    readOnly={readOnly}
                    bredde="fullbredde"
                  />
                  {selectedItemData.gradertAktivitet && (
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
          <FlexContainer fluid>
            <FlexRow>
              <FlexColumn>
                <Hovedknapp
                  mini
                  htmlType="button"
                  onClick={formProps.handleSubmit}
                  disabled={formProps.pristine || emptyBegrunnelse()}
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
  periodeTyper: kodeverkPropType.isRequired,
  cancelSelectedActivity: PropTypes.func.isRequired,
  avslagAarsakKoder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  innvilgelseAarsakKoder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  graderingAvslagAarsakKoder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  starttidspunktForeldrepenger: PropTypes.string.isRequired,
  stonadskontoer: PropTypes.shape().isRequired,
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
    if (periode.periodeResultatÅrsak.kodeverk === IKKE_OPPFYLT_AARSAK) {
      return false;
    }
    if (periode.periodeResultatÅrsak.kodeverk === INNVILGET_AARSAK) {
      return true;
    }
    return undefined;
  }
  return false;
};

const resultatTypeObject = (value) => {
  if (value) {
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

const validateUttakActivity = (values) => {
  const errors = {};
  errors.UttakFieldArray = [];
  if (values.samtidigUttak && values.UttakFieldArray) {
    const samletUbetalingsgrad = values.UttakFieldArray.reduce((acc, aktivit) => parseFloat(acc) + parseFloat(aktivit.utbetalingsgrad, 10), 0);
    values.UttakFieldArray.forEach((aktivitet, index) => {
      const invalid = isUtbetalingsgradMerSamitidigUttaksprosent(values.samtidigUttaksprosent, samletUbetalingsgrad);
      if (invalid) {
        errors.UttakFieldArray[index] = {
          utbetalingsgrad: invalid,
        };
      }
    });
  }
  return errors;
};

const transformValues = (values, selectedItemData, avslagAarsakKoder, innvilgelseAarsakKoder, graderingAvslagAarsakKoder) => {
  const { ...transformvalue } = selectedItemData;
  const [avslagAarsakObject] = avslagAarsakKoder.filter(a => a.kode === values.avslagAarsak);
  const [innvilgelseAarsakObject] = innvilgelseAarsakKoder.filter(a => a.kode === values.innvilgelseAarsak);
  const [graderingAvslagAarsakObject] = graderingAvslagAarsakKoder.filter(a => a.kode === values.graderingAvslagAarsak);
  transformvalue.aktiviteter = values.UttakFieldArray.map((a) => {
    const { ...bekreftetAktivitet } = a;
    bekreftetAktivitet.stønadskontoType.navn = uttakPeriodeNavn[a.stønadskontoType.kode];
    return bekreftetAktivitet;
  });
  transformvalue.begrunnelse = values.begrunnelse;
  transformvalue.flerbarnsdager = values.flerbarnsdager;
  transformvalue.samtidigUttak = values.samtidigUttak;
  transformvalue.samtidigUttaksprosent = values.samtidigUttaksprosent;
  transformvalue.erOppfylt = values.erOppfylt;
  transformvalue.graderingInnvilget = values.graderingInnvilget;
  transformvalue.periodeResultatType = resultatTypeObject(values.erOppfylt);
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
  if (!values.graderingInnvilget && graderingAvslagAarsakObject) {
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
    return aktivitet;
  });
};

const mapStateToProps = (state, ownProps) => {
  const selectedItem = ownProps.selectedItemData;
  const avslagAarsaker = getKodeverk(kodeverkTyper.UTTAK_AVSLAG_ARSAK)(state);
  const innvilgelseAarsaker = getKodeverk(kodeverkTyper.INNVILGET_AARSAK)(state);
  const graderingAvslagAarsakKoder = getKodeverk(kodeverkTyper.GRADERING_AVSLAG_AARSAK)(state);
  const kontoIkkeSatt = !selectedItem.periodeType
    && (selectedItem.aktiviteter[0].stønadskontoType.kode === '-');

  return {
    kontoIkkeSatt,
    graderingAvslagAarsakKoder,
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
    },
    erOppfylt: behandlingFormValueSelector(uttakActivityForm)(state, 'erOppfylt'),
    avslagAarsakKoder: avslagAarsaker,
    innvilgelseAarsakKoder: innvilgelseAarsaker,
    graderingInnvilget: behandlingFormValueSelector(uttakActivityForm)(state, 'graderingInnvilget'),
    erSamtidigUttak: behandlingFormValueSelector(uttakActivityForm)(state, 'samtidigUttak'),
    samtidigUttaksprosent: behandlingFormValueSelector(uttakActivityForm)(state, 'samtidigUttaksprosent'),
    periodeTyper: getKodeverk(kodeverkTyper.UTTAK_PERIODE_TYPE)(state),
    starttidspunktForeldrepenger: getSkjaeringstidspunktForeldrepenger(state),
    validate: values => validateUttakActivity(values),
    onSubmit: values => ownProps.updateActivity(transformValues(values, selectedItem, avslagAarsaker, innvilgelseAarsaker, graderingAvslagAarsakKoder)),
  };
};

export default connect(mapStateToProps)(injectIntl(behandlingForm({
  form: uttakActivityForm,
  enableReinitialize: true,
})(UttakActivity)));
