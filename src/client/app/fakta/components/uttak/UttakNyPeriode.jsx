import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';
import { behandlingFormValueSelector, behandlingForm } from 'behandling/behandlingForm';
import {
  PeriodpickerField, SelectField, CheckboxField, RadioGroupField, RadioOption, TextAreaField, DecimalField,
} from 'form/Fields';
import {
  hasValidDate,
  requiredIfNotPristine,
  required,
  hasValidDecimal,
  hasValidPeriod,
  maxValue, minLength, maxLength, hasValidText,
} from 'utils/validation/validators';
import moment from 'moment';
import guid from 'utils/guidUtil';
import { Knapp, Hovedknapp } from 'nav-frontend-knapper';
import FlexColumn from 'sharedComponents/flexGrid/FlexColumn';
import FlexRow from 'sharedComponents/flexGrid/FlexRow';
import FlexContainer from 'sharedComponents/flexGrid/FlexContainer';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getKodeverk } from 'kodeverk/duck';
import { getPersonopplysning, getAlleAndelerIForstePeriode } from 'behandling/behandlingSelectors';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import navBrukerKjonn from 'kodeverk/navBrukerKjonn';
import uttakPeriodeType from 'kodeverk/uttakPeriodeType';
import { ISO_DATE_FORMAT } from 'utils/formats';
import utsettelseArsakCodes from 'kodeverk/utsettelseArsakCodes';
import overforingArsak from 'kodeverk/overforingArsak';
import { calcDaysAndWeeks } from 'utils/dateUtils';
import styles from './uttakNyPeriode.less';

const maxValue100 = maxValue(100);
const minLength3 = minLength(3);
const maxLength4000 = maxLength(4000);

const gyldigeUttakperioder = [
  uttakPeriodeType.FELLESPERIODE,
  uttakPeriodeType.FEDREKVOTE,
  uttakPeriodeType.FORELDREPENGER_FOR_FODSEL,
  uttakPeriodeType.FORELDREPENGER,
  uttakPeriodeType.MODREKVOTE];

const gyldigeOverføringÅrsaker = [
  overforingArsak.INSTITUSJONSOPPHOLD_ANNEN_FORELDER,
  overforingArsak.SYKDOM_ANNEN_FORELDER,
];

const mapPeriodeTyper = typer => typer
  .filter(({ kode }) => gyldigeUttakperioder.includes(kode))
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

const mapOverføringÅrsaker = typer => typer
  .filter(({ kode }) => gyldigeOverføringÅrsaker.includes(kode))
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

const mapUtsettelseÅrsaker = typer => typer
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

const mapArbeidsforhold = arbeidsforhold => arbeidsforhold.map((arbeidsgiver) => {
  const {
    virksomhetId, virksomhetNavn, arbeidsforholdType, arbeidsforholdId,
  } = arbeidsgiver;

  let periodeArbeidsforhold = virksomhetNavn ? `${virksomhetNavn}` : arbeidsforholdType.navn;
  periodeArbeidsforhold = virksomhetId ? `${periodeArbeidsforhold} ${virksomhetId}` : periodeArbeidsforhold;
  periodeArbeidsforhold = arbeidsforholdId ? `${periodeArbeidsforhold}...${arbeidsforholdId.substr(-4)}` : periodeArbeidsforhold;

  const navn = virksomhetNavn || arbeidsforholdType.navn;
  const orgNr = virksomhetId || '-';

  return (
    <option value={`${orgNr}|${navn}`} key={orgNr}>{periodeArbeidsforhold}</option>
  );
});
const periodeTypeTrengerArsak = (sokerKjonn, periodeType) => (
  (sokerKjonn === navBrukerKjonn.MANN && periodeType === 'MØDREKVOTE')
  || (sokerKjonn === navBrukerKjonn.KVINNE && periodeType === 'FEDREKVOTE')
);

