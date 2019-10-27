import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { faktaPanelCodes, FaktaEkspandertpanel, withDefaultToggling } from '@fpsak-frontend/fp-felles';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import FordelingForm from './FordelingForm';
import fordelBeregningsgrunnlagAksjonspunkterPropType from '../propTypes/fordelBeregningsgrunnlagAksjonspunkterPropType';

const {
  FORDEL_BEREGNINGSGRUNNLAG,
} = aksjonspunktCodes;

const faktaOmFordelingAksjonspunkter = [FORDEL_BEREGNINGSGRUNNLAG];

export const BEGRUNNELSE_FORDELING_NAME = 'begrunnelseFordeling';

const harIkkeFordelInfo = (bg) => {
  if (!bg) {
    return true;
  }
  return bg.faktaOmFordeling ? !bg.faktaOmFordeling.fordelBeregningsgrunnlag : true;
};
const getFordelAksjonspunkt = (aksjonspunkter) => (aksjonspunkter ? aksjonspunkter.find((ap) => ap.definisjon.kode === FORDEL_BEREGNINGSGRUNNLAG) : undefined);
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
        openInfoPanels,
        toggleInfoPanelCallback,
        hasOpenAksjonspunkter,
        readOnly,
        aksjonspunkter,
        submitCallback,
        beregningsgrunnlag,
        behandlingId,
        behandlingVersjon,
        alleKodeverk,
        alleMerknaderFraBeslutter,
        behandlingType,
        submittable,
      },
      state: {
        submitEnabled,
      },
    } = this;
    const fordelAP = getFordelAksjonspunkt(aksjonspunkter);
    if (harIkkeFordelInfo(beregningsgrunnlag) || !fordelAP) {
      return null;
    }
    return (
      <FaktaEkspandertpanel
        title={<FormattedMessage id="FordelBeregningsgrunnlag.Title" />}
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.FORDELING)}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        faktaId={faktaPanelCodes.FORDELING}
        readOnly={readOnly}
      >
        {hasAksjonspunkt(FORDEL_BEREGNINGSGRUNNLAG, aksjonspunkter)
          && (
          <FordelingForm
            submitEnabled={submitEnabled}
            submittable={submittable}
            readOnly={readOnly}
            submitCallback={submitCallback}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            alleKodeverk={alleKodeverk}
            alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
            beregningsgrunnlag={beregningsgrunnlag}
            behandlingType={behandlingType}
            aksjonspunkter={aksjonspunkter}
          />
          )}
      </FaktaEkspandertpanel>
    );
  }
}

FordelBeregningsgrunnlagPanelImpl.propTypes = {
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(fordelBeregningsgrunnlagAksjonspunkterPropType.isRequired).isRequired,
  submitCallback: PropTypes.func.isRequired,
  submittable: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  beregningsgrunnlag: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
};

const FordelBeregningsgrunnlagPanel = withDefaultToggling(faktaPanelCodes.FORDELING,
  faktaOmFordelingAksjonspunkter)(FordelBeregningsgrunnlagPanelImpl);

export default FordelBeregningsgrunnlagPanel;
