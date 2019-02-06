import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormSection } from 'redux-form';
import { createSelector } from 'reselect';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { getBehandlingFormInitialValues } from 'behandlingFpsak/src/behandlingForm';

import { FaktaBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  getAksjonspunkter,
} from 'behandlingFpsak/src/behandlingSelectors';
import FaktaForATFLOgSNPanel, {
  transformValuesFaktaForATFLOgSN,
  getBuildInitialValuesFaktaForATFLOgSN, getValidationFaktaForATFLOgSN,
} from './FaktaForATFLOgSNPanel';


const {
  VURDER_FAKTA_FOR_ATFL_SN,
} = aksjonspunktCodes;

export const VURDER_FAKTA_BEREGNING_FORM_NAME = 'tilfellerFormSection';

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

const findAksjonspunktMedBegrunnelse = aksjonspunkter => aksjonspunkter
  .filter(ap => ap.definisjon.kode === VURDER_FAKTA_FOR_ATFL_SN && ap.begrunnelse !== null)[0];

/**
 * VurderFaktaBeregningPanel
 *
 * Container komponent.. Inneholder begrunnelsefelt og komponent som innholder panelene for fakta om beregning tilfeller
 */
export const VurderFaktaBeregningPanelImpl = ({
  readOnly,
  isAksjonspunktClosed,
  submittable,
  hasBegrunnelse,
  isDirty,
  formName,
}) => (
  <FormSection name={VURDER_FAKTA_BEREGNING_FORM_NAME}>
    <FaktaForATFLOgSNPanel
      readOnly={readOnly}
      isAksjonspunktClosed={isAksjonspunktClosed}
      formName={formName}
    />
    <VerticalSpacer eightPx />
    <VerticalSpacer twentyPx />
    <FaktaBegrunnelseTextField
      isDirty={isDirty}
      isSubmittable={submittable}
      isReadOnly={readOnly}
      hasBegrunnelse={hasBegrunnelse}
    />
  </FormSection>
);

VurderFaktaBeregningPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  isDirty: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
};

// /// TRANSFORM VALUES METHODS ///////

export const transformValuesVurderFaktaBeregning = createSelector(
  [getAksjonspunkter, transformValuesFaktaForATFLOgSN],
  (aksjonspunkter, transformFaktaATFL) => (values) => {
    if (hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)) {
      const faktaBeregningValues = values[VURDER_FAKTA_BEREGNING_FORM_NAME];
      const beg = faktaBeregningValues.begrunnelse;
      return [{
        kode: VURDER_FAKTA_FOR_ATFL_SN,
        begrunnelse: beg === undefined ? null : beg,
        ...transformFaktaATFL(faktaBeregningValues),
      }];
    }
    return {};
  },
);

// /// BUILD INITIAL VALUES METHODS ///////

export const buildInitialValuesVurderFaktaBeregning = createSelector(
  [getAksjonspunkter, getBuildInitialValuesFaktaForATFLOgSN],
  (aksjonspunkter, buildInitialValuesTilfeller) => {
    if (!hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)) {
      return {};
    }
    return ({
      [VURDER_FAKTA_BEREGNING_FORM_NAME]: {
        ...FaktaBegrunnelseTextField.buildInitialValues(findAksjonspunktMedBegrunnelse(aksjonspunkter)),
        ...buildInitialValuesTilfeller(),
      },
    });
  },
);

// / VALIDATION METHODS ///

export const getValidationVurderFaktaBeregning = createSelector(
  [getAksjonspunkter, getValidationFaktaForATFLOgSN],
  (aksjonspunkter, validationForVurderFakta) => (values) => {
    if (hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)) {
      return {
        [VURDER_FAKTA_BEREGNING_FORM_NAME]: {
          ...validationForVurderFakta(values[VURDER_FAKTA_BEREGNING_FORM_NAME]),
        },
      };
    }
    return null;
  },
);

// // MAP STATE TO PROPS METHODS //////

const mapStateToProps = (state, ownProps) => {
  const alleAp = getAksjonspunkter(state);
  const relevantAp = alleAp.filter(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN);
  const isAksjonspunktClosed = relevantAp.length === 0 ? undefined : !isAksjonspunktOpen(relevantAp[0].status.kode);
  const initialValues = getBehandlingFormInitialValues(ownProps.formName)(state);
  const hasBegrunnelse = initialValues && initialValues[VURDER_FAKTA_BEREGNING_FORM_NAME]
  && !!initialValues[VURDER_FAKTA_BEREGNING_FORM_NAME].begrunnelse;
  return {
    isAksjonspunktClosed,
    hasBegrunnelse,
  };
};

export default connect(mapStateToProps)(VurderFaktaBeregningPanelImpl);
