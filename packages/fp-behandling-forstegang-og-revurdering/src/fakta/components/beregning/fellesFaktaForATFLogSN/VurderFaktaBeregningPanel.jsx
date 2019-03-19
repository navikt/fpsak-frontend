import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { VerticalSpacer, ElementWrapper } from '@fpsak-frontend/shared-components';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

import { FaktaBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  getAksjonspunkter,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import FaktaForATFLOgSNPanel, {
  transformValuesFaktaForATFLOgSN,
  getBuildInitialValuesFaktaForATFLOgSN, getValidationFaktaForATFLOgSN,
} from './FaktaForATFLOgSNPanel';
import { getFormInitialValuesForBeregning } from '../BeregningFormUtils';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
} = aksjonspunktCodes;

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

const findAksjonspunktMedBegrunnelse = aksjonspunkter => aksjonspunkter
  .filter(ap => ap.definisjon.kode === VURDER_FAKTA_FOR_ATFL_SN && ap.begrunnelse !== null)[0];

export const BEGRUNNELSE_FAKTA_TILFELLER_NAME = 'begrunnelseFaktaTilfeller';

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
  showTableCallback,
}) => (
  <ElementWrapper>
    <FaktaForATFLOgSNPanel
      readOnly={readOnly}
      isAksjonspunktClosed={isAksjonspunktClosed}
      showTableCallback={showTableCallback}
    />
    <VerticalSpacer eightPx />
    <VerticalSpacer twentyPx />
    <FaktaBegrunnelseTextField
      name={BEGRUNNELSE_FAKTA_TILFELLER_NAME}
      isDirty={isDirty}
      isSubmittable={submittable}
      isReadOnly={readOnly}
      hasBegrunnelse={hasBegrunnelse}
    />
  </ElementWrapper>
);

VurderFaktaBeregningPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  isDirty: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  showTableCallback: PropTypes.func.isRequired,
};

// /// TRANSFORM VALUES METHODS ///////

export const transformValuesVurderFaktaBeregning = createSelector(
  [getAksjonspunkter, transformValuesFaktaForATFLOgSN],
  (aksjonspunkter, transformFaktaATFL) => (values) => {
    if (hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)) {
      const faktaBeregningValues = values;
      const beg = faktaBeregningValues[BEGRUNNELSE_FAKTA_TILFELLER_NAME];
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
      ...FaktaBegrunnelseTextField.buildInitialValues(findAksjonspunktMedBegrunnelse(aksjonspunkter), BEGRUNNELSE_FAKTA_TILFELLER_NAME),
      ...buildInitialValuesTilfeller(),
    });
  },
);

// / VALIDATION METHODS ///

export const getValidationVurderFaktaBeregning = createSelector(
  [getAksjonspunkter, getValidationFaktaForATFLOgSN],
  (aksjonspunkter, validationForVurderFakta) => (values) => {
    if (hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)) {
      return {
        ...validationForVurderFakta(values),
      };
    }
    return null;
  },
);

// // MAP STATE TO PROPS METHODS //////

const mapStateToProps = (state) => {
  const alleAp = getAksjonspunkter(state);
  const relevantAp = alleAp.filter(ap => ap.definisjon.kode === VURDER_FAKTA_FOR_ATFL_SN);
  const isAksjonspunktClosed = relevantAp.length === 0 ? undefined : !isAksjonspunktOpen(relevantAp[0].status.kode);
  const initialValues = getFormInitialValuesForBeregning(state);
  const hasBegrunnelse = initialValues
  && !!initialValues[BEGRUNNELSE_FAKTA_TILFELLER_NAME];
  return {
    isAksjonspunktClosed,
    hasBegrunnelse,
  };
};

export default connect(mapStateToProps)(VurderFaktaBeregningPanelImpl);
