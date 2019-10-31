import { createSelector } from 'reselect';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { behandlingFormValueSelector, getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import oppholdArsakType, { oppholdArsakMapper } from '@fpsak-frontend/kodeverk/src/oppholdArsakType';
import periodeResultatType from '@fpsak-frontend/kodeverk/src/periodeResultatType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import {
  calcDays, calcDaysAndWeeks, DDMMYY_DATE_FORMAT,
} from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { uttakPeriodeNavn } from '@fpsak-frontend/kodeverk/src/uttakPeriodeType';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';


const ACTIVITY_PANEL_NAME = 'uttaksresultatActivity';
const endretClassnavn = 'endretPeriode';
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

export const lagUttakMedOpphold = createSelector(
  [(state, props) => behandlingFormValueSelector(props.formName, props.behandlingId, props.behandlingVersjon)(state, ACTIVITY_PANEL_NAME)],
  (uttaksresultatActivity) => uttaksresultatActivity.map((uttak) => {
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

export const addClassNameGroupIdToPerioder = (hovedsokerPerioder, uttakResultatPerioder, intl, bStatus, alleKodeverk, hovedsoker) => {
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
    const copyOfItem = { ...item };
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

export const getFodselTerminDato = createSelector(
  [(props) => props.termindato, (props) => props.fodselsdatoer, (props) => props.adopsjonFodelsedatoer,
    (props) => props.familiehendelse.gjeldende],
  (termindato, fodselsdatoer, adopsjonFodelsedatoer, familiehendelse) => {
    if (familiehendelse && familiehendelse.avklartBarn && familiehendelse.avklartBarn.length > 0) {
      return familiehendelse.avklartBarn[0].fodselsdato;
    }
    if (fodselsdatoer && Object.keys(fodselsdatoer).length > 0) {
      return Object.values(fodselsdatoer)[0];
    }
    if (termindato) {
      return termindato;
    }
    if (adopsjonFodelsedatoer && Object.keys(adopsjonFodelsedatoer).length > 0) {
      return Object.values(adopsjonFodelsedatoer)[0];
    }
    return undefined;
  },
);

export const addClassNameGroupIdToPerioderHovedsoker = createSelector(
  [lagUttakMedOpphold, (_state, props) => props.uttaksresultat,
    (_state, props) => props.intl, (_state, props) => props.behandlingStatus, (_state, props) => props.alleKodeverk],
  (hovedsokerPerioder, uttakResultatPerioder, intl, bStatus, alleKodeverk) => addClassNameGroupIdToPerioder(
    hovedsokerPerioder, uttakResultatPerioder, intl, bStatus, alleKodeverk, true,
  ),
);

export const addClassNameGroupIdToPerioderAnnenForelder = createSelector(
  [lagUttakMedOpphold, (_state, props) => props.uttaksresultat,
    (_state, props) => props.intl, (_state, props) => props.behandlingStatus, (_state, props) => props.alleKodeverk],
  (hovedsokerPerioder, uttakResultatPerioder, intl, bStatus, alleKodeverk) => addClassNameGroupIdToPerioder(
    hovedsokerPerioder, uttakResultatPerioder, intl, bStatus, alleKodeverk, false,
  ),
);

export const slaSammenHovedsokerOgAnnenForelder = createSelector(
  [addClassNameGroupIdToPerioderHovedsoker, addClassNameGroupIdToPerioderAnnenForelder],
  (hovedsokerPerioder, annenForelderPerioder) => hovedsokerPerioder.concat(annenForelderPerioder),
);

export const lagUttaksresultatActivity = createSelector(
  [lagUttakMedOpphold, (_state, props) => props], (uttakMedOpphold, props) => {
    const tilknyttetStortinget = !!props.aksjonspunkter.find((ap) => ap.definisjon.kode === aksjonspunktCodes.TILKNYTTET_STORTINGET && props.isApOpen);
    return uttakMedOpphold.map((periode) => ({ tilknyttetStortinget, ...periode }));
  },
);

export const getBarnFraTpsRelatertTilSoknad = createSelector([(props) => props.familiehendelse.register],
  (register = {}) => (register ? register.avklartBarn : []));

export const getBehandlingIsRevurdering = createSelector([(props) => props.behandlingType], (bhType) => bhType.kode === behandlingType.REVURDERING);
