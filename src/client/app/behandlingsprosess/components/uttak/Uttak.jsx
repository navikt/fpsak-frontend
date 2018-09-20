import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';
import { connect } from 'react-redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import { injectIntl, FormattedMessage, intlShape } from 'react-intl';

import { FlexContainer, FlexRow, FlexColumn } from 'sharedComponents/flexGrid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { CheckboxField } from '@fpsak-frontend/form';
import { behandlingFormValueSelector, getBehandlingFormPrefix } from 'behandling/behandlingForm';
import {
  getBehandlingVersjon,
  getStonadskontoer,
  getSoknad,
  getBehandlingYtelseFordeling,
  getFamiliehendelse,
  getBehandlingIsRevurdering,
} from 'behandling/behandlingSelectors';
import { getRettigheter } from 'navAnsatt/duck';
import { getSelectedBehandlingId } from 'behandling/duck';
import periodeResultatType from 'kodeverk/periodeResultatType';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import soknadType from 'kodeverk/soknadType';
import TimeLineInfo from './stonadkonto/TimeLineInfo';
import UttakTimeLineData from './UttakTimeLineData';
import UttakTimeLine from './UttakTimeLine';

import styles from './uttak.less';

const ACTIVITY_PANEL_NAME = 'uttaksresultatActivity';

const parseDateString = dateString => moment(dateString, ISO_DATE_FORMAT).toDate();

const godkjentKlassenavn = 'godkjentPeriode';
const avvistKlassenavn = 'avvistPeriode';

const getStatusForPeriode = (periode) => {
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


const createTooltipContent = (periodeFom, periodeTom, periodeType, intl) => (`
  <p>
    <strong>${intl.formatMessage({ id: 'Timeline.tooltip.start' })}:</strong> ${moment(periodeFom).format(DDMMYYYY_DATE_FORMAT)}
    <strong>${intl.formatMessage({ id: 'Timeline.tooltip.slutt' })}:</strong> ${moment(periodeTom).format(DDMMYYYY_DATE_FORMAT)}
    <strong>${intl.formatMessage({ id: 'Timeline.tooltip.periodetype' })}:</strong> ${periodeType}
  </p>
`);

const addClassNameGroupIdToPerioder = (perioder, intl) => {
  const perioderMedClassName = [];
  perioder.forEach((item, index) => {
    const stonadskontoType = (item.aktiviteter.length > 0 && item.aktiviteter[0].stønadskontoType)
      ? item.aktiviteter[0].stønadskontoType.navn
      : '';
    const status = getStatusForPeriode(item);
    const copyOfItem = Object.assign({}, item);
    copyOfItem.id = index + 1;
    copyOfItem.tom = moment(item.tom).add(1, 'days');
    copyOfItem.className = status;
    copyOfItem.group = 1;
    copyOfItem.title = createTooltipContent(item.fom, item.tom, stonadskontoType, intl);
    perioderMedClassName.push(copyOfItem);
  });
  return perioderMedClassName;
};

const getCustomTimes = (soknadDate, familiehendelseDate, endringsDate, soknadsType, omsorgsOvertagelseDato, endredFodselsDato, isRevurdering) => {
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
 *
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
    const { uttaksresultatActivity } = this.props;
    if (!selectedItem) {
      this.setState({
        selectedItem: uttaksresultatActivity[0],
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
    const { uttaksresultatActivity } = this.props;
    const { ...verdier } = values;
    verdier.aktiviteter = verdier.aktiviteter.map((a) => {
      const { ...aktivitet } = a;
      aktivitet.utbetalingsgrad = a.utbetalingsgrad || a.utbetalingsgrad === 0 ? parseFloat(a.utbetalingsgrad) : null;
      return aktivitet;
    });

    const otherThanUpdated = uttaksresultatActivity.filter(o => o.id !== verdier.id);
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
    const { uttaksresultatActivity } = this.props;
    const { selectedItem: currentSelectedItem } = this.state;
    if (currentSelectedItem) {
      this.setSelectedUttakActivity(undefined);
    } else {
      const activity = uttaksresultatActivity.find(item => item.id === 1);
      this.setSelectedUttakActivity(activity);
    }
    event.preventDefault();
  }

  selectHandler(eventProps) {
    const { uttaksresultatActivity } = this.props;
    const { selectedItem: currentSelectedItem } = this.state;
    const selectedItem = uttaksresultatActivity.find(item => item.id === eventProps.items[0]);
    if (currentSelectedItem) {
      this.setState({ selectedItem: undefined });
      this.setSelectedUttakActivity(selectedItem);
    } else {
      this.setSelectedUttakActivity(selectedItem);
    }
    eventProps.event.preventDefault();
  }

  nextPeriod(event) {
    const { uttaksresultatActivity } = this.props;
    const { selectedItem } = this.state;
    const newIndex = uttaksresultatActivity.findIndex(item => item.id === selectedItem.id) + 1;
    if (newIndex < uttaksresultatActivity.length) {
      this.setSelectedUttakActivity(uttaksresultatActivity[newIndex]);
    }
    event.preventDefault();
  }

  prevPeriod(event) {
    const { uttaksresultatActivity } = this.props;
    const { selectedItem } = this.state;
    const newIndex = uttaksresultatActivity.findIndex(item => item.id === selectedItem.id) - 1;
    if (newIndex >= 0) {
      this.setSelectedUttakActivity(uttaksresultatActivity[newIndex]);
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
      intl,
      isRevurdering,
      reduxFormChange: formChange,
    } = this.props;
    const { selectedItem } = this.state;

    const customTimes = getCustomTimes(soknadDate, familiehendelseDate, endringsDate, soknadsType, omsorgsovertakelseDato, endredFodselsDato, isRevurdering);
    const nyePerioder = addClassNameGroupIdToPerioder(uttaksresultatActivity, intl);

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
            )
           }
        </Row>
        {this.testForReadOnly(aksjonspunkter) && !kanOverstyre
          && <FormattedMessage id="Uttak.Overstyrt" />
        }
        <div>
          <Row>
            <TimeLineInfo
              maksDato={stonadskonto.maksDato}
              stonadskonto={stonadskonto.stonadskontoer}
              dekningsgrad={dekningsgrad}
            />
          </Row>
          <VerticalSpacer twentyPx />
          <Row>
            <Column xs="12">
              <UttakTimeLine
                customTimes={customTimes}
                nyePerioder={nyePerioder}
                selectPeriodCallback={this.selectHandler}
                selectedPeriod={selectedItem}
                openPeriodInfo={this.openPeriodInfo}
                hovedsokerKjonnKode={hovedsokerKjonnKode}
              />
            </Column>
          </Row>
          {selectedItem
          && (
          <ElementWrapper>
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
          </ElementWrapper>
          )
        }
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
          )
        }
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
  readOnly: PropTypes.bool.isRequired,
  uttaksresultatActivity: PropTypes.arrayOf(PropTypes.shape()).isRequired,
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
  intl: intlShape.isRequired,
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
  const familiehendelse = getFamiliehendelse(state);
  const ytelseFordeling = getBehandlingYtelseFordeling(state);
  const uttaksresultatActivity = behandlingFormValueSelector(props.formName)(state, ACTIVITY_PANEL_NAME);
  const tilknyttetStortinget = !!props.aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.TILKNYTTET_STORTINGET && props.isApOpen);
  const isRevurdering = getBehandlingIsRevurdering(state);

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
    isRevurdering,
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