export const UttakNyPeriode = ({
  newPeriodeCallback,
  newPeriodeResetCallback,
  periodeTyper,
  utsettelseÅrsaker,
  overføringÅrsaker,
  nyPeriode,
  sokerKjonn,
  nyPeriodeDisabledDaysFom,
  arbeidsforhold,
  ...formProps
}) => {
  const inlineStyle = {
    arrowBox: {
      marginTop: nyPeriode.typeUttak === 'utsettelse' ? 80 : 0,
    },
  };
  const numberOfDaysAndWeeks = calcDaysAndWeeks(nyPeriode.fom, nyPeriode.tom, ISO_DATE_FORMAT);
  return (
    <div>
      <Row>
        <Column>
          <div className={styles.periodeContainer}>
            <div className={styles.periodeType}>
              <div className={styles.headerWrapper}>
                <Element><FormattedMessage id="UttakInfoPanel.NyPeriode" /></Element>
              </div>
            </div>
            <div className={styles.periodeInnhold}>
              <VerticalSpacer eightPx />
              <FlexContainer fluid wrap>
                <FlexRow wrap>
                  <FlexColumn>
                    <FlexRow>
                      <FlexColumn>
                        <PeriodpickerField
                          names={['fom', 'tom']}
                          label={{ id: 'UttakInfoPanel.Periode' }}
                          validate={[required, hasValidDate]}
                          disabledDays={{ before: moment(nyPeriodeDisabledDaysFom).toDate() }}
                        />
                      </FlexColumn>
                      <FlexColumn className={styles.suffix}>
                        <div id="antallDager">
                          {nyPeriode.fom
                          && (
                          <FormattedMessage
                            id={numberOfDaysAndWeeks.id.toString()}
                            values={{
                              weeks: numberOfDaysAndWeeks.weeks.toString(),
                              days: numberOfDaysAndWeeks.days.toString(),
                            }}
                          />
                          )}
                        </div>
                      </FlexColumn>
                    </FlexRow>
                    <FlexColumn>
                      <FlexRow wrap>
                        <FlexColumn>
                          <FlexRow>
                            <SelectField
                              label={{ id: 'UttakInfoPanel.StonadsKonto' }}
                              bredde="m"
                              name="periodeType"
                              validate={[required]}
                              selectValues={mapPeriodeTyper(periodeTyper)}
                            />
                          </FlexRow>
                        </FlexColumn>
                        <FlexColumn className={styles.alignRightHorizontalBottom}>
                          <CheckboxField
                            name="samtidigUttak"
                            label={<FormattedMessage id="UttakInfoPanel.SamtidigUttak" />}
                          />
                          <CheckboxField
                            name="flerBarnsDager"
                            label={<FormattedMessage id="UttakInfoPanel.FlerBarnsDager" />}
                          />
                        </FlexColumn>
                      </FlexRow>
                    </FlexColumn>
                    <FlexColumn>
                      {periodeTypeTrengerArsak(sokerKjonn, nyPeriode.periodeType) && (
                      <FlexRow>
                        <SelectField
                          label={{ id: 'UttakInfoPanel.AngiArsakforOverforing' }}
                          bredde="m"
                          name="periodeOverforingArsak"
                          selectValues={mapOverføringÅrsaker(overføringÅrsaker)}
                          validate={[required]}
                        />
                      </FlexRow>
                      )}
                    </FlexColumn>
                  </FlexColumn>
                </FlexRow>
                <FlexRow wrap className={styles.typeUttakStyle}>
                  <FlexColumn>
                    <div>
                      <Undertekst><FormattedMessage id="UttakInfoPanel.TypeUttak" /></Undertekst>
                      <VerticalSpacer eightPx />
                    </div>
                    <div>
                      <RadioGroupField name="typeUttak" validate={[required]} direction="vertical">
                        <RadioOption label={<FormattedMessage id="UttakInfoPanel.FulltUttak" />} value="fullt" />
                        <RadioOption label={<FormattedMessage id="UttakInfoPanel.GradertUttak" />} value="gradert" />
                        <RadioOption label={<FormattedMessage id="UttakInfoPanel.Utsettelse" />} value="utsettelse" />
                      </RadioGroupField>
                    </div>
                  </FlexColumn>
                  <FlexColumn>
                    {nyPeriode.typeUttak !== null
                      && nyPeriode.typeUttak !== 'fullt'
                      && (
                      <div className={styles.arrowBox} style={inlineStyle.arrowBox}>
                        {nyPeriode.typeUttak === 'gradert' && (
                        <div>
                          <div>
                            <SelectField
                              label={{ id: 'UttakInfoPanel.Aktivitet' }}
                              bredde="xl"
                              name="arbeidsForhold"
                              validate={[requiredIfNotPristine, required]}
                              selectValues={mapArbeidsforhold(arbeidsforhold)}
                            />
                          </div>
                          <FlexRow>
                            <FlexColumn>
                              <DecimalField
                                name="arbeidstidprosent"
                                label={{ id: 'UttakInfoPanel.AndelIArbeid' }}
                                bredde="XS"
                                validate={[required, maxValue100, hasValidDecimal]}
                                normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
                                inputClassName={styles.textAlignRight}
                              />
                            </FlexColumn>
                            <FlexColumn className={styles.suffix}>%</FlexColumn>
                          </FlexRow>

                        </div>
                        )}

                        {nyPeriode.typeUttak === 'utsettelse' && (
                        <SelectField
                          label={{ id: 'UttakInfoPanel.ArsakUtsettelse' }}
                          bredde="xl"
                          name="periodeArsak"
                          selectValues={mapUtsettelseÅrsaker(utsettelseÅrsaker)}
                          validate={[required]}
                        />
                        )}
                      </div>
                      )}
                  </FlexColumn>
                </FlexRow>
                <FlexRow>
                  <FlexColumn>
                    <div className={styles.textAreaStyle}>
                      <TextAreaField
                        name="begrunnelse"
                        label={{ id: 'UttakInfoPanel.BegrunnEndringene' }}
                        validate={[required, minLength3, maxLength4000, hasValidText]}
                        maxLength={4000}
                      />
                    </div>
                  </FlexColumn>
                </FlexRow>
              </FlexContainer>
              <div>
                <VerticalSpacer twentyPx />
                <Hovedknapp
                  className={styles.oppdaterMargin}
                  htmlType="button"
                  mini
                  onClick={formProps.handleSubmit}
                >
                  <FormattedMessage id="UttakInfoPanel.Oppdater" />
                </Hovedknapp>
                <Knapp
                  htmlType="button"
                  mini
                  onClick={newPeriodeResetCallback}
                >
                  <FormattedMessage id="UttakInfoPanel.Avbryt" />
                </Knapp>
              </div>
            </div>
          </div>
        </Column>
      </Row>
    </div>
  );
};

