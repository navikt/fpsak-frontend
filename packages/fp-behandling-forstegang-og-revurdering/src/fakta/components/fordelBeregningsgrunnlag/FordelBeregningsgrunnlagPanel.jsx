import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import { FaktaEkspandertpanel, withDefaultToggling } from '@fpsak-frontend/fp-behandling-felles';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import FordelingForm from './FordelingForm';
import VurderRefusjonForm from './VurderRefusjonForm';

const {
  FORDEL_BEREGNINGSGRUNNLAG,
  VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT,
} = aksjonspunktCodes;

const faktaOmFordelingAksjonspunkter = [FORDEL_BEREGNINGSGRUNNLAG, VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT];

export const BEGRUNNELSE_FORDELING_NAME = 'begrunnelseFordeling';

/**
 * FordelBeregningsgrunnlagPanel
 *
 * Container komponent. Har ansvar for å sette opp Redux Formen for "avklar fakta om fordeling" panel.
 * Denne brukes også funksjonen withDefaultToggling for å håndtere automatisk åpning av panelet
 * når det finnes åpne aksjonspunkter.
 */
export class FordelBeregningsgrunnlagPanelImpl extends Component {
  constructor() {
    super();
    this.state = {
      submitEnabled: false,
    };
  }

  componentDidMount() {
    const { submitEnabled } = this.state;
    if (!submitEnabled) {
      this.setState({
        submitEnabled: true,
      });
    }
  }

  render() {
    const {
      props: {
        intl,
        openInfoPanels,
        toggleInfoPanelCallback,
        hasOpenAksjonspunkter,
        readOnly,
        submittable,
        isOnHold,
        aksjonspunkter,
        submitCallback,
      },
      state: {
        submitEnabled,
      },
    } = this;
    if (isOnHold) {
      return null;
    }
    return (
      <FaktaEkspandertpanel
        title={intl.formatMessage({ id: 'FordelBeregningsgrunnlag.Title' })}
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.FORDELING)}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        faktaId={faktaPanelCodes.FORDELING}
        readOnly={readOnly}
      >
        {hasAksjonspunkt(VURDER_REFUSJONSKRAV_SOM_HAR_KOMMET_FOR_SENT, aksjonspunkter)
          && (
          <VurderRefusjonForm
            submitEnabled={submitEnabled}
            submittable={submittable}
            readOnly={readOnly}
            submitCallback={submitCallback}
          />
)
        }
        <VerticalSpacer twentyPx />
        {hasAksjonspunkt(FORDEL_BEREGNINGSGRUNNLAG, aksjonspunkter)
          && (
          <FordelingForm
            submitEnabled={submitEnabled}
            submittable={submittable}
            readOnly={readOnly}
            submitCallback={submitCallback}
          />
)
        }
      </FaktaEkspandertpanel>
    );
}
}

FordelBeregningsgrunnlagPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired).isRequired,
  submittable: PropTypes.bool.isRequired,
  isOnHold: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
};


const mapStateToProps = state => ({
  isOnHold: behandlingSelectors.getBehandlingIsOnHold(state),
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
});


const FordelBeregningsgrunnlagPanel = withDefaultToggling(faktaPanelCodes.FORDELING,
  faktaOmFordelingAksjonspunkter)(connect(mapStateToProps)(injectIntl(FordelBeregningsgrunnlagPanelImpl)));

FordelBeregningsgrunnlagPanel.supports = aksjonspunkter => aksjonspunkter.some(ap => faktaOmFordelingAksjonspunkter.includes(ap.definisjon.kode));

export default FordelBeregningsgrunnlagPanel;
