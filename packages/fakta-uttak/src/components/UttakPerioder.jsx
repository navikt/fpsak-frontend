import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  change as reduxFormChange, FieldArray, getFormInitialValues, reset as reduxFormReset,
} from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Element } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import { getBehandlingFormPrefix, behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';
import { CheckboxField } from '@fpsak-frontend/form';
import uttakPeriodeVurdering from '@fpsak-frontend/kodeverk/src/uttakPeriodeVurdering';
import { ariaCheck, DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { uttakPeriodeNavn } from '@fpsak-frontend/kodeverk/src/uttakPeriodeType';
import {
  AksjonspunktHelpText,
  FlexColumn,
  FlexContainer,
  FlexRow,
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';

import UttakPeriode from './UttakPeriode';
import UttakNyPeriode from './UttakNyPeriode';
import UttakSlettPeriodeModal from './UttakSlettPeriodeModal';

const createNewPerioder = (perioder, id, values) => {
  const updatedIndex = perioder.findIndex((p) => p.id === id);
  const updatedPeriode = perioder.find((p) => p.id === id);

  return [
    ...perioder.slice(0, updatedIndex),
    {
      ...updatedPeriode,
      ...values,
    },
    ...perioder.slice(updatedIndex + 1),
  ];
};

const overlappingDates = (inntektsmelding, innmldPeriode, soknadsPeriode) => {
  const søknadFomBetween = moment(soknadsPeriode.fom).isBetween(
    moment(innmldPeriode.fom),
    moment(innmldPeriode.tom),
    null,
    '[]',
  );
  const søknadTomBetween = moment(soknadsPeriode.tom).isBetween(
    moment(innmldPeriode.fom),
    moment(innmldPeriode.tom),
    null,
    '[]',
  );
  const inntekstmeldingFomBetween = moment(innmldPeriode.fom).isBetween(
    moment(soknadsPeriode.fom),
    moment(soknadsPeriode.tom),
    null,
    '[]',
  );
  const inntekstmeldingTomBetween = moment(innmldPeriode.tom).isBetween(
    moment(soknadsPeriode.fom),
    moment(soknadsPeriode.tom),
    null,
    '[]',
  );

  return (søknadFomBetween && søknadTomBetween) || inntekstmeldingFomBetween || inntekstmeldingTomBetween;
};

const findRelevantInntektsmeldingInfo = (inntektsmeldinger, soknadsPeriode) => {
  const relevant = inntektsmeldinger.map((inntektsmelding) => {
    const { graderingPerioder, utsettelsePerioder } = inntektsmelding;
    const gjeldeneGraderingPerioder = graderingPerioder.filter((graderingPeriode) => overlappingDates(inntektsmelding, graderingPeriode, soknadsPeriode));
    const gjeldeneUtsettelsePerioder = utsettelsePerioder.filter((utsettelsePeriode) => overlappingDates(inntektsmelding, utsettelsePeriode, soknadsPeriode));
    const inntektsmeldingInfoPerioder = gjeldeneGraderingPerioder.concat(gjeldeneUtsettelsePerioder);

    const isArbeidstaker = (soknadsPeriode.arbeidsgiver || {}).virksomhet;
    const isAvvikPeriode = inntektsmeldingInfoPerioder.some(
      (periode) => periode.fom !== soknadsPeriode.fom || periode.tom !== soknadsPeriode.tom,
    );
    const isAvvikArbeidsgiver = soknadsPeriode.utsettelseÅrsak.kode === '-'
      && inntektsmelding.arbeidsgiverOrgnr !== (soknadsPeriode.arbeidsgiver || {}).identifikator;
    const isAvvikArbeidsprosent = gjeldeneGraderingPerioder.some(
      (graderingPeriode) => parseFloat(graderingPeriode.arbeidsprosent).toFixed(2)
        !== parseFloat(soknadsPeriode.arbeidstidsprosent).toFixed(2),
    );
    const isAvvikUtsettelse = gjeldeneUtsettelsePerioder.some(
      (utsettelsePeriode) => utsettelsePeriode.utsettelseArsak.kode !== soknadsPeriode.utsettelseÅrsak.kode,
    );

    // hvis utsettelse er det ingen behov for arbeidsgiver
    const isManglendeSøktGraderingEllerUtsettelse = !!(isAvvikArbeidsgiver && !isAvvikPeriode);

    let isManglendeInntektsmelding = false;
    if (
      (isArbeidstaker && gjeldeneGraderingPerioder.length === 0 && soknadsPeriode.arbeidstidsprosent !== null)
      || (gjeldeneUtsettelsePerioder.length === 0 && soknadsPeriode.utsettelseÅrsak.kode !== '-')
    ) {
      isManglendeInntektsmelding = true;
    }

    return {
      ...inntektsmelding,
      arbeidsProsentFraInntektsmelding: gjeldeneGraderingPerioder.reduce(
        (acc, periode) => parseFloat(acc) + parseFloat(periode.arbeidsprosent, 10),
        0,
      ),
      graderingPerioder:
        isAvvikArbeidsprosent || isAvvikPeriode || isAvvikArbeidsgiver ? gjeldeneGraderingPerioder : [],
      utsettelsePerioder: isAvvikUtsettelse || isAvvikPeriode ? gjeldeneUtsettelsePerioder : [],
      isManglendeInntektsmelding,
      isManglendeSøktGraderingEllerUtsettelse,
      avvik: {
        utsettelseÅrsak:
          isManglendeInntektsmelding && soknadsPeriode.utsettelseÅrsak.kode !== '-'
            ? soknadsPeriode.utsettelseÅrsak
            : false,
        isAvvikArbeidsprosent,
        isAvvikArbeidsgiver,
        isAvvikUtsettelse,
        isAvvikPeriode,
      },
    };
  });

  const gyldigeInntektsmeldinger = relevant.filter(
    (inntektsmelding) => (!inntektsmelding.isManglendeInntektsmelding && !inntektsmelding.isManglendeSøktGraderingEllerUtsettelse)
      || (!inntektsmelding.isManglendeInntektsmelding && inntektsmelding.isManglendeSøktGraderingEllerUtsettelse)
      || (inntektsmelding.isManglendeInntektsmelding && !inntektsmelding.isManglendeSøktGraderingEllerUtsettelse),
  );
  if (gyldigeInntektsmeldinger.length) {
    return gyldigeInntektsmeldinger;
  }
  return relevant;
};

export const findFamiliehendelseDato = (gjeldendeFamiliehendelse) => {
  const { termindato, avklartBarn } = gjeldendeFamiliehendelse;

  if (avklartBarn && avklartBarn.length > 0) {
    return avklartBarn[0].fodselsdato;
  }

  return termindato;
};

const updateInntektsmeldingInfo = (inntektsmeldinger, inntektsmeldingInfo, updatedIndex, periode) => [
  ...inntektsmeldingInfo.slice(0, updatedIndex),
  findRelevantInntektsmeldingInfo(inntektsmeldinger, periode),
  ...inntektsmeldingInfo.slice(updatedIndex + 1),
];

export class UttakPerioder extends PureComponent {
  constructor(props) {
    super(props);

    const { inntektsmeldinger, perioder } = props;

    this.state = {
      isNyPeriodeFormOpen: false,
      showModalSlettPeriode: false,
      periodeSlett: {},
      inntektsmeldingInfo: perioder.map((periode) => findRelevantInntektsmeldingInfo(inntektsmeldinger, periode)),
    };

    this.newPeriodeCallback = this.newPeriodeCallback.bind(this);
    this.addNewPeriod = this.addNewPeriod.bind(this);
    this.openSlettPeriodeModalCallback = this.openSlettPeriodeModalCallback.bind(this);
    this.newPeriodeResetCallback = this.newPeriodeResetCallback.bind(this);
    this.removePeriode = this.removePeriode.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.cleaningUpForm = this.cleaningUpForm.bind(this);
    this.updatePeriode = this.updatePeriode.bind(this);
    this.editPeriode = this.editPeriode.bind(this);
    this.cancelEditPeriode = this.cancelEditPeriode.bind(this);
    this.isAnyFormOpen = this.isAnyFormOpen.bind(this);
    this.setNyPeriodeFormRef = this.setNyPeriodeFormRef.bind(this);
  }

  setNyPeriodeFormRef(element) {
    if (element) {
      this.nyPeriodeFormRef = element;
      this.nyPeriodeFormRef.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }

  overrideResultat = (resultat) => {
    if (
      [uttakPeriodeVurdering.PERIODE_KAN_IKKE_AVKLARES, uttakPeriodeVurdering.PERIODE_OK].some(
        (type) => type === resultat,
      )
    ) {
      return resultat;
    }
    return uttakPeriodeVurdering.PERIODE_IKKE_VURDERT;
  };

  newPeriodeResetCallback() {
    const { behandlingFormPrefix, reduxFormReset: formReset } = this.props;
    const { isNyPeriodeFormOpen } = this.state;
    formReset(`${behandlingFormPrefix}.nyPeriodeForm`);
    this.setState({ isNyPeriodeFormOpen: !isNyPeriodeFormOpen });
  }

  newPeriodeCallback(nyPeriode) {
    const {
      behandlingFormPrefix, perioder, inntektsmeldinger, reduxFormChange: formChange,
    } = this.props;
    const { isNyPeriodeFormOpen } = this.state;

    const newPerioder = perioder.concat(nyPeriode).sort((a, b) => a.fom.localeCompare(b.fom));

    formChange(`${behandlingFormPrefix}.UttakFaktaForm`, 'perioder', newPerioder);

    this.setState({
      isNyPeriodeFormOpen: !isNyPeriodeFormOpen,
      inntektsmeldingInfo: newPerioder.map((periode) => findRelevantInntektsmeldingInfo(inntektsmeldinger, periode)),
    });
  }

  openSlettPeriodeModalCallback(id) {
    const { showModalSlettPeriode } = this.state;
    const { perioder } = this.props;
    const periodeSlett = perioder.filter((periode) => periode.id === id);
    this.setState({
      showModalSlettPeriode: !showModalSlettPeriode,
      periodeSlett: periodeSlett[0],
    });
  }

  manuellOverstyringResetCallback() {
    const { behandlingFormPrefix, reduxFormReset: formReset } = this.props;
    formReset(`${behandlingFormPrefix}.UttakFaktaForm`);
  }

  removePeriode(values) {
    const {
      behandlingFormPrefix,
      perioder,
      inntektsmeldinger,
      slettedePerioder,
      initialValues,
      reduxFormChange: formChange,
    } = this.props;
    const { periodeSlett } = this.state;

    const hasOriginalPeriode = initialValues.perioder.find((p) => p.id === periodeSlett.id);

    if (hasOriginalPeriode) {
      formChange(
        `${behandlingFormPrefix}.UttakFaktaForm`,
        'slettedePerioder',
        slettedePerioder.concat([
          {
            ...periodeSlett,
            begrunnelse: values.begrunnelse,
          },
        ]),
      );
    }

    const newPerioder = perioder.filter((periode) => periode.id !== periodeSlett.id);

    formChange(`${behandlingFormPrefix}.UttakFaktaForm`, 'perioder', newPerioder);

    this.setState({
      inntektsmeldingInfo: newPerioder.map((periode) => findRelevantInntektsmeldingInfo(inntektsmeldinger, periode)),
    });

    this.hideModal();
  }

  hideModal() {
    this.setState({
      showModalSlettPeriode: false,
    });
  }

  cleaningUpForm(id) {
    const { behandlingFormPrefix, perioder, reduxFormChange: formChange } = this.props;

    formChange(
      `${behandlingFormPrefix}.UttakFaktaForm`,
      'perioder',
      perioder
        .map((periode) => {
          if (periode.id === id) {
            return {
              ...periode,
              begrunnelse: undefined,
              resultat: undefined,
            };
          }
          return { ...periode };
        })
        .sort((a, b) => a.fom.localeCompare(b.fom)),
    );
  }

  editPeriode(id) {
    const { perioder, behandlingFormPrefix, reduxFormChange: formChange } = this.props;

    const newPerioder = createNewPerioder(perioder, id, { openForm: true });

    formChange(`${behandlingFormPrefix}.UttakFaktaForm`, 'perioder', newPerioder);
  }

  cancelEditPeriode(id) {
    const { perioder, behandlingFormPrefix, reduxFormChange: formChange } = this.props;

    const newPerioder = createNewPerioder(perioder, id, { openForm: false });

    formChange(`${behandlingFormPrefix}.UttakFaktaForm`, 'perioder', newPerioder);
  }

  async updatePeriode(values) {
    const {
      behandlingFormPrefix,
      perioder,
      inntektsmeldinger,
      uttakPeriodeVurderingTyper,
      reduxFormChange: formChange,
      getKodeverknavn,
    } = this.props;
    const { inntektsmeldingInfo } = this.state;
    const {
      resultat, dokumentertePerioder, id, kontoType, nyFom, nyTom, nyArbeidstidsprosent, oppholdArsak,
    } = values;
    const updatedPeriode = perioder.find((p) => p.id === id);
    const updatedPeriodeIndex = perioder.findIndex((p) => p.id === id);
    const tom = nyTom || updatedPeriode.tom;
    const fom = nyFom || updatedPeriode.fom;
    const newPeriodeObject = {
      id,
      tom,
      fom,
      kontoType,
      resultat: uttakPeriodeVurderingTyper.find((type) => type.kode === this.overrideResultat(resultat)),
      begrunnelse: values.begrunnelse,
      dokumentertePerioder:
        resultat && resultat !== uttakPeriodeVurdering.PERIODE_KAN_IKKE_AVKLARES ? dokumentertePerioder : null,
      arbeidstidsprosent: nyArbeidstidsprosent || updatedPeriode.arbeidstidprosent,
      openForm: !updatedPeriode.openForm,
      utsettelseÅrsak: updatedPeriode.utsettelseÅrsak,
      overføringÅrsak: updatedPeriode.overføringÅrsak,
      erArbeidstaker: updatedPeriode.erArbeidstaker,
      erFrilanser: updatedPeriode.erFrilanser,
      erSelvstendig: updatedPeriode.erSelvstendig,
      samtidigUttak: updatedPeriode.samtidigUttak,
      samtidigUttaksprosent: updatedPeriode.samtidigUttaksprosent,
      flerBarnsDager: updatedPeriode.flerBarnsDager,
      morsAktivitet: updatedPeriode.morsAktivitet,
      arbeidsgiver: updatedPeriode.arbeidsgiver,
      isFromSøknad: updatedPeriode.isFromSøknad,
      updated: true,
      bekreftet: updatedPeriode.bekreftet,
      originalResultat: updatedPeriode.resultat,
    };

    if (kontoType) {
      newPeriodeObject.uttakPeriodeType = {
        kode: kontoType,
        navn: uttakPeriodeNavn[kontoType],
        kodeverk: 'UTTAK_PERIODE_TYPE',
      };
    }

    if (oppholdArsak) {
      newPeriodeObject.oppholdÅrsak = {
        kode: oppholdArsak,
        navn: getKodeverknavn(updatedPeriode.oppholdÅrsak),
        kodeverk: updatedPeriode.oppholdÅrsak.kodeverk,
      };
    }

    this.setState({
      inntektsmeldingInfo: updateInntektsmeldingInfo(
        inntektsmeldinger,
        inntektsmeldingInfo,
        updatedPeriodeIndex,
        newPeriodeObject,
      ),
    });

    const newPerioder = await createNewPerioder(perioder, id, newPeriodeObject);

    await formChange(
      `${behandlingFormPrefix}.UttakFaktaForm`,
      'perioder',
      newPerioder.sort((a, b) => a.fom.localeCompare(b.fom)),
    );
  }

  isAnyFormOpen() {
    const { perioder } = this.props;

    return perioder.some((p) => p.openForm);
  }

  addNewPeriod() {
    this.newPeriodeResetCallback();
  }

  disableButtons() {
    const {
      readOnly, openForms, isManuellOverstyring, submitting,
    } = this.props;
    const { isNyPeriodeFormOpen } = this.state;
    return submitting || openForms || isNyPeriodeFormOpen || (readOnly && !isManuellOverstyring);
  }

  render() {
    const {
      readOnly,
      inntektsmeldinger,
      perioder,
      aksjonspunkter,
      førsteUttaksdato,
      endringsdato,
      submitting,
      hasOpenAksjonspunkter,
      kanOverstyre,
      hasRevurderingOvertyringAp,
      isManuellOverstyring,
      uttakPeriodeVurderingTyper,
      getKodeverknavn,
      faktaArbeidsforhold,
      behandlingId,
      behandlingVersjon,
      behandlingStatus,
      personopplysninger,
      familiehendelse,
      alleKodeverk,
      vilkarForSykdomExists,
    } = this.props;
    const {
      periodeSlett, isNyPeriodeFormOpen, inntektsmeldingInfo, showModalSlettPeriode,
    } = this.state;
    const nyPeriodeDisabledDaysFom = førsteUttaksdato || (perioder[0] || []).fom;
    const sisteUttakdatoFørsteSeksUker = moment(findFamiliehendelseDato(familiehendelse.gjeldende)).add(6, 'weeks');
    const farSøkerFør6Uker = (perioder[0] || {}).uttakPeriodeType
      && (perioder[0] || {}).uttakPeriodeType.kode === 'FEDREKVOTE'
      && moment((perioder[0] || {}).fom).isBefore(sisteUttakdatoFørsteSeksUker);

    return (
      <>
        {!readOnly && (
          <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>
            {aksjonspunkter.map((ap) => {
              const førsteUttak = {
                value: moment(førsteUttaksdato).format(DDMMYYYY_DATE_FORMAT),
              };

              return (
                <FormattedMessage
                  key={`UttakInfoPanel.Aksjonspunkt.${ap.definisjon.kode}`}
                  id={`UttakInfoPanel.Aksjonspunkt.${ap.definisjon.kode}`}
                  values={førsteUttak}
                />
              );
            })}
            <VerticalSpacer eightPx />
            {farSøkerFør6Uker && <FormattedMessage id="UttakInfoPanel.Aksjonspunkt.FarSøkerFør6Uker" />}
          </AksjonspunktHelpText>
        )}
        <VerticalSpacer twentyPx />

        <FlexContainer>
          <FlexRow>
            <FlexColumn>
              <Element>
                <FormattedMessage id="UttakInfoPanel.SoknadsPeriode" />
              </Element>
            </FlexColumn>
            {kanOverstyre && (
              <FlexColumn className="justifyItemsToFlexEnd">
                <CheckboxField
                  name="faktaUttakManuellOverstyring"
                  label={{ id: 'UttakInfoPanel.ManuellOverstyring' }}
                  readOnly={!readOnly || hasRevurderingOvertyringAp || !kanOverstyre}
                  onClick={() => this.manuellOverstyringResetCallback()}
                />
              </FlexColumn>
            )}
          </FlexRow>
        </FlexContainer>

        <FieldArray
          name="perioder"
          component={UttakPeriode}
          openSlettPeriodeModalCallback={this.openSlettPeriodeModalCallback}
          updatePeriode={this.updatePeriode}
          editPeriode={this.editPeriode}
          cleaningUpForm={this.cleaningUpForm}
          cancelEditPeriode={this.cancelEditPeriode}
          isAnyFormOpen={this.isAnyFormOpen}
          isNyPeriodeFormOpen={isNyPeriodeFormOpen}
          perioder={perioder}
          readOnly={readOnly && !isManuellOverstyring}
          inntektsmeldingInfo={inntektsmeldingInfo}
          endringsdato={endringsdato}
          farSøkerFør6Uker={farSøkerFør6Uker}
          getKodeverknavn={getKodeverknavn}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          alleKodeverk={alleKodeverk}
          behandlingStatus={behandlingStatus}
          familiehendelse={familiehendelse}
          vilkarForSykdomExists={vilkarForSykdomExists}
          sisteUttakdatoFørsteSeksUker={sisteUttakdatoFørsteSeksUker}
        />
        <VerticalSpacer twentyPx />
        <FlexContainer fluid wrap>
          <FlexRow>
            <FlexColumn>
              <Hovedknapp mini disabled={this.disableButtons()} onClick={ariaCheck} spinner={submitting}>
                <FormattedMessage id="UttakInfoPanel.BekreftOgFortsett" />
              </Hovedknapp>
            </FlexColumn>
            <FlexColumn>
              <Knapp mini htmlType="button" onClick={this.addNewPeriod} disabled={this.disableButtons()}>
                <FormattedMessage id="UttakInfoPanel.LeggTilPeriode" />
              </Knapp>
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
        <VerticalSpacer eightPx />

        {isNyPeriodeFormOpen && (
          <div ref={this.setNyPeriodeFormRef}>
            <UttakNyPeriode
              newPeriodeCallback={this.newPeriodeCallback}
              newPeriodeResetCallback={this.newPeriodeResetCallback}
              inntektsmeldinger={inntektsmeldinger}
              nyPeriodeDisabledDaysFom={nyPeriodeDisabledDaysFom}
              uttakPeriodeVurderingTyper={uttakPeriodeVurderingTyper}
              getKodeverknavn={getKodeverknavn}
              faktaArbeidsforhold={faktaArbeidsforhold}
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              personopplysninger={personopplysninger}
              alleKodeverk={alleKodeverk}
            />
          </div>
        )}
        <UttakSlettPeriodeModal
          showModal={showModalSlettPeriode}
          periode={periodeSlett}
          cancelEvent={this.hideModal}
          closeEvent={this.removePeriode}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          getKodeverknavn={getKodeverknavn}
        />
      </>
    );
  }
}

UttakPerioder.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  inntektsmeldinger: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()),
  openForms: PropTypes.bool.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormReset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  initialValues: PropTypes.shape().isRequired,
  personopplysninger: PropTypes.shape().isRequired,
  uttakPeriodeVurderingTyper: PropTypes.arrayOf(
    PropTypes.shape({
      kode: PropTypes.string,
      name: PropTypes.string,
    }),
  ).isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  hasRevurderingOvertyringAp: PropTypes.bool.isRequired,
  kanOverstyre: PropTypes.bool.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
  faktaArbeidsforhold: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  behandlingStatus: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  familiehendelse: PropTypes.shape().isRequired,
  førsteUttaksdato: PropTypes.string,
  slettedePerioder: PropTypes.arrayOf(PropTypes.shape()),
  endringsdato: PropTypes.string,
  isManuellOverstyring: PropTypes.bool,
  vilkarForSykdomExists: PropTypes.bool,
};

UttakPerioder.defaultProps = {
  førsteUttaksdato: undefined,
  endringsdato: undefined,
  isManuellOverstyring: false,
  slettedePerioder: [],
  perioder: [],
};

const getFørsteUttaksdato = (state, behandlingId, behandlingVersjon) => behandlingFormValueSelector(
  'UttakFaktaForm', behandlingId, behandlingVersjon,
)(state, 'førsteUttaksdato') || undefined;
const getEndringsdato = (state, behandlingId, behandlingVersjon) => behandlingFormValueSelector(
  'UttakFaktaForm', behandlingId, behandlingVersjon,
)(state, 'endringsdato') || undefined;
const slettedePerioder = (state, behandlingId, behandlingVersjon) => behandlingFormValueSelector(
  'UttakFaktaForm', behandlingId, behandlingVersjon,
)(state, 'slettedePerioder');
const perioder = (state, behandlingId, behandlingVersjon) => behandlingFormValueSelector('UttakFaktaForm', behandlingId, behandlingVersjon)(state, 'perioder');
const manuellOverstyring = (state, behandlingId, behandlingVersjon) => behandlingFormValueSelector(
  'UttakFaktaForm',
  behandlingId,
  behandlingVersjon,
)(state, 'faktaUttakManuellOverstyring') || false;

const mapStateToProps = (state, props) => {
  const { behandlingId, behandlingVersjon, alleKodeverk } = props;
  const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);

  return {
    behandlingFormPrefix,
    isManuellOverstyring: manuellOverstyring(state, behandlingId, behandlingVersjon),
    openForms: !!perioder(state, behandlingId, behandlingVersjon).find((periode) => periode.openForm === true),
    førsteUttaksdato: getFørsteUttaksdato(state, behandlingId, behandlingVersjon),
    endringsdato: getEndringsdato(state, behandlingId, behandlingVersjon),
    uttakPeriodeVurderingTyper: alleKodeverk[kodeverkTyper.UTTAK_PERIODE_VURDERING_TYPE],
    inntektsmeldinger: [],
    initialValues: getFormInitialValues(`${behandlingFormPrefix}.UttakFaktaForm`)(state),
    slettedePerioder: slettedePerioder(state, behandlingId, behandlingVersjon),
    perioder: perioder(state, behandlingId, behandlingVersjon),
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      reduxFormChange,
      reduxFormReset,
    },
    dispatch,
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(UttakPerioder);
