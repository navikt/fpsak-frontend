import React from 'react';
import PropTypes from 'prop-types';

import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import beregningsgrunnlagPropType from '../propTypes/beregningsgrunnlagPropType';
import beregningAksjonspunkterPropType from '../propTypes/beregningAksjonspunkterPropType';

import VurderFaktaBeregningPanel from './fellesFaktaForATFLogSN/VurderFaktaBeregningPanel';
import AvklareAktiviteterPanel from './avklareAktiviteter/AvklareAktiviteterPanel';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
  AVKLAR_AKTIVITETER,
  OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
  OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
} = aksjonspunktCodes;

export const faktaOmBeregningAksjonspunkter = [VURDER_FAKTA_FOR_ATFL_SN, AVKLAR_AKTIVITETER,
  OVERSTYRING_AV_BEREGNINGSAKTIVITETER, OVERSTYRING_AV_BEREGNINGSGRUNNLAG];

const createRelevantForms = (
  readOnly,
  aksjonspunkter,
  submitCallback,
  submittable,
  erOverstyrer,
  alleKodeverk,
  behandlingId,
  behandlingVersjon,
  beregningsgrunnlag,
) => (
  <div>
    <AvklareAktiviteterPanel
      readOnly={readOnly || (hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunkter) && !erOverstyrer)}
      harAndreAksjonspunkterIPanel={hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)}
      submitCallback={submitCallback}
      submittable={submittable}
      erOverstyrer={erOverstyrer}
      aksjonspunkter={aksjonspunkter}
      alleKodeverk={alleKodeverk}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      beregningsgrunnlag={beregningsgrunnlag}
    />
    <VerticalSpacer thirtyTwoPx />
    <VurderFaktaBeregningPanel
      readOnly={readOnly || (hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSGRUNNLAG, aksjonspunkter) && !erOverstyrer)}
      submitCallback={submitCallback}
      submittable={submittable}
      aksjonspunkter={aksjonspunkter}
      alleKodeverk={alleKodeverk}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      beregningsgrunnlag={beregningsgrunnlag}
      erOverstyrer={erOverstyrer}
    />
  </div>
);


/**
 * BeregningInfoPanel
 *
 * Container komponent.. Har ansvar for å sette opp Redux Formen for "avklar fakta om beregning" panel.
 */
const BeregningInfoPanel = ({
  readOnly,
  aksjonspunkter,
  submittable,
  submitCallback,
  beregningsgrunnlag,
  erOverstyrer,
  alleKodeverk,
  behandlingId,
  behandlingVersjon,
}) => createRelevantForms(
  readOnly,
  aksjonspunkter,
  submitCallback,
  submittable,
  erOverstyrer,
  alleKodeverk,
  behandlingId,
  behandlingVersjon,
  beregningsgrunnlag,
);

BeregningInfoPanel.propTypes = {
  submitCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(beregningAksjonspunkterPropType).isRequired,
  submittable: PropTypes.bool.isRequired,
  erOverstyrer: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  beregningsgrunnlag: beregningsgrunnlagPropType,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

export default BeregningInfoPanel;
