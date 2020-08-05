import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import beregningAktivitetPropType from './beregningAktivitetPropType';
import VurderAktiviteterTabell, { lagAktivitetFieldId } from './VurderAktiviteterTabell';

const harListeAktivitetSomSkalBrukes = (mapping, values) => mapping.aktiviteter
  .find((aktivitet) => {
    const fieldId = lagAktivitetFieldId(aktivitet);
    const { skalBrukes } = values[fieldId] !== undefined && values[fieldId] !== null ? values[fieldId] : aktivitet.skalBrukes;
    return skalBrukes;
  }) !== undefined;

export const finnPlasseringIListe = (gjeldendeTomDatoMapping, dato) => {
  let i = 0;
  while (i < gjeldendeTomDatoMapping.length && moment(dato).isBefore(gjeldendeTomDatoMapping[i].tom === undefined ? null : gjeldendeTomDatoMapping[i].tom)) {
    i += 1;
  }
  return i;
};

export const leggTilAktivitet = (gjeldendeTomDatoMapping, aktivitet, tomDato) => {
  // Finnes gjeldendeTomDatoMapping med tomDato ?
  const eksisterende = gjeldendeTomDatoMapping.find(({ tom }) => tom === tomDato);
  if (eksisterende === undefined) {
    const nyTomDatoMapping = {
      tom: tomDato,
      aktiviteter: [aktivitet],
    };
    const index = finnPlasseringIListe(gjeldendeTomDatoMapping, tomDato);
    gjeldendeTomDatoMapping.splice(index, 0, nyTomDatoMapping);
  } else {
    eksisterende.aktiviteter.push(aktivitet);
  }
};

export const lagTomDatoMapping = (values) => {
  const forrigeTomDatoMapping = values.avklarAktiviteter.aktiviteterTomDatoMapping;
  const gjeldendeTomDatoMapping = [];
  const stpOpptjening = values.avklarAktiviteter.skjæringstidspunkt;

  // Alle aktiviteter som har t.o.m dato på en dag før, eller etter, skal legges til i gjeldendeTomDatoMapping
  forrigeTomDatoMapping.flatMap(({ aktiviteter }) => aktiviteter).forEach((aktivitet) => {
    const nyAktivitet = { ...aktivitet };
    const tomDato = values[lagAktivitetFieldId(aktivitet)].tom;
    if (!!tomDato && tomDato !== nyAktivitet.tom) {
      nyAktivitet.tom = tomDato;
    }
    if (moment(tomDato).isSameOrAfter(moment(stpOpptjening).subtract(1, 'days'))) {
      leggTilAktivitet(gjeldendeTomDatoMapping, nyAktivitet, stpOpptjening);
    } else {
      leggTilAktivitet(gjeldendeTomDatoMapping, nyAktivitet, moment(tomDato).add(1, 'days').format('YYYY-MM-DD'));
    }
  });
  return gjeldendeTomDatoMapping;
};

/**
 * Returnerer aktuelle aktivitetslister som skal vises frem i panelet (f.eks om man skal vise frem benyttet aktivitet,
 * eller også andre aktiviteter for overstyring)
 */
const finnListerSomSkalVurderes = (aktiviteterTomDatoMapping, values, erOverstyrt) => {
  const nyTomDatoMapping = values ? lagTomDatoMapping(values) : aktiviteterTomDatoMapping;
  if (erOverstyrt) {
    return nyTomDatoMapping;
  }
  if (!values || harListeAktivitetSomSkalBrukes(nyTomDatoMapping[0], values) || nyTomDatoMapping.length === 1) {
    return [nyTomDatoMapping[0]];
  }
  return [nyTomDatoMapping[0], nyTomDatoMapping[1]];
};

/**
 *  Utleder "gjeldende" skjæringstidspunkt (s.t.p) av lister med aktiviteter inndelt i skjæringstidspunkt.
 *  Disse inndelingene antas sortert i rekkefølge med seneste s.t.p først. Det sjekkes derfor  i rekkefølge om
 *  en aktivitet skal brukes (skalBrukes), og s.t.p for inndelingen til den første aktiviteten som
 *  skal brukes blir brukt.
 *
 *  Det antas altså at et s.t.p for en aktivitet er angitt i listeSomSkalVurderes[k].tom, der
 *  listeSomSkalVurderes[k].aktiviteter er en samling aktiviteter for s.t.p inndeling 'k'.
 *  (Liste med lister av aktiviteter).
 *
 * @param {*} values - Verdier fra nåværende form values
 * @param {*} listeSomSkalVurderes - Liste med aktiviteter delt inn i "bøtter" for skjæringstidspunkt
 * @returns seneste skjæringstidspunkt for en aktivitet som er satt til "skalBrukes". Undefined hvis
 * noen av argumentene er undefined.
 */
