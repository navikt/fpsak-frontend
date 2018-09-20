import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Column } from 'nav-frontend-grid';
import { FlexContainer, FlexColumn, FlexRow } from 'sharedComponents/flexGrid';
import {
  RadioGroupField, RadioOption, TextAreaField, SelectField, CheckboxField,
} from '@fpsak-frontend/form';
import {
  minLength, maxLength, requiredIfNotPristine, hasValidText, required, notDash,
} from '@fpsak-frontend/utils/validation/validators';
import { injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import kodeverkPropType from 'kodeverk/kodeverkPropType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { getKodeverk } from 'kodeverk/duck';
import { FieldArray, formPropTypes } from 'redux-form';
import periodeResultatType from 'kodeverk/periodeResultatType';
import { uttakPeriodeNavn } from 'kodeverk/uttakPeriodeType';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils/formats';
import { calcDaysAndWeeks } from '@fpsak-frontend/utils/dateUtils';
import { Element, Undertekst } from 'nav-frontend-typografi';
import moment from 'moment/moment';
import uttakArbeidTypeKodeverk from 'kodeverk/uttakArbeidType';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import ArrowBox from 'sharedComponents/ArrowBox';
import RenderUttakTable from './RenderUttakTable';
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
  if (a.navn < b.navn) { return -1; }
  if (a.navn > b.navn) { return 1; }
  return 0;
}

const mapAarsak = (kodeverk) => {
  kodeverk.sort(sortAlphabetically);
  return (kodeverk
    .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>));
};

const periodeStatusClassName = (periode) => {
  if (periode.erOppfylt === false) {
    return styles.redDetailsPeriod;
  }
  if (periode.erOppfylt || (periode.periodeResultatType.kode === periodeResultatType.INNVILGET && !periode.tilknyttetStortinget)) {
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

const isInnvilgetText = (isApOpen, selectedItemData) => {
  let returnText = '';
  if (periodeIsInnvilget(selectedItemData)) {
    returnText = <FormattedHTMLMessage id="UttakActivity.InnvilgelseAarsak" values={{ innvilgelseAarsak: selectedItemData.periodeResultatÅrsak.navn }} />;
  } else {
    returnText = <FormattedHTMLMessage id="UttakActivity.IkkeOppfyltAarsak" values={{ avslagAarsak: selectedItemData.periodeResultatÅrsak.navn }} />;
  }
  return returnText;
};

const stonadskonto = (selectedItem, kontoIkkeSatt) => {
  let returnText = '';
  if (!kontoIkkeSatt) {
    returnText = selectedItem.aktiviteter[0].stønadskontoType.navn;
  }
  return returnText;
};

const typePeriode = (selectedItem, kontoIkkeSatt) => {
  let returnText = '';
  if (selectedItem.utsettelseType.kode === '-' && !kontoIkkeSatt) {
    returnText = (<FormattedMessage id="UttakActivity.Uttak" />);
  } else if (selectedItem.utsettelseType.kode !== '-') {
    returnText = (<FormattedHTMLMessage id="UttakActivity.Utsettelse" values={{ utsettelseType: selectedItem.utsettelseType.navn }} />);
  } else if (kontoIkkeSatt) {
    returnText = (<FormattedMessage id="UttakActivity.IngenKonto" />);
  }
  return returnText;
};

const gradertArbforhold = (selectedItem) => {
  let arbeidsforhold = '';
  if (selectedItem.gradertAktivitet) {
    const {
      arbeidsforholdNavn, arbeidsforholdOrgnr, uttakArbeidType,
    } = selectedItem.gradertAktivitet;

    if (uttakArbeidType && uttakArbeidType.kode !== uttakArbeidTypeKodeverk.ORDINÆRT_ARBEID) {
      arbeidsforhold = <FormattedMessage id={`RenderUttakTable.ArbeidType.${uttakArbeidType.kode}`} />;
    } else {
      arbeidsforhold = arbeidsforholdNavn ? `${arbeidsforholdNavn}` : arbeidsforhold;
      arbeidsforhold = arbeidsforholdOrgnr ? `${arbeidsforhold} (${arbeidsforholdOrgnr})` : arbeidsforhold;
    }
  }
  return arbeidsforhold;
};

export const UttakActivity = ({
  periodeTyper,
  readOnly,
  cancelSelectedActivity,
  erOppfylt,
  avslagAarsakKoder,
  innvilgelseAarsakKoder,
  selectedItemData,
  isApOpen,
  kontoIkkeSatt,
  ...formProps
}) => (
  <div>
    <Row className={styles.uttakDataWrapper}>
      <Column xs="12">
        <div className={periodeStatusClassName(selectedItemData)}>
          <Row>
            <Column xs="4">
              <Row>
                <Column xs="12">
                  <Element>
                    {typePeriode(selectedItemData, kontoIkkeSatt)}
                  </Element>
                </Column>
              </Row>
              <Row>
                <Column xs="12">{stonadskonto(selectedItemData, kontoIkkeSatt)}</Column>
              </Row>
            </Column>
            <Column xs="6">
              {readOnly
              && (
              <div>
                {isInnvilgetText(isApOpen, selectedItemData)}
              </div>
              )
            }
            </Column>
            <Column xs="2">
              <CheckboxField
                key="samtidigUttak"
                name="samtidigUttak"
                label={{ id: 'UttakActivity.SamtidigUttak' }}
                disabled={readOnly}
              />
              <CheckboxField
                key="flerbarnsdager"
                name="flerbarnsdager"
                label={{ id: 'UttakActivity.Flerbarnsdager' }}
                disabled={readOnly}
              />
            </Column>
          </Row>
          <Row>
            <Column xs="4">
              <Row>
                <Column xs="12">
                  <Element>
                    <FormattedMessage
                      id="UttakActivity.PeriodeData.Periode"
                      values={{
                        fomVerdi: moment(selectedItemData.fom.toString()).format(DDMMYYYY_DATE_FORMAT),
                        tomVerdi: moment(selectedItemData.tom.toString()).format(DDMMYYYY_DATE_FORMAT),
                      }}
                    />
                  </Element>
                </Column>
              </Row>
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
                </Column>
              </Row>
              <Row>
                <Column xs="12">
                  {gradertArbforhold(selectedItemData)}
                  {' '}
                </Column>
              </Row>
            </Column>
          </Row>
        </div>
      </Column>
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
                selectValues={mapAarsak(avslagAarsakKoder)}
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
                  selectValues={mapAarsak(innvilgelseAarsakKoder)}
                  validate={[required, notDash]}
                  label={{ id: 'UttakActivity.InnvilgelseAarsaker' }}
                  readOnly={readOnly}
                  bredde="fullbredde"
                />
              </ArrowBox>
            </div>
          )
          }
        </div>
        <FlexContainer fluid>
          <FlexRow>
            <FlexColumn>
              <Hovedknapp mini htmlType="button" onClick={formProps.handleSubmit} disabled={formProps.pristine}>
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
    return ({ kode: periodeResultatType.INNVILGET, navn: innvilgetTekst, kodeverk: PERIODE_RESULTAT_TYPE });
  }
  return ({ kode: periodeResultatType.AVSLATT, navn: avlsattTekst, kodeverk: PERIODE_RESULTAT_TYPE });
};