UttakNyPeriode.propTypes = {
  newPeriodeCallback: PropTypes.func.isRequired,
  newPeriodeResetCallback: PropTypes.func.isRequired,
  periodeTyper: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  utsettelseÅrsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  overføringÅrsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  arbeidsforhold: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  nyPeriode: PropTypes.shape().isRequired,
  sokerKjonn: PropTypes.string.isRequired,
  nyPeriodeDisabledDaysFom: PropTypes.string.isRequired,
};

const transformValues = (values, periodeTyper, utsettelseÅrsaker, overføringÅrsaker) => {
  const getPeriodeData = (periode, periodeArray) => periodeArray
    .filter(({ kode }) => kode === periode);

  const periodeObjekt = getPeriodeData(values.periodeType, periodeTyper)[0];
  const utsettelseÅrsakObjekt = getPeriodeData(values.periodeArsak, utsettelseÅrsaker)[0];
  const overføringÅrsakObjekt = getPeriodeData(values.periodeOverforingArsak, overføringÅrsaker)[0];

  const utsettelseÅrsak = utsettelseÅrsakObjekt !== undefined ? {
    kode: utsettelseÅrsakObjekt.kode,
    kodeverk: utsettelseÅrsakObjekt.kodeverk,
    navn: utsettelseÅrsakObjekt.navn,
  } : {
    kode: utsettelseArsakCodes.UDEFINERT,
  };
  const overføringÅrsak = overføringÅrsakObjekt !== undefined ? {
    kode: overføringÅrsakObjekt.kode,
    kodeverk: overføringÅrsakObjekt.kodeverk,
    navn: overføringÅrsakObjekt.navn,
  } : {
    kode: overforingArsak.UDEFINERT,
  };
  const arbeidsForhold = values.arbeidsForhold ? values.arbeidsForhold.split('|') : null;
  return {
    id: guid(),
    arbeidstidsprosent: values.arbeidstidprosent ? +values.arbeidstidprosent : null,
    bekreftet: true, // TODO sette false hvis det vil bli et avvik
    updated: false,
    openForm: false,
    samtidigUttak: values.samtidigUttak,
    flerBarnsDager: values.flerBarnsDager,
    orgnr: arbeidsForhold && arbeidsForhold[0] !== '-' ? arbeidsForhold[0] : undefined,
    erArbeidstaker: arbeidsForhold && arbeidsForhold[0] !== '-',
    virksomhetNavn: arbeidsForhold && arbeidsForhold[1] ? arbeidsForhold[1] : undefined,
    fom: values.fom,
    tom: values.tom,
    isFromSøknad: false,
    saksebehandlersBegrunnelse: values.begrunnelse,
    uttakPeriodeType: {
      kode: periodeObjekt.kode,
      kodeverk: periodeObjekt.kodeverk,
      navn: periodeObjekt.navn,
    },
    utsettelseÅrsak,
    overføringÅrsak,
  };
};

