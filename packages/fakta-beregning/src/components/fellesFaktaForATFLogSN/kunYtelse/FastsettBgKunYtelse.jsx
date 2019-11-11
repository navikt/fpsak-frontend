import React from 'react';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { ElementWrapper } from '@fpsak-frontend/shared-components';
import KunYtelsePanel from './KunYtelsePanel';

const { FASTSETT_BG_KUN_YTELSE, VURDER_BESTEBEREGNING } = faktaOmBeregningTilfelle;

export const setFaktaPanelForKunYtelse = (faktaPanels,
  tilfeller,
  readOnly,
  isAksjonspunktClosed,
  faktaOmBeregning,
  behandlingId,
  behandlingVersjon,
  alleKodeverk) => {
  if (tilfeller.includes(FASTSETT_BG_KUN_YTELSE)) {
    faktaPanels.push(
      <ElementWrapper key="FASTSETT_BG_KUN_YTELSE">
        <KunYtelsePanel
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
          faktaOmBeregning={faktaOmBeregning}
          alleKodeverk={alleKodeverk}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
      </ElementWrapper>,
    );
  }
};

export const transformValuesForKunYtelse = (values, kunYtelse, tilfeller) => {
  if (tilfeller.includes(FASTSETT_BG_KUN_YTELSE)) {
    const faktaOmBeregningTilfeller = [FASTSETT_BG_KUN_YTELSE];
    if (kunYtelse.fodendeKvinneMedDP) {
      faktaOmBeregningTilfeller.push(VURDER_BESTEBEREGNING);
    }
    return {
      faktaOmBeregningTilfeller,
      ...KunYtelsePanel.transformValues(values, kunYtelse),
    };
  }
  return {};
};

export const getKunYtelseValidation = (values, kunYtelse, aktivertePaneler) => {
  if (aktivertePaneler.includes(FASTSETT_BG_KUN_YTELSE)) {
    return KunYtelsePanel.validate(values, aktivertePaneler, kunYtelse);
  }
  return {};
};


export const buildInitialValuesKunYtelse = (kunYtelse, tilfeller, faktaOmBeregningAndeler) => {
  if (tilfeller && tilfeller.includes(FASTSETT_BG_KUN_YTELSE)) {
    return KunYtelsePanel.buildInitialValues(kunYtelse, faktaOmBeregningAndeler);
  }
  return {};
};