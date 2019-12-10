import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import {
  FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { getBehandlingFormPrefix, behandlingFormValueSelector } from '@fpsak-frontend/fp-felles';
import {
  ISO_DATE_FORMAT,
} from '@fpsak-frontend/utils';
import { CheckboxField } from '@fpsak-frontend/form';
import periodeResultatType from '@fpsak-frontend/kodeverk/src/periodeResultatType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import { Tidslinje } from '@fpsak-frontend/tidslinje';
import TimeLineInfo from './stonadkonto/TimeLineInfo';
import UttakTimeLineData from './UttakTimeLineData';
import UttakMedsokerReadOnly from './UttakMedsokerReadOnly';

import styles from './uttak.less';
import UttakTidslinjeHjelpetekster from './UttakTidslinjeHjelpetekster';
import {
  getFodselTerminDato,
  lagUttaksresultatActivity,
  slaSammenHovedsokerOgAnnenForelder,
  addClassNameGroupIdToPerioderHovedsoker,
  addClassNameGroupIdToPerioderAnnenForelder,
  getBarnFraTpsRelatertTilSoknad,
  getBehandlingIsRevurdering,
} from '../selectors/uttakSelectors';

const ACTIVITY_PANEL_NAME = 'uttaksresultatActivity';
const STONADSKONTOER_TEMP = 'stonadskonto';
const parseDateString = (dateString) => moment(dateString, ISO_DATE_FORMAT).toDate();


const fodselsdato = (soknadsType, endredFodselsDato, familiehendelseDate, omsorgsOvertagelseDato) => {
  if (soknadsType === soknadType.FODSEL) {
    return (endredFodselsDato ? parseDateString(endredFodselsDato) : parseDateString(familiehendelseDate));
  }
  return parseDateString(omsorgsOvertagelseDato);
};

const getCustomTimes = (
  barnFraTps,
  endredFodselsDato,
  endringsdato,
  familiehendelse,
  familiehendelseDate,
  isRevurdering,
  omsorgsOvertagelseDato,
  person,
  soknadDate,
  soknadsType,
) => {
  // TODO: trumfa tps med avklartebarn fra lösningen - blir TPS-barn en del av dem?
  const dodeBarn = familiehendelse && !familiehendelse.brukAntallBarnFraTPS && familiehendelse.avklartBarn && familiehendelse.avklartBarn.length > 0
    ? familiehendelse.avklartBarn.filter((barn) => barn.dodsdato) : barnFraTps.filter((barn) => barn.dodsdato);

  const customTimesBuilder = {
    soknad: parseDateString(soknadDate),
    fodsel: fodselsdato(soknadsType, endredFodselsDato, familiehendelseDate, omsorgsOvertagelseDato),
    revurdering: isRevurdering ? parseDateString(endringsdato) : '1950-01-01',
    dodSoker: person && person.dodsdato ? parseDateString(person.dodsdato) : '1950-01-01',
  };

  dodeBarn.forEach((barn, index) => {
    Object.defineProperty(customTimesBuilder, `${`barndod${index}`}`, {
      value: parseDateString(barn.dodsdato), enumerable: true,
    });
  });
  return (customTimesBuilder);
};

const isInnvilget = (uttaksresultatActivity) => uttaksresultatActivity.periodeResultatType.kode === periodeResultatType.INNVILGET;

/**
 * Uttak
 * Presentationskomponent. Masserer data og populerer felten samt formatterar tidslinjen for uttak
 */

export class UttakImpl extends Component {
  constructor(props) {
    super(props);
    this.cancelSelectedActivity = this.cancelSelectedActivity.bind(this);
    this.ikkeGyldigForbruk = this.ikkeGyldigForbruk.bind(this);
    this.initializeActivityForm = this.initializeActivityForm.bind(this);
    this.isConfirmButtonDisabled = this.isConfirmButtonDisabled.bind(this);
    this.isReadOnly = this.isReadOnly.bind(this);
    this.nextPeriod = this.nextPeriod.bind(this);
    this.onToggleOverstyring = this.onToggleOverstyring.bind(this);
    this.openPeriodInfo = this.openPeriodInfo.bind(this);
    this.prevPeriod = this.prevPeriod.bind(this);
    this.selectHandler = this.selectHandler.bind(this);
    this.setSelectedDefaultPeriod = this.setSelectedDefaultPeriod.bind(this);
    this.setSelectedUttakActivity = this.setSelectedUttakActivity.bind(this);
    this.skalViseCheckbox = this.skalViseCheckbox.bind(this);
    this.testForReadOnly = this.testForReadOnly.bind(this);
    this.updateActivity = this.updateActivity.bind(this);
    this.updateStonadskontoer = this.updateStonadskontoer.bind(this);

    this.state = {
      selectedItem: null,
      stonadskonto: props.stonadskonto,
    };
  }

  UNSAFE_componentWillMount() {
    this.setSelectedDefaultPeriod();
  }

  onToggleOverstyring() {
    const { selectedItem } = this.state;
    const { uttakPerioder } = this.props;
    if (!selectedItem) {
      this.setState({
        selectedItem: uttakPerioder[0],
      });
    }
  }

  setSelectedDefaultPeriod() {
    const { selectedItem } = this.state;
    const { uttakPerioder } = this.props;
    const defaultSelectedElement = uttakPerioder.find((period) => period.periodeResultatType.kode === periodeResultatType.MANUELL_BEHANDLING);
    const defaultSelectedElementIfNoAP = uttakPerioder.find((period) => period.hovedsoker);
    if (!selectedItem) {
      this.setState({ selectedItem: defaultSelectedElement || defaultSelectedElementIfNoAP });
    }
  }

  setSelectedUttakActivity(uttakActivity, isMounting) {
    if (!isMounting) {
      this.initializeActivityForm(uttakActivity);
    }
    this.setState({ selectedItem: uttakActivity });
  }

  setFormField(fieldName, fieldValue) {
    const { reduxFormChange: formChange, behandlingFormPrefix, formName } = this.props;
    formChange(`${behandlingFormPrefix}.${formName}`, fieldName, fieldValue);
  }

  updateStonadskontoer(values) {
    const {
      tempUpdateStonadskontoer: updateKontoer,
      reduxFormChange: formChange,
      behandlingFormPrefix,
      formName,
      behandlingId,
      saksnummer,
    } = this.props;

    const transformedResultat = values.map((perioder) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tilknyttetStortinget, ...uta } = perioder; // NOSONAR destruct er bedre enn delete, immutable
      const { ...transformActivity } = uta;
      if (uta.oppholdÅrsak.kode !== '-') {
        uta.aktiviteter = [];
      }

      const transformAktiviteter = uta.aktiviteter.map((a) => {
        const { days, weeks, ...transformAktivitet } = a;
        if (typeof days !== 'undefined' && typeof weeks !== 'undefined') {
          const trekkdager = (weeks * 5) + parseFloat(days);
          transformAktivitet.trekkdagerDesimaler = trekkdager; // regner om uker og dager til trekkdager
        }
        return transformAktivitet;
      });
      transformActivity.aktiviteter = transformAktiviteter;
      return transformActivity;
    });

    const params = {
      behandlingId: {
        saksnummer,
        behandlingId,
      },
      perioder: transformedResultat,
    };

    updateKontoer(params).then((response) => {
      this.setState({ stonadskonto: response });
      formChange(`${behandlingFormPrefix}.${formName}`, STONADSKONTOER_TEMP, response);
    });
  }

  initializeActivityForm(uttakActivity) {
    const { reduxFormInitialize: formInitialize, behandlingFormPrefix } = this.props;
    formInitialize(`${behandlingFormPrefix}.${ACTIVITY_PANEL_NAME}`, uttakActivity);
  }

  updateActivity(values) {
    const { uttakPerioder } = this.props;
    const { ...verdier } = values;
    verdier.aktiviteter = verdier.aktiviteter.map((a) => {
      const { ...aktivitet } = a;
      aktivitet.utbetalingsgrad = a.utbetalingsgrad || a.utbetalingsgrad === 0 ? parseFloat(a.utbetalingsgrad) : null;
      aktivitet.trekkdager = null;
      return aktivitet;
    });

    const otherThanUpdated = uttakPerioder.filter((o) => o.id !== verdier.id && o.hovedsoker);
    const sortedActivities = otherThanUpdated.concat(verdier);
    sortedActivities.sort((a, b) => a.id - b.id);
    this.updateStonadskontoer(sortedActivities);
    this.setFormField(ACTIVITY_PANEL_NAME, sortedActivities);
    const uttakActivity = otherThanUpdated.find((o) => o.periodeResultatType.kode === periodeResultatType.MANUELL_BEHANDLING
      || (o.tilknyttetStortinget && !Object.prototype.hasOwnProperty.call(o, 'erOppfylt')));
    this.setSelectedUttakActivity(uttakActivity || undefined);
  }

  cancelSelectedActivity() {
    this.initializeActivityForm({});
    this.setState({ selectedItem: undefined });
  }

  openPeriodInfo(event) {
    const { uttakPerioder } = this.props;
    const { selectedItem: currentSelectedItem } = this.state;
    if (currentSelectedItem) {
      this.setSelectedUttakActivity(undefined);
    } else {
      const activity = uttakPerioder.find((item) => item.id === 1);
      this.setSelectedUttakActivity(activity);
    }
    event.preventDefault();
  }

  selectHandler(eventProps) {
    const { uttakPerioder } = this.props;
    const { selectedItem: currentSelectedItem } = this.state;
    const selectedItem = uttakPerioder.find((item) => item.id === eventProps.items[0]);
    if (currentSelectedItem) {
      this.setState({ selectedItem: undefined });
      this.setSelectedUttakActivity(selectedItem);
    } else {
      this.setSelectedUttakActivity(selectedItem);
    }
    eventProps.event.preventDefault();
  }

  nextPeriod(event) {
    const { uttakPerioder } = this.props;
    const { selectedItem } = this.state;
    const newIndex = uttakPerioder.findIndex((item) => item.id === selectedItem.id) + 1;
    if (newIndex < uttakPerioder.length) {
      this.setSelectedUttakActivity(uttakPerioder[newIndex]);
    }
    event.preventDefault();
  }

  prevPeriod(event) {
    const { uttakPerioder } = this.props;
    const { selectedItem } = this.state;
    const newIndex = uttakPerioder.findIndex((item) => item.id === selectedItem.id) - 1;
    if (newIndex >= 0) {
      this.setSelectedUttakActivity(uttakPerioder[newIndex]);
    }
    event.preventDefault();
  }

  testForReadOnly(aksjonspunkter, kanOverstyre) {
    const { manuellOverstyring } = this.props;
    const kunOverStyrAp = aksjonspunkter.length === 1
      && aksjonspunkter[0].definisjon.kode === aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER
      && aksjonspunkter[0].status.kode === 'OPPR';
    if (kunOverStyrAp && kanOverstyre) {
      return !kunOverStyrAp;
    }

    const activeUttakAp = aksjonspunkter.filter((ap) => ap.definisjon.kode !== aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER);
    return (activeUttakAp.length < 1 || (activeUttakAp[0].toTrinnsBehandlingGodkjent === true && activeUttakAp[0].status.kode === 'UTFO'))
      && !manuellOverstyring;
  }

  ikkeGyldigForbruk() {
    const { stonadskonto } = this.props;
    let validationError = false;
    if (stonadskonto && stonadskonto.stonadskontoer) {
      const kontoer = stonadskonto.stonadskontoer;
      const myArray = Object.entries(kontoer);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [name, periode] of myArray) { // eslint-disable-line no-restricted-syntax
        if (!periode.gyldigForbruk) {
          validationError = true;
          break;
        }
      }
    }
    return validationError;
  }

  isConfirmButtonDisabled() {
    const {
      uttaksresultatActivity, readOnly, submitting, isDirty,
    } = this.props;

    if (uttaksresultatActivity.every(isInnvilget)) {
      return false;
    }

    if (this.ikkeGyldigForbruk()) {
      return true;
    }

    if (!(uttaksresultatActivity.some((ac) => Object.prototype.hasOwnProperty.call(ac, 'erOppfylt')))) {
      return true;
    }
    const ikkeOppfylt = uttaksresultatActivity.some((ac) => (!Object.prototype.hasOwnProperty.call(ac, 'erOppfylt') && ac.tilknyttetStortinget)
      || ac.periodeResultatType.kode === periodeResultatType.MANUELL_BEHANDLING);

    if (!isDirty || ikkeOppfylt) {
      return true;
    }
    return submitting || readOnly;
  }

  isReadOnly() {
    const {
      readOnly, aksjonspunkter, endringsdato, isRevurdering, kanOverstyre,
    } = this.props;
    const { selectedItem } = this.state;
    const uttakIsReadOnly = this.testForReadOnly(aksjonspunkter, kanOverstyre) || (endringsdato && isRevurdering && selectedItem.tom < endringsdato);
    return readOnly || uttakIsReadOnly;
  }

  skalViseCheckbox() {
    const { aksjonspunkter } = this.props;
    const kunOverStyrAp = aksjonspunkter.length === 1
      && aksjonspunkter[0].definisjon.kode === aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER
      && aksjonspunkter[0].status.kode === 'OPPR';
    const apUtenOverstyre = aksjonspunkter.filter((a) => a.definisjon.kode !== aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER);
    return apUtenOverstyre.length > 0 || kunOverStyrAp;
  }

  render() {
    const {
      aksjonspunkter,
      annenForelderSoktOmFlerbarnsdager,
      barnFraTps,
      behandlingFormPrefix,
      dekningsgrad,
      endredFodselsDato,
      endringsdato,
      familiehendelse,
      familiehendelseDate,
      formName,
      behandlingId,
      behandlingVersjon,
      harSoktOmFlerbarnsdager,
      hovedsokerKjonnKode,
      isApOpen,
      isRevurdering,
      kanOverstyre,
      medsokerKjonnKode,
      omsorgsovertakelseDato,
      person,
      readOnly,
      reduxFormChange: formChange,
      soknadDate,
      soknadsType,
      submitting,
      uttakPerioder,
      uttaksresultatActivity,
      alleKodeverk,
      behandlingsresultat,
    } = this.props;
    const { selectedItem, stonadskonto } = this.state;
    const customTimes = getCustomTimes(
      barnFraTps,
      endredFodselsDato,
      endringsdato,
      familiehendelse,
      familiehendelseDate,
      isRevurdering,
      omsorgsovertakelseDato,
      person,
      soknadDate,
      soknadsType,
    );
    return (
      <div>
        <Row>
          {kanOverstyre
            && (
              <div className={styles.manuell}>
                <CheckboxField
                  key="manuellOverstyring"
                  name="manuellOverstyring"
                  label={{ id: 'Uttak.ManuellOverstyring' }}
                  onChange={this.onToggleOverstyring}
                  readOnly={isApOpen}
                />
              </div>
            )}
        </Row>
        {this.testForReadOnly(aksjonspunkter, kanOverstyre)
          && <FormattedMessage id="Uttak.Overstyrt" />}
        <div>
          <Row>
            <TimeLineInfo
              dekningsgrad={dekningsgrad}
              maksDatoUttak={stonadskonto.maksDatoUttak}
              stonadskonto={stonadskonto.stonadskontoer}
            />
          </Row>
          <VerticalSpacer twentyPx />
          <Row>
            <Column xs="12">
              <Tidslinje
                customTimes={customTimes}
                hovedsokerKjonnKode={hovedsokerKjonnKode}
                medsokerKjonnKode={medsokerKjonnKode}
                openPeriodInfo={this.openPeriodInfo}
                selectedPeriod={selectedItem}
                selectPeriodCallback={this.selectHandler}
                uttakPerioder={uttakPerioder}
              >
                <UttakTidslinjeHjelpetekster />
              </Tidslinje>
            </Column>
          </Row>
          {selectedItem
            && (
              <>
                {selectedItem.hovedsoker
                  && (
                    <UttakTimeLineData
                      activityPanelName={ACTIVITY_PANEL_NAME}
                      behandlingFormPrefix={behandlingFormPrefix}
                      callbackBackward={this.prevPeriod}
                      callbackCancelSelectedActivity={this.cancelSelectedActivity}
                      callbackForward={this.nextPeriod}
                      callbackSetSelected={this.setSelectedUttakActivity}
                      callbackUpdateActivity={this.updateActivity}
                      formName={formName}
                      harSoktOmFlerbarnsdager={harSoktOmFlerbarnsdager}
                      isApOpen={isApOpen}
                      readOnly={this.isReadOnly()}
                      reduxFormChange={formChange}
                      selectedItemData={selectedItem}
                      stonadskonto={stonadskonto}
                      uttaksresultatActivity={uttaksresultatActivity}
                      alleKodeverk={alleKodeverk}
                      behandlingId={behandlingId}
                      behandlingVersjon={behandlingVersjon}
                      behandlingsresultat={behandlingsresultat}
                    />
                  )}
                {!selectedItem.hovedsoker
                  && (
                    <UttakMedsokerReadOnly
                      readOnly
                      selectedItemData={selectedItem}
                      callbackForward={this.nextPeriod}
                      callbackBackward={this.prevPeriod}
                      callbackUpdateActivity={this.updateActivity}
                      callbackCancelSelectedActivity={this.cancelSelectedActivity}
                      isApOpen={false}
                      harSoktOmFlerbarnsdager={annenForelderSoktOmFlerbarnsdager}
                      alleKodeverk={alleKodeverk}
                      behandlingId={behandlingId}
                      behandlingVersjon={behandlingVersjon}
                      behandlingsresultat={behandlingsresultat}
                    />
                  )}
              </>
            )}
          {(!readOnly && !(this.testForReadOnly(aksjonspunkter, kanOverstyre)))
            && (
              <div className={styles.marginTop}>
                <FlexContainer fluid>
                  <FlexRow>
                    <FlexColumn>
                      <Hovedknapp
                        mini
                        disabled={this.isConfirmButtonDisabled()}
                        spinner={submitting}
                      >
                        <FormattedMessage id="Uttak.Confirm" />
                      </Hovedknapp>
                    </FlexColumn>
                  </FlexRow>
                </FlexContainer>
              </div>
            )}
        </div>
      </div>
    );
  }
}

