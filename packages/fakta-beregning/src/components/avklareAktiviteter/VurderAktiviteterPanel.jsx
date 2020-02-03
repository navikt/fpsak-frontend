import React from 'react';
import PropTypes from 'prop-types';
import beregningAktivitetPropType from './beregningAktivitetPropType';
import VurderAktiviteterTabell, { lagAktivitetFieldId } from './VurderAktiviteterTabell';


const harListeAktivitetSomSkalBrukes = (mapping, values) => mapping.aktiviteter
  .find((aktivitet) => {
    const fieldId = lagAktivitetFieldId(aktivitet);
    const { skalBrukes } = values[fieldId] !== undefined && values[fieldId] !== null ? values[fieldId] : aktivitet.skalBrukes;
    return skalBrukes;
  }) !== undefined;


const finnListerSomSkalVurderes = (aktiviteterTomDatoMapping, values) => {
  if (!values || harListeAktivitetSomSkalBrukes(aktiviteterTomDatoMapping[0], values) || aktiviteterTomDatoMapping.length === 1) {
    return [aktiviteterTomDatoMapping[0]];
  }
  return [aktiviteterTomDatoMapping[0], aktiviteterTomDatoMapping[1]];
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
  finnListerSomSkalVurderes(aktiviteterTomDatoMapping, values).map((aktivitetMap) => (
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
