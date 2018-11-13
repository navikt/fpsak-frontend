import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';
import { connect } from 'react-redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { FlexContainer, FlexRow, FlexColumn } from '@fpsak-frontend/shared-components/flexGrid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils/formats/';
import VerticalSpacer from '@fpsak-frontend/shared-components/VerticalSpacer';
import { CheckboxField } from '@fpsak-frontend/form';
import { behandlingFormValueSelector, getBehandlingFormPrefix } from 'behandling/behandlingForm';
import {
  getBehandlingVersjon,
  getStonadskontoer,
  getSoknad,
  getBehandlingYtelseFordeling,
  getFamiliehendelse,
  getBehandlingIsRevurdering,
  getPersonopplysning,
  getUttaksresultatPerioder,
} from 'behandling/behandlingSelectors';
import { getRettigheter } from '@fpsak-frontend/nav-ansatt/duck';
import { getSelectedBehandlingId } from 'behandling/duck';
import periodeResultatType from '@fpsak-frontend/kodeverk/periodeResultatType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/aksjonspunktCodes';
import ElementWrapper from '@fpsak-frontend/shared-components/ElementWrapper';
import soknadType from '@fpsak-frontend/kodeverk/soknadType';
import TimeLineInfo from './stonadkonto/TimeLineInfo';
import UttakTimeLineData from './UttakTimeLineData';
import UttakTimeLine from './UttakTimeLine';
import UttakMedsokerReadOnly from './UttakMedsokerReadOnly';
import styles from './uttak.less';

const ACTIVITY_PANEL_NAME = 'uttaksresultatActivity';
const parseDateString = dateString => moment(dateString, ISO_DATE_FORMAT).toDate();
const godkjentKlassenavn = 'godkjentPeriode';
const avvistKlassenavn = 'avvistPeriode';

const getStatusPeriodeHoved = (periode) => {
  if (periode.erOppfylt === false) {
    return avvistKlassenavn;
  }
  if (periode.erOppfylt === true || (periode.periodeResultatType.kode === periodeResultatType.INNVILGET
    && !periode.tilknyttetStortinget)) {
    return godkjentKlassenavn;
  }
  if (periode.periodeResultatType.kode === periodeResultatType.MANUELL_BEHANDLING
    || periode.tilknyttetStortinget
  ) {
    return 'undefined';
  }
  return avvistKlassenavn;
};

const getStatusPeriodeMed = (periode) => {
  if (periode.periodeResultatType.kode === periodeResultatType.INNVILGET && !periode.tilknyttetStortinget) {
    return godkjentKlassenavn;
  }
  return avvistKlassenavn;
};

const createTooltipContent = (periodeFom,
  periodeTom,
  periodeType,
  intl,
  item) => (`
  <p>
    <strong>${intl.formatMessage({ id: 'Timeline.tooltip.start' })}:</strong> ${moment(periodeFom).format(DDMMYYYY_DATE_FORMAT)}
    <strong>${intl.formatMessage({ id: 'Timeline.tooltip.slutt' })}:</strong> ${moment(periodeTom).format(DDMMYYYY_DATE_FORMAT)}
    <strong>${intl.formatMessage({ id: 'Timeline.tooltip.periodetype' })}:</strong> ${item.utsettelseType && item.utsettelseType.kode !== '-'
    ? intl.formatMessage({ id: 'Timeline.tooltip.utsettelsePeriode' })
    : periodeType}

  </p>
`);

const getCorrectPeriodName = (item) => {
  if (item.utsettelseType && item.utsettelseType.kode !== '-') {
    return (<FormattedMessage id="Timeline.tooltip.slutt" />);
  }

  if (item.aktiviteter.length > 0 && item.aktiviteter[0].stønadskontoType) {
    return item.aktiviteter[0].stønadskontoType.navn;
  }

  return '';
};

