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
}) => (
  <VurderAktiviteterTabell
    readOnly={readOnly}
    isAksjonspunktClosed={isAksjonspunktClosed}
    aktiviteter={aktiviteterTomDatoMapping[0].aktiviteter}
    skjaeringstidspunkt={aktiviteterTomDatoMapping[0].tom}
  />
);

VurderAktiviteterPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
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

VurderAktiviteterPanel.buildInitialValues = (aktiviteterTomDatoMapping, getKodeverknavn) => {
  if (!aktiviteterTomDatoMapping) {
    return {};
  }
  return VurderAktiviteterTabell.buildInitialValues(aktiviteterTomDatoMapping[0].aktiviteter, getKodeverknavn);
};

export default VurderAktiviteterPanel;
