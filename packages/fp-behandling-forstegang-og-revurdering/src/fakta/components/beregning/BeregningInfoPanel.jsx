import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { FaktaEkspandertpanel, withDefaultToggling } from '@fpsak-frontend/fp-behandling-felles';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getRettigheter } from 'navAnsatt/duck';
import { getBehandlingIsOnHold, getBeregningsgrunnlag } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import VurderFaktaBeregningPanel from './fellesFaktaForATFLogSN/VurderFaktaBeregningPanel';
import AvklareAktiviteterPanel from './avklareAktiviteter/AvklareAktiviteterPanel';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
  AVKLAR_AKTIVITETER,
  OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
  OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
} = aksjonspunktCodes;

const faktaOmBeregningAksjonspunkter = [VURDER_FAKTA_FOR_ATFL_SN, AVKLAR_AKTIVITETER, OVERSTYRING_AV_BEREGNINGSAKTIVITETER, OVERSTYRING_AV_BEREGNINGSGRUNNLAG];

const erOverstyrerSelector = createSelector([getRettigheter], rettigheter => rettigheter.kanOverstyreAccess.isEnabled);

const createRelevantForms = (readOnly, aksjonspunkter, submitCallback, submittable, erOverstyrer) => (
  <div>
    <AvklareAktiviteterPanel
      readOnly={readOnly || (hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunkter) && !erOverstyrer)}
      harAndreAksjonspunkterIPanel={hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)}
      submitCallback={submitCallback}
      submittable={submittable}
    />
    <VerticalSpacer thirtyTwoPx />
    <VurderFaktaBeregningPanel
      readOnly={readOnly || (hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSGRUNNLAG, aksjonspunkter) && !erOverstyrer)}
      submitCallback={submitCallback}
      submittable={submittable}
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
        isOnHold,
        submitCallback,
        harBeregningsgrunnlag,
        erOverstyrer,
    }) => {
    if (isOnHold || !harBeregningsgrunnlag) {
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
        {createRelevantForms(readOnly, aksjonspunkter, submitCallback, submittable, erOverstyrer)}
      </FaktaEkspandertpanel>
    );
};

BeregningInfoPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired).isRequired,
  submittable: PropTypes.bool.isRequired,
  isOnHold: PropTypes.bool.isRequired,
  harBeregningsgrunnlag: PropTypes.bool.isRequired,
  erOverstyrer: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  erOverstyrer: erOverstyrerSelector(state),
  harBeregningsgrunnlag: !!getBeregningsgrunnlag(state),
  isOnHold: getBehandlingIsOnHold(state),
});

const BeregningInfoPanel = withDefaultToggling(faktaPanelCodes.BEREGNING,
  faktaOmBeregningAksjonspunkter, true)(connect(mapStateToProps)(injectIntl(BeregningInfoPanelImpl)));

BeregningInfoPanel.supports = aksjonspunkter => aksjonspunkter.some(ap => faktaOmBeregningAksjonspunkter.includes(ap.definisjon.kode));

export default BeregningInfoPanel;