UttakImpl.propTypes = {
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()),
  annenForelderSoktOmFlerbarnsdager: PropTypes.bool.isRequired,
  barnFraTps: PropTypes.arrayOf(PropTypes.shape()),
  behandlingFormPrefix: PropTypes.string.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  dekningsgrad: PropTypes.number,
  endredFodselsDato: PropTypes.string,
  endringsdato: PropTypes.string.isRequired,
  familiehendelse: PropTypes.shape(),
  familiehendelseDate: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  harSoktOmFlerbarnsdager: PropTypes.bool.isRequired,
  hovedsokerKjonnKode: PropTypes.string.isRequired,
  isApOpen: PropTypes.bool,
  isDirty: PropTypes.bool.isRequired,
  isRevurdering: PropTypes.bool,
  kanOverstyre: PropTypes.bool,
  manuellOverstyring: PropTypes.bool,
  medsokerKjonnKode: PropTypes.string,
  omsorgsovertakelseDato: PropTypes.string,
  person: PropTypes.shape(),
  readOnly: PropTypes.bool.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  saksnummer: PropTypes.string.isRequired,
  soknadDate: PropTypes.string.isRequired,
  soknadsType: PropTypes.string.isRequired,
  stonadskonto: PropTypes.shape().isRequired,
  submitting: PropTypes.bool.isRequired,
  tempUpdateStonadskontoer: PropTypes.func.isRequired,
  uttakPerioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  uttaksresultatActivity: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
};

