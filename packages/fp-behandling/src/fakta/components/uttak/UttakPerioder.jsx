import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  FieldArray,
  change as reduxFormChange,
  reset as reduxFormReset,
  getFormInitialValues,
} from 'redux-form';
import { getRettigheter } from 'navAnsatt/duck';
import { FormattedMessage } from 'react-intl';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { CheckboxField } from '@fpsak-frontend/form';
import { Element } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { getBehandlingFormPrefix, behandlingFormValueSelector } from 'behandlingFpsak/src/behandlingForm';
import {
  getInntektsmeldinger, getBehandlingVersjon,
} from 'behandlingFpsak/src/behandlingSelectors';
import uttakPeriodeVurdering from '@fpsak-frontend/kodeverk/src/uttakPeriodeVurdering';
import { getSelectedBehandlingId, getKodeverk } from 'behandlingFpsak/src/duck';
import {
  ariaCheck, DDMMYYYY_DATE_FORMAT,
} from '@fpsak-frontend/utils';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { uttakPeriodeNavn } from '@fpsak-frontend/kodeverk/src/uttakPeriodeType';
import {
  VerticalSpacer, AksjonspunktHelpText, FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';
import UttakPeriode from './UttakPeriode';
import UttakNyPeriode from './UttakNyPeriode';
import UttakSlettPeriodeModal from './UttakSlettPeriodeModal';

const createNewPerioder = (perioder, id, values) => {
  const updatedIndex = perioder.findIndex(p => p.id === id);
  const updatedPeriode = perioder.find(p => p.id === id);

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
  const søknadFomBetween = moment(soknadsPeriode.fom)
    .isBetween(moment(innmldPeriode.fom), moment(innmldPeriode.tom), null, '[]');
  const søknadTomBetween = moment(soknadsPeriode.tom)
    .isBetween(moment(innmldPeriode.fom), moment(innmldPeriode.tom), null, '[]');
  const inntekstmeldingFomBetween = moment(innmldPeriode.fom)
    .isBetween(moment(soknadsPeriode.fom), moment(soknadsPeriode.tom), null, '[]');
  const inntekstmeldingTomBetween = moment(innmldPeriode.tom)
    .isBetween(moment(soknadsPeriode.fom), moment(soknadsPeriode.tom), null, '[]');

  return (søknadFomBetween && søknadTomBetween) || inntekstmeldingFomBetween || inntekstmeldingTomBetween;
};

const findRelevantInntektsmeldingInfo = (inntektsmeldinger, soknadsPeriode) => inntektsmeldinger.map((inntektsmelding) => {
  const { graderingPerioder, utsettelsePerioder } = inntektsmelding;
  const gjeldeneGraderingPerioder = graderingPerioder.filter(graderingPeriode => overlappingDates(inntektsmelding, graderingPeriode, soknadsPeriode));
  const gjeldeneUtsettelsePerioder = utsettelsePerioder.filter(utsettelsePeriode => overlappingDates(inntektsmelding, utsettelsePeriode, soknadsPeriode));
  const inntektsmeldingInfoPerioder = gjeldeneGraderingPerioder.concat(gjeldeneUtsettelsePerioder);

  const isArbeidstaker = (soknadsPeriode.arbeidsgiver || {}).virksomhet;
  const isAvvikPeriode = inntektsmeldingInfoPerioder.some(periode => periode.fom !== soknadsPeriode.fom || periode.tom !== soknadsPeriode.tom);
  const isAvvikArbeidsprosent = gjeldeneGraderingPerioder
    .some(graderingPeriode => parseFloat(graderingPeriode.arbeidsprosent).toFixed(2) !== parseFloat(soknadsPeriode.arbeidstidsprosent).toFixed(2));
  const isAvvikUtsettelse = gjeldeneUtsettelsePerioder
    .some(utsettelsePeriode => utsettelsePeriode.utsettelseArsak.kode !== soknadsPeriode.utsettelseÅrsak.kode);

  let isManglendeInntektsmelding = false;
  if ((isArbeidstaker && gjeldeneGraderingPerioder.length === 0 && soknadsPeriode.arbeidstidsprosent !== null)
  || (gjeldeneUtsettelsePerioder.length === 0 && soknadsPeriode.utsettelseÅrsak.kode !== '-')) {
    isManglendeInntektsmelding = true;
  }

  return {
    ...inntektsmelding,
    arbeidsProsentFraInntektsmelding: gjeldeneGraderingPerioder.reduce((acc, periode) => parseFloat(acc) + parseFloat(periode.arbeidsprosent, 10), 0),
    graderingPerioder: isAvvikArbeidsprosent || isAvvikPeriode ? gjeldeneGraderingPerioder : [],
    utsettelsePerioder: isAvvikUtsettelse || isAvvikPeriode ? gjeldeneUtsettelsePerioder : [],
    isManglendeInntektsmelding,
    avvik: {
      utsettelseÅrsak: isManglendeInntektsmelding && soknadsPeriode.utsettelseÅrsak.kode !== '-' ? soknadsPeriode.utsettelseÅrsak : false,
      isAvvikArbeidsprosent,
      isAvvikUtsettelse,
      isAvvikPeriode,
    },
  };
});

const updateInntektsmeldingInfo = (inntektsmeldinger, inntektsmeldingInfo, updatedIndex, periode) => ([
  ...inntektsmeldingInfo.slice(0, updatedIndex),
  findRelevantInntektsmeldingInfo(inntektsmeldinger, periode),
  ...inntektsmeldingInfo.slice(updatedIndex + 1),
]);

export class UttakPerioder extends Component {
  constructor(props) {
    super(props);

    const { inntektsmeldinger, perioder } = props;

    this.state = {
      isNyPeriodeFormOpen: false,
      showModalSlettPeriode: false,
      periodeSlett: {},
      inntektsmeldingInfo: perioder.map(periode => findRelevantInntektsmeldingInfo(inntektsmeldinger, periode)),
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
      this.nyPeriodeFormRef.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  }

  overrideResultat = (resultat) => {
    if (
      [uttakPeriodeVurdering.PERIODE_KAN_IKKE_AVKLARES,
        uttakPeriodeVurdering.PERIODE_OK,
      ].some(type => type === resultat)
    ) {
      return resultat;
    }
    return uttakPeriodeVurdering.PERIODE_IKKE_VURDERT;
  }

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
      inntektsmeldingInfo: newPerioder.map(periode => findRelevantInntektsmeldingInfo(inntektsmeldinger, periode)),
    });
  }

  openSlettPeriodeModalCallback(id) {
    const { showModalSlettPeriode } = this.state;
    const { perioder } = this.props;
    const periodeSlett = perioder.filter(periode => periode.id === id);
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
      behandlingFormPrefix, perioder, inntektsmeldinger, slettedePerioder, initialValues, reduxFormChange: formChange,
    } = this.props;
    const { periodeSlett } = this.state;

    const hasOriginalPeriode = initialValues.perioder.find(p => p.id === periodeSlett.id);

    if (hasOriginalPeriode) {
      formChange(
        `${behandlingFormPrefix}.UttakFaktaForm`,
        'slettedePerioder',
        slettedePerioder.concat([{
          ...periodeSlett,
          begrunnelse: values.begrunnelse,
        }]),
      );
    }

    const newPerioder = perioder.filter(periode => periode.id !== periodeSlett.id);

    formChange(`${behandlingFormPrefix}.UttakFaktaForm`, 'perioder', newPerioder);

    this.setState({
      inntektsmeldingInfo: newPerioder.map(periode => findRelevantInntektsmeldingInfo(inntektsmeldinger, periode)),
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
      `${behandlingFormPrefix}.UttakFaktaForm`, 'perioder',
      perioder.map((periode) => {
        if (periode.id === id) {
          return {
            ...periode,
            begrunnelse: undefined,
            resultat: undefined,
          };
        }
        return { ...periode };
      }).sort((a, b) => a.fom.localeCompare(b.fom)),
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

  updatePeriode(values) {
    const {
      behandlingFormPrefix, perioder, inntektsmeldinger, uttakPeriodeVurderingTyper, reduxFormChange: formChange,
    } = this.props;
    const { inntektsmeldingInfo } = this.state;
    const {
      resultat, dokumentertePerioder, id, kontoType, nyFom, nyTom, nyArbeidstidsprosent, oppholdArsak,
    } = values;
    const updatedPeriode = perioder.find(p => p.id === id);
    const updatedPeriodeIndex = perioder.findIndex(p => p.id === id);
    const tom = nyTom || updatedPeriode.tom;
    const fom = nyFom || updatedPeriode.fom;
    const newPeriodeObject = {
      id,
      tom,
      fom,
      kontoType,
      resultat: uttakPeriodeVurderingTyper.find(type => type.kode === this.overrideResultat(resultat)),
      begrunnelse: values.begrunnelse,
      dokumentertePerioder: resultat && resultat !== uttakPeriodeVurdering.PERIODE_KAN_IKKE_AVKLARES ? dokumentertePerioder : null,
      arbeidstidsprosent: nyArbeidstidsprosent || updatedPeriode.arbeidstidprosent,
      openForm: !updatedPeriode.openForm,
      utsettelseÅrsak: updatedPeriode.utsettelseÅrsak,
      overføringÅrsak: updatedPeriode.overføringÅrsak,
      erArbeidstaker: updatedPeriode.erArbeidstaker,
      samtidigUttak: updatedPeriode.samtidigUttak,
      samtidigUttaksprosent: updatedPeriode.samtidigUttaksprosent,
      flerBarnsDager: updatedPeriode.flerBarnsDager,
      morsAktivitet: updatedPeriode.morsAktivitet,
      arbeidsgiver: updatedPeriode.arbeidsgiver,
      isFromSøknad: updatedPeriode.isFromSøknad,
      updated: true,
      bekreftet: updatedPeriode.bekreftet,
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
        navn: updatedPeriode.oppholdÅrsak.navn,
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

    const newPerioder = createNewPerioder(perioder, id, newPeriodeObject);

    formChange(`${behandlingFormPrefix}.UttakFaktaForm`, 'perioder', newPerioder.sort((a, b) => a.fom.localeCompare(b.fom)));
  }

  isAnyFormOpen() {
    const { perioder } = this.props;

    return perioder.some(p => p.openForm);
  }

  addNewPeriod() {
    this.newPeriodeResetCallback();
  }

  disableButtons() {
    const {
      readOnly, openForms, isManuellOverstyring,
    } = this.props;
    const { isNyPeriodeFormOpen } = this.state;


    if (openForms || isNyPeriodeFormOpen) {
      return true;
    }

    if (isManuellOverstyring) {
      return false;
    }

    if (readOnly) {
      return true;
    }

    return false;
  }

  render() {
    const {
      readOnly,
      inntektsmeldinger,
      perioder,
      aksjonspunkter,
      førsteUttaksDato,
      submitting,
      hasOpenAksjonspunkter,
      kanOverstyre,
      hasRevurderingOvertyringAp,
      isManuellOverstyring,
    } = this.props;
    const {
      periodeSlett, isNyPeriodeFormOpen, inntektsmeldingInfo, showModalSlettPeriode,
    } = this.state;
    const nyPeriodeDisabledDaysFom = førsteUttaksDato || (perioder[0] || []).fom;
    return (
      <React.Fragment>
        {!readOnly && (
        <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>
          {aksjonspunkter.map((ap) => {
            const førsteUttak = {
              value: moment(førsteUttaksDato).format(DDMMYYYY_DATE_FORMAT),
            };
            return (
              <FormattedMessage
                key={`UttakInfoPanel.Aksjonspunkt.${ap.definisjon.kode}`}
                id={`UttakInfoPanel.Aksjonspunkt.${ap.definisjon.kode}`}
                values={førsteUttak}
              />
            );
          })}
        </AksjonspunktHelpText>
        )
        }
        <VerticalSpacer twentyPx />

        <FlexContainer>
          <FlexRow>
            <FlexColumn>
              <Element><FormattedMessage id="UttakInfoPanel.SoknadsPeriode" /></Element>
            </FlexColumn>
            {kanOverstyre
                && (
                <FlexColumn className="justifyItemsToFlexEnd">
                  <CheckboxField
                    name="manuellOverstyring"
                    label={{ id: 'UttakInfoPanel.ManuellOverstyring' }}
                    readOnly={!readOnly || hasRevurderingOvertyringAp || !kanOverstyre}
                    onClick={() => this.manuellOverstyringResetCallback()}
                  />
                </FlexColumn>
                )
                }
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
          førsteUttaksDato={førsteUttaksDato}
        />
        <VerticalSpacer twentyPx />
        <FlexContainer fluid wrap>
          <FlexRow>
            <FlexColumn>
              <Hovedknapp
                mini
                disabled={this.disableButtons()}
                onClick={ariaCheck}
                spinner={submitting}
              >
                <FormattedMessage id="UttakInfoPanel.BekreftOgFortsett" />
              </Hovedknapp>
            </FlexColumn>
            <FlexColumn>
              <Knapp
                mini
                htmlType="button"
                onClick={this.addNewPeriod}
                disabled={this.disableButtons()}
              >
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
          />
        </div>
        )}
        <UttakSlettPeriodeModal
          showModal={showModalSlettPeriode}
          periode={periodeSlett}
          cancelEvent={this.hideModal}
          closeEvent={this.removePeriode}
        />

      </React.Fragment>

    );
  }
}

