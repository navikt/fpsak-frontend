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
}) => (
  <VurderAktiviteterTabell
    readOnly={readOnly}
    isAksjonspunktClosed={isAksjonspunktClosed}
    aktiviteter={aktiviteterTomDatoMapping[0].aktiviteter}
    skjaeringstidspunkt={aktiviteterTomDatoMapping[0].tom}
    erOverstyrt={erOverstyrt}
    harAksjonspunkt={harAksjonspunkt}
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
};

VurderAktiviteterPanel.transformValues = (values, aktiviteterTomDatoMapping) => ({
  beregningsaktivitetLagreDtoList: VurderAktiviteterTabell.transformValues(values, aktiviteterTomDatoMapping[0].aktiviteter),
});


VurderAktiviteterPanel.hasValueChangedFromInitial = (aktiviteterTomDatoMapping, values, initialValues) => {
  if (!aktiviteterTomDatoMapping) {
    return false;
  }
  return VurderAktiviteterTabell.hasValueChangedFromInitial(aktiviteterTomDatoMapping[0].aktiviteter, values, initialValues);
};

VurderAktiviteterPanel.buildInitialValues = (aktiviteterTomDatoMapping, getKodeverknavn, erOverstyrt, harAksjonspunkt) => {
  if (!aktiviteterTomDatoMapping || aktiviteterTomDatoMapping.length === 0) {
    return {};
  }
  return VurderAktiviteterTabell.buildInitialValues(aktiviteterTomDatoMapping[0].aktiviteter, getKodeverknavn, erOverstyrt, harAksjonspunkt);
};

export default VurderAktiviteterPanel;
