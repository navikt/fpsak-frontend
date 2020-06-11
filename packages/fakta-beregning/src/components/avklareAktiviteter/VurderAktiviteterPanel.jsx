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
  while (i < gjeldendeTomDatoMapping.length && moment(dato).isBefore(gjeldendeTomDatoMapping[i].tom)) {
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
  const stpOpptjening = values.avklarAktiviteter.skjæringstidspunktOpptjening;

  // Alle aktiviteter som har t.o.m dato på en dag før, eller etter, skal legges til i gjeldendeTomDatoMapping
  forrigeTomDatoMapping.flatMap(({ aktiviteter }) => aktiviteter).forEach((aktivitet) => {
    const nyAktivitet = { ...aktivitet };
    const tomDato = values[lagAktivitetFieldId(aktivitet)].tom;
    if (tomDato !== nyAktivitet.tom) {
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
}) => (
  finnListerSomSkalVurderes(aktiviteterTomDatoMapping, values, erOverstyrt).map((aktivitetMap) => (
    <VurderAktiviteterTabell
      readOnly={readOnly}
      isAksjonspunktClosed={isAksjonspunktClosed}
      aktiviteter={aktivitetMap.aktiviteter}
      skjaeringstidspunkt={aktivitetMap.tom}
      erOverstyrt={erOverstyrt}
      harAksjonspunkt={harAksjonspunkt}
      alleKodeverk={alleKodeverk}
    />
  ))
);

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
};

VurderAktiviteterPanel.validate = (values, aktiviteterTomDatoMapping) => {
  const listerSomVurderes = finnListerSomSkalVurderes(aktiviteterTomDatoMapping, values);
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

VurderAktiviteterPanel.transformValues = (values, aktiviteterTomDatoMapping) => {
  const listerSomVurderes = finnListerSomSkalVurderes(aktiviteterTomDatoMapping, values);
  return ({
    beregningsaktivitetLagreDtoList: listerSomVurderes.flatMap((liste) => VurderAktiviteterTabell.transformValues(values, liste.aktiviteter)),
  });
};

VurderAktiviteterPanel.hasValueChangedFromInitial = (aktiviteterTomDatoMapping, values, initialValues) => {
  if (!aktiviteterTomDatoMapping) {
    return false;
  }
  const listerSomVurderes = finnListerSomSkalVurderes(aktiviteterTomDatoMapping, values);
  return listerSomVurderes.find((liste) => VurderAktiviteterTabell.hasValueChangedFromInitial(liste.aktiviteter, values, initialValues)) !== undefined;
};

VurderAktiviteterPanel.buildInitialValues = (aktiviteterTomDatoMapping, alleKodeverk, erOverstyrt, harAksjonspunkt) => {
  if (!aktiviteterTomDatoMapping || aktiviteterTomDatoMapping.length === 0) {
    return {};
  }
  let initialValues = {};
  aktiviteterTomDatoMapping.forEach((liste) => {
    initialValues = {
      ...initialValues,
      ...VurderAktiviteterTabell.buildInitialValues(liste.aktiviteter, alleKodeverk, erOverstyrt, harAksjonspunkt),
    };
  });
  return initialValues;
};


export default VurderAktiviteterPanel;
