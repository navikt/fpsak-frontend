import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { OverstyringKnapp } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import { InntektstabellPanelImpl } from './InntektstabellPanel';

const {
  OVERSTYRING_AV_BEREGNINGSGRUNNLAG,
} = aksjonspunktCodes;

describe('<InntektstabellPanel>', () => {
  it('skal vise checkbox for overstyring', () => {
    const wrapper = shallow(
      <InntektstabellPanelImpl
        key="inntektstabell"
        hjelpeTekstId="hjelpetekst"
        tabell={<span> tabell </span>}
        kanOverstyre
        aksjonspunkter={[]}
        readOnly={false}
        erOverstyrt={false}
        reduxFormChange={() => undefined}
        behandlingFormPrefix="form"
      >
        <span>test1</span>
        <span>test2</span>
      </InntektstabellPanelImpl>,
    );
    expect(wrapper.find(OverstyringKnapp)).has.length(1);
  });

  it('checkbox skal vere readOnly når man har overstyring aksjonspunkt', () => {
    const wrapper = shallow(
      <InntektstabellPanelImpl
        key="inntektstabell"
        hjelpeTekstId="hjelpetekst"
        tabell={<span> tabell </span>}
        kanOverstyre
        aksjonspunkter={[{ definisjon: { kode: OVERSTYRING_AV_BEREGNINGSGRUNNLAG }, status: { kode: 'OPPR' } }]}
        readOnly={false}
        erOverstyrt={false}
        reduxFormChange={() => undefined}
        behandlingFormPrefix="form"
      >
        <span>test1</span>
        <span>test2</span>
      </InntektstabellPanelImpl>,
    );
    const knapp = wrapper.find(OverstyringKnapp);
    expect(knapp).has.length(1);
    expect(knapp.first().prop('erOverstyrt')).to.equal(true);
  });
});