const utledGjeldendeSkjæringstidspunkt = (values, listeSomSkalVurderes) => {
  if (values === undefined || listeSomSkalVurderes === undefined) {
    return undefined;
  }
  for (let k = 0; k < listeSomSkalVurderes.length; k += 1) {
    const { aktiviteter } = listeSomSkalVurderes[k];
    for (let i = 0; i < aktiviteter.length; i += 1) {
      const tempaktivitet = values[lagAktivitetFieldId(aktiviteter[i])];
      if (tempaktivitet.skalBrukes) {
        return listeSomSkalVurderes[k].tom;
      }
    }
  }
  return undefined;
};

/**
 * VurderAktiviteterPanel
 *
 * Presentasjonskomponent.. Inneholder tabeller for avklaring av skjæringstidspunkt
 */
export const VurderAktiviteterPanel = ({
  readOnly,
  isAksjonspunktClosed,
  values,
  aktiviteterTomDatoMapping,
  erOverstyrt,
  harAksjonspunkt,
  alleKodeverk,
  formNameAvklarAktiviteter,
  behandlingId,
  behandlingVersjon,
}) => {
  const listeSomSkalVurderes = finnListerSomSkalVurderes(aktiviteterTomDatoMapping, values, erOverstyrt);
  const gjeldendeSkjæringstidspunkt = utledGjeldendeSkjæringstidspunkt(values, listeSomSkalVurderes);

  return listeSomSkalVurderes.map((aktivitetMap) => (
    <VurderAktiviteterTabell
      readOnly={readOnly}
      isAksjonspunktClosed={isAksjonspunktClosed}
      aktiviteter={aktivitetMap.aktiviteter}
      erOverstyrt={erOverstyrt}
      harAksjonspunkt={harAksjonspunkt}
      alleKodeverk={alleKodeverk}
      tomDatoForAktivitetGruppe={aktivitetMap.tom}
      valgtSkjæringstidspunkt={gjeldendeSkjæringstidspunkt}
      ingenAktiviterErBrukt={gjeldendeSkjæringstidspunkt === undefined}
      formNameAvklarAktiviteter={formNameAvklarAktiviteter}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
    />
  ));
};

