import React from 'react';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { ElementWrapper } from '@fpsak-frontend/shared-components';
import KunYtelsePanel from './KunYtelsePanel';

const { FASTSETT_BG_KUN_YTELSE } = faktaOmBeregningTilfelle;

export const setFaktaPanelForKunYtelse = (faktaPanels, tilfeller, readOnly, isAksjonspunktClosed) => {
  if (tilfeller.includes(FASTSETT_BG_KUN_YTELSE)) {
    faktaPanels.push(
      <ElementWrapper key="FASTSETT_BG_KUN_YTELSE">
        <KunYtelsePanel
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
        />
      </ElementWrapper>,
    );
  }
};

export const transformValuesForKunYtelse = (values, kunYtelse, tilfeller) => {
  if (tilfeller.includes(FASTSETT_BG_KUN_YTELSE)) {
    return {
      faktaOmBeregningTilfeller: [FASTSETT_BG_KUN_YTELSE],
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
