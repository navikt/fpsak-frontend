import React from 'react';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { ElementWrapper } from '@fpsak-frontend/shared-components';
import KunYtelsePanel from './KunYtelsePanel';
import KunYtelseTilkommetArbeidPanel from './tilkommetArbeidsforhold/KunYtelseTilkommetArbeidPanel';

const { FASTSETT_BG_KUN_YTELSE, FASTSETT_ENDRET_BEREGNINGSGRUNNLAG } = faktaOmBeregningTilfelle;

const harKunYtelseOgEndretBeregningsgrunnlag = aktivertePaneler => (aktivertePaneler.length === 2
  && aktivertePaneler.includes(FASTSETT_BG_KUN_YTELSE)
  && aktivertePaneler.includes(FASTSETT_ENDRET_BEREGNINGSGRUNNLAG));

export const setFaktaPanelForKunYtelse = (faktaPanels, tilfeller, readOnly, isAksjonspunktClosed) => {
  if (tilfeller.includes(FASTSETT_BG_KUN_YTELSE) && !tilfeller.includes(FASTSETT_ENDRET_BEREGNINGSGRUNNLAG)) {
    faktaPanels.push(
      <ElementWrapper key="FASTSETT_BG_KUN_YTELSE">
        <KunYtelsePanel
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
        />
      </ElementWrapper>,
    );
  } else if (tilfeller.includes(FASTSETT_BG_KUN_YTELSE) && tilfeller.includes(FASTSETT_ENDRET_BEREGNINGSGRUNNLAG)) {
    faktaPanels.push(
      <ElementWrapper key="FASTSETT_BG_KUN_YTELSE">
        <KunYtelseTilkommetArbeidPanel
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
        />
      </ElementWrapper>,
    );
  }
};

export const transformValuesForKunYtelse = (values, kunYtelse, endringBGPerioder, tilfeller) => {
  if (harKunYtelseOgEndretBeregningsgrunnlag(tilfeller)) {
    return {
      ...KunYtelseTilkommetArbeidPanel.transformValues(values, kunYtelse, endringBGPerioder),
    };
  }
  if (tilfeller.includes(FASTSETT_BG_KUN_YTELSE)) {
    return {
      faktaOmBeregningTilfeller: [FASTSETT_BG_KUN_YTELSE],
      ...KunYtelsePanel.transformValues(values, kunYtelse),
    };
  }
  return {};
};

export const getKunYtelseValidation = (values, kunYtelse, endringBgPerioder, aktivertePaneler, skjaeringstidspunktBeregning, getKodeverknavn) => {
  if (harKunYtelseOgEndretBeregningsgrunnlag(aktivertePaneler)) {
    return KunYtelseTilkommetArbeidPanel.validate(values, aktivertePaneler, kunYtelse, endringBgPerioder, skjaeringstidspunktBeregning, getKodeverknavn);
  }
  if (aktivertePaneler.includes(FASTSETT_BG_KUN_YTELSE)) {
    return KunYtelsePanel.validate(values, aktivertePaneler, kunYtelse);
  }
  return {};
};


export const buildInitialValuesKunYtelse = (kunYtelse, endringBgPerioder, isRevurdering, tilfeller, getKodeverknavn) => {
  if (harKunYtelseOgEndretBeregningsgrunnlag(tilfeller)) {
    return KunYtelseTilkommetArbeidPanel.buildInitialValues(kunYtelse, endringBgPerioder, isRevurdering, tilfeller, getKodeverknavn);
  }
  if (tilfeller.includes(FASTSETT_BG_KUN_YTELSE)) {
    return KunYtelsePanel.buildInitialValues(kunYtelse, getKodeverknavn);
  }
  return {};
};