VurderAktiviteterPanel.propTypes = {
  erOverstyrt: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  harAksjonspunkt: PropTypes.bool.isRequired,
  aktiviteterTomDatoMapping: PropTypes.arrayOf(PropTypes.shape({
    tom: PropTypes.string,
    aktiviteter: PropTypes.arrayOf(beregningAktivitetPropType),
  })).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  formNameAvklarAktiviteter: PropTypes.string.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

VurderAktiviteterPanel.validate = (values, aktiviteterTomDatoMapping, erOverstyrt) => {
  const listerSomVurderes = finnListerSomSkalVurderes(aktiviteterTomDatoMapping, values, erOverstyrt);
  let errors = VurderAktiviteterTabell.validate(values, listerSomVurderes[0].aktiviteter);
  if (errors !== null) {
    return errors;
  }
  const harAktiviteterSomSkalBrukes = harListeAktivitetSomSkalBrukes(listerSomVurderes[0], values);
  if (harAktiviteterSomSkalBrukes) {
    return {};
  }
  const harAktiviteterINesteSkjæringstidspunkt = listerSomVurderes.length > 1
    && listerSomVurderes[1].aktiviteter.length > 0;
  if (!harAktiviteterINesteSkjæringstidspunkt) {
    return { _error: 'VurderAktiviteterTabell.Validation.MåHaMinstEnAktivitet' };
  }
  errors = VurderAktiviteterTabell.validate(values, listerSomVurderes[1].aktiviteter);
  if (errors !== null) {
    return errors;
  }
  const harAktiviteterSomSkalBrukesINesteSkjæringstidspunkt = harListeAktivitetSomSkalBrukes(listerSomVurderes[1], values);
  if (!harAktiviteterSomSkalBrukesINesteSkjæringstidspunkt) {
    return { _error: 'VurderAktiviteterTabell.Validation.MåHaMinstEnAktivitet' };
  }
  return {};
};

const erLikEllerFør = (dato1, dato2) => moment(dato1).isSameOrBefore(moment(dato2));

VurderAktiviteterPanel.transformValues = (values, aktiviteterTomDatoMapping, erOverstyrt) => {
  const listerSomVurderes = finnListerSomSkalVurderes(aktiviteterTomDatoMapping, values, erOverstyrt);
  const gjeldendeSkjæringstidspunkt = utledGjeldendeSkjæringstidspunkt(values, listerSomVurderes);
  return ({
    beregningsaktivitetLagreDtoList: listerSomVurderes
      .flatMap((liste) => VurderAktiviteterTabell.transformValues(values, liste.aktiviteter, gjeldendeSkjæringstidspunkt, liste.tom)),
  });
};

VurderAktiviteterPanel.hasValueChangedFromInitial = (aktiviteterTomDatoMapping, values, initialValues) => {
  if (!aktiviteterTomDatoMapping) {
    return false;
  }
  const listerSomVurderes = finnListerSomSkalVurderes(aktiviteterTomDatoMapping, values);
  return listerSomVurderes.find((liste) => VurderAktiviteterTabell.hasValueChangedFromInitial(liste.aktiviteter, values, initialValues)) !== undefined;
};

/**
 *  Utleder "gjeldende" skjæringstidspunkt (s.t.p) av lister med aktiviteter inndelt i skjæringstidspunkt.
 *  Disse inndelingene antas sortert i rekkefølge med seneste s.t.p først. Det sjekkes derfor  i rekkefølge om
 *  en aktivitet skal brukes (skalBrukes), og s.t.p for inndelingen til den første aktiviteten som
 *  skal brukes blir brukt.
 *
 *  Det antas altså at et s.t.p for en aktivitet er angitt i listeSomSkalVurderes[k].tom, der
 *  listeSomSkalVurderes[k].aktiviteter er en samling aktiviteter for s.t.p inndeling 'k'.
 *  (Liste med lister av aktiviteter).
 *
 * @param {*} values - Verdier fra nåværende form values
 * @param {*} listeSomSkalVurderes - Liste med aktiviteter delt inn i "bøtter" for skjæringstidspunkt
 * @returns seneste skjæringstidspunkt for en aktivitet som er satt til "skalBrukes". Undefined hvis
 * noen av argumentene er undefined.
 */
const utledGjeldendeSkjæringstidspunktVedPreutfylling = (aktiviteterTomDatoMapping) => {
  if (aktiviteterTomDatoMapping === undefined) {
    return undefined;
  }
  for (let k = 0; k < aktiviteterTomDatoMapping.length; k += 1) {
    const { aktiviteter } = aktiviteterTomDatoMapping[k];
    for (let i = 0; i < aktiviteter.length; i += 1) {
      const skalBrukes = aktiviteter[i].skalBrukes === true || aktiviteter[i].skalBrukes === null || aktiviteter[i].skalBrukes === undefined;
      if (skalBrukes) {
        return aktiviteterTomDatoMapping[k].tom;
      }
    }
  }
  return undefined;
};

VurderAktiviteterPanel.buildInitialValues = (aktiviteterTomDatoMapping, alleKodeverk, erOverstyrt, harAksjonspunkt) => {
  if (!aktiviteterTomDatoMapping || aktiviteterTomDatoMapping.length === 0) {
    return {};
  }
  let initialValues = {};
  const gjeldendeSkjæringstidspunkt = utledGjeldendeSkjæringstidspunktVedPreutfylling(aktiviteterTomDatoMapping);

  aktiviteterTomDatoMapping.forEach((liste) => {
    initialValues = {
      ...initialValues,
      ...VurderAktiviteterTabell.buildInitialValues(liste.aktiviteter, alleKodeverk, erOverstyrt,
        harAksjonspunkt, erLikEllerFør(gjeldendeSkjæringstidspunkt, liste.tom)),
    };
  });
  return initialValues;
};

export default VurderAktiviteterPanel;