const addClassNameGroupIdToPerioder = (hovedsokerPerioder, annenForelderPerioder, hovedsoker, intl) => {
  const perioderMedClassName = [];
  const perioder = hovedsoker ? hovedsokerPerioder : annenForelderPerioder;

  perioder.forEach((item, index) => {
    const stonadskontoType = getCorrectPeriodName(item);
    const status = hovedsoker ? getStatusPeriodeHoved(item) : getStatusPeriodeMed(item);
    const gradert = (item.gradertAktivitet && item.graderingInnvilget) ? 'gradert' : '';
    const copyOfItem = Object.assign({}, item);

    copyOfItem.id = index + 1 + (hovedsoker ? 0 : hovedsokerPerioder.length);
    copyOfItem.tomMoment = moment(item.tom).add(1, 'days');
    copyOfItem.className = `${status} ${gradert}`;
    copyOfItem.hovedsoker = hovedsoker;
    copyOfItem.group = annenForelderPerioder.length > 0 && hovedsoker ? 2 : 1;
    copyOfItem.title = createTooltipContent(item.fom, item.tom, stonadskontoType, intl, item);
    perioderMedClassName.push(copyOfItem);
  });
  return perioderMedClassName;
};

const getCustomTimes = (
  soknadDate,
  familiehendelseDate,
  endringsDate,
  soknadsType,
  omsorgsOvertagelseDato,
  endredFodselsDato,
  isRevurdering,
) => {
  if (soknadsType === soknadType.FODSEL) {
    return ({
      soknad: parseDateString(soknadDate),
      fodsel: endredFodselsDato ? parseDateString(endredFodselsDato) : parseDateString(familiehendelseDate),
      revurdering: isRevurdering ? parseDateString(endringsDate) : '1950-01-01',
    });
  }
  return ({
    soknad: parseDateString(soknadDate),
    fodsel: parseDateString(omsorgsOvertagelseDato),
    revurdering: isRevurdering ? parseDateString(endringsDate) : '1950-01-01',
  });
};

const isInnvilget = uttaksresultatActivity => uttaksresultatActivity.periodeResultatType.kode === periodeResultatType.INNVILGET;

/**
 * Uttak
 * Presentationskomponent. Masserer data og populerer felten samt formatterar tidslinjen for uttak
 */

