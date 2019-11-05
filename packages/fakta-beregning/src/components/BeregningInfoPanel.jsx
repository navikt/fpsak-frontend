import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { faktaPanelCodes, FaktaEkspandertpanel, withDefaultToggling } from '@fpsak-frontend/fp-felles';
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
 * Denne brukes også funksjonen withDefaultToggling for å håndtere automatisk åpning av panelet
 * når det finnes åpne aksjonspunkter.
 */
export const BeregningInfoPanelImpl = ({
  intl,
  openInfoPanels,
  toggleInfoPanelCallback,
  hasOpenAksjonspunkter,
  readOnly,
  aksjonspunkter,
  submittable,
  submitCallback,
  beregningsgrunnlag,
  erOverstyrer,
  alleKodeverk,
  behandlingId,
  behandlingVersjon,
}) => {
  if (!beregningsgrunnlag) {
    return null;
  }
  return (
    <FaktaEkspandertpanel
      title={intl.formatMessage({ id: 'BeregningInfoPanel.Title' })}
      hasOpenAksjonspunkter={hasOpenAksjonspunkter}
      isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.BEREGNING)}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      faktaId={faktaPanelCodes.BEREGNING}
      readOnly={readOnly}
    >
      {createRelevantForms(
        readOnly,
        aksjonspunkter,
        submitCallback,
        submittable,
        erOverstyrer,
        alleKodeverk,
        behandlingId,
        behandlingVersjon,
        beregningsgrunnlag,
      )}
    </FaktaEkspandertpanel>
  );
};

BeregningInfoPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
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

const BeregningInfoPanel = withDefaultToggling(faktaPanelCodes.BEREGNING,
  faktaOmBeregningAksjonspunkter, true)(injectIntl(BeregningInfoPanelImpl));

export default BeregningInfoPanel;
