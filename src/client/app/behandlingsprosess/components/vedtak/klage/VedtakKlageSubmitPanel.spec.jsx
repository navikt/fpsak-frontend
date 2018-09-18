import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import klageVurdering from 'kodeverk/klageVurdering';
import { VedtakKlageSubmitPanelImpl, isMedholdIKlage } from './VedtakKlageSubmitPanel';

describe('<VedtakKlageSubmitPanel>', () => {
  const forhandsvisVedtaksbrevFunc = sinon.spy();


  it('skal returnere false om behandling ikke har medhold i klage', () => {
    const klageVurderingResultatNK = {
      klageVurdering: 'TEST',
    };

    const isNotMedhold = isMedholdIKlage({}, klageVurderingResultatNK);

    expect(isNotMedhold).to.eql(false);
  });

  it('skal rendre submit panel uten medhold i klagevurdering', () => {
    const klageVurderingResultatNK = {
      klageVurdering: 'TEST',
    };

    const wrapper = shallowWithIntl(<VedtakKlageSubmitPanelImpl
      intl={intlMock}
      formProps={reduxFormPropsMock}
      readOnly={false}
      behandlingPaaVent={false}
      klageVurderingResultatNK={klageVurderingResultatNK}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
    />);


    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(1);
    expect(hovedknapp.childAt(0).text()).to.eql('Til godkjenning');
    const a = wrapper.find('a');
    expect(a).to.have.length(1);
    expect(wrapper.find('FormattedMessage').first().prop('id')).to.eql('VedtakKlageForm.ForhandvisBrev');
  });


  it('skal rendre submit panel med medhold i klagevurdering', () => {
    const klageVurderingResultatNK = {
      klageVurdering: klageVurdering.MEDHOLD_I_KLAGE,
    };

    const wrapper = shallowWithIntl(<VedtakKlageSubmitPanelImpl
      intl={intlMock}
      formProps={reduxFormPropsMock}
      readOnly={false}
      behandlingPaaVent={false}
      klageVurderingResultatNK={klageVurderingResultatNK}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
    />);

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(1);
    expect(hovedknapp.childAt(0).text()).to.eql('Til godkjenning');
    const a = wrapper.find('a');
    expect(a).to.have.length(0);
  });


  it('skal rendre submit panel med behandling på vent', () => {
    const wrapper = shallowWithIntl(<VedtakKlageSubmitPanelImpl
      intl={intlMock}
      formProps={reduxFormPropsMock}
      readOnly={false}
      behandlingPaaVent
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
    />);

    const hovedknapp = wrapper.find('Hovedknapp');
    expect(hovedknapp).to.have.length(1);
    expect(hovedknapp.childAt(0).text()).to.eql('Til godkjenning');
    expect(hovedknapp.prop('disabled')).is.true;

    const a = wrapper.find('a');
    expect(a).to.have.length(1);
  });
});