export class UttakImpl extends Component {
  constructor() {
    super();
    this.initializeActivityForm = this.initializeActivityForm.bind(this);
    this.openPeriodInfo = this.openPeriodInfo.bind(this);
    this.nextPeriod = this.nextPeriod.bind(this);
    this.prevPeriod = this.prevPeriod.bind(this);
    this.onToggleOverstyring = this.onToggleOverstyring.bind(this);
    this.setSelectedUttakActivity = this.setSelectedUttakActivity.bind(this);
    this.updateActivity = this.updateActivity.bind(this);
    this.cancelSelectedActivity = this.cancelSelectedActivity.bind(this);
    this.isConfirmButtonDisabled = this.isConfirmButtonDisabled.bind(this);
    this.selectHandler = this.selectHandler.bind(this);
    this.testForReadOnly = this.testForReadOnly.bind(this);
    this.isReadOnly = this.isReadOnly.bind(this);

    this.state = {
      selectedItem: null,
    };
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
      return aktivitet;
    });

    const otherThanUpdated = uttakPerioder.filter(o => o.id !== verdier.id && o.hovedsoker);
    const sortedActivities = otherThanUpdated.concat(verdier);
    sortedActivities.sort((a, b) => a.id - b.id);
    this.setFormField(ACTIVITY_PANEL_NAME, sortedActivities);
    const uttakActivity = otherThanUpdated.find(o => o.periodeResultatType.kode === periodeResultatType.MANUELL_BEHANDLING
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
      const activity = uttakPerioder.find(item => item.id === 1);
      this.setSelectedUttakActivity(activity);
    }
    event.preventDefault();
  }

  selectHandler(eventProps) {
    const { uttakPerioder } = this.props;
    const { selectedItem: currentSelectedItem } = this.state;
    const selectedItem = uttakPerioder.find(item => item.id === eventProps.items[0]);
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
    const newIndex = uttakPerioder.findIndex(item => item.id === selectedItem.id) + 1;
    if (newIndex < uttakPerioder.length) {
      this.setSelectedUttakActivity(uttakPerioder[newIndex]);
    }
    event.preventDefault();
  }

  prevPeriod(event) {
    const { uttakPerioder } = this.props;
    const { selectedItem } = this.state;
    const newIndex = uttakPerioder.findIndex(item => item.id === selectedItem.id) - 1;
    if (newIndex >= 0) {
      this.setSelectedUttakActivity(uttakPerioder[newIndex]);
    }
    event.preventDefault();
  }

  testForReadOnly(aksjonspunkter) {
    const { manuellOverstyring } = this.props;
    const activeUttakAp = aksjonspunkter.filter(ap => ap.definisjon.kode === aksjonspunktCodes.FASTSETT_UTTAKPERIODER
      || aksjonspunktCodes.TILKNYTTET_STORTINGET);
    return (activeUttakAp.length < 1 || activeUttakAp[0].status.kode === 'UTFO') && !manuellOverstyring;
  }

  isConfirmButtonDisabled() {
    const {
      uttaksresultatActivity, readOnly, submitting, isDirty,
    } = this.props;

    if (uttaksresultatActivity.every(isInnvilget)) {
      return false;
    }
    if (!(uttaksresultatActivity.some(ac => Object.prototype.hasOwnProperty.call(ac, 'erOppfylt')))) {
      return true;
    }
    const ikkeOppfylt = uttaksresultatActivity.some(ac => (!Object.prototype.hasOwnProperty.call(ac, 'erOppfylt') && ac.tilknyttetStortinget)
      || ac.periodeResultatType.kode === periodeResultatType.MANUELL_BEHANDLING);

    if (!isDirty || ikkeOppfylt) {
      return true;
    }
    return submitting || readOnly;
  }

  isReadOnly() {
    const {
      readOnly, aksjonspunkter, endringsDate, isRevurdering,
    } = this.props;
    const { selectedItem } = this.state;
    const uttakIsReadOnly = this.testForReadOnly(aksjonspunkter) || (endringsDate && isRevurdering && selectedItem.tom < endringsDate);
    return readOnly || uttakIsReadOnly;
  }

  render() {
    const {
      soknadDate,
      familiehendelseDate,
      endringsDate,
      hovedsokerKjonnKode,
      medsokerKjonnKode,
      stonadskonto,
      dekningsgrad,
      readOnly,
      uttaksresultatActivity,
      submitting,
      behandlingFormPrefix,
      formName,
      kanOverstyre,
      isApOpen,
      aksjonspunkter,
      soknadsType,
      omsorgsovertakelseDato,
      endredFodselsDato,
      uttakPerioder,
      isRevurdering,
      reduxFormChange: formChange,
    } = this.props;
    const { selectedItem } = this.state;
    const customTimes = getCustomTimes(
      soknadDate,
      familiehendelseDate,
      endringsDate,
      soknadsType,
      omsorgsovertakelseDato,
      endredFodselsDato,
      isRevurdering,
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
                readOnly={readOnly || isApOpen}
              />
            </div>
          )}
        </Row>
        {this.testForReadOnly(aksjonspunkter) && !kanOverstyre
        && <FormattedMessage id="Uttak.Overstyrt" />
        }
        <div>
          <Row>
            <TimeLineInfo
              maksDatoUttak={stonadskonto.maksDatoUttak}
              stonadskonto={stonadskonto.stonadskontoer}
              dekningsgrad={dekningsgrad}
            />
          </Row>
          <VerticalSpacer twentyPx />
          <Row>
            <Column xs="12">
              <UttakTimeLine
                customTimes={customTimes}
                uttakPerioder={uttakPerioder}
                selectPeriodCallback={this.selectHandler}
                selectedPeriod={selectedItem}
                openPeriodInfo={this.openPeriodInfo}
                hovedsokerKjonnKode={hovedsokerKjonnKode}
                medsokerKjonnKode={medsokerKjonnKode}
              />
            </Column>
          </Row>
          {selectedItem
          && (
          <ElementWrapper>
            {selectedItem.hovedsoker
              && (
              <UttakTimeLineData
                readOnly={this.isReadOnly()}
                selectedItemData={selectedItem}
                callbackSetSelected={this.setSelectedUttakActivity}
                callbackForward={this.nextPeriod}
                callbackBackward={this.prevPeriod}
                callbackUpdateActivity={this.updateActivity}
                callbackCancelSelectedActivity={this.cancelSelectedActivity}
                uttaksresultatActivity={uttaksresultatActivity}
                reduxFormChange={formChange}
                behandlingFormPrefix={behandlingFormPrefix}
                formName={formName}
                activityPanelName={ACTIVITY_PANEL_NAME}
                isApOpen={isApOpen}
                stonadskontoer={stonadskonto.stonadskontoer}
              />
              )
            }
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
                stonadskontoer={stonadskonto.stonadskontoer}
              />
              )
            }
          </ElementWrapper>
          )}
          {(!readOnly && !(this.testForReadOnly(aksjonspunkter)))
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
  formName: PropTypes.string.isRequired,
  soknadDate: PropTypes.string.isRequired,
  familiehendelseDate: PropTypes.string.isRequired,
  endringsDate: PropTypes.string.isRequired,
  hovedsokerKjonnKode: PropTypes.string.isRequired,
  medsokerKjonnKode: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
  uttaksresultatActivity: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  uttakPerioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  isDirty: PropTypes.bool.isRequired,
  isApOpen: PropTypes.bool,
  stonadskonto: PropTypes.shape().isRequired,
  dekningsgrad: PropTypes.number,
  manuellOverstyring: PropTypes.bool,
  kanOverstyre: PropTypes.bool,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()),
  soknadsType: PropTypes.string.isRequired,
  omsorgsovertakelseDato: PropTypes.string,
  endredFodselsDato: PropTypes.string,
  isRevurdering: PropTypes.bool,
};

