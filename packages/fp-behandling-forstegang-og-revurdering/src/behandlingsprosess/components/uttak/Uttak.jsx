import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import {
  VerticalSpacer, FlexContainer, FlexRow, FlexColumn,
} from '@fpsak-frontend/shared-components';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import { getBehandlingFormPrefix } from '@fpsak-frontend/fp-behandling-felles';
import {
  calcDays, ISO_DATE_FORMAT, DDMMYY_DATE_FORMAT, calcDaysAndWeeks,
} from '@fpsak-frontend/utils';
import { CheckboxField } from '@fpsak-frontend/form';
import oppholdArsakType, { oppholdArsakMapper } from '@fpsak-frontend/kodeverk/src/oppholdArsakType';
import periodeResultatType from '@fpsak-frontend/kodeverk/src/periodeResultatType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { uttakPeriodeNavn } from '@fpsak-frontend/kodeverk/src/uttakPeriodeType';
import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';

import { behandlingFormValueSelector } from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import {
  getBehandlingYtelseFordeling,
  getFamiliehendelseGjeldende,
  getBehandlingIsRevurdering,
  getPersonopplysning,
  getUttaksresultatPerioder,
  getBehandlingUttaksperiodegrense,
  getBarnFraTpsRelatertTilSoknad,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import { tempUpdateStonadskontoer } from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/duckBpForstegangOgRev';
import { getRettigheter } from 'navAnsatt/duck';
import { getAlleKodeverk, getSelectedBehandlingId, getSelectedSaksnummer } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import TimeLineInfo from './stonadkonto/TimeLineInfo';
import UttakTimeLineData from './UttakTimeLineData';
import UttakTimeLine from './UttakTimeLine';
import UttakMedsokerReadOnly from './UttakMedsokerReadOnly';

import styles from './uttak.less';

const ACTIVITY_PANEL_NAME = 'uttaksresultatActivity';
const STONADSKONTOER_TEMP = 'stonadskonto';
const parseDateString = dateString => moment(dateString, ISO_DATE_FORMAT).toDate();
const godkjentKlassenavn = 'godkjentPeriode';
const avvistKlassenavn = 'avvistPeriode';
const endretClassnavn = 'endretPeriode';

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

const createTooltipContent = (periodeType, intl, item) => (`
  <p>
    ${moment(item.fom).format(DDMMYY_DATE_FORMAT)} - ${moment(item.tom).format(DDMMYY_DATE_FORMAT)}
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
     ${intl.formatMessage({ id: calcDaysAndWeeks(moment(item.fom), moment(item.tom)).id },
    {
      weeks: calcDaysAndWeeks(moment(item.fom), moment(item.tom)).weeks,
      days: calcDaysAndWeeks(moment(item.fom), moment(item.tom)).days,
    })}
    </br>
    ${item.utsettelseType && item.utsettelseType.kode !== '-'
    ? intl.formatMessage({ id: 'Timeline.tooltip.utsettelsePeriode' }) : periodeType}
   </p>
`);

const getCorrectPeriodName = (item, getKodeverknavn) => {
  if (item.utsettelseType && item.utsettelseType.kode !== '-') {
    return (<FormattedMessage id="Timeline.tooltip.slutt" />);
  }

  if (item.aktiviteter.length > 0 && item.aktiviteter[0].stønadskontoType) {
    return getKodeverknavn(item.aktiviteter[0].stønadskontoType);
  }

  if (item.oppholdÅrsak !== oppholdArsakType.UDEFINERT) {
    const stonadskonto = oppholdArsakMapper[item.oppholdÅrsak.kode];
    return uttakPeriodeNavn[stonadskonto];
  }

  return '';
};

const fodselsdato = (soknadsType, endredFodselsDato, familiehendelseDate, omsorgsOvertagelseDato) => {
  if (soknadsType === soknadType.FODSEL) {
    return (endredFodselsDato ? parseDateString(endredFodselsDato) : parseDateString(familiehendelseDate));
  }
  return parseDateString(omsorgsOvertagelseDato);
};

const getCustomTimes = (
  soknadDate,
  familiehendelseDate,
  endringsdato,
  soknadsType,
  omsorgsOvertagelseDato,
  endredFodselsDato,
  isRevurdering,
  barnFraTps,
  person,
  familiehendelse,
) => {
  // TODO: trumfa tps med avklartebarn fra lösningen - blir TPS-barn en del av dem?
  const dodeBarn = familiehendelse && !familiehendelse.brukAntallBarnFraTPS && familiehendelse.avklartBarn && familiehendelse.avklartBarn.length > 0
    ? familiehendelse.avklartBarn.filter(barn => barn.dodsdato) : barnFraTps.filter(barn => barn.dodsdato);

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

const isInnvilget = uttaksresultatActivity => uttaksresultatActivity.periodeResultatType.kode === periodeResultatType.INNVILGET;

/**
 * Uttak
 * Presentationskomponent. Masserer data og populerer felten samt formatterar tidslinjen for uttak
 */

export class UttakImpl extends Component {
  constructor(props) {
    super(props);
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
    this.skalViseCheckbox = this.skalViseCheckbox.bind(this);
    this.setSelectedDefaultPeriod = this.setSelectedDefaultPeriod.bind(this);
    this.updateStonadskontoer = this.updateStonadskontoer.bind(this);
    this.ikkeGyldigForbruk = this.ikkeGyldigForbruk.bind(this);

    this.state = {
      selectedItem: null,
      stonadskonto: props.stonadskonto,
    };
  }

  componentWillMount() {
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
    const defaultSelectedElement = uttakPerioder.find(period => period.periodeResultatType.kode === periodeResultatType.MANUELL_BEHANDLING);
    const defaultSelectedElementIfNoAP = uttakPerioder.find(period => period.hovedsoker);
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

    const otherThanUpdated = uttakPerioder.filter(o => o.id !== verdier.id && o.hovedsoker);
    const sortedActivities = otherThanUpdated.concat(verdier);
    sortedActivities.sort((a, b) => a.id - b.id);
    this.updateStonadskontoer(sortedActivities);
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

  testForReadOnly(aksjonspunkter, kanOverstyre) {
    const { manuellOverstyring } = this.props;
    const kunOverStyrAp = aksjonspunkter.length === 1
      && aksjonspunkter[0].definisjon.kode === aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER
      && aksjonspunkter[0].status.kode === 'OPPR';
    if (kunOverStyrAp && kanOverstyre) {
      return !kunOverStyrAp;
    }

    const activeUttakAp = aksjonspunkter.filter(ap => ap.definisjon.kode !== aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER);
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
    const apUtenOverstyre = aksjonspunkter.filter(a => a.definisjon.kode !== aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER);
    return apUtenOverstyre.length > 0 || kunOverStyrAp;
  }

  render() {
    const {
      soknadDate,
      familiehendelseDate,
      endringsdato,
      hovedsokerKjonnKode,
      medsokerKjonnKode,
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
      harSoktOmFlerbarnsdager,
      annenForelderSoktOmFlerbarnsdager,
      reduxFormChange: formChange,
      person,
      barnFraTps,
      familiehendelse,
    } = this.props;
    const { selectedItem, stonadskonto } = this.state;
    const customTimes = getCustomTimes(
      soknadDate,
      familiehendelseDate,
      endringsdato,
      soknadsType,
      omsorgsovertakelseDato,
      endredFodselsDato,
      isRevurdering,
      barnFraTps,
      person,
      familiehendelse,
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
            <>
              {selectedItem.hovedsoker
              && (
                <UttakTimeLineData
                  harSoktOmFlerbarnsdager={harSoktOmFlerbarnsdager}
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
                  stonadskonto={stonadskonto}
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
                  harSoktOmFlerbarnsdager={annenForelderSoktOmFlerbarnsdager}
                />
              )
              }
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
  formName: PropTypes.string.isRequired,
  soknadDate: PropTypes.string.isRequired,
  familiehendelseDate: PropTypes.string.isRequired,
  endringsdato: PropTypes.string.isRequired,
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
  harSoktOmFlerbarnsdager: PropTypes.bool.isRequired,
  annenForelderSoktOmFlerbarnsdager: PropTypes.bool.isRequired,
  tempUpdateStonadskontoer: PropTypes.func.isRequired,
  behandlingId: PropTypes.number.isRequired,
  saksnummer: PropTypes.number.isRequired,
  barnFraTps: PropTypes.arrayOf(PropTypes.shape()),
  person: PropTypes.shape(),
  familiehendelse: PropTypes.shape(),
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
  barnFraTps: [],
  person: undefined,
  familiehendelse: undefined,
};

const determineMottatDato = (soknadsDato, mottatDato) => {
  if (moment(mottatDato) < moment(soknadsDato)) {
    return mottatDato;
  }
  return soknadsDato;
};

const lagUttakMedOpphold = createSelector(
  [(state, props) => behandlingFormValueSelector(props.formName)(state, ACTIVITY_PANEL_NAME)],
    uttaksresultatActivity => uttaksresultatActivity.map((uttak) => {
      const { ...uttakPerioder } = uttak;

      // Setter trekkdager til null - brukes som lowkey feature-toggle - remove when everything works (06.05.19)
      if (uttakPerioder && uttakPerioder.aktiviteter.length > 0) {
        const aktivitetArray = uttakPerioder.aktiviteter;
        aktivitetArray.forEach((item) => {
          item.trekkdager = null; // eslint-disable-line no-param-reassign
        });
      }
      // remove to here
      if (uttak.oppholdÅrsak.kode !== oppholdArsakType.UDEFINERT) {
        const stonadskonto = oppholdArsakMapper[uttak.oppholdÅrsak.kode];
        const oppholdInfo = {
          stønadskontoType: {
            kode: stonadskonto,
            kodeverk: uttak.oppholdÅrsak.kodeverk,
            navn: uttakPeriodeNavn[stonadskonto],
          },
          trekkdagerDesimaler: calcDays(moment(uttak.fom.toString()), moment(uttak.tom.toString())),
          trekkdager: null,
        };
        uttakPerioder.aktiviteter = [oppholdInfo];
      }
      return uttakPerioder;
    }),
);

const lagUttaksresultatActivity = createSelector(
  [lagUttakMedOpphold, (state, props) => props], (uttakMedOpphold, props) => {
    const tilknyttetStortinget = !!props.aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.TILKNYTTET_STORTINGET && props.isApOpen);
    return uttakMedOpphold.map(periode => ({ tilknyttetStortinget, ...periode }));
  },
);

const getFodselTerminDato = createSelector(
  [behandlingSelectors.getSoknad, getFamiliehendelseGjeldende], (soknad, familiehendelse) => {
    if (familiehendelse && familiehendelse.avklartBarn && familiehendelse.avklartBarn.length > 0) {
      return familiehendelse.avklartBarn[0].fodselsdato;
    }
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
  },
);

const addClassNameGroupIdToPerioder = (hovedsokerPerioder, uttakResultatPerioder, intl, bStatus, alleKodeverk, hovedsoker) => {
    const behandlingStatusKode = bStatus.kode;
    const annenForelderPerioder = uttakResultatPerioder.perioderAnnenpart;
    const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
    const perioderMedClassName = [];
    const perioder = hovedsoker ? hovedsokerPerioder : annenForelderPerioder;

    perioder.forEach((item, index) => {
      const stonadskontoType = getCorrectPeriodName(item, getKodeverknavn);
      const opphold = item.oppholdÅrsak.kode !== oppholdArsakType.UDEFINERT;
      const status = hovedsoker ? getStatusPeriodeHoved(item) : getStatusPeriodeMed(item);
      const gradert = (item.gradertAktivitet && item.graderingInnvilget) ? 'gradert' : '';
      const copyOfItem = Object.assign({}, item);
      const isEndret = item.begrunnelse
      && behandlingStatusKode === behandlingStatus.FATTER_VEDTAK ? endretClassnavn : '';
      const oppholdStatus = status === 'undefined' ? 'opphold-manuell' : 'opphold';
      copyOfItem.id = index + 1 + (hovedsoker ? 0 : hovedsokerPerioder.length);
      copyOfItem.tomMoment = moment(item.tom).add(1, 'days');
      copyOfItem.className = opphold ? oppholdStatus : `${status} ${isEndret} ${gradert}`;
      copyOfItem.hovedsoker = hovedsoker;
      copyOfItem.group = annenForelderPerioder.length > 0 && hovedsoker ? 2 : 1;
      copyOfItem.title = createTooltipContent(stonadskontoType, intl, item);
      perioderMedClassName.push(copyOfItem);
    });
    return perioderMedClassName;
  };

const addClassNameGroupIdToPerioderHovedsoker = createSelector(
  [lagUttakMedOpphold, getUttaksresultatPerioder, (state, props) => props.intl, behandlingSelectors.getBehandlingStatus, getAlleKodeverk],
  (hovedsokerPerioder, uttakResultatPerioder, intl, bStatus, alleKodeverk) => addClassNameGroupIdToPerioder(
    hovedsokerPerioder, uttakResultatPerioder, intl, bStatus, alleKodeverk, true,
),
);

const addClassNameGroupIdToPerioderAnnenForelder = createSelector(
  [lagUttakMedOpphold, getUttaksresultatPerioder, (state, props) => props.intl, behandlingSelectors.getBehandlingStatus, getAlleKodeverk],
  (hovedsokerPerioder, uttakResultatPerioder, intl, bStatus, alleKodeverk) => addClassNameGroupIdToPerioder(
    hovedsokerPerioder, uttakResultatPerioder, intl, bStatus, alleKodeverk, false,
),
);

const slaSammenHovedsokerOgAnnenForelder = createSelector(
  [addClassNameGroupIdToPerioderHovedsoker, addClassNameGroupIdToPerioderAnnenForelder],
  (hovedsokerPerioder, annenForelderPerioder) => hovedsokerPerioder.concat(annenForelderPerioder),
);

const mapStateToProps = (state, props) => {
  const soknad = behandlingSelectors.getSoknad(state);
  const person = getPersonopplysning(state);
  const periodeGrenseMottatDato = getBehandlingUttaksperiodegrense(state).mottattDato;
  const hovedsokerKjonnKode = person ? person.navBrukerKjonn.kode : undefined;
  const annenForelderUttak = getUttaksresultatPerioder(state).perioderAnnenpart;
  const viseUttakMedsoker = annenForelderUttak.length > 0;
  const getMedsokerKjonnKode = (viseUttakMedsoker && person && person.annenPart) ? person.annenPart.navBrukerKjonn.kode : undefined;
  // hvis ukjent annenpart og annenpart uttak, vis ukjent ikon
  const medsokerKjonnKode = viseUttakMedsoker && getMedsokerKjonnKode === undefined ? navBrukerKjonn.UDEFINERT : getMedsokerKjonnKode;
  const familiehendelse = getFamiliehendelseGjeldende(state);
  const ytelseFordeling = getBehandlingYtelseFordeling(state);
  const barnFraTps = getBarnFraTpsRelatertTilSoknad(state);

  const isRevurdering = getBehandlingIsRevurdering(state);

  const uttaksresultatActivity = lagUttaksresultatActivity(state, props);
  const familiehendelseDate = getFodselTerminDato(state);

  const hovedsokerPerioder = addClassNameGroupIdToPerioderHovedsoker(state, props);
  const annenForelderPerioder = addClassNameGroupIdToPerioderAnnenForelder(state, props);
  const uttakPerioder = slaSammenHovedsokerOgAnnenForelder(state, props);
  const harSoktOmFlerbarnsdager = hovedsokerPerioder.filter(p => p.flerbarnsdager === true).length > 0;
  const annenForelderSoktOmFlerbarnsdager = annenForelderPerioder.filter(p => p.flerbarnsdager === true).length > 0;

  return {
    saksnummer: getSelectedSaksnummer(state),
    behandlingId: getSelectedBehandlingId(state),
    soknadDate: determineMottatDato(periodeGrenseMottatDato, soknad.mottattDato),
    endringsdato: ytelseFordeling.endringsdato ? ytelseFordeling.endringsdato : undefined,
    dekningsgrad: soknad.dekningsgrad ? soknad.dekningsgrad : undefined,
    stonadskonto: behandlingFormValueSelector(props.formName)(state, STONADSKONTOER_TEMP),
    behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), behandlingSelectors.getBehandlingVersjon(state)),
    kanOverstyre: getRettigheter(state).kanOverstyreAccess.employeeHasAccess,
    soknadsType: soknad.soknadType.kode,
    omsorgsovertakelseDato: soknad.omsorgsovertakelseDato,
    endredFodselsDato: familiehendelse.fodselsdato,
    uttaksresultatActivity,
    familiehendelseDate,
    hovedsokerKjonnKode,
    medsokerKjonnKode,
    isRevurdering,
    uttakPerioder,
    harSoktOmFlerbarnsdager,
    annenForelderSoktOmFlerbarnsdager,
    barnFraTps,
    person,
    familiehendelse,
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
    tempUpdateStonadskontoer,
  }, dispatch),
});

const Uttak = connect(mapStateToProps, mapDispatchToProps)(injectIntl(UttakImpl));
export default Uttak;
