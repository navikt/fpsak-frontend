import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { getBehandlingFormValues } from 'behandlingFpsak/behandlingForm';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

import {
  getAksjonspunkter,
  getAvklarAktiviteter,
} from 'behandlingFpsak/behandlingSelectors';
import VentelonnVartpengerPanel,
{ erVerdiForVentelonnVartpengerEndret, erInkludertverdiForVentelonnVartpengerSatt, harVerdiBlittSattTidligere } from './VentelonnVartpengerPanel';

const {
  AVKLAR_AKTIVITETER,
} = aksjonspunktCodes;

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);


export const erAktivitetAvklartOgIkkeEndret = formName => createSelector(
  [getAksjonspunkter, getAvklarAktiviteter, getBehandlingFormValues(formName)],
  (aksjonspunkter, avklarAktiviteter, values) => {
    if (!hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)) {
      return false;
    }
    if (avklarAktiviteter && avklarAktiviteter.ventelonnVartpenger) {
      return erInkludertverdiForVentelonnVartpengerSatt(values)
      && (!harVerdiBlittSattTidligere(avklarAktiviteter) || !erVerdiForVentelonnVartpengerEndret(values, avklarAktiviteter));
    }
    return false;
  },
);

/**
 * AvklareAktiviteterPanel
 *
 * Container komponent.. Inneholder panel for å avklare om aktivitet fra opptjening skal tas med i beregning
 */
export const AvklareAktiviteterPanelImpl = ({
  readOnly,
  avklarAktiviteter,
  isAksjonspunktClosed,
}) => (
  <div>
    {avklarAktiviteter.ventelonnVartpenger
      && (
      <VentelonnVartpengerPanel
        readOnly={readOnly}
        isAksjonspunktClosed={isAksjonspunktClosed}
      />
      )
    }
  </div>
);


AvklareAktiviteterPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  avklarAktiviteter: PropTypes.shape().isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
};

// /// TRANSFORM VALUES METHODS ///////

export const transformValuesAvklarAktiviteter = createSelector(
  [getAksjonspunkter, getAvklarAktiviteter],
  (aksjonspunkter, avklarAktiviteter) => (values) => {
    if (hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)) {
      if (avklarAktiviteter && avklarAktiviteter.ventelonnVartpenger) {
        const ventelonnVartpengerTransformed = VentelonnVartpengerPanel.transformValues(values, avklarAktiviteter);
        if (ventelonnVartpengerTransformed) {
          const beg = values.begrunnelse;
          return {
            kode: AVKLAR_AKTIVITETER,
            begrunnelse: beg === undefined ? null : beg,
            ...ventelonnVartpengerTransformed,
          };
        }
      }
    }
    return null;
  },
);

// /// BUILD INITIAL VALUES METHODS ///////

export const buildInitialValuesAvklarAktiviteter = createSelector(
  [getAksjonspunkter, getAvklarAktiviteter],
  (aksjonspunkter, avklarAktiviteter) => {
    if (!hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)) {
      return {};
    }
    if (avklarAktiviteter && avklarAktiviteter.ventelonnVartpenger) {
      return VentelonnVartpengerPanel.buildInitialValues(avklarAktiviteter);
    }
    return null;
  },
);

// / VALIDATION METHODS ///

export const getValidationAvklarAktiviteter = createSelector([getAksjonspunkter, getAvklarAktiviteter], (aksjonspunkter, avklarAktiviteter) => (values) => {
  if (hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)) {
    if (avklarAktiviteter && avklarAktiviteter.ventelonnVartpenger) {
      return VentelonnVartpengerPanel.validate(values);
    }
  }
  return null;
});


// // MAP STATE TO PROPS METHODS //////

const mapStateToProps = (state) => {
  const avklarAktiviteter = getAvklarAktiviteter(state);
  const alleAp = getAksjonspunkter(state);
  const relevantAp = alleAp.filter(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN);
  const isAksjonspunktClosed = relevantAp.length === 0 ? undefined : !isAksjonspunktOpen(relevantAp[0].status.kode);
  return {
    isAksjonspunktClosed,
    avklarAktiviteter,
  };
};

export default connect(mapStateToProps)(AvklareAktiviteterPanelImpl);