const transformValues = (values, selectedItemData, avslagAarsakKoder, innvilgelseAarsakKoder) => {
  const { ...transformvalue } = selectedItemData;
  const [avslagAarsakObject] = avslagAarsakKoder.filter(a => a.kode === values.avslagAarsak);
  const [innvilgelseAarsakObject] = innvilgelseAarsakKoder.filter(a => a.kode === values.innvilgelseAarsak);
  transformvalue.aktiviteter = values.UttakFieldArray.map((a) => {
    const { ...bekreftetAktivitet } = a;
    bekreftetAktivitet.stønadskontoType.navn = uttakPeriodeNavn[a.stønadskontoType.kode];
    return bekreftetAktivitet;
  });
  transformvalue.begrunnelse = values.begrunnelse;
  transformvalue.flerbarnsdager = values.flerbarnsdager;
  transformvalue.samtidigUttak = values.samtidigUttak;
  transformvalue.erOppfylt = values.erOppfylt;
  transformvalue.periodeResultatType = resultatTypeObject(values.erOppfylt);
  transformvalue.periodeResultatÅrsak = {
    kode: '-',
  };
  if (!values.erOppfylt && avslagAarsakObject) {
    transformvalue.periodeResultatÅrsak = avslagAarsakObject;
  }
  if (values.erOppfylt && innvilgelseAarsakObject) {
    transformvalue.periodeResultatÅrsak = innvilgelseAarsakObject;
  }
  return transformvalue;
};

export const initialValue = (selectedItem, kontoIkkeSatt) => {
  const { ...returnValues } = selectedItem;
  return returnValues.aktiviteter.map((a) => {
    const { ...aktivitet } = a;
    aktivitet.utbetalingsgrad = !kontoIkkeSatt ? aktivitet.utbetalingsgrad : 0;
    aktivitet.fom = selectedItem.fom;
    aktivitet.tom = selectedItem.tom;
    aktivitet.weeks = typeof a.weeks !== 'undefined' ? a.weeks : Math.floor(a.trekkdager / 5);
    aktivitet.days = typeof a.weeks !== 'undefined' ? a.days : a.trekkdager % 5;
    return aktivitet;
  });
};

const mapStateToProps = (state, ownProps) => {
  const selectedItem = ownProps.selectedItemData;
  const avslagAarsaker = getKodeverk(kodeverkTyper.UTTAK_AVSLAG_ARSAK)(state);
  const innvilgelseAarsaker = getKodeverk(kodeverkTyper.INNVILGET_AARSAK)(state);
  const kontoIkkeSatt = !selectedItem.periodeType
    && (selectedItem.aktiviteter[0].stønadskontoType.kode === '-');
  return {
    kontoIkkeSatt,
    initialValues: {
      UttakFieldArray: initialValue(selectedItem, kontoIkkeSatt),
      erOppfylt: erPeriodeOppfylt(selectedItem, kontoIkkeSatt),
      begrunnelse: selectedItem.begrunnelse,
      flerbarnsdager: selectedItem.flerbarnsdager,
      samtidigUttak: selectedItem.samtidigUttak,
      avslagAarsak: selectedItem.periodeResultatÅrsak.kode,
      innvilgelseAarsak: selectedItem.periodeResultatÅrsak.kode,
    },
    erOppfylt: behandlingFormValueSelector(uttakActivityForm)(state, 'erOppfylt'),
    avslagAarsakKoder: avslagAarsaker,
    innvilgelseAarsakKoder: innvilgelseAarsaker,

    periodeTyper: getKodeverk(kodeverkTyper.UTTAK_PERIODE_TYPE)(state),
    onSubmit: values => ownProps.updateActivity(transformValues(values, selectedItem, avslagAarsaker, innvilgelseAarsaker)),
  };
};

export default connect(mapStateToProps)(injectIntl(behandlingForm({
  form: uttakActivityForm,
  enableReinitialize: true,
})(UttakActivity)));