const validateNyPeriodeForm = (values) => {
  const errors = {};

  const invalid = required(values.fom) || hasValidPeriod(values.fom, values.tom);

  if (invalid) {
    errors.fom = invalid;
  }

  return errors;
};


const mapStateToProps = (state, ownProps) => {
  const periodeTyper = getKodeverk(kodeverkTyper.UTTAK_PERIODE_TYPE)(state);
  const utsettelseÅrsaker = getKodeverk(kodeverkTyper.UTSETTELSE_ARSAK)(state);
  const overføringÅrsaker = getKodeverk(kodeverkTyper.OVERFOERING_AARSAK_TYPE)(state);
  const personopplysninger = getPersonopplysning(state);
  const arbeidsforhold = getAlleAndelerIForstePeriode(state);

  return {
    periodeTyper,
    utsettelseÅrsaker,
    overføringÅrsaker,
    arbeidsforhold,
    sokerKjonn: personopplysninger.navBrukerKjonn.kode,
    initialValues: {
      fom: null,
      tom: null,
      periodeType: null,
      periodeOverforingArsak: null,
      periodeArsak: null,
      arbeidsForhold: null,
      arbeidstidprosent: null,
      typeUttak: null,
    },
    nyPeriode: behandlingFormValueSelector('nyPeriodeForm')(
      state,
      'fom',
      'tom',
      'periodeType',
      'periodeOverforingArsak',
      'periodeArsak',
      'arbeidsForhold',
      'arbeidstidprosent',
      'typeUttak',
    ),

    onSubmit: values => ownProps.newPeriodeCallback(transformValues(values, periodeTyper, utsettelseÅrsaker, overføringÅrsaker)),
  };
};

export default connect(mapStateToProps)(behandlingForm({
  form: 'nyPeriodeForm',
  validate: values => validateNyPeriodeForm(values),
  enableReinitialize: true,
})(UttakNyPeriode));
