import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  FieldArray,
  change as reduxFormChange,
  reset as reduxFormReset,
  getFormInitialValues,
} from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Element } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { getBehandlingFormPrefix, behandlingFormValueSelector } from 'behandling/behandlingForm';
import FlexColumn from 'sharedComponents/flexGrid/FlexColumn';
import FlexRow from 'sharedComponents/flexGrid/FlexRow';
import FlexContainer from 'sharedComponents/flexGrid/FlexContainer';
import { ariaCheck } from 'utils/validation/validators';
import { getInntektsmeldinger, getBehandlingVersjon } from 'behandling/behandlingSelectors';
import uttakPeriodeVurdering from 'kodeverk/uttakPeriodeVurdering';
import { getSelectedBehandlingId } from 'behandling/duck';
import { DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { uttakPeriodeNavn } from 'kodeverk/uttakPeriodeType';
import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
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

const overlappingDates = (innmldPeriode, soknadsPeriode) => {
  const søknadFomBetween = moment(soknadsPeriode.fom)
    .isBetween(moment(innmldPeriode.fom), moment(innmldPeriode.tom), null, '[]');
  const søknadTomBetween = moment(soknadsPeriode.tom)
    .isBetween(moment(innmldPeriode.fom), moment(innmldPeriode.tom), null, '[]');
  const inntekstmeldingFomBetween = moment(innmldPeriode.fom)
    .isBetween(moment(soknadsPeriode.fom), moment(soknadsPeriode.tom), null, '[]');
  const inntekstmeldingTomBetween = moment(innmldPeriode.tom)
    .isBetween(moment(soknadsPeriode.fom), moment(soknadsPeriode.tom), null, '[]');

  const isGradering = innmldPeriode.arbeidsprosent !== undefined && innmldPeriode.arbeidsprosent !== null;

  if (søknadFomBetween || søknadTomBetween) {
    if (isGradering) {
      return soknadsPeriode.arbeidstidsprosent !== innmldPeriode.arbeidsprosent;
    }

    return innmldPeriode.utsettelseArsak && (innmldPeriode.utsettelseArsak.kode !== soknadsPeriode.utsettelseÅrsak.kode);
  }

  return inntekstmeldingFomBetween || inntekstmeldingTomBetween;
};

const findRelevantInntektsmeldingInfo = (inntektsmeldinger, soknadsPeriode) => inntektsmeldinger.map((innmld) => {
  const { graderingPerioder, utsettelsePerioder } = innmld;

  return {
    ...innmld,
    arbeidsProsentFraInntektsmelding: graderingPerioder.reduce((acc, periode) => parseFloat(acc) + parseFloat(periode.arbeidsprosent, 10), 0),
    graderingPerioder: graderingPerioder.filter(grp => overlappingDates(grp, soknadsPeriode)),
    utsettelsePerioder: utsettelsePerioder.filter(utp => overlappingDates(utp, soknadsPeriode)),
  };
});

const updateInntektsmeldingInfo = (inntektsmeldinger, inntektsmeldingInfo, updatedIndex, periode) => ([
  ...inntektsmeldingInfo.slice(0, updatedIndex),
  findRelevantInntektsmeldingInfo(inntektsmeldinger, periode),
  ...inntektsmeldingInfo.slice(updatedIndex + 1),
]);

export class UttakFaktaForm extends Component {
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

    formChange(`${behandlingFormPrefix}.UttakInfoPanel`, 'perioder', newPerioder);

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

  removePeriode(values) {
    const {
      behandlingFormPrefix, perioder, inntektsmeldinger, slettedePerioder, initialValues, reduxFormChange: formChange,
    } = this.props;
    const { periodeSlett } = this.state;

    const hasOriginalPeriode = initialValues.perioder.find(p => p.id === periodeSlett.id);

    if (hasOriginalPeriode) {
      formChange(
        `${behandlingFormPrefix}.UttakInfoPanel`,
        'slettedePerioder',
        slettedePerioder.concat([{
          ...periodeSlett,
          begrunnelse: values.begrunnelse,
        }]),
      );
    }

    const newPerioder = perioder.filter(periode => periode.id !== periodeSlett.id);

    formChange(`${behandlingFormPrefix}.UttakInfoPanel`, 'perioder', newPerioder);

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
      `${behandlingFormPrefix}.UttakInfoPanel`, 'perioder',
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

    formChange(`${behandlingFormPrefix}.UttakInfoPanel`, 'perioder', newPerioder);
  }

  cancelEditPeriode(id) {
    const { perioder, behandlingFormPrefix, reduxFormChange: formChange } = this.props;

    const newPerioder = createNewPerioder(perioder, id, { openForm: false });

    formChange(`${behandlingFormPrefix}.UttakInfoPanel`, 'perioder', newPerioder);
  }

  updatePeriode(values) {
    const {
      behandlingFormPrefix, perioder, inntektsmeldinger, uttakPeriodeVurderingTyper, reduxFormChange: formChange,
    } = this.props;
    const { inntektsmeldingInfo } = this.state;
    const {
      resultat, dokumentertePerioder, id, kontoType, nyFom, nyTom, nyArbeidstidsprosent,
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
      resultat: uttakPeriodeVurderingTyper.find(type => type.kode === resultat),
      begrunnelse: values.begrunnelse,
      dokumentertePerioder: resultat && resultat !== uttakPeriodeVurdering.PERIODE_KAN_IKKE_AVKLARES ? dokumentertePerioder : null,
      arbeidstidsprosent: nyArbeidstidsprosent || updatedPeriode.arbeidstidprosent,
      openForm: !updatedPeriode.openForm,
      bekreftet: updatedPeriode.bekreftet,
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
    };
    if (kontoType) {
      newPeriodeObject.uttakPeriodeType = {
        kode: kontoType,
        navn: uttakPeriodeNavn[kontoType],
        kodeverk: 'UTTAK_PERIODE_TYPE',
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

    formChange(`${behandlingFormPrefix}.UttakInfoPanel`, 'perioder', newPerioder.sort((a, b) => a.fom.localeCompare(b.fom)));
  }

  isAnyFormOpen() {
    const { perioder } = this.props;

    return perioder.some(p => p.openForm);
  }

  addNewPeriod() {
    this.newPeriodeResetCallback();
  }

  render() {
    const {
      readOnly,
      hasOpenAksjonspunkter,
      inntektsmeldinger,
      disableButtons,
      perioder,
      aksjonspunkter,
      førsteUttaksDato,
      submitting,
    } = this.props;
    const {
      periodeSlett, isNyPeriodeFormOpen, inntektsmeldingInfo, showModalSlettPeriode,
    } = this.state;
    const nyPeriodeDisabledDaysFom = førsteUttaksDato || (perioder[0] || []).fom;
    return (
      <div>
        {!readOnly
        && (
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
        <Element><FormattedMessage id="UttakInfoPanel.SoknadsPeriode" /></Element>

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
          readOnly={readOnly}
          inntektsmeldingInfo={inntektsmeldingInfo}
          førsteUttaksDato={førsteUttaksDato}
        />
        <VerticalSpacer twentyPx />
        <FlexContainer fluid wrap>
          <FlexRow>
            <FlexColumn>
              <Hovedknapp
                mini
                disabled={disableButtons || readOnly || isNyPeriodeFormOpen}
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
                disabled={disableButtons || readOnly || isNyPeriodeFormOpen}
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
        )
        }
        <UttakSlettPeriodeModal
          showModal={showModalSlettPeriode}
          periode={periodeSlett}
          cancelEvent={this.hideModal}
          closeEvent={this.removePeriode}
        />
      </div>
    );
  }
}

UttakFaktaForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  inntektsmeldinger: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  disableButtons: PropTypes.bool.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormReset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  slettedePerioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  initialValues: PropTypes.shape().isRequired,
  uttakPeriodeVurderingTyper: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  førsteUttaksDato: PropTypes.string,
};

UttakFaktaForm.defaultProps = {
  førsteUttaksDato: undefined,
};

const perioder = state => behandlingFormValueSelector('UttakInfoPanel')(state, 'perioder') || [];
const slettedePerioder = state => behandlingFormValueSelector('UttakInfoPanel')(state, 'slettedePerioder') || [];

const mapStateToProps = (state) => {
  const behandlingFormPrefix = getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state));
  return {
    behandlingFormPrefix,
    uttakPeriodeVurderingTyper: getKodeverk(kodeverkTyper.UTTAK_PERIODE_VURDERING_TYPE)(state),
    inntektsmeldinger: getInntektsmeldinger(state),
    initialValues: getFormInitialValues(`${behandlingFormPrefix}.UttakInfoPanel`)(state),
    slettedePerioder: slettedePerioder(state),
    perioder: perioder(state),
    disableButtons: perioder(state).find(periode => periode.openForm === true) !== undefined,
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormReset,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(UttakFaktaForm);
