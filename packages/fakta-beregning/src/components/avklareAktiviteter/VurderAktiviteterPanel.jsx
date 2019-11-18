import React from 'react';
import PropTypes from 'prop-types';
import beregningAktivitetPropType from './beregningAktivitetPropType';
import VurderAktiviteterTabell from './VurderAktiviteterTabell';


/**
 * VurderAktiviteterPanel
 *
 * Presentasjonskomponent.. Inneholder tabeller for avklaring av skjæringstidspunkt
 */
export const VurderAktiviteterPanel = ({
  readOnly,
  isAksjonspunktClosed,
  aktiviteterTomDatoMapping,
  erOverstyrt,
  harAksjonspunkt,
  alleKodeverk,
}) => (
  <VurderAktiviteterTabell
    readOnly={readOnly}
    isAksjonspunktClosed={isAksjonspunktClosed}
    aktiviteter={aktiviteterTomDatoMapping[0].aktiviteter}
    skjaeringstidspunkt={aktiviteterTomDatoMapping[0].tom}
    erOverstyrt={erOverstyrt}
    harAksjonspunkt={harAksjonspunkt}
    alleKodeverk={alleKodeverk}
  />
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

VurderAktiviteterPanel.validate = (values, aktiviteterTomDatoMapping) => VurderAktiviteterTabell.validate(values, aktiviteterTomDatoMapping[0].aktiviteter);

VurderAktiviteterPanel.transformValues = (values, aktiviteterTomDatoMapping) => ({
  beregningsaktivitetLagreDtoList: VurderAktiviteterTabell.transformValues(values, aktiviteterTomDatoMapping[0].aktiviteter),
});

VurderAktiviteterPanel.hasValueChangedFromInitial = (aktiviteterTomDatoMapping, values, initialValues) => {
  if (!aktiviteterTomDatoMapping) {
    return false;
  }
  return VurderAktiviteterTabell.hasValueChangedFromInitial(aktiviteterTomDatoMapping[0].aktiviteter, values, initialValues);
};

VurderAktiviteterPanel.buildInitialValues = (aktiviteterTomDatoMapping, alleKodeverk, erOverstyrt, harAksjonspunkt) => {
  if (!aktiviteterTomDatoMapping || aktiviteterTomDatoMapping.length === 0) {
    return {};
  }
  return VurderAktiviteterTabell.buildInitialValues(aktiviteterTomDatoMapping[0].aktiviteter, alleKodeverk, erOverstyrt, harAksjonspunkt);
};

export default VurderAktiviteterPanel;