UttakImpl.defaultProps = {
  aksjonspunkter: [],
  barnFraTps: [],
  dekningsgrad: undefined,
  endredFodselsDato: undefined,
  familiehendelse: undefined,
  isApOpen: false,
  isRevurdering: false,
  kanOverstyre: undefined,
  manuellOverstyring: false,
  medsokerKjonnKode: undefined,
  omsorgsovertakelseDato: undefined,
  person: undefined,
};

const determineMottatDato = (soknadsDato, mottatDato) => {
  if (moment(mottatDato) < moment(soknadsDato)) {
    return mottatDato;
  }
  return soknadsDato;
};

const mapStateToProps = (state, props) => {
  const {
    person,
    mottattDato,
    formName,
    familiehendelse,
    uttaksresultat,
    uttakPeriodeGrense,
    ytelsefordeling,
    behandlingId,
    behandlingVersjon,
    fagsak,
    employeeHasAccess,
  } = props;
  const periodeGrenseMottatDato = uttakPeriodeGrense.mottattDato;
  const hovedsokerKjonnKode = person ? person.navBrukerKjonn.kode : undefined;
  const annenForelderUttak = uttaksresultat.perioderAnnenpart;
  const viseUttakMedsoker = annenForelderUttak.length > 0;
  const getMedsokerKjonnKode = (viseUttakMedsoker && person && person.annenPart) ? person.annenPart.navBrukerKjonn.kode : undefined;
  // hvis ukjent annenpart og annenpart uttak, vis ukjent ikon
  const medsokerKjonnKode = viseUttakMedsoker && getMedsokerKjonnKode === undefined ? navBrukerKjonn.UDEFINERT : getMedsokerKjonnKode;
  const hovedsokerPerioder = addClassNameGroupIdToPerioderHovedsoker(state, props);
  const annenForelderPerioder = addClassNameGroupIdToPerioderAnnenForelder(state, props);

  /*
  @TODO clean up interface
  const personer = [person];
  if (viseUttakMedsoker && person && person.annenPart) {
    personer.push(person.annenPart.navBrukerKjonn);
  }
  */
  return {
    annenForelderSoktOmFlerbarnsdager: annenForelderPerioder.filter((p) => p.flerbarnsdager === true).length > 0,
    barnFraTps: getBarnFraTpsRelatertTilSoknad(props),
    behandlingFormPrefix: getBehandlingFormPrefix(behandlingId, behandlingVersjon),
    endredFodselsDato: familiehendelse.fodselsdato,
    endringsdato: ytelsefordeling.endringsdato ? ytelsefordeling.endringsdato : undefined,
    familiehendelse,
    familiehendelseDate: getFodselTerminDato(props),
    harSoktOmFlerbarnsdager: hovedsokerPerioder.filter((p) => p.flerbarnsdager === true).length > 0,
    hovedsokerKjonnKode,
    isRevurdering: getBehandlingIsRevurdering(props),
    kanOverstyre: employeeHasAccess,
    medsokerKjonnKode,
    person,
    saksnummer: fagsak.saksnummer,
    soknadDate: determineMottatDato(periodeGrenseMottatDato, mottattDato),
    stonadskonto: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'stonadskonto'),
    uttakPerioder: slaSammenHovedsokerOgAnnenForelder(state, props),
    uttaksresultatActivity: lagUttaksresultatActivity(state, props),
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
  }, dispatch),
});

const Uttak = connect(mapStateToProps, mapDispatchToProps)(injectIntl(UttakImpl));
export default Uttak;
