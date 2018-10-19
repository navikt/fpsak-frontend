import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import FodselSammenligningPanel from 'behandling/components/fodselSammenligning/FodselSammenligningPanel';
import { VarselOmRevurderingFormImpl as UnwrappedForm } from './VarselOmRevurderingForm';

describe('<VarselOmRevurderingFormImpl>', () => {
  it('skal vise fodselsammenligningpanel når automatisk revurdering', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      previewCallback={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
      erAutomatiskRevurdering
      languageCode="NN"
      readOnly={false}
      sendVarsel
      frist="2017-05-15"
      aksjonspunktStatus="OPPR"
      begrunnelse="Begrunnelse"
    />);
    const fodselPanel = wrapper.find(FodselSammenligningPanel);
    expect(fodselPanel).to.have.length(1);
  });

  it('skal vise fritekst og forhåndsvis av brev når varsel skal sendes', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      previewCallback={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
      erAutomatiskRevurdering={false}
      languageCode="NN"
      readOnly={false}
      sendVarsel
      frist="2017-05-15"
      aksjonspunktStatus="OPPR"
      begrunnelse="Begrunnelse"
    />);
    const fodselPanel = wrapper.find(FodselSammenligningPanel);
    expect(fodselPanel).to.have.length(0);

    const textarea = wrapper.find('TextAreaField');
    const forhandsvis = wrapper.find('a');
    expect(textarea).to.have.length(2);
    expect(forhandsvis).to.have.length(1);
  });

  it('skal ikke vise fritekst og forhåndsvis av brev når varsel ikke skal sendes', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      previewCallback={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
      erAutomatiskRevurdering={false}
      languageCode="NN"
      readOnly={false}
      sendVarsel={false}
      frist="2017-05-15"
      aksjonspunktStatus="OPPR"
      begrunnelse="Begrunnelse"
    />);

    const textarea = wrapper.find('TextAreaField');
    const forhandsvis = wrapper.find('a');
    expect(textarea).to.have.length(1);
    expect(forhandsvis).to.have.length(0);
  });

  it('skal vises i readonly visning', () => {
    const begrunnelse = 'Begrunnelse';
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      previewCallback={sinon.spy()}
      dispatchSubmitFailed={sinon.spy()}
      erAutomatiskRevurdering={false}
      languageCode="NN"
      readOnly={false}
      sendVarsel={false}
      frist="2017-05-15"
      aksjonspunktStatus="UTFRT"
      begrunnelse={begrunnelse}
    />);

    expect(wrapper.find('Undertekst')).to.have.length(1);
    expect(wrapper.find('Normaltekst')).to.have.length(1);
    expect(wrapper.find('Normaltekst').children().text()).to.equal(begrunnelse);
  });
});
