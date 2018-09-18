import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import sinon from 'sinon';

import { reduxFormPropsMock } from 'testHelpers/redux-form-test-helper';
import relatertYtelseType from 'kodeverk/relatertYtelseType';
import FaktaBegrunnelseTextField from 'fakta/components/FaktaBegrunnelseTextField';
import OmsorgOgForeldreansvarFaktaForm from './OmsorgOgForeldreansvarFaktaForm';
import { OmsorgOgForeldreansvarInfoPanelImpl } from './OmsorgOgForeldreansvarInfoPanel';


describe('<OmsorgOgForeldreansvarInfoPanel>', () => {
  const aksjonspunkt = {
    id: 1,
    definisjon: {
      kode: 'ap1',
      navn: 'ap1',
    },
    status: {
      kode: 's1',
      navn: 's1',
    },
    kanLoses: true,
    erAktivt: true,
  };

  it('skal vise faktapanel og form for omsorgsvilkåret', () => {
    const wrapper = shallowWithIntl(<OmsorgOgForeldreansvarInfoPanelImpl
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkt={aksjonspunkt}
      erAksjonspunktForeldreansvar={false}
      openInfoPanels={['omsorgsvilkaaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      vilkarTypes={[{ data: 'test' }]}
      relatertYtelseTypes={[relatertYtelseType]}
    />);

    const panel = wrapper.find('FaktaEkspandertpanel');
    expect(panel).to.have.length(1);
    expect(panel.prop('title')).to.eql('Fakta om omsorg og foreldreansvar');
    expect(panel.prop('hasOpenAksjonspunkter')).is.true;
    expect(panel.prop('isInfoPanelOpen')).is.true;
    expect(panel.prop('faktaId')).to.eql('omsorgsvilkaaret');
    const form = wrapper.find('Connect(InjectIntl(OmsorgOgForeldreansvarFaktaFormImpl))');
    expect(form).to.have.length(1);
    expect(form.prop('readOnly')).is.false;

    const begrunnelseForm = wrapper.find(FaktaBegrunnelseTextField);
    expect(begrunnelseForm).to.have.length(1);
    expect(begrunnelseForm.prop('isReadOnly')).is.false;
  });

  it('skal vise lukket faktapanel når panelet er markert lukket', () => {
    const wrapper = shallowWithIntl(<OmsorgOgForeldreansvarInfoPanelImpl
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkt={aksjonspunkt}
      erAksjonspunktForeldreansvar={false}
      openInfoPanels={[]}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly={false}
      vilkarTypes={[{ data: 'test' }]}
      relatertYtelseTypes={[relatertYtelseType]}
    />);

    const panel = wrapper.find('FaktaEkspandertpanel');
    expect(panel.prop('isInfoPanelOpen')).is.false;
  });

  it('skal vise readonly form', () => {
    const wrapper = shallowWithIntl(<OmsorgOgForeldreansvarInfoPanelImpl
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkt={aksjonspunkt}
      erAksjonspunktForeldreansvar={false}
      openInfoPanels={['omsorgsvilkaaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter
      submittable
      readOnly
      vilkarTypes={[{ data: 'test' }]}
      relatertYtelseTypes={[relatertYtelseType]}
    />);

    const form = wrapper.find('Connect(InjectIntl(OmsorgOgForeldreansvarFaktaFormImpl))');
    expect(form.prop('readOnly')).is.true;
  });

  it('skal vise readonly submit-knapp når det ikke er åpne aksjonspunkter', () => {
    const wrapper = shallowWithIntl(<OmsorgOgForeldreansvarInfoPanelImpl
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkt={aksjonspunkt}
      erAksjonspunktForeldreansvar={false}
      openInfoPanels={['omsorgsvilkaaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      submittable
      readOnly={false}
      vilkarTypes={[{ data: 'test' }]}
      relatertYtelseTypes={[relatertYtelseType]}
    />);

    const begrunnelseForm = wrapper.find(FaktaBegrunnelseTextField);
    expect(begrunnelseForm.prop('isReadOnly')).is.false;
  });


  it('skal gi foreldreansvar lik true når aksjonspunkt er foreldreansvar', () => {
    const wrapper = shallowWithIntl(<OmsorgOgForeldreansvarInfoPanelImpl
      {...reduxFormPropsMock}
      initialValues={{ begrunnelse: 'test' }}
      intl={intlMock}
      aksjonspunkt={aksjonspunkt}
      erAksjonspunktForeldreansvar
      openInfoPanels={['omsorgsvilkaaret']}
      toggleInfoPanelCallback={sinon.spy()}
      hasOpenAksjonspunkter={false}
      submittable
      readOnly={false}
      vilkarTypes={[{ data: 'test' }]}
      relatertYtelseTypes={[relatertYtelseType]}
    />);
    const omsorgOgForeldreAnsvarFaktaForm = wrapper.find(OmsorgOgForeldreansvarFaktaForm);
    expect(omsorgOgForeldreAnsvarFaktaForm.prop('erAksjonspunktForeldreansvar')).is.true;
  });
});
