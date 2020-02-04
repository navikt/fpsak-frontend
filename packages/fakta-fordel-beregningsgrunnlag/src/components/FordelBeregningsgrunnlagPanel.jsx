import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import FordelingForm from './FordelingForm';
import fordelBeregningsgrunnlagAksjonspunkterPropType from '../propTypes/fordelBeregningsgrunnlagAksjonspunkterPropType';

const {
  FORDEL_BEREGNINGSGRUNNLAG,
} = aksjonspunktCodes;

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
 * Har ansvar for å sette opp Redux Formen for "avklar fakta om fordeling" panel.
 */
export class FordelBeregningsgrunnlagPanel extends Component {
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
    );
  }
}

FordelBeregningsgrunnlagPanel.propTypes = {
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

export default FordelBeregningsgrunnlagPanel;