UttakPerioder.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  inntektsmeldinger: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  openForms: PropTypes.bool.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormReset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  slettedePerioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  initialValues: PropTypes.shape().isRequired,
  uttakPeriodeVurderingTyper: PropTypes.arrayOf(
    PropTypes.shape({
      kode: PropTypes.string,
      name: PropTypes.string,
    }),
  ).isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  førsteUttaksDato: PropTypes.string,
  isManuellOverstyring: PropTypes.bool,
  hasRevurderingOvertyringAp: PropTypes.bool.isRequired,
  kanOverstyre: PropTypes.bool.isRequired,
};

UttakPerioder.defaultProps = {
  førsteUttaksDato: undefined,
  isManuellOverstyring: false,
};

const førsteUttaksDato = state => behandlingFormValueSelector('UttakFaktaForm')(state, 'førsteUttaksDato') || undefined;
const slettedePerioder = state => behandlingFormValueSelector('UttakFaktaForm')(state, 'slettedePerioder') || [];
const perioder = state => behandlingFormValueSelector('UttakFaktaForm')(state, 'perioder') || [];
const manuellOverstyring = state => behandlingFormValueSelector('UttakFaktaForm')(state, 'manuellOverstyring') || false;

const mapStateToProps = (state) => {
  const behandlingFormPrefix = getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state));

  return {
    behandlingFormPrefix,
    isManuellOverstyring: manuellOverstyring(state),
    kanOverstyre: getRettigheter(state).kanOverstyreAccess.isEnabled,
    openForms: !!perioder(state).find(periode => periode.openForm === true),
    førsteUttaksDato: førsteUttaksDato(state),
    uttakPeriodeVurderingTyper: getKodeverk(kodeverkTyper.UTTAK_PERIODE_VURDERING_TYPE)(state),
    inntektsmeldinger: getInntektsmeldinger(state),
    initialValues: getFormInitialValues(`${behandlingFormPrefix}.UttakFaktaForm`)(state),
    slettedePerioder: slettedePerioder(state),
    perioder: perioder(state),
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormReset,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UttakPerioder);