UttakImpl.defaultProps = {
  dekningsgrad: undefined,
  manuellOverstyring: false,
  kanOverstyre: undefined,
  isApOpen: false,
  aksjonspunkter: [],
  omsorgsovertakelseDato: undefined,
  endredFodselsDato: undefined,
  isRevurdering: false,
  medsokerKjonnKode: undefined,
};

const fodselTerminDato = (soknad) => {
  if (soknad.fodselsdatoer && Object.keys(soknad.fodselsdatoer).length > 0) {
    return Object.values(soknad.fodselsdatoer)[0];
  }
  if (soknad.termindato) {
    return soknad.termindato;
  }
  if (soknad.adopsjonFodelsedatoer && Object.keys(soknad.adopsjonFodelsedatoer).length > 0) {
    return Object.values(soknad.adopsjonFodelsedatoer)[0];
  }
  return undefined;
};

const mapStateToProps = (state, props) => {
  const soknad = getSoknad(state);
  const person = getPersonopplysning(state);
  const hovedsokerKjonnKode = person ? person.navBrukerKjonn.kode : undefined;
  const annenForelderUttak = getUttaksresultatPerioder(state).perioderAnnenpart;
  const viseUttakMedsoker = annenForelderUttak.length > 0;
  const medsokerKjonnKode = (viseUttakMedsoker && person && person.annenPart) ? person.annenPart.navBrukerKjonn.kode : undefined;

  const familiehendelse = getFamiliehendelse(state);
  const ytelseFordeling = getBehandlingYtelseFordeling(state);
  const uttaksresultatActivity = behandlingFormValueSelector(props.formName)(state, ACTIVITY_PANEL_NAME);
  const tilknyttetStortinget = !!props.aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.TILKNYTTET_STORTINGET && props.isApOpen);
  const isRevurdering = getBehandlingIsRevurdering(state);

  const hovedsokerPerioder = addClassNameGroupIdToPerioder(uttaksresultatActivity, annenForelderUttak, true, props.intl);
  const annenForelderPerioder = addClassNameGroupIdToPerioder(uttaksresultatActivity, annenForelderUttak, false, props.intl);
  const uttakPerioder = hovedsokerPerioder.concat(annenForelderPerioder);
  return {
    soknadDate: soknad.mottattDato,
    familiehendelseDate: fodselTerminDato(soknad),
    endringsDate: ytelseFordeling.endringsDato ? ytelseFordeling.endringsDato : undefined,
    dekningsgrad: soknad.dekningsgrad ? soknad.dekningsgrad : undefined,
    stonadskonto: getStonadskontoer(state),
    behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
    uttaksresultatActivity: uttaksresultatActivity.map(periode => ({ tilknyttetStortinget, ...periode })),
    kanOverstyre: getRettigheter(state).kanOverstyreAccess.employeeHasAccess,
    soknadsType: soknad.soknadType.kode,
    omsorgsovertakelseDato: soknad.omsorgsovertakelseDato,
    endredFodselsDato: familiehendelse.fodselsdato,
    hovedsokerKjonnKode,
    medsokerKjonnKode,
    isRevurdering,
    uttakPerioder,
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
  }, dispatch),
});

const Uttak = connect(mapStateToProps, mapDispatchToProps)(injectIntl(UttakImpl));
export default Uttak;
