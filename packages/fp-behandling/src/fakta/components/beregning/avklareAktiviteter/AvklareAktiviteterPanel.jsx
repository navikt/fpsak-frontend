import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { VerticalSpacer, ElementWrapper } from '@fpsak-frontend/shared-components';
import { FaktaBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  getAksjonspunkter,
  getAvklarAktiviteter,
} from 'behandlingFpsak/src/behandlingSelectors';
import { getFormValuesForBeregning, getFormInitialValuesForBeregning } from '../BeregningFormUtils';
import VentelonnVartpengerPanel from './VentelonnVartpengerPanel';

const {
  AVKLAR_AKTIVITETER,
} = aksjonspunktCodes;

export const BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME = 'begrunnelseAvklareAktiviteter';


const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

const findAksjonspunktMedBegrunnelse = aksjonspunkter => aksjonspunkter
  .filter(ap => ap.definisjon.kode === AVKLAR_AKTIVITETER && ap.begrunnelse !== null)[0];


export const erAvklartAktivitetEndret = createSelector(
  [getAksjonspunkter, getAvklarAktiviteter, getFormValuesForBeregning, getFormInitialValuesForBeregning],
  (aksjonspunkter, avklarAktiviteter, values, initialValues) => {
    if (!hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)) {
      return false;
    }
    if (values && avklarAktiviteter && avklarAktiviteter.ventelonnVartpenger) {
      return VentelonnVartpengerPanel.hasValueChangedFromInitial(values, initialValues);
    }
    return false;
  },
);

export const getHelpTextsAvklarAktiviteter = createSelector(
  [getAksjonspunkter],
  aksjonspunkter => (hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)
    ? [<FormattedMessage key="VurderFaktaForBeregningen" id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning" />]
    : []),
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
  submittable,
  hasBegrunnelse,
  isDirty,
}) => (
  <ElementWrapper>
    {avklarAktiviteter.ventelonnVartpenger
      && (
      <VentelonnVartpengerPanel
        readOnly={readOnly}
        isAksjonspunktClosed={isAksjonspunktClosed}
      />
      )
    }
    <VerticalSpacer eightPx />
    <VerticalSpacer twentyPx />
    <FaktaBegrunnelseTextField
      name={BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME}
      isDirty={isDirty}
      isSubmittable={submittable}
      isReadOnly={readOnly}
      hasBegrunnelse={hasBegrunnelse}
    />
  </ElementWrapper>
);


AvklareAktiviteterPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  avklarAktiviteter: PropTypes.shape().isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  isDirty: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
};

// /// TRANSFORM VALUES METHODS ///////

export const transformValuesAvklarAktiviteter = createSelector(
  [getAksjonspunkter, getAvklarAktiviteter],
  (aksjonspunkter, avklarAktiviteter) => (values) => {
    if (hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)) {
      if (avklarAktiviteter && avklarAktiviteter.ventelonnVartpenger) {
        const ventelonnVartpengerTransformed = VentelonnVartpengerPanel.transformValues(values, avklarAktiviteter);
        if (ventelonnVartpengerTransformed) {
          const beg = values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME];
          return [{
            kode: AVKLAR_AKTIVITETER,
            begrunnelse: beg === undefined ? null : beg,
            ...ventelonnVartpengerTransformed,
          }];
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
    let initialValues = {};
    if (avklarAktiviteter && avklarAktiviteter.ventelonnVartpenger) {
      initialValues = VentelonnVartpengerPanel.buildInitialValues(avklarAktiviteter);
    }
    return {
      ...initialValues,
      ...FaktaBegrunnelseTextField.buildInitialValues(findAksjonspunktMedBegrunnelse(aksjonspunkter), BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME),
    };
  },
);

// / VALIDATION METHODS ///

export const getValidationAvklarAktiviteter = createSelector([getAksjonspunkter, getAvklarAktiviteter], (aksjonspunkter, avklarAktiviteter) => (values) => {
  if (hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)) {
    let errors = {};
    if (avklarAktiviteter && avklarAktiviteter.ventelonnVartpenger) {
      errors = VentelonnVartpengerPanel.validate(values);
    }
    return errors;
  }
  return null;
});


// // MAP STATE TO PROPS METHODS //////

const mapStateToProps = (state) => {
  const avklarAktiviteter = getAvklarAktiviteter(state);
  const alleAp = getAksjonspunkter(state);
  const relevantAp = alleAp.filter(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_AKTIVITETER);
  const isAksjonspunktClosed = relevantAp.length === 0 ? undefined : !isAksjonspunktOpen(relevantAp[0].status.kode);
  const initialValues = getFormInitialValuesForBeregning(state);
  const hasBegrunnelse = initialValues
  && !!initialValues[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME];
  return {
    isAksjonspunktClosed,
    avklarAktiviteter,
    hasBegrunnelse,
  };
};

export default connect(mapStateToProps)(AvklareAktiviteterPanelImpl);
