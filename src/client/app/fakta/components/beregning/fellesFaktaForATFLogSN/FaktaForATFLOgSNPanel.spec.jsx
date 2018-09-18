import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import faktaOmBeregningTilfelle from 'kodeverk/faktaOmBeregningTilfelle';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { FaktaForATFLOgSNPanelImpl, getHelpTextsFaktaForATFLOgSN } from './FaktaForATFLOgSNPanel';
import TidsbegrensetArbeidsforholdForm from './tidsbegrensetArbeidsforhold/TidsbegrensetArbeidsforholdForm';
import EndringBeregningsgrunnlagForm from './endringBeregningsgrunnlag/EndringBeregningsgrunnlagForm';
import NyIArbeidslivetSNForm from './nyIArbeidslivet/NyIArbeidslivetSNForm';
import VurderOgFastsettATFL
  from './vurderOgFastsettATFL/VurderOgFastsettATFL';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
} = aksjonspunktCodes;

const aksjonspunkter = [{
  definisjon:
  { kode: VURDER_FAKTA_FOR_ATFL_SN },
}];

describe('<FaktaForATFLOgSNPanel>', () => {
  it('skal lage helptext', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD, faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET,
      faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL,
      faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const helpText = getHelpTextsFaktaForATFLOgSN.resultFunc(aktivertePaneler, aksjonspunkter, []);
    expect(helpText).to.have.length(1);
    expect(helpText[0].props.id).to.equal('BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning');
  });


  it('skal vise TidsbegrensetArbeidsforholdForm', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      formName="test"
      isAksjonspunktClosed={false}
      skalViseATFLTabell={false}
    />);
    const tidsbegrensetArbeidsforhold = wrapper.find(TidsbegrensetArbeidsforholdForm);
    expect(tidsbegrensetArbeidsforhold).to.have.length(1);
  });

  it('skal vise NyIArbeidslivetSNForm', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      formName="test"
      isAksjonspunktClosed={false}
      skalViseATFLTabell={false}
    />);
    const tidsbegrensetArbeidsforhold = wrapper.find(NyIArbeidslivetSNForm);
    expect(tidsbegrensetArbeidsforhold).to.have.length(1);
  });

  it('skal vise NyoppstartetFLForm', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      formName="test"
      isAksjonspunktClosed={false}
      skalViseATFLTabell={false}
    />);
    const tidsbegrensetArbeidsforhold = wrapper.find(VurderOgFastsettATFL);
    expect(tidsbegrensetArbeidsforhold).to.have.length(1);
  });

  it('skal vise EndringBeregningsgrunnlagForm', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      formName="test"
      isAksjonspunktClosed={false}
      skalViseATFLTabell={false}
    />);
    const tidsbegrensetArbeidsforhold = wrapper.find(EndringBeregningsgrunnlagForm);
    expect(tidsbegrensetArbeidsforhold).to.have.length(1);
  });
});
