import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { FaktaEkspandertpanel, withDefaultToggling } from '@fpsak-frontend/fp-behandling-felles';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { getBehandlingIsOnHold } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import VurderFaktaBeregningPanel from './fellesFaktaForATFLogSN/VurderFaktaBeregningPanel';
import AvklareAktiviteterPanel from './avklareAktiviteter/AvklareAktiviteterPanel';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
  AVKLAR_AKTIVITETER,
  OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
} = aksjonspunktCodes;

const faktaOmBeregningAksjonspunkter = [VURDER_FAKTA_FOR_ATFL_SN, AVKLAR_AKTIVITETER, OVERSTYRING_AV_BEREGNINGSAKTIVITETER];

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

const createRelevantForms = (readOnly, aksjonspunkter, submitCallback, submittable) => (
  <div>
    <AvklareAktiviteterPanel
      readOnly={readOnly}
      harAndreAksjonspunkterIPanel={hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)}
      submitCallback={submitCallback}
      submittable={submittable}
    />
    {hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)
    && (
      <VurderFaktaBeregningPanel
        readOnly={readOnly}
        submitCallback={submitCallback}
        submittable={submittable}
      />
    )
    }
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
    }) => {
    if (isOnHold) {
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
        {createRelevantForms(readOnly, aksjonspunkter, submitCallback, submittable)}
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
};

const mapStateToProps = (state) => {
  const isOnHold = getBehandlingIsOnHold(state);
  return {
    isOnHold,
  };
};

const BeregningInfoPanel = withDefaultToggling(faktaPanelCodes.BEREGNING,
  faktaOmBeregningAksjonspunkter)(connect(mapStateToProps)(injectIntl(BeregningInfoPanelImpl)));

BeregningInfoPanel.supports = aksjonspunkter => aksjonspunkter.some(ap => faktaOmBeregningAksjonspunkter.includes(ap.definisjon.kode));

export default BeregningInfoPanel;
